/**
 * Design tokens for the Astral Soul Oracle application
 * These tokens define the core visual elements of our design system
 */

// Color palette
export const colors = {
  // Primary colors
  primary: {
    light: '#B09CFF',
    base: '#9B87F5',
    dark: '#7A6ACC',
  },
  
  // Secondary colors
  secondary: {
    light: '#5B6AD9',
    base: '#3D4AB6',
    dark: '#2E3787',
  },
  
  // Background colors
  background: {
    light: '#171224',
    base: '#13101D',
    dark: '#0E0B16',
  },
  
  // UI colors
  card: {
    light: '#221D35',
    base: '#1E1A30',
    dark: '#171425',
  },
  
  // Text colors
  text: {
    primary: '#F2F2F2',
    secondary: '#B6B6B6',
    muted: '#8A8A8A',
    accent: '#D6B85A',
  },
  
  // Utility colors
  util: {
    success: '#38B48B',
    warning: '#D6B85A',
    error: '#E6646E',
    info: '#5690D8',
  },
};

// Typography system
export const typography = {
  fontFamily: {
    body: "'Inter', sans-serif",
    heading: "'Cormorant Garamond', serif",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.8,
  },
};

// Spacing system
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
};

// Border radius
export const radius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 4px 6px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.23)',
  lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  glow: {
    primary: '0 0 15px rgba(155, 135, 245, 0.4)',
    primaryHover: '0 0 25px rgba(155, 135, 245, 0.6)',
    secondary: '0 0 15px rgba(61, 74, 182, 0.4)',
    accent: '0 0 15px rgba(214, 184, 90, 0.5)',
  },
};

// Transitions
export const transitions = {
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
  timing: {
    ease: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Animations
export const animations = {
  float: `
    @keyframes float {
      0% { transform: translatey(0px); }
      50% { transform: translatey(-10px); }
      100% { transform: translatey(0px); }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeUp: `
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  twinkle: `
    @keyframes twinkle {
      0%, 100% { opacity: 0; }
      50% { opacity: var(--opacity, 0.8); }
    }
  `,
}; 