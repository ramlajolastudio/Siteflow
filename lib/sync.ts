/**
 * Sync Engine — processes the offline queue when connectivity returns.
 * Watches for network changes and automatically pushes pending items.
 */
import { getPendingSyncItems, getPendingSyncCount, markSynced, markSyncFailed } from './database';
import { onNetworkChange, canSync, NetworkStatus } from './network';

let isSyncing = false;
const syncListeners: Set<(count: number) => void> = new Set();

// Subscribe to pending count changes
export function onSyncCountChange(callback: (count: number) => void): () => void {
  syncListeners.add(callback);
  return () => syncListeners.delete(callback);
}

async function notifyListeners() {
  const count = await getPendingSyncCount();
  syncListeners.forEach((listener) => listener(count));
}

/**
 * Process the sync queue — called when network comes back online.
 * In production, this would POST each item to your API.
 * For now, it simulates the sync with a delay.
 */
async function processSyncQueue(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const items = await getPendingSyncItems();

    for (const item of items) {
      try {
        // ── PRODUCTION: Replace this with actual API calls ──
        // Example:
        // await fetch(`${API_BASE}/${item.table_name}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: item.payload,
        // });

        // For now, simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mark as synced
        await markSynced(item.id);
        await notifyListeners();
      } catch (err) {
        // Mark failed, will retry next cycle
        await markSyncFailed(item.id);
        console.warn(`Sync failed for ${item.table_name}/${item.record_id}:`, err);
      }
    }
  } finally {
    isSyncing = false;
    await notifyListeners();
  }
}

/**
 * Start the sync engine — watches for network changes
 * and auto-syncs when connectivity is restored.
 */
export function startSyncEngine(): void {
  // Listen for network changes
  onNetworkChange(async (status: NetworkStatus) => {
    if (status === 'online') {
      // Connection restored — process the queue
      await processSyncQueue();
    }
  });

  // Also try syncing on startup
  canSync().then((online) => {
    if (online) processSyncQueue();
  });

  // Initial count notification
  notifyListeners();
}

/**
 * Manually trigger a sync (e.g., pull-to-refresh)
 */
export async function triggerSync(): Promise<void> {
  const online = await canSync();
  if (online) {
    await processSyncQueue();
  }
}

/**
 * Get current pending count
 */
export async function getSyncStatus(): Promise<{ pending: number; isSyncing: boolean }> {
  const pending = await getPendingSyncCount();
  return { pending, isSyncing };
}
