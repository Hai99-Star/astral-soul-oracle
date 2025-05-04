/**
 * Thông tin lá bài Tarot
 */
export interface TarotCard {
  id: number;
  name: string;
  nameVi: string;
  image: string;
  meaning: string;
}

/**
 * Loại trải bài
 */
export interface SpreadType {
  id: string;
  name: string;
  description: string;
}

/**
 * Kết quả phân tích Tarot cho 1 lá
 */
export interface TarotSingleCardResult {
  question: string;
  card: TarotCard;
  reading: string;
  timestamp: number;
}

/**
 * Kết quả phân tích Tarot cho 3 lá
 */
export interface Tarot3CardResult {
  question: string;
  cards: TarotCard[];
  spreadType: string;
  spreadDescription: string;
  reading: string;
  timestamp: number;
}

/**
 * Định nghĩa các loại trải bài
 */
export const SPREAD_TYPES: Record<string, string> = {
  "a": "Quá khứ / Hiện tại / Tương lai",
  "b": "Tình huống hiện tại / Hành động cần làm / Kết quả",
  "c": "Điểm mạnh của bạn / Thách thức chính / Lời khuyên",
  "d": "Điều bạn mong muốn / Điều đang cản trở / Cách dung hòa/vượt qua",
  "e": "Tâm trí (Suy nghĩ) / Cơ thể (Hành động) / Tinh thần (Cảm xúc/Trực giác)",
  "f": "Bản chất vấn đề / Nguyên nhân gốc rễ / Hướng giải quyết",
  "g": "Điểm mạnh / Điểm yếu / Lời khuyên",
  "h": "Bạn muốn gì / Điều gì cản trở / Làm thế nào để đạt được"
}; 