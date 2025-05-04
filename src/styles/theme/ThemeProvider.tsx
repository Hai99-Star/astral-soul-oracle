import React, { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './index';
import GlobalStyles from '../GlobalStyles';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom ThemeProvider that wraps the styled-components ThemeProvider
 * and includes GlobalStyles
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider; 