/**
 * Voice-First Notes — capture observations with voice or text.
 * Matches the voice_first_notes prototype.
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lazy-load Audio only on native
let Audio: any = null;
if (Platform.OS !== 'web') {
  Audio = require('expo-av').Audio;
}
import SyncStatusBar from '@/components/SyncStatusBar';
import { getAll, insertRecord } from '@/lib/database';
import { saveVoiceNote } from '@/lib/storage';
import { Colors, Shadows } from '@/constants/theme';

const NOTE_FILTERS = ['All', 'Internal', 'Customer', 'Insurance'];

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  internal: { bg: Colors.primaryAlpha10, text: Colors.primary },
  insurance: { bg: Colors.tertiaryContainerAlpha10, text: Colors.tertiaryContainer },
  customer: { bg: 'rgba(149,170,253,0.2)', text: Colors.secondary },
};

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [noteText, setNoteText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    setNotes(await getAll<any>('notes'));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ── Voice Recording ─────────────────────────────────────────────
  async function startRecording() {
    if (Platform.OS === 'web' || !Audio) {
      Alert.alert('Not available', 'Voice recording requires the native app.');
      return;
    }
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Microphone access is required for voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets?.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return;

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (uri) {
        const noteId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
        const savedUri = await saveVoiceNote({ sourceUri: uri, noteId });

        await insertRecord('notes', {
          id: noteId,
          job_id: null,
          category: 'internal',
          content: `Voice note (${recordingDuration}s)`,
          author: 'Juan Rodriguez',
          has_voice: 1,
          voice_uri: savedUri,
          photo_count: 0,
        });

        await loadData();
        setRecordingDuration(0);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  }

  // ── Save Text Note ──────────────────────────────────────────────
  async function saveNote() {
    if (!noteText.trim()) return;

    const noteId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    await insertRecord('notes', {
      id: noteId,
      job_id: null,
      category: 'internal',
      content: noteText.trim(),
      author: 'Juan Rodriguez',
      has_voice: 0,
      photo_count: 0,
    });

    setNoteText('');
    await loadData();
  }

  const filtered = filter === 'All'
    ? notes
    : notes.filter((n) => n.category?.toLowerCase() === filter.toLowerCase());

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return 'Yesterday';
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerBrand}>SiteFlow</Text>
        <MaterialIcons name="account-circle" size={28} color={Colors.primary} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SyncStatusBar />

        <Text style={styles.pageTitle}>Notes</Text>
        <Text style={styles.pageSub}>Capture observations instantly.</Text>

        {/* Recording + Input Area */}
        <View style={styles.bentoGrid}>
          {/* Voice Recorder */}
          <TouchableOpacity
            style={styles.recorderBox}
            activeOpacity={0.8}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording && <View style={styles.pulseRing} />}
            <View style={styles.micButton}>
              <MaterialIcons name="mic" size={32} color="#fff" />
            </View>
            <Text style={styles.micLabel}>
              {isRecording ? 'Tap to stop' : 'Tap to record'}
            </Text>
            {isRecording && (
              <>
                <View style={styles.waveform}>
                  {[3, 6, 8, 5, 7].map((h, i) => (
                    <View
                      key={i}
                      style={[styles.waveBar, { height: h * 4 }]}
                    />
                  ))}
                </View>
                <Text style={styles.timerText}>{formatDuration(recordingDuration)}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Text Input */}
          <View style={[styles.inputBox, Shadows.card]}>
            <TouchableOpacity style={styles.jobLinkBtn}>
              <Text style={styles.jobLinkText}>
                Link to: <Text style={{ color: Colors.onSurface }}>[Select job ▾]</Text>
              </Text>
              <MaterialIcons name="work" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            <TextInput
              style={styles.noteInput}
              placeholder="Type or dictate your note..."
              placeholderTextColor={Colors.outline}
              multiline
              value={noteText}
              onChangeText={setNoteText}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveNote} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          {NOTE_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, filter === f && styles.pillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Notes */}
        <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
        {filtered.map((note) => {
          const cat = CAT_COLORS[note.category] || CAT_COLORS.internal;
          return (
            <View key={note.id} style={[styles.noteCard, Shadows.card]}>
              <View style={styles.noteHeader}>
                <View style={[styles.catPill, { backgroundColor: cat.bg }]}>
                  <Text style={[styles.catText, { color: cat.text }]}>
                    {note.category?.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.noteTime}>
                  {note.created_at ? timeAgo(note.created_at) : ''}
                </Text>
              </View>
              <Text style={styles.noteContent}>{note.content}</Text>
              <View style={styles.noteMeta}>
                {note.has_voice ? (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="mic" size={18} color={Colors.outline} />
                    <Text style={styles.metaText}>Voice Memo</Text>
                  </View>
                ) : null}
                {note.photo_count > 0 && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="image" size={18} color={Colors.outline} />
                    <Text style={styles.metaText}>{note.photo_count} Photos</Text>
                  </View>
                )}
                {note.job_id && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="link" size={18} color={Colors.outline} />
                    <Text style={styles.metaText}>Job #{note.job_id?.slice(-4)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.noteFooter}>
                <Text style={styles.noteAuthor}>{note.author}</Text>
                <MaterialIcons name="more-horiz" size={20} color={Colors.outline} />
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
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },

  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: Colors.onSurface },
  pageSub: { color: Colors.onSurfaceVariant, fontWeight: '500', marginBottom: 32 },

  // Bento grid
  bentoGrid: { gap: 16, marginBottom: 32 },
  recorderBox: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  pulseRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.errorAlpha10,
    opacity: 0.5,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  micLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    color: Colors.primary,
  },
  waveform: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 32, marginTop: 16 },
  waveBar: { width: 4, backgroundColor: Colors.error, borderRadius: 2 },
  timerText: { fontFamily: 'monospace', fontWeight: '700', color: Colors.error, marginTop: 8 },

  inputBox: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  jobLinkBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 8,
  },
  jobLinkText: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant },
  noteInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.onSurface,
  },
  saveBtn: {
    height: 56,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Filters
  pillRow: { gap: 12, marginBottom: 32 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  pillActive: { backgroundColor: Colors.primary },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    color: Colors.onSurfaceVariant,
  },
  pillTextActive: { color: '#fff' },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
    marginLeft: 4,
  },

  // Note card
  noteCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  catText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  noteTime: { fontSize: 12, fontWeight: '500', color: Colors.outline },
  noteContent: { fontSize: 14, fontWeight: '500', color: Colors.onSurface, lineHeight: 21 },
  noteMeta: { flexDirection: 'row', gap: 16, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '700', color: Colors.outline },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
  },
  noteAuthor: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant },
});
