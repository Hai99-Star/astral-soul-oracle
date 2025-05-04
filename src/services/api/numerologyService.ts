import { callGeminiApi } from './geminiClient';
import { NumerologyFormData, NumerologyResult, NumerologyNumbers } from '@/types/numerology';
import { getFallbackResponse } from '@/utils/fallbackResponses';

/**
 * Gọi API Gemini với cơ chế retry cho lỗi 503
 * @param prompt Prompt gửi đến API
 * @param maxRetries Số lần thử lại tối đa
 * @param initialDelay Thời gian chờ ban đầu (ms)
 * @returns Kết quả từ API
 */
async function callGeminiWithRetry(prompt: string, maxRetries = 3, initialDelay = 1000) {
  let retries = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await callGeminiApi(prompt);
    } catch (error) {
      if (retries >= maxRetries) {
        console.error(`Đã thử lại tối đa ${maxRetries} lần và thất bại`);
        throw error;
      }
      
      // Chỉ retry cho lỗi 503 hoặc thông báo quá tải
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && 
          (error.message.includes('503') || 
           error.message.toLowerCase().includes('overloaded') ||
           error.message.toLowerCase().includes('internal server error') ||
           error.message.toLowerCase().includes('temporarily unavailable'))) {
        
        console.log(`Gemini API error (Retryable). Đang thử lại lần ${retries + 1} sau ${delay}ms... Error: ${error.message}`);
        
        // Chờ theo thời gian delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Tăng thời gian chờ theo hàm mũ (exponential backoff)
        delay *= 2;
        retries++;
      } else {
        // Nếu không phải lỗi có thể retry, ném ra luôn
        console.error("Lỗi không thể retry từ Gemini API:", error);
        throw error;
      }
    }
  }
}

/**
 * Tạo phân tích thần số học có retry khi gặp lỗi 503.
 * Prompt này được tối ưu để AI trả về JSON đơn giản,
 * phản ánh đúng quy tắc tính Đường đời (38->2),
 * và kết quả sẽ được biến đổi sau bằng TypeScript.
 * @param name Tên khai sinh
 * @param birthDate Ngày sinh (dd/mm/yyyy)
 * @returns Chuỗi JSON thô từ API (hoặc fallback/response.text khi lỗi parse)
 */
