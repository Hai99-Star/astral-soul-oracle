/**
 * Dữ liệu form tử vi
 */
export interface AstrologyFormData {
  fullName: string;
  birthDate: string;
  birthTime?: string; // Đánh dấu là tùy chọn
  birthPlace?: string; // Đánh dấu là tùy chọn
}

/**
 * Kết quả phân tích tử vi
 */
export interface AstrologyResult {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  reading: string;
  timestamp: number; // Thời gian phân tích
  isDetailed: boolean; // Phân tích chi tiết hay đơn giản
}

/**
 * Cấu trúc JSON mong đợi cho kết quả phân tích tử vi cơ bản
 */
export interface BasicAstrologyJsonResponse {
  tongQuan: string; // Tổng quan về lá số
  diemNoiBat: string; // Các điểm nổi bật, tính cách chính
  luuY?: string; // Lưu ý nếu thiếu thông tin
  [key: string]: string | undefined; // Cho phép các key bổ sung
}

/**
 * Cấu trúc JSON mong đợi cho kết quả phân tích tử vi chi tiết
 */
export interface DetailedAstrologyJsonResponse {
  gioiThieuChung: string;
  canChiVaLichAm: string;
  napAmAmDuongMang: string;
  yeuToCoDinh?: string; // Có thể không có nếu thiếu thông tin
  cungMenhThan?: string; // Cần giờ sinh
  saoChinhVaYnghia?: string; // Phụ thuộc vào mức độ xác định được
  vanMenhTongQuan: {
    congDanh: string;
    taiLoc: string;
    tinhDuyen: string;
    sucKhoe: string;
  };
  ketLuanVaLoiKhuyen: string;
  luuY: string; // Luôn có, nêu rõ hạn chế nếu thiếu thông tin
}

/**
 * Kiểu dữ liệu cho props của thành phần UI hiển thị kết quả tử vi
 */
export interface AstrologyDisplayProps {
  readingData: BasicAstrologyJsonResponse | DetailedAstrologyJsonResponse | null;
  isLoading: boolean;
  error: string | null;
} 