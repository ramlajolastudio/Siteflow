/**
 * Network status detection — watches for connectivity changes
 * and triggers sync when connection is restored.
 */
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';

let NetInfo: any = null;
if (Platform.OS !== 'web') {
  NetInfo = require('@react-native-community/netinfo').default;
}

type NetInfoState = any;

export type NetworkStatus = 'online' | 'offline';

let currentStatus: NetworkStatus = 'offline';
const listeners: Set<(status: NetworkStatus) => void> = new Set();

// Initialize network monitoring
export function startNetworkMonitoring() {
  if (Platform.OS === 'web' || !NetInfo) {
    // On web, assume always online
    currentStatus = 'online';
    return;
  }
  NetInfo.addEventListener((state: NetInfoState) => {
    const newStatus: NetworkStatus =
      state.isConnected && state.isInternetReachable !== false ? 'online' : 'offline';

    if (newStatus !== currentStatus) {
      currentStatus = newStatus;
      listeners.forEach((listener) => listener(newStatus));
    }
  });
}

export function getNetworkStatus(): NetworkStatus {
  return currentStatus;
}

export function onNetworkChange(callback: (status: NetworkStatus) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// React hook for components
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(currentStatus);

  useEffect(() => {
    if (Platform.OS === 'web' || !NetInfo) {
      setStatus('online');
      return;
    }
    // Get initial status
    NetInfo.fetch().then((state: any) => {
      const s: NetworkStatus =
        state.isConnected && state.isInternetReachable !== false ? 'online' : 'offline';
      currentStatus = s;
      setStatus(s);
    });

    const unsubscribe = onNetworkChange(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

// Check if we can sync right now
export async function canSync(): Promise<boolean> {
  if (Platform.OS === 'web' || !NetInfo) return true;
  const state = await NetInfo.fetch();
  return !!(state.isConnected && state.isInternetReachable !== false);
}
