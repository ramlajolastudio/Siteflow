/**
 * Glass Tab Bar — frosted glass bottom navigation matching the design system.
 * White at 70% opacity + 20px backdrop blur.
 * Active tab is a blue pill with filled icon.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

// BlurView may not work on all web browsers
let BlurView: any = null;
if (Platform.OS !== 'web') {
  BlurView = require('expo-blur').BlurView;
}
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Components, Shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  index: 'home',
  jobs: 'construction',
  contacts: 'contacts',
  notes: 'description',
  settings: 'settings',
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  jobs: 'Jobs',
  contacts: 'Contacts',
  notes: 'Notes',
  settings: 'Settings',
};

export default function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {Platform.OS === 'ios' && BlurView ? (
        <BlurView intensity={60} tint="light" style={styles.blurFill} />
      ) : (
        <View style={styles.androidFill} />
      )}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = TAB_ICONS[route.name] || 'circle';
          const label = TAB_LABELS[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabActive]}
            >
              <MaterialIcons
                name={icon}
                size={24}
                color={isFocused ? '#ffffff' : Colors.tabInactive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#ffffff' : Colors.tabInactive },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...Shadows.navBar,
  },
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },
  androidFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.primaryContainer,
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    marginTop: 2,
  },
});
