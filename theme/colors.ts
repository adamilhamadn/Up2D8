export const AccentColors = {
  graphite: '#8E8E93',
  tomato: '#FF3B30',
  ocean: '#007AFF',
  mint: '#34C759',
  amethyst: '#AF52DE',
  tangerine: '#FF9500',
} as const;

export type AccentColorName = keyof typeof AccentColors;

export const Colors = {
  dark: {
    bg: '#000000',
    surface: '#111111',
    surfaceRaised: '#1C1C1E',
    border: '#2C2C2E',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
  },
  light: {
    bg: '#FFFFFF',
    surface: '#F2F2F7',
    surfaceRaised: '#FFFFFF',
    border: '#E5E5EA',
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
  },
} as const;
