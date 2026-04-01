/**
 * Photo & File Storage — saves files locally on-device.
 * Photos are saved immediately when captured, then queued for cloud sync.
 */
import { Platform } from 'react-native';
import { insertRecord } from './database';

// Lazy-load expo-file-system only on native
let FileSystem: any = null;
if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system');
}

// Base directory for all SiteFlow photos
const PHOTOS_DIR = Platform.OS !== 'web' ? `${FileSystem?.documentDirectory}siteflow-photos/` : '';

/**
 * Ensure the photos directory exists
 */
export async function ensurePhotosDir(): Promise<void> {
  if (Platform.OS === 'web' || !FileSystem) return;
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

/**
 * Save a photo from camera/picker to local storage and record in DB.
 * Returns the local URI of the saved photo.
 */
export async function savePhoto(params: {
  sourceUri: string;
  jobId: string;
  category?: 'before' | 'active' | 'after';
  room?: string;
  caption?: string;
}): Promise<string> {
  await ensurePhotosDir();

  const photoId = generateId();
  const extension = params.sourceUri.split('.').pop() || 'jpg';
  const filename = `${params.jobId}_${photoId}.${extension}`;
  const destUri = `${PHOTOS_DIR}${filename}`;

  // Copy file to our managed directory
  await FileSystem.copyAsync({
    from: params.sourceUri,
    to: destUri,
  });

  // Record in database (auto-adds to sync queue)
  await insertRecord('photos', {
    id: photoId,
    job_id: params.jobId,
    local_uri: destUri,
    category: params.category || 'active',
    room: params.room || '',
    caption: params.caption || '',
    taken_at: new Date().toISOString(),
    synced: 0,
  });

  return destUri;
}

/**
 * Save a voice note recording to local storage.
 */
export async function saveVoiceNote(params: {
  sourceUri: string;
  jobId?: string;
  noteId: string;
}): Promise<string> {
  const voiceDir = `${FileSystem.documentDirectory}siteflow-voice/`;
  const dirInfo = await FileSystem.getInfoAsync(voiceDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(voiceDir, { intermediates: true });
  }

  const filename = `voice_${params.noteId}.m4a`;
  const destUri = `${voiceDir}${filename}`;

  await FileSystem.copyAsync({
    from: params.sourceUri,
    to: destUri,
  });

  return destUri;
}

/**
 * Get all photos for a job from local storage
 */
export async function getJobPhotos(jobId: string): Promise<string[]> {
  await ensurePhotosDir();

  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  return files
    .filter((f) => f.startsWith(jobId))
    .map((f) => `${PHOTOS_DIR}${f}`);
}

/**
 * Get storage usage info
 */
export async function getStorageInfo(): Promise<{
  photoCount: number;
  totalSizeMB: number;
}> {
  await ensurePhotosDir();

  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  let totalSize = 0;

  for (const file of files) {
    const info = await FileSystem.getInfoAsync(`${PHOTOS_DIR}${file}`);
    if (info.exists && 'size' in info) {
      totalSize += info.size || 0;
    }
  }

  return {
    photoCount: files.length,
    totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 10) / 10,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
