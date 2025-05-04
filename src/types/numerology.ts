/**
 * Dữ liệu form thần số học
 */
export interface NumerologyFormData {
  fullName: string;   // Tên khai sinh đầy đủ
  birthDate: string;  // Định dạng dd/mm/yyyy
}

/**
 * Master Number info
 */
export interface MasterNumberInfo {
  isMasterNumber: boolean;
  originalValue?: number; // Giá trị Master Number gốc nếu có (11, 22, 33)
}

/**
 * Các con số thần số học
 */
export interface NumerologyNumbers {
  lifePathNumber: number;
  lifePathMaster?: MasterNumberInfo;
  
  soulNumber: number; // Soul Urge/Heart's Desire Number
  soulMaster?: MasterNumberInfo;
  
  destinyNumber: number; // Destiny/Expression Number
  destinyMaster?: MasterNumberInfo;
  
  personalityNumber: number;
  personalityMaster?: MasterNumberInfo;
  
  birthDayNumber: number; // Birth Day Number (chỉ rút gọn ngày sinh)
  birthDayMaster?: MasterNumberInfo;
}

/**
 * Thông tin chi tiết về từng con số
 */
export interface NumberDetail {
  number: number;
  masterNumber?: MasterNumberInfo;
  strengths: string[];   // Điểm mạnh, tài năng
  challenges: string[];  // Thách thức, bài học 
  meaning: string;       // Ý nghĩa tổng quát
  calculation?: string;  // Cách tính (để hiển thị)
}

/**
 * Kết quả phân tích thần số học
 */
export interface NumerologyResult {
  name: string;
  birthDate: string;
  numbers: NumerologyNumbers;
  details?: {                       // Chi tiết về từng con số
    lifePath?: NumberDetail;        // Chi tiết con số Đường đời
    soul?: NumberDetail;            // Chi tiết con số Linh hồn
    destiny?: NumberDetail;         // Chi tiết con số Sứ mệnh
    personality?: NumberDetail;     // Chi tiết con số Nhân cách
    birthDay?: NumberDetail;        // Chi tiết con số Ngày sinh
  };
  interactions?: string;            // Phân tích tương tác giữa các con số
  advice?: string;                  // Lời khuyên và định hướng
  reading: string;                  // Toàn bộ phân tích dạng văn bản
  timestamp: number;                // Thời gian phân tích
} 