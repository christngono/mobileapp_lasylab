import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreenModule from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Logo } from './src/components';
import { colors, useAppFonts } from './src/theme';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

export default function App() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreenModule.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Logo height={56} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
});
