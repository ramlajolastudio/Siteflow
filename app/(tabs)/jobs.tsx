/**
 * Jobs Pipeline — filterable list of all jobs with status indicators.
 * Matches the jobs_pipeline prototype.
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
import { router } from 'expo-router';
import SyncStatusBar from '@/components/SyncStatusBar';
import { getAll } from '@/lib/database';
import { triggerSync } from '@/lib/sync';
import { Colors, Shadows } from '@/constants/theme';

const FILTERS = ['All', 'Lead', 'Mitigation', 'Drying', 'Rebuild', 'Complete'];

const RISK_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  high: { bg: Colors.error, text: Colors.error, ring: Colors.errorAlpha20 },
  medium: { bg: '#f59e0b', text: '#d97706', ring: 'rgba(245,158,11,0.2)' },
  normal: { bg: Colors.statusGreen, text: '#059669', ring: 'transparent' },
};

const RISK_LABELS: Record<string, string> = {
  high: 'High Risk',
  medium: 'Pending Review',
  normal: 'On Schedule',
};

const DAMAGE_COLORS: Record<string, { bg: string; text: string }> = {
  'Water Damage': { bg: 'rgba(0,85,255,0.1)', text: Colors.primaryContainer },
  'Fire Restoration': { bg: Colors.tertiaryContainerAlpha10, text: Colors.tertiaryContainer },
  'Mold Remediation': { bg: 'rgba(22,163,74,0.1)', text: '#16a34a' },
};

export default function JobsScreen() {
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const allJobs = await getAll<any>('jobs');
    setJobs(allJobs);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await triggerSync();
    await loadData();
    setRefreshing(false);
  };

  const filtered = jobs.filter((job) => {
    if (filter !== 'All' && job.phase?.toLowerCase() !== filter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        job.address?.toLowerCase().includes(q) ||
        job.client_name?.toLowerCase().includes(q) ||
        job.claim_number?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filterCounts: Record<string, number> = {
    All: jobs.length,
    Lead: jobs.filter((j) => j.phase === 'lead').length,
    Mitigation: jobs.filter((j) => j.phase === 'mitigation').length,
    Drying: jobs.filter((j) => j.phase === 'drying').length,
    Rebuild: jobs.filter((j) => j.phase === 'reconstruction').length,
    Complete: jobs.filter((j) => j.status === 'complete').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerBrand}>SiteFlow</Text>
        <MaterialIcons name="account-circle" size={28} color={Colors.primary} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SyncStatusBar />

        {/* Title row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Jobs</Text>
            <Text style={styles.pageSubtitle}>{jobs.length} active projects</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialIcons name="filter-list" size={24} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, filter === f && styles.pillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>
                {f} ({filterCounts[f] || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={Colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by address, client, or claim..."
            placeholderTextColor={Colors.outline}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Job Cards */}
        {filtered.map((job) => {
          const risk = RISK_COLORS[job.risk_level] || RISK_COLORS.normal;
          const riskLabel = RISK_LABELS[job.risk_level] || 'On Schedule';
          const damage = DAMAGE_COLORS[job.damage_type] || { bg: Colors.primaryAlpha10, text: Colors.primaryContainer };

          return (
            <TouchableOpacity
              key={job.id}
              style={[
                styles.jobCard,
                Shadows.card,
                job.risk_level !== 'normal' && { borderWidth: 2, borderColor: risk.ring },
              ]}
              activeOpacity={0.7}
              onPress={() => router.push(`/job/${job.id}`)}
            >
              {/* Side stripe */}
              <View style={[styles.sideStripe, { backgroundColor: risk.bg }]} />

              {/* Top row */}
              <View style={styles.jobTopRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: risk.bg }]} />
                    <Text style={[styles.statusText, { color: risk.text }]}>{riskLabel}</Text>
                  </View>
                  <Text style={styles.jobAddress}>{job.address}</Text>
                  <Text style={styles.jobMeta}>
                    {job.phase?.charAt(0).toUpperCase() + job.phase?.slice(1)} · Day {job.day_count}
                  </Text>
                </View>
                <View style={[styles.damagePill, { backgroundColor: damage.bg }]}>
                  <Text style={[styles.damagePillText, { color: damage.text }]}>
                    {job.damage_type}
                  </Text>
                </View>
              </View>

              {/* Value */}
              <View style={styles.valueRow}>
                <Text style={styles.jobValue}>
                  ${job.estimated_value?.toLocaleString()}
                </Text>
                <Text style={styles.jobValueLabel}>ESTIMATED</Text>
              </View>

              {/* Footer */}
              <View style={styles.jobFooter}>
                <View style={styles.equipRow}>
                  <MaterialIcons name="inventory-2" size={18} color={Colors.outline} />
                  <Text style={styles.equipText}>{job.equipment_count} Equip. On-site</Text>
                </View>
                <Text style={styles.detailsLink}>DETAILS</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
    backgroundColor: 'rgba(249,249,254,0.7)',
  },
  headerBrand: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, color: '#0f172a' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 24,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: Colors.onSurface },
  pageSubtitle: { color: Colors.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pillRow: { gap: 8, marginBottom: 24 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceContainerLow,
  },
  pillActive: { backgroundColor: Colors.primaryContainer },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    color: Colors.onSurfaceVariant,
  },
  pillTextActive: { color: '#fff' },

  searchBox: { position: 'relative', marginBottom: 32 },
  searchIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  searchInput: {
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 14,
    color: Colors.onSurface,
  },

  jobCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  sideStripe: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '100%',
  },
  jobTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.55 },
  jobAddress: { fontSize: 18, fontWeight: '700', color: Colors.onSurface },
  jobMeta: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant, marginTop: 2 },
  damagePill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, alignSelf: 'flex-start' },
  damagePillText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.55 },

  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 24 },
  jobValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: Colors.onSurface },
  jobValueLabel: { fontSize: 12, fontWeight: '700', color: Colors.outline },

  jobFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  equipText: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant },
  detailsLink: { fontSize: 12, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },

  fab: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.cardLifted,
  },
});
