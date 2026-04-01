/**
 * Sync Status Indicator — shows sync state on every screen.
 * Green cloud = all synced
 * Orange cloud + count = items waiting
 * Red cloud = offline, saved locally
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNetworkStatus } from '@/lib/network';
import { getPendingSyncCount } from '@/lib/database';
import { onSyncCountChange } from '@/lib/sync';
import { Colors, SyncColors } from '@/constants/theme';

export default function SyncStatusBar() {
  const networkStatus = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPendingSyncCount().then(setPendingCount);
    const unsubscribe = onSyncCountChange(setPendingCount);
    return unsubscribe;
  }, []);

  const isOffline = networkStatus === 'offline';
  const hasPending = pendingCount > 0;

  // Don't show if everything is synced and online
  if (!isOffline && !hasPending) return null;

  const color = isOffline
    ? SyncColors.offline
    : hasPending
      ? SyncColors.pending
      : SyncColors.synced;

  const label = isOffline
    ? 'Offline — saved locally'
    : `${pendingCount} item${pendingCount !== 1 ? 's' : ''} waiting to sync`;

  const icon = isOffline ? 'cloud-off' : 'cloud-upload';

  return (
    <View style={[styles.container, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={icon} size={16} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
