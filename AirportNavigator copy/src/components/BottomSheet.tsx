import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, useWindowDimensions } from 'react-native';

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints: number[]; // Array of snap points as percentages of screen height (e.g., [20, 50, 90])
  initialSnap?: number; // Index of initial snap point
}

export function BottomSheet({ children, snapPoints, initialSnap = 0 }: BottomSheetProps) {
  const { height: screenHeight } = useWindowDimensions();

  const snapHeights = useMemo(
    () => snapPoints.map(percent => screenHeight * (percent / 100)),
    [snapPoints, screenHeight]
  );

  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  
  const translateY = useRef(new Animated.Value(screenHeight - snapHeights[initialSnap])).current;
  const currentPosition = useRef(screenHeight - snapHeights[initialSnap]);
  const dragStartY = useRef(currentPosition.current);

  const minY = screenHeight - snapHeights[snapHeights.length - 1];
  const maxY = screenHeight - snapHeights[0];

  useEffect(() => {
    const newY = screenHeight - snapHeights[currentSnapIndex];
    Animated.spring(translateY, {
      toValue: newY,
      useNativeDriver: true,
      tension: 40,
      friction: 10,
    }).start();
    currentPosition.current = newY;
    dragStartY.current = newY;
  }, [screenHeight, snapHeights, currentSnapIndex, translateY]);

  useEffect(() => {
    const listenerId = translateY.addListener(({ value }) => {
      currentPosition.current = value;
    });

    return () => {
      translateY.removeListener(listenerId);
    };
  }, [translateY]);

  const clamp = (value: number) => Math.min(Math.max(value, minY), maxY);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        dragStartY.current = currentPosition.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const nextY = clamp(dragStartY.current + gestureState.dy);
        translateY.setValue(nextY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dragY = dragStartY.current + gestureState.dy;
        const projectedY = dragY + gestureState.vy * 120;
        const targetPosition = clamp(Math.abs(gestureState.vy) > 0.2 ? projectedY : dragY);

        let closestIndex = currentSnapIndex;
        let closestDistance = Infinity;

        snapHeights.forEach((height, index) => {
          const targetY = screenHeight - height;
          const distance = Math.abs(targetPosition - targetY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        snapToIndex(closestIndex);
      },
    })
  ).current;

  const snapToIndex = (index: number) => {
    setCurrentSnapIndex(index);
    Animated.spring(translateY, {
      toValue: screenHeight - snapHeights[index],
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start(() => {
      currentPosition.current = screenHeight - snapHeights[index];
      dragStartY.current = currentPosition.current;
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: screenHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
});
