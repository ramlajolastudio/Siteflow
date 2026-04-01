/**
 * Settings & Profile — user profile, notification prefs, security.
 * Matches the settings_profile prototype.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getDatabase } from '@/lib/database';
import { Colors, Shadows } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const db = await getDatabase();
          await db.runAsync('UPDATE user_session SET logged_in = 0 WHERE id = 1');
          router.replace('/login');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerBrand}>SiteFlow</Text>
        <MaterialIcons name="account-circle" size={32} color={Colors.primary} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>JR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juan Rodriguez</Text>
            <Text style={styles.profileRole}>Project Manager</Text>
            <Text style={styles.profileCompany}>ABC Restoration Services</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Preferences */}
        <Text style={styles.sectionLabel}>NOTIFICATION PREFERENCES</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>SMS</Text>
              <Text style={styles.settingDesc}>Urgent dispatch</Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Email</Text>
              <Text style={styles.settingDesc}>Daily summaries</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.settingTitle}>In-App Alerts</Text>
              <Text style={styles.settingDesc}>Real-time feedback</Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Security */}
        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={[styles.card, Shadows.card, { padding: 0, overflow: 'hidden' }]}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Biometric Authentication</Text>
              <View style={styles.onBadge}>
                <Text style={styles.onBadgeText}>ON</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.menuItemText}>Managed Devices</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* About */}
        <View style={styles.about}>
          <Text style={styles.aboutVersion}>SiteFlow v2.0.0</Text>
          <Text style={styles.aboutTag}>Built for the field</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerBrand: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, color: '#0f172a' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.onSurface,
    marginBottom: 32,
  },

  // Profile
  profileSection: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 48,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0055ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  profileInitials: { color: '#fff', fontSize: 28, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: Colors.onSurface },
  profileRole: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant, marginTop: 2 },
  profileCompany: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant, marginBottom: 16 },
  editBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
  },
  editBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },

  // Section
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
    marginLeft: 4,
  },

  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: { fontWeight: '700', color: Colors.onSurface, fontSize: 15 },
  settingDesc: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuItemText: { fontWeight: '700', color: Colors.onSurface, fontSize: 15 },
  onBadge: {
    backgroundColor: Colors.primaryAlpha10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  onBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary, textTransform: 'uppercase' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: Colors.errorAlpha5,
    borderRadius: 12,
  },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 15 },

  about: { alignItems: 'center', paddingVertical: 32 },
  aboutVersion: { fontWeight: '700', color: Colors.onSurface },
  aboutTag: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4 },
});
