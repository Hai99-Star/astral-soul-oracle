/**
 * Response từ Gemini API
 */
export interface GeminiApiResponse {
  text: string;
}

/**
 * Các loại dữ liệu fallback 
 */
export type FallbackType = 
  | 'astrology'
  | 'astrologyDetailed'
  | 'numerology'
  | 'tarotSingleCard'
  | 'tarot3Cards';

/**
 * Dữ liệu fallback cho tổng hợp API
 */
export interface FallbackData {
  // Người dùng có thể thêm các tùy chọn tùy theo API
  [key: string]: any;
} 