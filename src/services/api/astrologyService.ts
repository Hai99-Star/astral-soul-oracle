import { callGeminiApi } from './geminiClient';
import { AstrologyFormData } from '@/types/astrology';
import { getFallbackResponse } from '@/utils/fallbackResponses';
import errorService, { ErrorType } from '@/utils/errorService';

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
 * Làm sạch phản hồi API để loại bỏ các dấu hiệu Markdown
 * @param text Chuỗi phản hồi từ API
 * @returns Chuỗi JSON sạch
 */
function cleanJsonResponse(text: string): string {
  // Đảm bảo chuỗi không rỗng
  if (!text || text.trim().length === 0) {
    console.warn('Received empty response');
    return '{}';
  }
  
  const trimmedText = text.trim();
  
  // Xử lý trường hợp bắt đầu bằng ```json
  if (trimmedText.startsWith('```json')) {
    // Tìm và trích xuất phần JSON bên trong code block
    const jsonStartIndex = trimmedText.indexOf('{');
    const jsonEndIndex = trimmedText.lastIndexOf('}');
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      return trimmedText.substring(jsonStartIndex, jsonEndIndex + 1);
    }
  }
  
  // Kiểm tra nếu bắt đầu với dấu # (Markdown heading) hoặc không bắt đầu với { hoặc [
  if (trimmedText.startsWith('#') || (!trimmedText.startsWith('{') && !trimmedText.startsWith('['))) {
    console.warn('Response does not start with { or [, likely not JSON:', trimmedText.substring(0, 50));
    
    // Tìm ký tự { đầu tiên và } cuối cùng để trích xuất JSON nếu có
    const jsonStartIndex = trimmedText.indexOf('{');
    const jsonEndIndex = trimmedText.lastIndexOf('}');
    
    // Nếu tìm thấy cả { và } và vị trí hợp lệ
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      const potentialJson = trimmedText.substring(jsonStartIndex, jsonEndIndex + 1);
      try {
        // Thử phân tích JSON để kiểm tra tính hợp lệ
        JSON.parse(potentialJson);
        console.log('Successfully extracted JSON from non-standard response');
        return potentialJson;
      } catch (e) {
        console.warn('Found { and } but content is not valid JSON');
      }
    }
    
    // Không tìm thấy JSON hợp lệ, trả về đối tượng rỗng
    return '{}';
  }
  
  // Loại bỏ ```json ở đầu nếu có (xử lý trường hợp truyền thống)
  let cleaned = text.replace(/^```json\s*/g, '');
  
  // Loại bỏ ``` ở cuối nếu có
  cleaned = cleaned.replace(/\s*```$/g, '');
  
  // Làm sạch thêm chuỗi nếu cần
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Tạo phân tích tử vi cơ bản
 * @param name Tên người dùng
 * @param birthDate Ngày sinh (dd/mm/yyyy)
 * @param birthTime Giờ sinh (HH:MM)
 * @param birthPlace Nơi sinh
 * @returns Kết quả phân tích tử vi
 */
export async function generateAstrologyReading(
  name: string, 
  birthDate: string, 
  birthTime?: string, 
  birthPlace?: string
): Promise<string> {
  // Tạo context để log và theo dõi
  const context = {
    service: 'astrology',
    type: 'basic-json',
    name,
    birthDate,
    hasBirthTime: !!birthTime,
    hasBirthPlace: !!birthPlace
  };
  
  try {
    const prompt = `
    # YÊU CẦU PHÂN TÍCH TỬ VI CƠ BẢN (ĐỊNH DẠNG JSON)

    ## Thông tin cá nhân
    - Họ và Tên Đầy Đủ: ${name}
    - Ngày Tháng Năm Sinh: ${birthDate}
    ${birthTime ? `- Giờ Sinh: ${birthTime}` : '- Giờ Sinh: Không rõ'}
    ${birthPlace ? `- Nơi Sinh: ${birthPlace}` : '- Nơi Sinh: Không rõ'}

    ## Yêu cầu
    Phân tích lá số tử vi cơ bản dựa trên thông tin năm sinh (Can Chi, Nạp Âm nếu có). Tập trung vào các nét tổng quan và đặc điểm chính **không cần giờ sinh chi tiết**.

    ## Hướng dẫn định dạng và nội dung JSON
    - **CẢNH BÁO: PHẢN HỒI CỦA BẠN PHẢI BẮT ĐẦU BẰNG DẤU NGOẶC NHỌN MỞ '{' VÀ KẾT THÚC BẰNG NGOẶC NHỌN ĐÓNG '}', KHÔNG CÓ BẤT KỲ NỘI DUNG NÀO TRƯỚC HOẶC SAU CẶP NGOẶC NÀY.**
    - **KHÔNG BAO GIỜ** bắt đầu phản hồi bằng \`#\`, \`*\`, \`\`\`json, hoặc bất kỳ ký tự đánh dấu Markdown nào khác.
    - **CHỈ TRẢ VỀ MỘT CHUỖI JSON HỢP LỆ** - không thêm bất kỳ văn bản nào trước hoặc sau JSON.
    - Cấu trúc JSON **bắt buộc**:
\`\`\`json
{
  "tongQuan": "Nội dung phân tích tổng quan...",
  "diemNoiBat": "Nội dung về các điểm nổi bật chính...",
  "luuY": "Nội dung lưu ý về phạm vi phân tích..."
}
\`\`\`
    - **Nội dung chi tiết cho từng trường:**
        - \`"tongQuan"\`: Đoạn văn tóm tắt nét chính từ năm sinh/Can Chi (khoảng 100-150 từ). **Ngôn ngữ cực kỳ thân thiện, dễ hiểu.**
        - \`"diemNoiBat"\`: Mô tả 2-3 đặc điểm nổi bật nhất (khoảng 150-250 từ). Viết rõ ràng, giúp người đọc dễ hình dung.
        - \`"luuY"\`:
            - Nếu thiếu giờ sinh/nơi sinh: Ghi chính xác: "Phân tích này tập trung vào các yếu tố cơ bản dựa trên năm sinh, chưa bao gồm các luận giải chi tiết phụ thuộc vào giờ sinh và nơi sinh."
            - Nếu có đủ thông tin: Ghi chính xác: "Phân tích cơ bản dựa trên thông tin cung cấp." (Hoặc có thể bỏ qua key này nếu muốn).
    - **Ngôn ngữ:** Tiếng Việt, từ ngữ phổ thông, **hạn chế tối đa thuật ngữ chuyên môn.**
    - **Độ dài:** Tổng nội dung khoảng 300-500 từ.
    `;

    // Log bắt đầu thực hiện yêu cầu
    console.log(`Starting basic JSON astrology reading generation for: ${name}`);
    
    try {
      const response = await callGeminiApi(prompt);
      
      // Kiểm tra kết quả trả về
      if (!response.text || response.text.trim().length < 50) {
        // Log warning nếu kết quả quá ngắn
        errorService.logError(
          errorService.createError(
            ErrorType.API,
            "API trả về kết quả quá ngắn hoặc rỗng cho phân tích tử vi JSON cơ bản",
            null,
            { 
              responseLength: response.text?.length || 0,
              ...context 
            }
          ),
          { includeStackTrace: false }
        );
        
        // Sử dụng fallback nếu kết quả không khả dụng
        return getFallbackResponse('astrology', { name, birthDate });
      }
      
      // Log phản hồi gốc cho mục đích gỡ lỗi
      console.log('Raw API response:', response.text.substring(0, 100) + (response.text.length > 100 ? '...' : ''));
      
      // Làm sạch phản hồi trước khi phân tích
      const cleanedResponse = cleanJsonResponse(response.text);
      
      // Thêm một bước kiểm tra JSON đơn giản
      try {
        // Kiểm tra đơn giản nếu đã trả về chuỗi rỗng từ cleanJsonResponse
        if (cleanedResponse === '{}') {
          // cleanJsonResponse đã phát hiện đây không phải là JSON
          errorService.logError(
            errorService.createError(
              ErrorType.API,
              "API không trả về JSON hợp lệ cho phân tích tử vi cơ bản - phát hiện phản hồi không phải JSON",
              null,
              {
                rawResponse: response.text.substring(0, 200),
                ...context
              }
            ),
            { includeStackTrace: false }
          );
          return getFallbackResponse('astrology', { name, birthDate });
        }
        
        // Nếu phản hồi không rỗng, kiểm tra xem có phải JSON hợp lệ không
        const parsedJson = JSON.parse(cleanedResponse);
        
        // Kiểm tra cấu trúc JSON cơ bản
        if (!parsedJson.tongQuan || !parsedJson.diemNoiBat) {
          console.warn('JSON structure is missing required fields');
          errorService.logError(
            errorService.createError(
              ErrorType.API,
              "API trả về JSON không đầy đủ cho phân tích tử vi cơ bản",
              null,
              {
                jsonKeys: Object.keys(parsedJson).join(', '),
                ...context
              }
            ),
            { includeStackTrace: false }
          );
          return getFallbackResponse('astrology', { name, birthDate });
        }
        
        // Trả về chuỗi đã làm sạch nếu phân tích thành công
        return cleanedResponse;
      } catch (parseError) {
        errorService.logError(
          errorService.createError(
            ErrorType.API,
            "API không trả về JSON hợp lệ cho phân tích tử vi cơ bản",
            parseError, // Bao gồm lỗi parse gốc
            {
              rawResponse: response.text.substring(0, 200), // Log một phần response lỗi
              cleanedResponse: cleanedResponse,
              ...context
            }
          ),
          { includeStackTrace: false }
        );
        // Vẫn trả về fallback dạng text
        return getFallbackResponse('astrology', { name, birthDate });
      }
    } catch (error) {
      // Xử lý lỗi từ geminiClient
      errorService.logError(
        errorService.createError(
          ErrorType.API,
          "Lỗi khi gọi Gemini API cho phân tích tử vi cơ bản",
          error,
          { ...context }
        ),
        { includeStackTrace: true }
      );
      return getFallbackResponse('astrology', { name, birthDate });
    }
  } catch (error) {
    // Log lỗi với context đầy đủ
    const appError = errorService.createError(
      error instanceof Error && 'type' in error ? (error as any).type : ErrorType.API,
      error instanceof Error && 'message' in error ? error.message : "Lỗi khi tạo phân tích tử vi JSON cơ bản",
      error,
      context
    );
    
    errorService.logError(appError);
    
    // Trả về response dự phòng
    console.log("Returning fallback astrology response (text)");
    return getFallbackResponse('astrology', { name, birthDate });
  }
}

