/**
 * Contacts Network — referral CRM with revenue tracking.
 * Matches the contacts_network prototype.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SyncStatusBar from '@/components/SyncStatusBar';
import { getAll } from '@/lib/database';
import { Colors, Shadows } from '@/constants/theme';

const FILTERS = ['All', 'Agents', 'Adjusters', 'Clients', 'Property Mgrs', 'Plumbers'];
const ROLE_MAP: Record<string, string> = {
  Agents: 'agent',
  Adjusters: 'adjuster',
  Clients: 'client',
  'Property Mgrs': 'property_mgr',
  Plumbers: 'plumber',
};

const AVATAR_GRADIENTS: string[][] = [
  ['#3b82f6', '#4f46e5'],
  ['#a855f7', '#ec4899'],
  ['#10b981', '#0d9488'],
  ['#f59e0b', '#ea580c'],
  ['#475569', '#1e293b'],
  ['#06b6d4', '#2563eb'],
  ['#34d399', '#16a34a'],
];

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setContacts(await getAll<any>('contacts'));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filtered = contacts.filter((c) => {
    if (filter !== 'All') {
      const roleFilter = ROLE_MAP[filter];
      if (roleFilter && c.role !== roleFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return c.name?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q);
    }
    return true;
  });

  const roleCounts: Record<string, number> = {
    All: contacts.length,
    Agents: contacts.filter((c) => c.role === 'agent').length,
    Adjusters: contacts.filter((c) => c.role === 'adjuster').length,
    Clients: contacts.filter((c) => c.role === 'client').length,
    'Property Mgrs': contacts.filter((c) => c.role === 'property_mgr').length,
    Plumbers: contacts.filter((c) => c.role === 'plumber').length,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerBrand}>SiteFlow</Text>
        <View style={styles.headerIcons}>
          <MaterialIcons name="search" size={24} color={Colors.onSurfaceVariant} />
          <MaterialIcons name="account-circle" size={28} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SyncStatusBar />

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Contacts</Text>
            <Text style={styles.pageSub}>Your referral network</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialIcons name="filter-list" size={24} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={Colors.outline} style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.outline}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, filter === f && styles.pillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>
                {f} ({roleCounts[f] || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contact Cards */}
        {filtered.map((contact, idx) => {
          const colors = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
          const initials = contact.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2);
          const isStale = contact.status === 'stale';
          const revenue = contact.total_revenue >= 1000
            ? `$${Math.round(contact.total_revenue / 1000)}K`
            : `$${contact.total_revenue}`;

          return (
            <View
              key={contact.id}
              style={[styles.contactCard, Shadows.card, isStale && styles.contactCardStale]}
            >
              <View style={styles.contactTop}>
                <View style={[styles.avatar, { backgroundColor: colors[0] }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactMeta}>
                    {contact.company} · {contact.role?.charAt(0).toUpperCase() + contact.role?.slice(1)}
                  </Text>
                </View>
                <View style={styles.contactRight}>
                  {isStale ? (
                    <View style={styles.staleBadge}>
                      <MaterialIcons name="warning" size={14} color={Colors.error} />
                      <Text style={styles.staleText}>STALE</Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.contactRevenue}>{revenue}</Text>
                      <Text style={styles.contactRefCount}>
                        {contact.referral_count} Referrals
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
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
  headerIcons: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 32,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: Colors.onSurface },
  pageSub: { color: Colors.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBox: { position: 'relative', marginBottom: 24 },
  searchInput: {
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 14,
    color: Colors.onSurface,
  },

  pillRow: { gap: 8, marginBottom: 32 },
  pill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9999, backgroundColor: Colors.surfaceContainerLow },
  pillActive: { backgroundColor: Colors.primary },
  pillText: { fontSize: 13, fontWeight: '700', color: Colors.onSurfaceVariant },
  pillTextActive: { color: '#fff' },

  contactCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  contactCardStale: {},
  contactTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 20 },
  contactName: { fontSize: 18, fontWeight: '800', color: Colors.onSurface },
  contactMeta: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant, marginTop: 2 },
  contactRight: { alignItems: 'flex-end' },
  contactRevenue: { fontSize: 20, fontWeight: '800', color: Colors.onSurface },
  contactRefCount: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.outline },

  staleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  staleText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', color: Colors.error, letterSpacing: 0.5 },
});
