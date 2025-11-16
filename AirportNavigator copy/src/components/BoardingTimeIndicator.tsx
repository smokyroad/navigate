import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { formatTime, formatDuration } from '../utils/timelineUtils';

interface BoardingTimeIndicatorProps {
  boardingTime: Date;
  journeyEndTime: Date;
}

export function BoardingTimeIndicator({ boardingTime, journeyEndTime }: BoardingTimeIndicatorProps) {
  const { t } = useTranslation();
  
  // Calculate time difference in minutes
  const timeDiffMs = boardingTime.getTime() - journeyEndTime.getTime();
  const timeDiffMinutes = Math.round(timeDiffMs / 60000);
  
  // Check if time is exceeded
  const isWarning = timeDiffMinutes < 0;
  const absTimeDiff = Math.abs(timeDiffMinutes);

  return (
    <View style={styles.container}>
      
      {/* Boarding gate icon */}
      <View style={[styles.dot, isWarning && styles.dotWarning]}>
        <MaterialIcons 
          name="flight" 
          size={16} 
          color={isWarning ? "#FFFFFF" : "#016563"} 
        />
      </View>

      {/* Boarding time card */}
      <View style={[styles.card, isWarning && styles.cardWarning]}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.title, isWarning && styles.titleWarning]}>
                {t.time.boardingTime}
              </Text>
              <Text style={[styles.time, isWarning && styles.timeWarning]}>
                {formatTime(boardingTime)}
              </Text>
            </View>
            <MaterialIcons 
              name={isWarning ? "warning" : "check-circle"} 
              size={24} 
              color={isWarning ? "#DC2626" : "#059669"} 
            />
          </View>

          <View style={[styles.statusBadge, isWarning ? styles.statusBadgeWarning : styles.statusBadgeSuccess]}>
            <MaterialIcons 
              name={isWarning ? "error-outline" : "schedule"} 
              size={14} 
              color={isWarning ? "#DC2626" : "#059669"} 
            />
            <Text style={[styles.statusText, isWarning ? styles.statusTextWarning : styles.statusTextSuccess]}>
              {isWarning ? t.time.timeExceeded : t.time.timeRemaining}:{' '}
              {formatDuration(absTimeDiff)} {!isWarning && t.time.beforeBoarding}
            </Text>
          </View>

          {isWarning && (
            <View style={styles.warningMessage}>
              <Text style={styles.warningText}>
                {t.time.boardingWarning}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingLeft: 40,
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    position: 'absolute',
    left: 5,
    top: 26,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E8F4F3',
    borderWidth: 2,
    borderColor: '#016563',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dotWarning: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
    overflow: 'hidden',
  },
  cardWarning: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  cardContent: {
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  titleWarning: {
    color: '#DC2626',
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeWarning: {
    color: '#DC2626',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusBadgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextSuccess: {
    color: '#059669',
  },
  statusTextWarning: {
    color: '#DC2626',
  },
  warningMessage: {
    paddingTop: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    lineHeight: 16,
  },
});
