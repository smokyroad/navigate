import 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ItineraryProvider } from './src/context/ItineraryContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { TopBar } from './src/components/TopBar';
import { MapScreen } from './src/screens/MapScreen';
import { useTranslation } from './src/hooks/useTranslation';

function AppContent() {
  const { t } = useTranslation();

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <TopBar title={t.topBar.airportNavigator} />
      </SafeAreaView>
      <View style={styles.screen}>
        <MapScreen />
      </View>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <ItineraryProvider>
            <AppContent />
          </ItineraryProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
  },
});
