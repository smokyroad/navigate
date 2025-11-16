import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useItinerary } from '../context/ItineraryContext';
import { AirportMap } from '../components/AirportMap';
import { BottomSheet, BottomSheetScrollView } from '../components/BottomSheet';
import { JourneyProgress } from '../components/JourneyProgress';
import { TimelineCard } from '../components/TimelineCard';
import { BoardingTimeIndicator } from '../components/BoardingTimeIndicator';
import { CheckpointLibrary } from '../components/CheckpointLibrary';
import { ChatScreen } from '../screens/ChatScreen';
import { useTranslation } from '../hooks/useTranslation';
import { calculateTotalTime, formatDuration } from '../utils/timelineUtils';

export function MapScreen() {
  const {
    checkpoints,
    selectedCheckpoints,
    timeline,
    currentStep,
    startTime,
    setStartTime,
    toggleCheckpoint,
    removeCheckpoint,
    addCheckpoint,
  } = useItinerary();
  const { t, language } = useTranslation();

  const [libraryVisible, setLibraryVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  // Define boarding time as a FIXED time (e.g., flight boarding time)
  // Set to 2 hours from the INITIAL current time, independent of start time adjustments
  // You can modify this to use actual flight data
  const [boardingTime] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() + 120 * 60000); // 2 hours from now
  });

  const currentCheckpoint = timeline[currentStep - 1];
  const totalTime = calculateTotalTime(timeline);
  const journeyEndTime = timeline.length > 0 ? timeline[timeline.length - 1].departureTime : startTime;

  const adjustStartTime = (minutes: number) => {
    const newTime = new Date(startTime.getTime() + minutes * 60000);
    setStartTime(newTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <AirportMap
          checkpoints={checkpoints}
          selectedCheckpoints={selectedCheckpoints}
          onCheckpointPress={toggleCheckpoint}
        />
      </View>

      <BottomSheet snapPoints={[30, 55, 95]} initialSnap={1}>
        <SafeAreaView style={styles.sheetSafeArea}>
          <View style={styles.sheetContent}>
            <JourneyProgress
              currentStep={currentStep}
              totalSteps={timeline.length}
              currentCheckpoint={currentCheckpoint?.name}
            />

            <View style={styles.optimizationBanner}>
              <MaterialIcons name="bolt" size={16} color="#B45309" />
              <Text style={styles.optimizationText}>{t.mapScreen.optimizedRoute}</Text>
            </View>

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{t.mapScreen.myItinerary}</Text>
                <Text style={styles.sheetMeta}>{timeline.length} {t.mapScreen.stops}</Text>
              </View>
              {timeline.length > 0 && (
                <View style={styles.totalTimebadge}>
                  <MaterialIcons name="schedule" size={16} color="#016563" />
                  <Text style={styles.totalTimeText}>{formatDuration(totalTime)}</Text>
                </View>
              )}
            </View>

            {timeline.length > 0 && (
              <View style={styles.timeControl}>
                <Text style={styles.timeControlLabel}>{t.time.startTime}:</Text>
                <View style={styles.timeControlButtons}>
                  <Pressable 
                    style={styles.timeButton} 
                    onPress={() => adjustStartTime(-30)}
                  >
                    <MaterialIcons name="remove" size={16} color="#016563" />
                    <Text style={styles.timeButtonText}>30m</Text>
                  </Pressable>
                  <View style={styles.currentTime}>
                    <Text style={styles.currentTimeText}>
                      {startTime.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </Text>
                  </View>
                  <Pressable 
                    style={styles.timeButton} 
                    onPress={() => adjustStartTime(30)}
                  >
                    <MaterialIcons name="add" size={16} color="#016563" />
                    <Text style={styles.timeButtonText}>30m</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <BottomSheetScrollView 
              style={styles.timelineScroll}
              contentContainerStyle={styles.timelineList}
              showsVerticalScrollIndicator={false}
            >
              {timeline.length === 0 ? (
                <Text style={styles.emptyText}>{t.mapScreen.noCheckpoints}</Text>
              ) : (
                <>
                  {timeline.map((item, index) => (
                    <TimelineCard
                      key={item.id}
                      checkpoint={item}
                      isFirst={index === 0}
                      isLast={index === timeline.length - 1}
                      isActive={index === currentStep - 1}
                      onRemove={removeCheckpoint}
                    />
                  ))}
                  <BoardingTimeIndicator 
                    boardingTime={boardingTime}
                    journeyEndTime={journeyEndTime}
                  />
                </>
              )}
            </BottomSheetScrollView>

            <Pressable style={styles.addButton} onPress={() => setLibraryVisible(true)}>
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>{t.mapScreen.addCheckpoint}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </BottomSheet>

      <Modal
        animationType="slide"
        visible={libraryVisible}
        onRequestClose={() => setLibraryVisible(false)}
      >
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.mapScreen.availableCheckpoints}</Text>
            <Pressable onPress={() => setLibraryVisible(false)}>
              <MaterialIcons name="close" size={24} color="#0F172A" />
            </Pressable>
          </View>
          <CheckpointLibrary
            checkpoints={checkpoints}
            selectedIds={selectedCheckpoints}
            onAdd={(id) => {
              addCheckpoint(id);
              setLibraryVisible(false);
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* Floating Assistant Button */}
      <Pressable 
        style={styles.fab} 
        onPress={() => setChatVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open AI Assistant"
      >
        <MaterialIcons name="chat" size={28} color="#FFFFFF" />
      </Pressable>

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
      >
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{t.topBar.aiAssistant}</Text>
              <View style={styles.aiBadge}>
                <MaterialIcons name="auto-awesome" size={12} color="#FFFFFF" />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>
            <Pressable onPress={() => setChatVisible(false)}>
              <MaterialIcons name="close" size={24} color="#0F172A" />
            </Pressable>
          </View>
          <ChatScreen />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1A2A',
  },
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sheetSafeArea: {
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  optimizationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  optimizationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  sheetMeta: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  totalTimebadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F4F3',
    borderRadius: 20,
  },
  totalTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#016563',
  },
  timeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  timeControlLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  timeControlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#016563',
  },
  currentTime: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#016563',
  },
  currentTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#016563',
    fontVariant: ['tabular-nums'],
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    paddingVertical: 24,
  },
  timelineScroll: {
    flex: 1,
  },
  timelineList: {
    paddingVertical: 12,
    paddingBottom: 100,
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#016563',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#016563',
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#016563',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
  },
});
