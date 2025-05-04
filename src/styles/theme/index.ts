import * as tokens from './tokens';

/**
 * Main theme object for styled-components
 * Exports all design tokens in a structured format
 */
export const theme = {
  colors: tokens.colors,
  typography: tokens.typography,
  spacing: tokens.spacing,
  radius: tokens.radius,
  shadows: tokens.shadows,
  transitions: tokens.transitions,
  animations: tokens.animations,
};

export type ThemeType = typeof theme;

// Re-export all tokens
export * from './tokens'; 