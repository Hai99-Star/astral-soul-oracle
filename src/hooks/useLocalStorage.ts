import { useState, useEffect } from 'react';

/**
 * Hook for using localStorage with React state
 * @param key The key to store in localStorage
 * @param initialValue The initial value
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Hàm này được dùng để lấy giá trị từ localStorage
  // hoặc trả về initialValue nếu không tìm thấy
  const readValue = (): T => {
    // SSR check
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State để lưu trữ giá trị hiện tại
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Hàm để cập nhật cả state và localStorage
  const setValue = (value: T) => {
    if (typeof window === 'undefined') {
      console.warn(`Cannot set localStorage key "${key}" when not in browser`);
    }

    try {
      // Cho phép giá trị là một hàm giống như setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Phát sự kiện storage để các tab khác có thể lắng nghe
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Lắng nghe sự thay đổi từ các tab khác
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // Lắng nghe sự kiện storage từ window
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
} 