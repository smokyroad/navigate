import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkpoint } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslatedCheckpoint } from '../utils/translationUtils';

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  onRemove?: (id: string) => void;
}

export function CheckpointCard({ checkpoint, onRemove }: CheckpointCardProps) {
  const { language } = useTranslation();
  const translatedCheckpoint = getTranslatedCheckpoint(checkpoint, language);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="place" size={18} color="#016563" />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{translatedCheckpoint.name}</Text>
        <Text style={styles.meta}>{translatedCheckpoint.location}</Text>
        <Text style={styles.meta}>{translatedCheckpoint.terminal}</Text>
      </View>
      {!checkpoint.isMandatory && onRemove ? (
        <Pressable style={styles.removeButton} onPress={() => onRemove(checkpoint.id)}>
          <MaterialIcons name="remove-circle-outline" size={20} color="#DC2626" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
});
