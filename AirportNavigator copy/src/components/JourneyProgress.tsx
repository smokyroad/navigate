import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

interface JourneyProgressProps {
  currentStep: number;
  totalSteps: number;
  currentCheckpoint?: string;
}

export function JourneyProgress({ currentStep, totalSteps, currentCheckpoint }: JourneyProgressProps) {
  const progress = totalSteps === 0 ? 0 : (currentStep / totalSteps) * 100;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <MaterialIcons name="explore" size={18} color="#016563" />
          <Text style={styles.label}>{t.mapScreen.journeyProgress}</Text>
        </View>
        <Text style={styles.value}>
          {t.mapScreen.step} {Math.min(currentStep, totalSteps || 1)} / {Math.max(totalSteps, 1)}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      {currentCheckpoint ? (
        <View style={styles.captionRow}>
          <MaterialIcons name="place" size={14} color="#64748B" />
          <Text style={styles.caption}>{currentCheckpoint}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#016563',
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caption: {
    fontSize: 12,
    color: '#64748B',
  },
});
