/**
 * Tab Layout — 5-tab bottom navigation with custom glass tab bar.
 */
import React from 'react';
import { Tabs } from 'expo-router';
import GlassTabBar from '@/components/GlassTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jobs" />
      <Tabs.Screen name="contacts" />
      <Tabs.Screen name="notes" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
