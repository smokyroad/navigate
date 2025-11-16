import { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Checkpoint } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslatedCheckpoints } from '../utils/translationUtils';

const typeIconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  entrance: 'login',
  customs: 'badge',
  gate: 'flight',
  dining: 'restaurant',
  shopping: 'storefront',
  lounge: 'weekend',
  restroom: 'wc',
  luggage: 'luggage',
};

interface AirportMapProps {
  checkpoints: Checkpoint[];
  selectedCheckpoints: string[];
  onCheckpointPress?: (id: string) => void;
}

// Map dimensions in pixels
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 800;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// Convert percentage coordinates to pixel coordinates
const toPixelCoords = (x: number, y: number): { x: number; y: number } => ({
  x: (x / 100) * MAP_WIDTH,
  y: (y / 100) * MAP_HEIGHT,
});

const clampTranslation = (
  translation: number,
  currentScale: number,
  mapSize: number,
  viewportSize: number,
) => {
  'worklet';
  const scaledSize = mapSize * currentScale;
  if (scaledSize <= viewportSize) {
    return 0;
  }
  const maxTranslate = (scaledSize - viewportSize) / 2;
  return Math.max(-maxTranslate, Math.min(maxTranslate, translation));
};

export function AirportMap({ checkpoints, selectedCheckpoints, onCheckpointPress }: AirportMapProps) {
  const [scaleDisplay, setScaleDisplay] = useState(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const pinchStart = useSharedValue(1);
  const containerWidth = useSharedValue(Dimensions.get('window').width);
  const containerHeight = useSharedValue(Dimensions.get('window').height);
  
  const { t, language } = useTranslation();
  const translatedCheckpoints = useMemo(() => 
    getTranslatedCheckpoints(checkpoints, language), 
    [checkpoints, language]
  );

  // Generate path with proper pixel coordinates
  const pathData = useMemo(() => {
    if (selectedCheckpoints.length < 2) return '';
    
    const selectedPoints = selectedCheckpoints
      .map(id => translatedCheckpoints.find(cp => cp.id === id))
      .filter((cp): cp is Checkpoint => cp !== undefined);

    if (selectedPoints.length < 2) return '';

    return selectedPoints
      .map((checkpoint, index) => {
        const coords = toPixelCoords(checkpoint.x, checkpoint.y);
        const prefix = index === 0 ? 'M' : 'L';
        return `${prefix} ${coords.x} ${coords.y}`;
      })
      .join(' ');
  }, [selectedCheckpoints, translatedCheckpoints]);

  // Calculate checkpoint pixel positions
  const checkpointPositions = useMemo(() => {
    return translatedCheckpoints.map(cp => ({
      ...cp,
      ...toPixelCoords(cp.x, cp.y),
    }));
  }, [translatedCheckpoints]);

  useAnimatedReaction(
    () => scale.value,
    (currentScale) => {
      runOnJS(setScaleDisplay)(currentScale);
    },
    [],
  );

  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
      containerHeight.value = event.nativeEvent.layout.height;
    },
    [containerHeight, containerWidth],
  );

  const animatedMapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      panStartX.value = translateX.value;
      panStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = clampTranslation(
        panStartX.value + event.translationX,
        scale.value,
        MAP_WIDTH,
        containerWidth.value,
      );
      translateY.value = clampTranslation(
        panStartY.value + event.translationY,
        scale.value,
        MAP_HEIGHT,
        containerHeight.value,
      );
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      pinchStart.value = scale.value;
    })
    .onUpdate((event) => {
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinchStart.value * event.scale),
      );
      scale.value = nextScale;
      translateX.value = clampTranslation(
        translateX.value,
        nextScale,
        MAP_WIDTH,
        containerWidth.value,
      );
      translateY.value = clampTranslation(
        translateY.value,
        nextScale,
        MAP_HEIGHT,
        containerHeight.value,
      );
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd((_, success) => {
      if (!success) return;
      const nextScale = Math.min(MAX_SCALE, scale.value * 1.4);
      scale.value = withTiming(nextScale, { duration: 180 });
      translateX.value = withTiming(
        clampTranslation(translateX.value, nextScale, MAP_WIDTH, containerWidth.value),
        { duration: 180 },
      );
      translateY.value = withTiming(
        clampTranslation(translateY.value, nextScale, MAP_HEIGHT, containerHeight.value),
        { duration: 180 },
      );
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture, doubleTapGesture);

  const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const animateScaleTo = (value: number) => {
    const nextScale = clampScale(value);
    scale.value = withTiming(nextScale, { duration: 180 });
    translateX.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(0, { duration: 180 });
  };

  const handleZoomIn = () => {
    animateScaleTo(scaleDisplay * 1.2);
  };

  const handleZoomOut = () => {
    animateScaleTo(scaleDisplay / 1.2);
  };

  const handleResetView = () => {
    animateScaleTo(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper} onLayout={handleContainerLayout}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.mapSurface, animatedMapStyle]}>
            <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
              <Defs>
                <Pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <Path d="M 50 0 L 0 0 0 50" stroke="#E2E8F0" strokeWidth={1} fill="none" />
                </Pattern>
              </Defs>

              {/* Background */}
              <Rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="#F8FAFC" />
              <Rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

              {/* Terminal Layout */}
              <Rect x={50} y={100} width={900} height={600} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={3} rx={10} />

              {/* Zones */}
              <Rect x={80} y={150} width={200} height={500} fill="#016563" fillOpacity={0.1} stroke="#14B8A6" strokeWidth={2} strokeDasharray="5,5" rx={5} />
              <SvgText x={180} y={180} fontSize={14} fill="#016563" textAnchor="middle" fontWeight="600">{t.mapZones.entryZone}</SvgText>

              <Rect x={320} y={150} width={320} height={500} fill="#016563" fillOpacity={0.1} stroke="#14B8A6" strokeWidth={2} strokeDasharray="5,5" rx={5} />
              <SvgText x={480} y={180} fontSize={14} fill="#016563" textAnchor="middle" fontWeight="600">{t.mapZones.shoppingDining}</SvgText>

              <Rect x={680} y={150} width={240} height={500} fill="#016563" fillOpacity={0.1} stroke="#14B8A6" strokeWidth={2} strokeDasharray="5,5" rx={5} />
              <SvgText x={800} y={180} fontSize={14} fill="#016563" textAnchor="middle" fontWeight="600">{t.mapZones.gates}</SvgText>

              {/* Main Corridor */}
              <Path
                d={`M 150 400 L 850 400`}
                stroke="#94A3B8"
                strokeWidth={4}
                strokeDasharray="10,5"
                opacity={0.3}
              />

              {/* Route Path */}
              {pathData && (
                <>
                  {/* Path shadow */}
                  <Path
                    d={pathData}
                    stroke="#000000"
                    strokeWidth={8}
                    strokeOpacity={0.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Main path */}
                  <Path
                    d={pathData}
                    stroke="#016563"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Animated dashed overlay */}
                  <Path
                    d={pathData}
                    stroke="#14B8A6"
                    strokeWidth={5}
                    strokeDasharray="12 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={0.7}
                  />
                </>
              )}

              {/* Checkpoints as SVG circles */}
              {checkpointPositions.map((checkpoint) => {
                const isSelected = selectedCheckpoints.includes(checkpoint.id);
                const selectedIndex = selectedCheckpoints.indexOf(checkpoint.id);

                return (
                  <G key={checkpoint.id}>
                    {/* Checkpoint circle */}
                    <Circle
                      cx={checkpoint.x}
                      cy={checkpoint.y}
                      r={isSelected ? 18 : 14}
                      fill={isSelected ? '#016563' : '#FFFFFF'}
                      stroke={checkpoint.isMandatory ? '#FCD34D' : '#CBD5E1'}
                      strokeWidth={checkpoint.isMandatory ? 3 : 2}
                    />

                    {/* Selected order badge */}
                    {isSelected && selectedIndex >= 0 && (
                      <>
                        <Circle
                          cx={checkpoint.x + 14}
                          cy={checkpoint.y - 14}
                          r={10}
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth={2}
                        />
                        <SvgText
                          x={checkpoint.x + 14}
                          y={checkpoint.y - 10}
                          fontSize={11}
                          fill="#FFFFFF"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {selectedIndex + 1}
                        </SvgText>
                      </>
                    )}
                  </G>
                );
              })}
            </Svg>

            {/* React Native markers for interaction */}
            {checkpointPositions.map((checkpoint) => {
              const isSelected = selectedCheckpoints.includes(checkpoint.id);
              return (
                <Pressable
                  key={`marker-${checkpoint.id}`}
                  style={[
                    styles.marker,
                    {
                      left: checkpoint.x - 16,
                      top: checkpoint.y - 16,
                    },
                  ]}
                  onPress={() => onCheckpointPress?.(checkpoint.id)}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      checkpoint.isMandatory && styles.mandatory,
                      isSelected && styles.selected,
                    ]}
                  >
                    <MaterialIcons
                      name={typeIconMap[checkpoint.type] ?? 'place'}
                      size={18}
                      color={isSelected ? '#FFFFFF' : '#1E293B'}
                    />
                  </View>
                  {isSelected && (
                    <View style={styles.labelBubble}>
                      <Text style={styles.labelText} numberOfLines={1}>
                        {checkpoint.name}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <Pressable
          style={styles.zoomButton}
          onPress={handleZoomIn}
          accessibilityLabel="Zoom in"
        >
          <MaterialIcons name="add" size={20} color="#0F172A" />
        </Pressable>
        <Pressable
          style={styles.zoomButton}
          onPress={handleResetView}
          accessibilityLabel="Reset view"
        >
          <MaterialIcons name="center-focus-strong" size={20} color="#0F172A" />
        </Pressable>
        <Pressable
          style={styles.zoomButton}
          onPress={handleZoomOut}
          accessibilityLabel="Zoom out"
        >
          <MaterialIcons name="remove" size={20} color="#0F172A" />
        </Pressable>
      </View>

      {/* Scale Indicator */}
      <View style={styles.scaleIndicator}>
        <Text style={styles.scaleText}>{Math.round(scaleDisplay * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  mapWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapSurface: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scaleIndicator: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  scaleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  mandatory: {
    borderColor: '#FCD34D',
    borderWidth: 2.5,
  },
  selected: {
    backgroundColor: '#016563',
    borderColor: '#016563',
    borderWidth: 2.5,
  },
  labelBubble: {
    position: 'absolute',
    top: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 80,
  },
  labelText: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'center',
  },
});
