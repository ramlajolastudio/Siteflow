/**
 * Entry point — checks auth state and redirects.
 */
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getDatabase, isWebPlatform, getWebStore } from '@/lib/database';
import { Colors } from '@/constants/theme';

export default function Index() {
  useEffect(() => {
    async function checkAuth() {
      try {
        if (isWebPlatform()) {
          const store = getWebStore();
          if (store.user_session?.[0]?.logged_in === 1) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
          return;
        }
        const db = await getDatabase();
        const session = await db.getFirstAsync(
          'SELECT logged_in FROM user_session WHERE id = 1'
        );
        if ((session as any)?.logged_in === 1) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      }
    }
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primaryContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.loginBgDark,
  },
});
