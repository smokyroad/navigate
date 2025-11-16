import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage, Language } from '../context/LanguageContext';

interface TopBarProps {
  title: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showLanguageToggle?: boolean;
  showAIBadge?: boolean;
}

export function TopBar({ title, showMenu, onMenuPress, showLanguageToggle = true, showAIBadge = false }: TopBarProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showMenu ? (
          <Pressable onPress={onMenuPress} style={styles.menuButton} accessibilityLabel="Open menu">
            <MaterialIcons name="menu" size={24} color="#0F172A" />
          </Pressable>
        ) : (
          <MaterialIcons name="travel-explore" size={24} color="#0F172A" />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {showAIBadge && (
            <View style={styles.aiBadge}>
              <MaterialIcons name="auto-awesome" size={12} color="#FFFFFF" />
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          )}
        </View>
      </View>
      {showLanguageToggle && (
        <View style={styles.languageToggle} accessible accessibilityRole="radiogroup">
          <Pressable
            style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
            onPress={() => handleLanguageChange('en')}
            accessibilityRole="radio"
            accessibilityState={{ selected: language === 'en' }}
            accessibilityLabel="Switch to English"
          >
            <Text style={[styles.languageText, language === 'en' && styles.languageTextActive]}>EN</Text>
          </Pressable>
          <Pressable
            style={[styles.languageButton, language === 'zh' && styles.languageButtonActive]}
            onPress={() => handleLanguageChange('zh')}
            accessibilityRole="radio"
            accessibilityState={{ selected: language === 'zh' }}
            accessibilityLabel="切換到中文"
          >
            <Text style={[styles.languageText, language === 'zh' && styles.languageTextActive]}>中文</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
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
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 4,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  languageButtonActive: {
    backgroundColor: '#016563',
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  languageTextActive: {
    color: '#FFFFFF',
  },
});
