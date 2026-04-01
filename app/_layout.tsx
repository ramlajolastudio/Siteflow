/**
 * Root Layout — initializes the database, seeds demo data,
 * starts the sync engine and network monitoring.
 * Routes to login or main tabs based on auth state.
 */
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '@/lib/database';
import { seedDemoData } from '@/lib/seed';
import { startNetworkMonitoring } from '@/lib/network';
import { startSyncEngine } from '@/lib/sync';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // 1. Initialize database
        await getDatabase();

        // 2. Seed demo data (only runs once)
        await seedDemoData();

        // 3. Start network monitoring
        startNetworkMonitoring();

        // 4. Start sync engine
        startSyncEngine();
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setIsReady(true);
      }
    }

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primaryContainer} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="job/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.loginBgDark,
  },
});
