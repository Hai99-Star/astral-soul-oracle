import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

/**
 * Hook để quản lý theme của ứng dụng
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('astral-theme', 'system');

  // Áp dụng theme vào document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Xóa các class hiện tại
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Lắng nghe thay đổi system theme nếu đang dùng 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    isDark: theme === 'dark' || (theme === 'system' && window?.matchMedia('(prefers-color-scheme: dark)')?.matches)
  };
} 