export async function generateNumerologyReading(
  name: string,
  birthDate: string
): Promise<string> {
  try {
    // ***** PROMPT CHÍNH XÁC VÀ PHÙ HỢP *****
    const prompt = `**Nhiệm vụ:** Phân tích thần số học Pythagorean cho ${name} (sinh ngày ${birthDate}). Thực hiện các phép tính một cách CỰC KỲ CẨN THẬN, TỪNG BƯỚC và CHÍNH XÁC TUYỆT ĐỐI theo hướng dẫn bên dưới. Trả về kết quả dưới dạng một đối tượng JSON hợp lệ duy nhất, **bao gồm cả chi tiết các bước tính toán**.

**I. QUY TẮC TÍNH TOÁN CHI TIẾT (PHẢI TUÂN THỦ NGHIÊM NGẶT):**

1.  **Bảng giá trị chữ cái (Pythagorean):**
    *   1: A, J, S
    *   2: B, K, T
    *   3: C, L, U
    *   4: D, M, V
    *   5: E, N, W
    *   6: F, O, X
    *   7: G, P, Y
    *   8: H, Q, Z
    *   9: I, R

2.  **Nguyên âm và Phụ âm:**
    *   Nguyên âm CỐ ĐỊNH: A, E, I, O, U.
    *   Chữ 'Y':
        *   **Là Nguyên âm KHI:** Đứng một mình tạo âm tiết (ví dụ: 'Lynn') HOẶC đứng ngay sau một phụ âm (ví dụ: 'Mary').
        *   **Là Phụ âm KHI:** Đứng ngay sau một nguyên âm khác (A,E,I,O,U) (ví dụ: 'Roy', 'Maya').
        *   **Ghi lại rõ quyết định (Nguyên âm/Phụ âm) cho từng chữ 'Y' trong '${name}' vào phần chi tiết tính toán.**
    *   Phụ âm: Các chữ cái còn lại và 'Y' khi là phụ âm.

3.  **Quy trình Rút gọn số CHUNG (Áp dụng cho Sứ mệnh, Linh hồn, Nhân cách, Ngày sinh > 9 và không phải 11, 22):**
    *   **Bước RG.1:** Gọi số cần rút gọn là N. Tính TỔNG_CHỮ_SỐ = tổng các chữ số của N.
    *   **Bước RG.2:** Kiểm tra TỔNG_CHỮ_SỐ:
        *   Nếu TỔNG_CHỮ_SỐ là Master Number (11, 22, 33) VÀ chỉ số đang tính cho phép giữ (xem I.4), thì Kết quả = TỔNG_CHỮ_SỐ. Dừng.
        *   Nếu 1 <= TỔNG_CHỮ_SỐ <= 9, thì Kết quả = TỔNG_CHỮ_SỐ. Dừng.
        *   Nếu TỔNG_CHỮ_SỐ > 9 VÀ (không phải Master Number được giữ HOẶC chỉ số không cho phép giữ), gán N = TỔNG_CHỮ_SỐ và LẶP LẠI từ Bước RG.1.
    *   **Ghi lại từng bước rút gọn vào chi tiết tính toán.**

4.  **Master Numbers được giữ lại:**
    *   **Đường đời:** CHỈ GIỮ 11, 22 nếu là TỔNG_BAN_ĐẦU (tổng tất cả chữ số dd/mm/yyyy). Nếu TỔNG_BAN_ĐẦU là 33, kết quả là 6. **KHÔNG GIỮ BẤT KỲ Master Number nào (11, 22, 33) trong các bước rút gọn SAU TỔNG_BAN_ĐẦU.**
    *   **Sứ mệnh, Linh hồn, Nhân cách:** GIỮ 11, 22, 33 nếu gặp trong Quy trình Rút gọn số CHUNG (I.3).
    *   **Ngày sinh:** CHỈ GIỮ 11, 22 nếu ngày sinh là 11 hoặc 22. Khi rút gọn số ngày sinh khác (ví dụ 29, 30), áp dụng Quy trình Rút gọn số CHUNG (I.3) nhưng **KHÔNG GIỮ 33** (ví dụ: 30 -> 3, 29 -> 11).

**II. CÁCH TÍNH 5 CON SỐ CHÍNH (Thực hiện từng bước, ghi lại chi tiết):**

1.  **Đường đời (Life Path):**
    *   Bước 1.1: Liệt kê chữ số ${birthDate}: [ghi ra các chữ số].
    *   Bước 1.2: Tính TỔNG_BAN_ĐẦU = [phép cộng các chữ số] = [kết quả tổng].
    *   Bước 1.3: Kiểm tra TỔNG_BAN_ĐẦU:
        *   Nếu = 11 hoặc 22, Số Đường Đời = TỔNG_BAN_ĐẦU. Ghi "Giữ Master Number ban đầu". Dừng.
        *   Nếu = 33, Số Đường Đời = 6. Ghi "Tổng ban đầu 33 rút gọn thành 6". Dừng.
        *   Nếu khác, tiếp tục rút gọn.
    *   Bước 1.4: Rút gọn TỔNG_BAN_ĐẦU (KHÔNG giữ Master Number ở bước này và các bước sau):
        *   Lần 1: [số] -> [phép cộng chữ số] = [kết quả].
        *   (Nếu kết quả > 9) Lần 2: [số] -> [phép cộng chữ số] = [kết quả].
        *   ... (Tiếp tục cho đến khi còn 1 chữ số)
    *   Bước 1.5: Số Đường Đời = [kết quả rút gọn cuối cùng].
    *   **Yêu cầu:** Ghi lại toàn bộ quá trình này vào \`calculation_details.lifePath\`.

2.  **Sứ mệnh (Destiny/Expression):**
    *   Bước 2.1: Chữ cái trong '${name}': [liệt kê chữ cái].
    *   Bước 2.2: Giá trị số tương ứng: [liệt kê số].
    *   Bước 2.3: Tính TỔNG = [phép cộng các số] = [kết quả tổng].
    *   Bước 2.4: Rút gọn TỔNG (áp dụng I.3, GIỮ 11, 22, 33): [ghi lại các bước rút gọn, ví dụ: 56 -> 5+6=11. Giữ 11.].
    *   Bước 2.5: Số Sứ mệnh = [kết quả cuối cùng].
    *   **Yêu cầu:** Ghi lại vào \`calculation_details.destiny\`.

3.  **Linh hồn (Soul Urge):**
    *   Bước 3.1: Nguyên âm trong '${name}' (Xác định 'Y' theo I.2): [liệt kê nguyên âm, ghi rõ quyết định cho Y].
    *   Bước 3.2: Giá trị số tương ứng: [liệt kê số].
    *   Bước 3.3: Tính TỔNG = [phép cộng các số] = [kết quả tổng].
    *   Bước 3.4: Rút gọn TỔNG (áp dụng I.3, GIỮ 11, 22, 33): [ghi lại các bước rút gọn].
    *   Bước 3.5: Số Linh hồn = [kết quả cuối cùng].
    *   **Yêu cầu:** Ghi lại vào \`calculation_details.soul\`.

4.  **Nhân cách (Personality):**
    *   Bước 4.1: Phụ âm trong '${name}' (Xác định 'Y' theo I.2): [liệt kê phụ âm, ghi rõ quyết định cho Y].
    *   Bước 4.2: Giá trị số tương ứng: [liệt kê số].
    *   Bước 4.3: Tính TỔNG = [phép cộng các số] = [kết quả tổng].
    *   Bước 4.4: Rút gọn TỔNG (áp dụng I.3, GIỮ 11, 22, 33): [ghi lại các bước rút gọn].
    *   Bước 4.5: Số Nhân cách = [kết quả cuối cùng].
    *   **Yêu cầu:** Ghi lại vào \`calculation_details.personality\`.

5.  **Ngày sinh (Birth Day):**
    *   Bước 5.1: Ngày sinh 'dd': [ghi ngày].
    *   Bước 5.2: Kiểm tra: Nếu là 11 hoặc 22, Số Ngày sinh = 'dd'. Ghi "Giữ Master Number". Dừng.
    *   Bước 5.3: Nếu > 9 và khác 11, 22: Rút gọn 'dd' (áp dụng I.3, KHÔNG giữ 33): [ghi lại bước rút gọn, ví dụ: 29 -> 2+9=11. Giữ 11. Hoặc 30 -> 3+0=3.].
    *   Bước 5.4: Số Ngày sinh = [kết quả cuối cùng].
    *   **Yêu cầu:** Ghi lại vào \`calculation_details.birthDay\`.

**III. YÊU CẦU ĐỊNH DẠNG OUTPUT (JSON) - Cấu trúc CHÍNH XÁC:**
Cung cấp TOÀN BỘ phản hồi dưới dạng một chuỗi JSON hợp lệ duy nhất, KHÔNG có văn bản nào khác.

{
  "calculation_details": {
    "name": "${name}",
    "birthDate": "${birthDate}",
    "lifePath": "Bước 1.1: Chữ số: [...]. Bước 1.2: Tổng ban đầu = ... = X. Bước 1.3: [Kiểm tra X]. Bước 1.4: Rút gọn: X -> ... -> Y. Bước 1.5: Kết quả cuối cùng: Y.",
    "destiny": "Bước 2.1: Chữ cái: [...]. Bước 2.2: Số: [...]. Bước 2.3: Tổng = ... = X. Bước 2.4: Rút gọn: X -> ... -> Y [Ghi rõ nếu giữ Master Number]. Bước 2.5: Kết quả cuối cùng: Y.",
    "soul": "Bước 3.1: Nguyên âm: [...] (Quyết định Y: ...). Bước 3.2: Số: [...]. Bước 3.3: Tổng = ... = X. Bước 3.4: Rút gọn: X -> ... -> Y [Ghi rõ nếu giữ Master Number]. Bước 3.5: Kết quả cuối cùng: Y.",
    "personality": "Bước 4.1: Phụ âm: [...] (Quyết định Y: ...). Bước 4.2: Số: [...]. Bước 4.3: Tổng = ... = X. Bước 4.4: Rút gọn: X -> ... -> Y [Ghi rõ nếu giữ Master Number]. Bước 4.5: Kết quả cuối cùng: Y.",
    "birthDay": "Bước 5.1: Ngày sinh: dd. Bước 5.2/5.3: [Kiểm tra/Rút gọn dd -> ... -> Y (Ghi rõ nếu giữ 11, 22)]. Bước 5.4: Kết quả cuối cùng: Y."
  },
  "introduction": "Một đoạn giới thiệu ngắn gọn...",
  "lifePathAnalysis": {
    "number": 0,
    "masterInfo": null,
    "meaning": "Ý nghĩa...",
    "strengths": ["...", "..."],
    "challenges": ["...", "..."]
  },
  "destinyAnalysis": {
    "number": 0,
    "masterInfo": null,
    "meaning": "Ý nghĩa cốt lõi của con số Sứ mệnh này.",
    "strengths": ["...", "..."],
    "challenges": ["...", "..."]
  },
  "soulAnalysis": {
    "number": 0,
    "masterInfo": null,
    "meaning": "Ý nghĩa cốt lõi, khát vọng sâu thẳm của con số Linh hồn.",
    "strengths": ["...", "..."],
    "challenges": ["...", "..."]
  },
  "personalityAnalysis": {
    "number": 0,
    "masterInfo": null,
    "meaning": "Ý nghĩa cốt lõi, cách thể hiện ra bên ngoài của con số Nhân cách.",
    "strengths": ["...", "..."],
    "challenges": ["...", "..."]
  },
  "birthDayAnalysis": {
    "number": 0,
    "masterInfo": null,
    "meaning": "Ảnh hưởng bổ sung từ con số Ngày sinh.",
    "strengths": ["...", "..."],
    "challenges": ["...", "..."]
  },
  "interactions": "Phân tích sự tương tác...",
  "advice": [ "Lời khuyên...", "..." ]
}

**IV. YÊU CẦU VỀ NỘI DUNG PHÂN TÍCH:**
- Nội dung diễn giải ý nghĩa, điểm mạnh, điểm yếu, tương tác, lời khuyên phải tập trung vào tâm lý, tiềm năng, định hướng phát triển.
- Giọng văn sâu sắc, tích cực, truyền cảm hứng, xây dựng, không mê tín.
- Viết bằng tiếng Việt.
- Cung cấp đầy đủ nội dung cho TẤT CẢ các trường diễn giải trong cấu trúc JSON.

**QUAN TRỌNG NHẤT:**
- TÍNH TOÁN TUYỆT ĐỐI CHÍNH XÁC THEO TỪNG BƯỚC MÔ TẢ Ở PHẦN II.
- GHI LẠI CHI TIẾT CÁC BƯỚC TÍNH TOÁN VÀO calculation_details. ĐÂY LÀ BẮT BUỘC.
- ĐẢM BẢO OUTPUT LÀ MỘT JSON HỢP LỆ DUY NHẤT.`;
    // ***** KẾT THÚC PROMPT *****

    // Sử dụng hàm gọi API với retry
    const response = await callGeminiWithRetry(prompt); // response bây giờ là object { text: '...' }

    try {
      // Lấy chuỗi JSON từ response.text
      const jsonText = response.text;

      // Loại bỏ các ký tự không hợp lệ hoặc markdown code block nếu AI trả về
      const cleanedJsonString = jsonText
        .replace(/^```json\s*/, '') // Xóa ```json ở đầu
        .replace(/\s*```$/, '');    // Xóa ``` ở cuối
        // Cân nhắc thêm .trim() nếu cần thiết
        // .trim();

      // Kiểm tra nếu là JSON hợp lệ (chỉ kiểm tra, không lưu kết quả parse ở đây)
      JSON.parse(cleanedJsonString);

      // Trả về chuỗi JSON đã được làm sạch ĐỂ hàm gọi bên ngoài parse và biến đổi
      return cleanedJsonString;

    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      console.error("Raw response text was:", response.text); // Log chuỗi text gốc

      // Trả về văn bản gốc nếu không phải JSON hợp lệ (để hàm gọi xử lý)
      // Hoặc có thể ném lỗi cụ thể hơn
      // throw new Error(`Failed to parse JSON: ${jsonError.message}`);
      return response.text; // Giữ nguyên hành vi trả về text nếu parse lỗi
    }
  } catch (error) {
    console.error("Error in generateNumerologyReading (API call or retry failed):", error);
    // Sử dụng fallback khi có lỗi trong quá trình gọi API hoặc retry
    // Đảm bảo getFallbackResponse trả về một chuỗi JSON hợp lệ hoặc chuỗi thông báo lỗi
    const fallbackData = { name, birthDate };
    return getFallbackResponse('numerology', fallbackData);
  }
}

// --- Các hàm tính toán ---

/**
 * Rút gọn số về 1 chữ số cho Đường Đời (KHÔNG giữ master trung gian).
 */
function reduceLifePathDigit(num: number): number {
    while (num > 9) {
        let sum = 0;
        while (num > 0) {
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        num = sum;
    }
    return num;
}

/**
 * Tính toán con số đường đời.
 */
export function calculateLifePathNumber(dateStr: string): number {
    try {
        const parts = dateStr.split('/');
        if (parts.length !== 3) return 0;

        const dayStr = parts[0];
        const monthStr = parts[1];
        const yearStr = parts[2];

        if (isNaN(parseInt(dayStr)) || isNaN(parseInt(monthStr)) || isNaN(parseInt(yearStr))) return 0;

        let totalSum = 0;
        for (const char of (dayStr + monthStr + yearStr)) {
            const digit = parseInt(char);
            if (!isNaN(digit)) {
                totalSum += digit;
            }
        }

        if (totalSum === 11 || totalSum === 22) {
            return totalSum;
        }

        // Sử dụng hàm rút gọn riêng cho Life Path
        return reduceLifePathDigit(totalSum);

    } catch (error) {
        console.error("Error calculating life path number:", error);
        return 0;
    }
}


/**
 * Rút gọn số về 1 chữ số (CÓ giữ lại 11, 22, 33).
 * Dùng cho Sứ mệnh, Linh hồn, Nhân cách (nếu tự tính).
 */
function reduceToSingleDigit(num: number): number {
    // Giữ lại Master Number ngay từ đầu nếu có
    if (num === 11 || num === 22 || num === 33) {
        return num;
    }

    while (num > 9) {
        let sum = 0;
        while (num > 0) {
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        num = sum;

        // Kiểm tra Master Number sau mỗi lần rút gọn
        if (num === 11 || num === 22 || num === 33) {
            return num;
        }
    }
    return num;
} 