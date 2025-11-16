import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkpoint } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslatedCheckpoints } from '../utils/translationUtils';

interface CheckpointLibraryProps {
  checkpoints: Checkpoint[];
  selectedIds: string[];
  onAdd: (id: string) => void;
}

export function CheckpointLibrary({ checkpoints, selectedIds, onAdd }: CheckpointLibraryProps) {
  const [search, setSearch] = useState('');
  const { t, language } = useTranslation();

  const translatedCheckpoints = useMemo(() => 
    getTranslatedCheckpoints(checkpoints, language), 
    [checkpoints, language]
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return translatedCheckpoints.filter(
      (checkpoint) =>
        checkpoint.name.toLowerCase().includes(query) ||
        checkpoint.type.toLowerCase().includes(query) ||
        checkpoint.location.toLowerCase().includes(query)
    );
  }, [search, translatedCheckpoints]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t.checkpointLibrary.searchPlaceholder}
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <FlatList<Checkpoint>
        data={filtered}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 12 }}
  renderItem={({ item }: { item: Checkpoint }) => {
          const added = selectedIds.includes(item.id);
          return (
            <View style={styles.card}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="flag-circle" size={20} color="#016563" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.location}</Text>
              </View>
              <Pressable
                onPress={() => !added && onAdd(item.id)}
                style={[styles.addButton, added && styles.addedButton]}
              >
                <MaterialIcons
                  name={added ? 'check' : 'add'}
                  size={20}
                  color={added ? '#16A34A' : '#016563'}
                />
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  searchInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedButton: {
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
  },
});
