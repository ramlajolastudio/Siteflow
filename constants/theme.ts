/**
 * SiteFlow Design System — "Precision Utility"
 * Derived from DESIGN.md and HTML prototypes
 */

// ─── Colors (Material Design 3 Surface System) ─────────────────────
export const Colors = {
  // Primary
  primary: '#0041c8',
  primaryContainer: '#0055ff',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#e3e6ff',

  // Secondary
  secondary: '#445aa7',
  secondaryContainer: '#95aafd',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#243c88',

  // Tertiary (warnings / in-progress)
  tertiary: '#972500',
  tertiaryContainer: '#c13301',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#ffe1d9',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Surface system (tonal stacking)
  background: '#f9f9fe',
  surface: '#f9f9fe',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3f3f8',
  surfaceContainer: '#ededf2',
  surfaceContainerHigh: '#e8e8ed',
  surfaceContainerHighest: '#e2e2e7',

  // On-surface
  onBackground: '#1a1c1f',
  onSurface: '#1a1c1f',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',

  // Inverse
  inverseSurface: '#2e3034',
  inverseOnSurface: '#f0f0f5',
  inversePrimary: '#b6c4ff',

  // Status colors
  statusGreen: '#10b981',
  statusAmber: '#f59e0b',
  statusRed: '#ba1a1a',

  // Login dark theme
  loginBgDark: '#080c18',
  loginBgLight: '#101830',
  headerDark: '#111827',
  headerDarkEnd: '#1f2937',

  // Tab bar
  tabInactive: '#6b7280',
  glassWhite: 'rgba(255, 255, 255, 0.7)',

  // Transparent helpers
  primaryAlpha10: 'rgba(0, 65, 200, 0.1)',
  primaryAlpha20: 'rgba(0, 65, 200, 0.2)',
  errorAlpha5: 'rgba(186, 26, 26, 0.05)',
  errorAlpha10: 'rgba(186, 26, 26, 0.1)',
  errorAlpha20: 'rgba(186, 26, 26, 0.2)',
  tertiaryContainerAlpha10: 'rgba(193, 51, 1, 0.1)',
  outlineVariantAlpha15: 'rgba(195, 197, 217, 0.15)',
  outlineVariantAlpha20: 'rgba(195, 197, 217, 0.2)',
  blackAlpha4: 'rgba(0, 0, 0, 0.04)',
  blackAlpha6: 'rgba(0, 0, 0, 0.06)',
} as const;

// ─── Typography ─────────────────────────────────────────────────────
export const Typography = {
  fontFamily: 'Inter',

  // Display — at-a-glance metrics
  displayMd: {
    fontSize: 44,
    fontWeight: '800' as const,
    letterSpacing: -0.02 * 44,
  },

  // Headline — section metrics
  headlineLg: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.02 * 28,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },

  // Title
  titleLg: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  titleMd: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  titleSm: {
    fontSize: 16,
    fontWeight: '700' as const,
  },

  // Body
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },

  // Label — signature navigation labels
  labelLg: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.05 * 11,
    textTransform: 'uppercase' as const,
  },
  labelXs: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.05 * 10,
    textTransform: 'uppercase' as const,
  },
} as const;

// ─── Spacing ────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

// ─── Radii ──────────────────────────────────────────────────────────
export const Radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// ─── Shadows (ambient, not black) ───────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardLifted: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  navBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─── Component constants ────────────────────────────────────────────
export const Components = {
  // Minimum touch target for field use
  minTouchTarget: 56,
  // Tab bar height
  tabBarHeight: 94,
  // Button radius
  buttonRadius: 14,
  // Card radius
  cardRadius: 16,
  // Card radius large
  cardRadiusLg: 24,
  // Pill radius
  pillRadius: 9999,
} as const;

// ─── Sync status ────────────────────────────────────────────────────
export const SyncColors = {
  synced: '#10b981',
  pending: '#f59e0b',
  offline: '#ef4444',
} as const;
