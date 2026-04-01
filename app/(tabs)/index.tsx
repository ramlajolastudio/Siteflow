/**
 * Home Dashboard — command center with alerts, metrics, quick actions, tasks.
 * Matches the home_dashboard prototype.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import SyncStatusBar from '@/components/SyncStatusBar';
import { getDatabase } from '@/lib/database';
import { triggerSync } from '@/lib/sync';
import { Colors, Shadows, Typography } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeJobs: 0,
    pendingSupplements: 0,
    equipmentOut: 0,
    overdueTasks: 0,
  });

  const loadData = useCallback(async () => {
    const db = await getDatabase();
    const allJobs = await db.getAllAsync('SELECT * FROM jobs ORDER BY created_at DESC');
    const allTasks = await db.getAllAsync(
      "SELECT * FROM tasks WHERE status != 'completed' ORDER BY due_date ASC"
    );
    setJobs(allJobs as any[]);
    setTasks(allTasks as any[]);

    // Calculate metrics
    const activeCount = (allJobs as any[]).filter((j: any) => j.status === 'active').length;
    const pendingSup = (allJobs as any[]).reduce((sum: number, j: any) => sum + (j.pending_amount || 0), 0);
    const equipOut = (allJobs as any[]).reduce((sum: number, j: any) => sum + (j.equipment_count || 0), 0);
    const overdue = (allTasks as any[]).filter((t: any) => t.status === 'overdue').length;

    setMetrics({
      activeJobs: activeCount,
      pendingSupplements: pendingSup,
      equipmentOut: equipOut,
      overdueTasks: overdue,
    });
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

  return (
    <View style={styles.container}>
      {/* Dark Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerGreeting}>GOOD MORNING</Text>
          <Text style={styles.headerTitle}>SiteFlow</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JR</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SyncStatusBar />

        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <MaterialIcons name="warning" size={20} color={Colors.error} />
          <Text style={styles.alertText}>
            2 lien deadlines within 5 days · 3 supplements overdue 30+ days
          </Text>
        </View>

        {/* Key Metrics Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsRow}
        >
          <MetricCard label="Active Jobs" value={String(metrics.activeJobs)} color={Colors.primary} />
          <MetricCard
            label="Pending Supplements"
            value={`$${(metrics.pendingSupplements / 1000).toFixed(1)}K`}
            color={Colors.tertiaryContainer}
            wide
          />
          <MetricCard label="Equipment Out" value={String(metrics.equipmentOut)} color={Colors.onSurface} />
          <MetricCard label="Overdue Tasks" value={String(metrics.overdueTasks)} color={Colors.error} />
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionPrimary]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add-business" size={32} color="#fff" />
              <Text style={styles.actionLabelWhite}>New Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionSecondary]} activeOpacity={0.8}>
              <MaterialIcons name="photo-camera" size={32} color={Colors.primary} />
              <Text style={styles.actionLabel}>Quick Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionSecondary]}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/notes')}
            >
              <MaterialIcons name="mic" size={32} color={Colors.tertiaryContainer} />
              <Text style={styles.actionLabel}>Voice Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionSecondary]} activeOpacity={0.8}>
              <MaterialIcons name="straighten" size={32} color="#008080" />
              <Text style={styles.actionLabel}>Log Reading</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Tasks</Text>

          {/* Juan's tasks */}
          <View style={styles.taskCard}>
            <View style={styles.taskCardHeader}>
              <View style={[styles.taskAvatar, { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.taskAvatarText, { color: '#1d4ed8' }]}>JR</Text>
              </View>
              <Text style={styles.taskAssignee}>Juan Rodriguez (PM)</Text>
            </View>
            {tasks
              .filter((t: any) => t.assignee === 'Juan Rodriguez')
              .map((task: any) => (
                <View key={task.id} style={styles.taskRow}>
                  <View style={styles.taskRowLeft}>
                    <View
                      style={[
                        styles.taskDot,
                        {
                          backgroundColor:
                            task.status === 'overdue'
                              ? Colors.error
                              : task.status === 'completed'
                                ? Colors.statusGreen
                                : Colors.tertiaryContainer,
                        },
                      ]}
                    />
                    <View>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskSub}>{task.description}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.taskBadge,
                      {
                        backgroundColor:
                          task.status === 'overdue'
                            ? Colors.errorAlpha10
                            : Colors.surfaceContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.taskBadgeText,
                        {
                          color:
                            task.status === 'overdue'
                              ? Colors.error
                              : Colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {task.status === 'overdue' ? 'OVERDUE' : 'DUE TODAY'}
                    </Text>
                  </View>
                </View>
              ))}
          </View>

          {/* Matt's tasks */}
          <View style={styles.taskCard}>
            <View style={styles.taskCardHeader}>
              <View style={[styles.taskAvatar, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.taskAvatarText, { color: '#b45309' }]}>MK</Text>
              </View>
              <Text style={styles.taskAssignee}>Matt Kowalski (PM)</Text>
            </View>
            {tasks
              .filter((t: any) => t.assignee === 'Matt Kowalski')
              .map((task: any) => (
                <View key={task.id} style={styles.taskRow}>
                  <View style={styles.taskRowLeft}>
                    <View style={[styles.taskDot, { backgroundColor: Colors.statusGreen }]} />
                    <View>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskSub}>{task.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.taskBadge, { backgroundColor: Colors.surfaceContainer }]}>
                    <Text style={[styles.taskBadgeText, { color: Colors.onSurfaceVariant }]}>
                      TOMORROW
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function MetricCard({
  label,
  value,
  color,
  wide,
}: {
  label: string;
  value: string;
  color: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.metricCard, wide && { width: 200 }, Shadows.card]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#94a3b8',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },

  // Alert
  alertBanner: {
    backgroundColor: Colors.errorAlpha5,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onErrorContainer,
    lineHeight: 20,
  },

  // Metrics
  metricsRow: { gap: 16, paddingBottom: 16, marginBottom: 8 },
  metricCard: {
    width: 160,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  // Section
  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 16,
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionBtn: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderRadius: 24,
    gap: 12,
  },
  actionPrimary: { backgroundColor: Colors.primaryContainer },
  actionSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
    ...Shadows.card,
  },
  actionLabelWhite: { fontSize: 14, fontWeight: '700', color: '#fff' },
  actionLabel: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },

  // Tasks
  taskCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    ...Shadows.cardLifted,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  taskAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskAvatarText: { fontSize: 11, fontWeight: '700' },
  taskAssignee: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskRowLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  taskDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  taskSub: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  taskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  taskBadgeText: { fontSize: 10, fontWeight: '700' },
});
