/**
 * Job Detail Screen — full job view with all sections.
 * Matches the job_detail_martinez prototype.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getById, getWhere } from '@/lib/database';
import { Colors, Shadows } from '@/constants/theme';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [job, setJob] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [readings, setReadings] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const j = await getById<any>('jobs', id);
      setJob(j);
      setEquipment(await getWhere('equipment', 'job_id = ?', [id]));
      setNotes(await getWhere('notes', 'job_id = ?', [id]));
      setTasks(await getWhere('tasks', 'job_id = ?', [id]));
      setReadings(await getWhere('moisture_readings', 'job_id = ?', [id]));
    }
    load();
  }, [id]);

  if (!job) return <View style={styles.loading} />;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;

  // Group readings by location, get latest 2 dates
  const locationMap: Record<string, any[]> = {};
  readings.forEach((r) => {
    if (!locationMap[r.location]) locationMap[r.location] = [];
    locationMap[r.location].push(r);
  });

  return (
    <View style={styles.container}>
      {/* Dark header */}
      <LinearGradient
        colors={['#111827', '#1f2937']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>{job.address}</Text>
          </TouchableOpacity>
          <MaterialIcons name="more-horiz" size={24} color="#fff" />
        </View>
        <View style={styles.headerTags}>
          <View style={styles.phasePill}>
            <Text style={styles.phasePillText}>
              {job.phase?.charAt(0).toUpperCase() + job.phase?.slice(1)}
            </Text>
          </View>
          <Text style={styles.headerSub}>
            {job.damage_type} - {job.client_name?.split(' ')[0]}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Health Alert */}
        <View style={styles.alertCard}>
          <MaterialIcons name="warning" size={20} color={Colors.error} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Action Required</Text>
            <Text style={styles.alertBody}>
              Lien deadline approaching (3 days) and Supplement #2 is currently 48h overdue.
            </Text>
          </View>
        </View>

        {/* 2. Client Info */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.cardLabel}>CLIENT INFORMATION</Text>
          <Text style={styles.clientName}>{job.client_name}</Text>
          <Text style={styles.clientAddress}>{job.address}, Phoenix AZ</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`tel:${job.client_phone}`)}
            >
              <MaterialIcons name="call" size={20} color={Colors.primary} />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`sms:${job.client_phone}`)}
            >
              <MaterialIcons name="chat" size={20} color={Colors.primary} />
              <Text style={styles.contactBtnText}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`mailto:${job.client_email}`)}
            >
              <MaterialIcons name="mail" size={20} color={Colors.primary} />
              <Text style={styles.contactBtnText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Insurance */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.cardLabel}>INSURANCE DETAILS</Text>
          <View style={styles.insuranceGrid}>
            <View style={styles.insuranceItem}>
              <Text style={styles.insuranceLabel}>CARRIER</Text>
              <Text style={styles.insuranceValue}>{job.insurance_carrier}</Text>
            </View>
            <View style={styles.insuranceItem}>
              <Text style={styles.insuranceLabel}>CLAIM #</Text>
              <Text style={styles.insuranceValue}>{job.claim_number}</Text>
            </View>
          </View>
          <View style={styles.adjusterRow}>
            <View style={styles.adjusterAvatar}>
              <MaterialIcons name="person" size={20} color="#64748b" />
            </View>
            <View>
              <Text style={styles.adjusterName}>{job.adjuster_name}</Text>
              <Text style={styles.adjusterPhone}>Adjuster · {job.adjuster_phone}</Text>
            </View>
          </View>
        </View>

        {/* 4. Financial Overview */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.finHeader}>
            <Text style={styles.cardLabel}>FINANCIAL OVERVIEW</Text>
            <Text style={styles.finTotal}>
              ${job.estimated_value?.toLocaleString()}.00
            </Text>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Colors.primary,
                  width: `${((job.paid_amount || 0) / (job.estimated_value || 1)) * 100}%`,
                },
              ]}
            />
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: '#fbbf24',
                  width: `${((job.approved_amount || 0) / (job.estimated_value || 1)) * 100}%`,
                },
              ]}
            />
          </View>
          <View style={styles.finGrid}>
            <View>
              <Text style={styles.finLabel}>PAID</Text>
              <Text style={[styles.finValue, { color: Colors.primary }]}>
                ${(job.paid_amount || 0).toLocaleString()}
              </Text>
            </View>
            <View>
              <Text style={styles.finLabel}>APPROVED</Text>
              <Text style={[styles.finValue, { color: '#d97706' }]}>
                ${(job.approved_amount || 0).toLocaleString()}
              </Text>
            </View>
            <View>
              <Text style={styles.finLabel}>PENDING</Text>
              <Text style={[styles.finValue, { color: '#94a3b8' }]}>
                ${(job.pending_amount || 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Equipment */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.equipHeader}>
            <Text style={styles.cardLabel}>EQUIPMENT ON-SITE</Text>
            <Text style={styles.liveText}>Live Tracking</Text>
          </View>
          {equipment.map((eq) => (
            <View key={eq.id} style={styles.equipItem}>
              <View style={styles.equipIcon}>
                <MaterialIcons name="air" size={20} color={Colors.onSurfaceVariant} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.equipName}>{eq.name}</Text>
                <Text style={styles.equipRate}>${eq.daily_rate.toFixed(2)} / day</Text>
              </View>
              <Text style={styles.equipQty}>x{eq.quantity}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addEquipBtn}>
            <Text style={styles.addEquipText}>+ Add Equipment</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Notes */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.notesHeader}>
            <Text style={styles.cardLabel}>LATEST NOTES ({notes.length})</Text>
            <MaterialIcons name="add-box" size={24} color={Colors.primary} />
          </View>
          {notes.slice(0, 2).map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <View style={styles.noteTop}>
                <View
                  style={[
                    styles.noteCatPill,
                    {
                      backgroundColor:
                        note.category === 'insurance' ? '#e0e7ff' : '#d1fae5',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.noteCatText,
                      { color: note.category === 'insurance' ? '#4338ca' : '#047857' },
                    ]}
                  >
                    {note.category?.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.noteTime}>
                  {note.created_at ? new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
              </View>
              <Text style={styles.noteBody}>{note.content}</Text>
            </View>
          ))}
        </View>

        {/* 7. Tasks */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.cardLabel}>PRODUCTION TASKS</Text>
          <View style={styles.taskProgress}>
            <View style={styles.taskProgressBar}>
              <View
                style={[
                  styles.taskProgressFill,
                  { width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' },
                ]}
              />
            </View>
            <Text style={styles.taskProgressText}>
              {completedTasks}/{totalTasks} Done
            </Text>
          </View>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskCheckRow}>
                <View
                  style={[
                    styles.taskCheck,
                    task.status === 'completed' && styles.taskCheckDone,
                  ]}
                >
                  {task.status === 'completed' && (
                    <MaterialIcons name="check" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.taskName}>{task.title}</Text>
              </View>
              {task.status !== 'completed' && (
                <View
                  style={[
                    styles.taskDuePill,
                    {
                      backgroundColor:
                        task.status === 'overdue' ? Colors.errorAlpha10 : '#fef3c7',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.taskDueText,
                      { color: task.status === 'overdue' ? Colors.error : '#b45309' },
                    ]}
                  >
                    {task.status === 'overdue' ? 'DUE NOW' : 'TOMORROW'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 8. Moisture Readings */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.moistureHeader}>
            <View>
              <Text style={styles.cardLabel}>MOISTURE CONTENT</Text>
              <View style={styles.trendRow}>
                <MaterialIcons name="trending-down" size={16} color={Colors.statusGreen} />
                <Text style={styles.trendText}>Trending down</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chartBtn}>
              <Text style={styles.chartBtnText}>View Full Chart</Text>
            </TouchableOpacity>
          </View>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>LOCATION</Text>
            <Text style={styles.tableHeaderText}>PREV</Text>
            <Text style={styles.tableHeaderText}>CURRENT</Text>
          </View>
          {Object.entries(locationMap).map(([loc, rds]) => {
            const sorted = rds.sort(
              (a: any, b: any) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
            );
            const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
            const current = sorted[sorted.length - 1];
            const improving = prev && current.reading_value < prev.reading_value;

            return (
              <View key={loc} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: '700' }]}>{loc}</Text>
                <Text style={styles.tableCell}>{prev ? `${prev.reading_value}%` : '—'}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    { fontWeight: '700', color: improving ? Colors.statusGreen : '#d97706' },
                  ]}
                >
                  {current.reading_value}%
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 32 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerTags: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phasePill: { backgroundColor: 'rgba(59,130,246,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  phasePillText: { color: '#93c5fd', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  headerSub: { color: '#94a3b8', fontSize: 14 },

  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },

  // Alert
  alertCard: {
    backgroundColor: 'rgba(255,218,214,0.4)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  alertTitle: { color: Colors.error, fontWeight: '700', fontSize: 14 },
  alertBody: { color: Colors.onErrorContainer, fontSize: 14, lineHeight: 20, marginTop: 4 },

  // Card
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },

  // Client
  clientName: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  clientAddress: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4, marginBottom: 24 },
  contactRow: { flexDirection: 'row', gap: 8 },
  contactBtn: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnText: { color: Colors.primary, fontWeight: '700' },

  // Insurance
  insuranceGrid: { flexDirection: 'row', marginBottom: 16 },
  insuranceItem: { flex: 1 },
  insuranceLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: Colors.outline, marginBottom: 4 },
  insuranceValue: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  adjusterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8 },
  adjusterAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  adjusterName: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  adjusterPhone: { fontSize: 11, color: Colors.outline },

  // Financial
  finHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  finTotal: { fontSize: 18, fontWeight: '800', color: '#0f172a', letterSpacing: -0.3 },
  progressBar: { height: 12, backgroundColor: Colors.surfaceContainerLow, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginBottom: 24 },
  progressFill: { height: '100%' },
  finGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  finLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: Colors.outline, marginBottom: 4 },
  finValue: { fontSize: 14, fontWeight: '700' },

  // Equipment
  equipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  liveText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  equipItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  equipIcon: { width: 36, height: 36, backgroundColor: Colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  equipName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  equipRate: { fontSize: 12, color: Colors.outline },
  equipQty: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  addEquipBtn: { borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.outlineVariant, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  addEquipText: { fontSize: 14, fontWeight: '700', color: Colors.outline },

  // Notes
  notesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  noteItem: { backgroundColor: Colors.surfaceContainerLow, padding: 12, borderRadius: 12, marginBottom: 12 },
  noteTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  noteCatPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  noteCatText: { fontSize: 9, fontWeight: '700' },
  noteTime: { fontSize: 10, color: Colors.outline },
  noteBody: { fontSize: 12, color: '#334155', lineHeight: 18 },

  // Tasks
  taskProgress: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  taskProgressBar: { flex: 1, height: 8, backgroundColor: Colors.surfaceContainerLow, borderRadius: 4, overflow: 'hidden' },
  taskProgressFill: { height: '100%', backgroundColor: Colors.statusGreen, borderRadius: 4 },
  taskProgressText: { fontSize: 11, fontWeight: '700', color: '#0f172a' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  taskCheckRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskCheck: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  taskCheckDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  taskName: { fontSize: 14, fontWeight: '500', color: '#0f172a' },
  taskDuePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  taskDueText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  // Moisture
  moistureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  trendText: { fontSize: 12, fontWeight: '700', color: Colors.statusGreen },
  chartBtn: { backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  chartBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  tableHeader: { flexDirection: 'row', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerLow },
  tableHeaderText: { flex: 1, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: Colors.outline },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerLow },
  tableCell: { flex: 1, fontSize: 14, color: '#0f172a' },
});
