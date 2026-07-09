import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreenModule from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SessionProvider, useSession } from './src/store/session';
import { Logo } from './src/components';
import { colors, useAppFonts } from './src/theme';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

function Root() {
  const fontsLoaded = useAppFonts();
  const { isLoading } = useSession();
  const ready = fontsLoaded && !isLoading;

  useEffect(() => {
    if (ready) {
      SplashScreenModule.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Logo height={56} />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SessionProvider>
        <Root />
      </SessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
});
