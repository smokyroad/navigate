import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

type TabKey = 'map' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();
  
  const tabs: { key: TabKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'map', label: t.bottomNav.itinerary, icon: 'map' },
    { key: 'profile', label: t.bottomNav.profile, icon: 'person' },
  ];
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={isActive ? '#016563' : '#94A3B8'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#01656315',
  },
  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#016563',
  },
});
