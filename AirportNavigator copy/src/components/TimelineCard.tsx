import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TimelineCheckpoint } from '../types';
import { formatTime, formatDuration } from '../utils/timelineUtils';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslatedCheckpoint } from '../utils/translationUtils';

interface TimelineCardProps {
  checkpoint: TimelineCheckpoint;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onRemove?: (id: string) => void;
}

export function TimelineCard({ checkpoint, isFirst, isLast, isActive, onRemove }: TimelineCardProps) {
  const duration = checkpoint.estimatedDuration || 10;
  const { language } = useTranslation();
  const translatedCheckpoint = getTranslatedCheckpoint(checkpoint, language);

  return (
    <View style={styles.container}>
      {/* Timeline connector line */}
      {!isFirst && <View style={styles.lineTop} />}
      {!isLast && <View style={styles.lineBottom} />}

      {/* Timeline dot */}
      <View style={[styles.dot, isActive && styles.dotActive]}>
        <MaterialIcons 
          name={checkpoint.isMandatory ? "star" : "place"} 
          size={14} 
          color={isActive ? "#FFFFFF" : "#016563"} 
        />
      </View>

      {/* Card content */}
      <View style={[styles.card, isActive && styles.cardActive]}>
        {/* Time badge */}
        <View style={styles.timeBadge}>
          <MaterialIcons name="schedule" size={12} color="#016563" />
          <Text style={styles.timeText}>{formatTime(checkpoint.arrivalTime)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{translatedCheckpoint.name}</Text>
              <Text style={styles.meta}>{translatedCheckpoint.location}</Text>
            </View>
            
            {!checkpoint.isMandatory && onRemove && (
              <Pressable 
                style={styles.removeButton} 
                onPress={() => onRemove(checkpoint.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={18} color="#94A3B8" />
              </Pressable>
            )}
          </View>

          {/* Duration info */}
          <View style={styles.durationRow}>
            <View style={styles.durationBadge}>
              <MaterialIcons name="access-time" size={12} color="#64748B" />
              <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            </View>
            <Text style={styles.departureText}>
              Depart at {formatTime(checkpoint.departureTime)}
            </Text>
          </View>
        </View>
      </View>

      {/* Travel time indicator */}
      {checkpoint.travelTimeToNext && !isLast && (
        <View style={styles.travelInfo}>
          <MaterialIcons name="directions-walk" size={14} color="#64748B" />
          <Text style={styles.travelText}>{formatDuration(checkpoint.travelTimeToNext)} walk</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingLeft: 40,
    marginBottom: 4,
  },
  lineTop: {
    position: 'absolute',
    left: 15,
    top: -50,
    bottom: '50%',
    width: 2,
    backgroundColor: '#CBD5E1',
  },
  lineBottom: {
    position: 'absolute',
    left: 15,
    top: '50%',
    bottom: -4,
    width: 2,
    backgroundColor: '#CBD5E1',
  },
  dot: {
    position: 'absolute',
    left: 6,
    top: 58,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F4F3',
    borderWidth: 2,
    borderColor: '#016563',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dotActive: {
    backgroundColor: '#016563',
    borderColor: '#016563',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardActive: {
    borderColor: '#016563',
    borderWidth: 1,
    shadowColor: '#016563',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E8F4F3',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#016563',
  },
  cardBody: {
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
  },
  removeButton: {
    padding: 2,
    marginLeft: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  departureText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  travelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 6,
    paddingTop: 12,
    paddingLeft: 4,
  },
  travelText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
});
