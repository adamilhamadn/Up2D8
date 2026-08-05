import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../theme';
import { useEffect, useState } from 'react';
import { initDatabase } from '../db';
import { View, Text } from 'react-native';

export default function Layout() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbInitialized(true))
      .catch((e) => {
        console.error('Failed to initialize DB:', e);
        setDbError(e);
      });
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: '#ff3b30', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Database Error</Text>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{dbError.message}</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