/**
 * Tạo phân tích tử vi chi tiết
 * @param name Tên người dùng
 * @param birthDate Ngày sinh (dd/mm/yyyy)
 * @param birthTime Giờ sinh (HH:MM)
 * @param birthPlace Nơi sinh
 * @returns Kết quả phân tích tử vi chi tiết
 */
export async function generateAstrologyDetailedReading(
  name: string, 
  birthDate: string, 
  birthTime?: string, 
  birthPlace?: string
): Promise<string> {
  // Tạo context để log và theo dõi
  const context = {
    service: 'astrology',
    type: 'detailed-json',
    name,
    birthDate,
    hasBirthTime: !!birthTime,
    hasBirthPlace: !!birthPlace
  };
  
  try {
    const prompt = `
    # YÊU CẦU PHÂN TÍCH TỬ VI CHI TIẾT (ĐỊNH DẠNG JSON)

    ## Thông tin cá nhân
    - Họ và Tên Đầy Đủ: ${name}
    - Ngày Tháng Năm Sinh: ${birthDate}
    ${birthTime ? `- Giờ Sinh: ${birthTime}` : '- Giờ Sinh: Không rõ'}
    ${birthPlace ? `- Nơi Sinh: ${birthPlace}` : '- Nơi Sinh: Không rõ'}

    ## Yêu cầu
    Phân tích chi tiết lá số tử vi, sử dụng đầy đủ thông tin được cung cấp. Đảm bảo cấu trúc và nội dung theo đúng hướng dẫn.

    ## Hướng dẫn định dạng và nội dung JSON
    - **CẢNH BÁO: PHẢN HỒI CỦA BẠN PHẢI BẮT ĐẦU BẰNG DẤU NGOẶC NHỌN MỞ '{' VÀ KẾT THÚC BẰNG NGOẶC NHỌN ĐÓNG '}', KHÔNG CÓ BẤT KỲ NỘI DUNG NÀO TRƯỚC HOẶC SAU CẶP NGOẶC NÀY.**
    - **KHÔNG BAO GIỜ** bắt đầu phản hồi bằng \`#\`, \`*\`, \`\`\`json, hoặc bất kỳ ký tự đánh dấu Markdown nào khác.
    - **CHỈ TRẢ VỀ MỘT CHUỖI JSON HỢP LỆ** - không thêm bất kỳ văn bản nào trước hoặc sau JSON.
    - **Phong cách viết:** Ngôn ngữ trang trọng nhưng **dễ tiếp cận**. Giải thích ngắn gọn thuật ngữ Tử Vi nếu sử dụng. **Quan trọng:** Nội dung trong mỗi trường nên được chia thành các đoạn văn ngắn bằng cách sử dụng ký tự xuống dòng (\`\\n\`) nếu cần thiết để dễ đọc, vì frontend sẽ hiển thị giữ nguyên định dạng này.
    - Cấu trúc JSON mong muốn **chính xác** như sau:
\`\`\`json
{
  "gioiThieuChung": "Nội dung giới thiệu...",
  "canChiVaLichAm": "Nội dung Can Chi, Lịch Âm...",
  "napAmAmDuongMang": "Nội dung Nạp Âm, Âm Dương...",
  "yeuToCoDinh": "Nội dung yếu tố cố định (nếu có)...",
  "cungMenhThan": "Nội dung Cung Mệnh, Cung Thân (nếu xác định được)...",
  "saoChinhVaYnghia": "Nội dung các Sao chính (nếu xác định được)...",
  "vanMenhTongQuan": {
    "congDanh": "Phân tích Công danh...",
    "taiLoc": "Phân tích Tài lộc...",
    "tinhDuyen": "Phân tích Tình duyên...",
    "sucKhoe": "Phân tích Sức khỏe..."
  },
  "ketLuanVaLoiKhuyen": "Nội dung Kết luận, Lời khuyên...",
  "luuY": "Nội dung Lưu ý về thông tin..."
}
\`\`\`
    - **Nội dung chi tiết cho từng trường:**
        - \`"gioiThieuChung"\`: Ngắn gọn (50-70 từ), xác nhận thông tin, nêu mục đích.
        - \`"canChiVaLichAm"\`: Xác định Can Chi, Âm lịch. Giải thích ý nghĩa cơ bản.
        - \`"napAmAmDuongMang"\`: Xác định Nạp Âm, Âm/Dương mạng. Giải thích ảnh hưởng.
        - \`"yeuToCoDinh"\`: (Tùy chọn) Phân tích yếu tố cố định nếu có và liên quan. Nếu không có thì **bỏ qua key này**.
        - \`"cungMenhThan"\`: (**Cần giờ sinh**)
            - Nếu có giờ sinh: Luận giải Mệnh (tiền vận) và Thân (hậu vận). Viết thành đoạn riêng.
            - Nếu thiếu giờ sinh: **Bắt buộc** ghi: "Không thể xác định chính xác Cung Mệnh và Cung Thân do thiếu giờ sinh." (Hoặc có thể **bỏ qua key này** và giải thích trong "luuY").
        - \`"saoChinhVaYnghia"\`: (**Cần giờ sinh**)
            - Nếu có giờ sinh: Liệt kê, giải thích sao chính/phụ quan trọng tại Mệnh/Thân/các cung chính. Chia đoạn nhỏ.
            - Nếu thiếu giờ sinh: **Bắt buộc** ghi: "Không thể an sao chi tiết do thiếu giờ sinh." (Hoặc có thể **bỏ qua key này** và giải thích trong "luuY").
        - \`"vanMenhTongQuan"\`: Phân tích các cung chức năng. **Độ chi tiết phụ thuộc giờ sinh**. Nếu thiếu giờ sinh, luận giải dựa trên yếu tố khác và có thể ít chi tiết hơn.
            - \`"congDanh"\`: Luận giải sự nghiệp.
            - \`"taiLoc"\`: Luận giải tài chính.
            - \`"tinhDuyen"\`: Luận giải tình duyên/gia đạo.
            - \`"sucKhoe"\`: Luận giải sức khỏe.
        - \`"ketLuanVaLoiKhuyen"\`: Tóm tắt cốt lõi, đưa 2-3 lời khuyên thực tế.
        - \`"luuY"\`: **Luôn phải có**.
            - Nếu thiếu giờ sinh/nơi sinh: **Ghi cực kỳ rõ ràng** những phần nào bị ảnh hưởng (VD: "Do thiếu giờ sinh, các luận giải về Cung Mệnh, Thân và vị trí chi tiết của các sao không thể thực hiện.").
            - Nếu đủ thông tin: Ghi chính xác: "Luận giải dựa trên thông tin đầy đủ ngày, tháng, năm, giờ và nơi sinh."
    - **Độ dài:** Tổng nội dung khoảng 700-1000 từ.
    `;

    // Log bắt đầu thực hiện yêu cầu
    console.log(`Starting detailed JSON astrology reading generation for: ${name}`);
    
    try {
      const response = await callGeminiApi(prompt);
      
      // Kiểm tra kết quả trả về
      if (!response.text || response.text.trim().length < 100) {
        // Log warning nếu kết quả quá ngắn
        errorService.logError(
          errorService.createError(
            ErrorType.API,
            "API trả về kết quả quá ngắn hoặc rỗng cho phân tích tử vi JSON chi tiết",
            null,
            { 
              responseLength: response.text?.length || 0,
              ...context 
            }
          ),
          { includeStackTrace: false }
        );
        
        // Sử dụng fallback nếu kết quả không khả dụng
        return getFallbackResponse('astrologyDetailed', { name, birthDate });
      }
      
      // Log phản hồi gốc cho mục đích gỡ lỗi
      console.log('Raw API response (detailed):', response.text.substring(0, 100) + (response.text.length > 100 ? '...' : ''));
      
      // Làm sạch phản hồi trước khi phân tích
      const cleanedResponse = cleanJsonResponse(response.text);
      
      // Thêm kiểm tra JSON parse
      try {
        // Kiểm tra đơn giản nếu đã trả về chuỗi rỗng từ cleanJsonResponse
        if (cleanedResponse === '{}') {
          // cleanJsonResponse đã phát hiện đây không phải là JSON
          errorService.logError(
            errorService.createError(
              ErrorType.API,
              "API không trả về JSON hợp lệ cho phân tích tử vi chi tiết - phát hiện phản hồi không phải JSON",
              null,
              {
                rawResponse: response.text.substring(0, 200),
                ...context
              }
            ),
            { includeStackTrace: false }
          );
          return getFallbackResponse('astrologyDetailed', { name, birthDate });
        }
        
        // Nếu phản hồi không rỗng, kiểm tra xem có phải JSON hợp lệ không
        const parsedJson = JSON.parse(cleanedResponse);
        
        // Kiểm tra cấu trúc JSON cơ bản (ít nhất phải có các trường bắt buộc)
        if (!parsedJson.gioiThieuChung || !parsedJson.canChiVaLichAm || 
            !parsedJson.napAmAmDuongMang || !parsedJson.vanMenhTongQuan) {
          console.warn('Detailed JSON structure is missing required fields');
          errorService.logError(
            errorService.createError(
              ErrorType.API,
              "API trả về JSON không đầy đủ cho phân tích tử vi chi tiết",
              null,
              {
                jsonKeys: Object.keys(parsedJson).join(', '),
                ...context
              }
            ),
            { includeStackTrace: false }
          );
          return getFallbackResponse('astrologyDetailed', { name, birthDate });
        }
        
        // Trả về chuỗi đã làm sạch nếu phân tích thành công
        return cleanedResponse;
      } catch (parseError) {
        errorService.logError(
          errorService.createError(
            ErrorType.API,
            "API không trả về JSON hợp lệ cho phân tích tử vi chi tiết",
            parseError,
            {
              rawResponse: response.text.substring(0, 200),
              cleanedResponse: cleanedResponse,
              ...context
            }
          ),
          { includeStackTrace: false }
        );
        // Trả về fallback dạng text
        return getFallbackResponse('astrologyDetailed', { name, birthDate });
      }
    } catch (error) {
      // Xử lý lỗi từ geminiClient
      errorService.logError(
        errorService.createError(
          ErrorType.API,
          "Lỗi khi gọi Gemini API cho phân tích tử vi chi tiết",
          error,
          { ...context }
        ),
        { includeStackTrace: true }
      );
      return getFallbackResponse('astrologyDetailed', { name, birthDate });
    }
  } catch (error) {
    // Log lỗi với context đầy đủ
    const appError = errorService.createError(
      error instanceof Error && 'type' in error ? (error as any).type : ErrorType.API,
      error instanceof Error && 'message' in error ? error.message : "Lỗi khi tạo phân tích tử vi JSON chi tiết",
      error,
      context
    );
    
    errorService.logError(appError);
    
    // Trả về response dự phòng
    console.log("Returning fallback detailed astrology response (text)");
    return getFallbackResponse('astrologyDetailed', { name, birthDate });
  }
} 