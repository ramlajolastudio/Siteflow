/**
 * Login Screen — dark gradient with access code gate.
 * Matches the login_screen prototype.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDatabase, isWebPlatform, getWebStore } from '@/lib/database';
import { Colors } from '@/constants/theme';

const VALID_CODE = 'SITE2026';

export default function LoginScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  async function handleLogin() {
    if (code.trim().toUpperCase() === VALID_CODE) {
      if (isWebPlatform()) {
        const store = getWebStore();
        if (store.user_session?.[0]) store.user_session[0].logged_in = 1;
      } else {
        const db = await getDatabase();
        await db.runAsync('UPDATE user_session SET logged_in = 1 WHERE id = 1');
      }
      router.replace('/(tabs)');
    } else {
      setError('Invalid access code');
    }
  }

  return (
    <LinearGradient
      colors={['#101830', '#080c18']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Background glow effects */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoGlow} />
          <LinearGradient
            colors={['#0055ff', '#0041c8']}
            style={styles.logoCircle}
          >
            <MaterialIcons name="near-me" size={40} color="#fff" />
          </LinearGradient>
        </View>

        {/* Header */}
        <Text style={styles.title}>SiteFlow</Text>
        <Text style={styles.subtitle}>Your job site command center</Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Access code"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={code}
            onChangeText={(t) => {
              setCode(t);
              setError('');
            }}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#0055ff', '#0040cc']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign In</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Secondary action */}
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Request site access</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.footerText}>SITEFLOW — BUILT FOR THE FIELD</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgGlow1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '60%',
    height: '60%',
    borderRadius: 9999,
    backgroundColor: 'rgba(0,65,200,0.2)',
    opacity: 0.3,
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: 9999,
    backgroundColor: 'rgba(0,85,255,0.1)',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoSection: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Colors.primaryContainer,
    opacity: 0.2,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0055ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    maxWidth: 360,
    gap: 16,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 20,
    color: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '700',
    marginTop: -8,
    marginLeft: 4,
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#0055ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 32,
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 0.6,
  },
});
