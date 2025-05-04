import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

/**
 * Global styles for the application
 * Contains base styling, resets, and global animations
 */
const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background.base};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: ${({ theme }) => theme.typography.lineHeight.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Background gradients */
    background-image: radial-gradient(
      circle at 90% 10%, 
      rgba(120, 90, 200, 0.1), 
      transparent 40%
    ),
    radial-gradient(
      circle at 10% 90%, 
      rgba(88, 65, 150, 0.1), 
      transparent 40%
    );
    background-attachment: fixed;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    letter-spacing: 0.02em;
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  a {
    color: ${({ theme }) => theme.colors.primary.base};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.timing.ease};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  /* Global animation keyframes */
  ${({ theme }) => theme.animations.float}
  ${({ theme }) => theme.animations.fadeIn}
  ${({ theme }) => theme.animations.fadeUp}
  ${({ theme }) => theme.animations.twinkle}

  /* Animation Classes */
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  .fade-in {
    animation: fadeIn ${({ theme }) => theme.transitions.duration.base} ${({ theme }) => theme.transitions.timing.easeOut};
  }

  .fade-up {
    animation: fadeUp ${({ theme }) => theme.transitions.duration.base} ${({ theme }) => theme.transitions.timing.easeOut};
  }

  /* Utility Classes */
  .text-gradient {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.light}, ${({ theme }) => theme.colors.secondary.light});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glow-effect {
    box-shadow: ${({ theme }) => theme.shadows.glow.primary};
    transition: box-shadow ${({ theme }) => theme.transitions.duration.base} ${({ theme }) => theme.transitions.timing.ease};

    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.glow.primaryHover};
    }
  }
`;

export default GlobalStyles; 