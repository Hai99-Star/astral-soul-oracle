
// API key for Gemini 2.0
const GEMINI_API_KEY = "AIzaSyDXhXPtnctL1b4IDYwUbWfA2TQ0jU1G41E";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeminiResponse {
  text: string;
}

export async function generateGeminiResponse(prompt: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the response format from Gemini API
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Không thể tạo kết quả từ API. Vui lòng thử lại sau.";
      
    return { text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { 
      text: "Đã xảy ra lỗi khi kết nối với dịch vụ. Vui lòng thử lại sau." 
    };
  }
}

// Function to generate astrology reading
export async function generateAstrologyReading(name: string, birthDate: string, birthTime?: string, birthPlace?: string): Promise<string> {
  const prompt = `
    Hãy phân tích lá số tử vi với thông tin sau:
    Tên: ${name}
    Ngày sinh: ${birthDate}
    ${birthTime ? `Giờ sinh: ${birthTime}` : ''}
    ${birthPlace ? `Nơi sinh: ${birthPlace}` : ''}
    
    Phân tích chi tiết về:
    1. Cung mệnh và ý nghĩa
    2. Cung thân và đặc điểm
    3. Các sao chính trong lá số và ảnh hưởng
    4. Vận mệnh tổng quan
    
    Trả về kết quả dưới dạng nhiều đoạn văn ngắn với ngôn ngữ huyền bí nhưng dễ hiểu và cụ thể cho người này.
  `;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
}

// Function to generate numerology reading with detailed prompt
export async function generateNumerologyReading(name: string, birthDate: string): Promise<string> {
  const prompt = `
**Vai trò:** Hãy đóng vai một chuyên gia Thần số học (Numerologist) dày dạn kinh nghiệm, TUÂN THỦ NGHIÊM NGẶT hệ thống Pythagorean truyền thống.

**Thông tin cần phân tích:**

1. **Họ và Tên Đầy Đủ (Như trên giấy tờ):** ${name}
2. **Ngày Tháng Năm Sinh (Dương lịch):** ${birthDate}

**Yêu cầu Phân tích chi tiết VÀ CÁC QUY TẮC BẮT BUỘC PHẢI TUÂN THEO:**

**QUY TẮC TÍNH TOÁN CỐT LÕI (RẤT QUAN TRỌNG):**

1. **Bảng Chữ Cái Pythagorean CHUẨN:** Chỉ sử dụng bảng quy đổi sau cho TẤT CẢ các tính toán liên quan đến tên:
   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
   | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
   | A   | B   | C   | D   | E   | F   | G   | H   | I   |
   | J   | K   | L   | M   | N   | O   | P   | Q   | R   |
   | S   | T   | U   | V   | W   | X   | Y   | Z   |     |
   *(A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8)*. **KHÔNG được sử dụng bảng quy đổi nào khác.**

2. **Xử lý Tên:** Tự động phiên âm tên ${name} được cung cấp thành tên không dấu để tính toán. Sử dụng tên không dấu này cho mọi phép tính liên quan đến tên. Ghi rõ tên không dấu đã sử dụng.

3. **Xác định Nguyên Âm/Phụ Âm:**
   * **Nguyên âm (Vowels):** Chỉ bao gồm **A, E, I, O, U**.
   * **Phụ âm (Consonants):** Bao gồm **TẤT CẢ** các chữ cái còn lại (B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z). Chữ **Y** luôn được tính là **PHỤ ÂM** trong hệ thống này, bất kể vị trí.

4. **Quy tắc Tính Chỉ số Đường Đời (Life Path):**
   * Tách riêng **Ngày sinh**, **Tháng sinh**, **Năm sinh** từ ${birthDate}.
   * **QUAN TRỌNG:** Nếu Ngày sinh hoặc Tháng sinh là Số Master (11, 22), **GIỮ NGUYÊN** giá trị Master đó, **KHÔNG RÚT GỌN** thành số đơn trước khi cộng tổng. Nếu không phải số Master, rút gọn về số đơn (1-9).
   * Rút gọn Năm sinh thành số đơn (hoặc Số Master 11, 22, 33 nếu có).
   * Cộng tổng của (Ngày sinh đã xử lý) + (Tháng sinh đã xử lý) + (Năm sinh đã rút gọn). Ghi rõ phép cộng này.
   * Rút gọn tổng cuối cùng này thành số đơn (từ 1-9) hoặc Số Master (11, 22, 33) nếu tổng cuối là một trong các số này. Ghi rõ quá trình rút gọn cuối cùng.

5. **Quy tắc Tính các Chỉ số từ Tên (Sứ Mệnh, Linh Hồn, Nhân Cách):**
   * Sử dụng bảng chữ cái Pythagorean chuẩn và tên không dấu đã được phiên âm.
   * Tính tổng giá trị số của các chữ cái tương ứng (Toàn bộ tên cho Sứ Mệnh, chỉ Nguyên âm cho Linh Hồn, chỉ Phụ âm cho Nhân Cách). Hiển thị rõ ràng tổng giá trị của từng phần tên (Họ, Đệm, Tên) hoặc cộng dồn tất cả các chữ cái liên quan.
   * **Cộng tất cả giá trị chữ cái** của toàn bộ tên (cho Sứ Mệnh), toàn bộ nguyên âm (cho Linh Hồn), toàn bộ phụ âm (cho Nhân Cách) **TRƯỚC KHI** thực hiện rút gọn cuối cùng.
   * **QUAN TRỌNG:** Khi rút gọn tổng cuối cùng cho mỗi chỉ số (Sứ Mệnh, Linh Hồn, Nhân Cách), nếu tổng **TRƯỚC KHI RÚT GỌN CUỐI CÙNG** là một **Số Master (11, 22, 33)** hoặc một **Số Nợ Nghiệp (13, 14, 16, 19)**, hãy **GHI NHẬN RÕ RÀNG** con số đó bên cạnh kết quả cuối cùng (ví dụ: "Kết quả: 7 (từ 16)" hoặc "Kết quả: 5 (từ 14)").

6. **Xác định Số Master (11, 22, 33):**
   * Luôn kiểm tra xem các chỉ số **cốt lõi cuối cùng** (Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách) có phải là 11, 22, 33 hay không.
   * Kiểm tra cả các **con số gốc** (Ngày sinh, Tháng sinh) có phải là Master không.
   * Diễn giải cả ý nghĩa số gốc (2, 4, 6) và tiềm năng/thách thức của Số Master nếu tìm thấy.

7. **Xác định Số Nợ Nghiệp (Karmic Debt - 13, 14, 16, 19):**
   * **BẮT BUỘC:** Kiểm tra xem các con số **13, 14, 16, 19** có xuất hiện trong **TỔNG TRƯỚC KHI RÚT GỌN CUỐI CÙNG** của bất kỳ chỉ số cốt lõi nào (Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách) hay không.
   * Nếu có, phải xác định rõ ràng và diễn giải bài học nghiệp quả liên quan trong phần diễn giải của chỉ số đó và phần tổng hợp Nợ Nghiệp.

**NỘI DUNG PHÂN TÍCH CẦN CÓ (Định dạng cho Web):**

Vui lòng trình bày kết quả phân tích cho ${name} (sinh ngày ${birthDate}) theo cấu trúc sau, sử dụng định dạng rõ ràng, có thể dùng markdown nhẹ nếu phù hợp với API response (ví dụ: **tiêu đề**, *nhấn mạnh*):

1. **Thông tin Cơ bản:**
   * Họ và Tên: ${name}
   * Tên Tính toán: [Tên không dấu đã phiên âm]
   * Ngày Sinh: ${birthDate}
   * **Bảng chữ cái Pythagorean đã sử dụng:** (Hiển thị lại bảng 1-9)

2. **Phân tích Chi tiết Các Chỉ số Cốt lõi:**
   * **Chỉ số Đường Đời (Life Path Number):**
     * Phép tính: (Trình bày rõ các bước tính: [Ngày đã xử lý] + [Tháng đã xử lý] + [Năm đã rút gọn] = [Tổng] => [Quá trình rút gọn cuối] => [Kết quả cuối])
     * Kết quả: [Số cuối cùng] (Ghi chú nếu có ảnh hưởng từ Master Number trong ngày/tháng sinh)
     * Diễn giải chi tiết: (Bài học, điểm mạnh/yếu, cơ hội, thách thức, nghề nghiệp phù hợp với con số kết quả, liên hệ ảnh hưởng Master Number gốc nếu có)
   * **Chỉ số Sứ Mệnh/Biểu Đạt (Expression/Destiny Number):**
     * Phép tính: (Trình bày rõ phép cộng giá trị các chữ cái của tên không dấu, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
     * Kết quả: [Số cuối cùng] (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp, ví dụ: "7 (từ 16)")
     * Diễn giải chi tiết: (Tài năng, tiềm năng, thể hiện, mục đích, cách thành tựu. **Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó**)
   * **Chỉ số Linh Hồn (Soul Urge/Heart's Desire Number):**
     * Nguyên âm: (Liệt kê các nguyên âm trong tên không dấu)
     * Phép tính: (Trình bày rõ phép cộng giá trị các nguyên âm, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
     * Kết quả: [Số cuối cùng] (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp)
     * Diễn giải chi tiết: (Động lực sâu kín, mong muốn cốt lõi, sự thỏa mãn. **Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó**)
   * **Chỉ số Nhân Cách (Personality Number):**
     * Phụ âm: (Liệt kê các phụ âm trong tên không dấu)
     * Phép tính: (Trình bày rõ phép cộng giá trị các phụ âm, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
     * Kết quả: [Số cuối cùng] (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp, ví dụ: "5 (từ 14)")
     * Diễn giải chi tiết: (Ấn tượng ban đầu, vẻ bề ngoài, khía cạnh dễ thể hiện. **Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó**)
   * **Chỉ số Ngày Sinh (Birth Day Number):**
     * Kết quả: [Số ngày sinh gốc] (Rút gọn nếu lớn hơn 9 và không phải Master, ghi rõ ví dụ: "25 => 7" hoặc "22 (Master Number)")
     * Diễn giải chi tiết: (Ý nghĩa của riêng con số ngày sinh như một tài năng/đặc điểm bổ sung. **Nếu là Master Number, diễn giải ý nghĩa Master**)

3. **Phân tích Tổng hợp Số Master:**
   * (Tóm tắt và nhấn mạnh ảnh hưởng của tất cả các Số Master tìm thấy trong các chỉ số cốt lõi hoặc ngày/tháng sinh lên tổng thể hồ sơ. Nếu không có, ghi rõ "Không có Số Master nổi bật trong các chỉ số cốt lõi.")

4. **Phân tích Tổng hợp Số Nợ Nghiệp:**
   * (Nếu tìm thấy bất kỳ Số Nợ Nghiệp nào (13, 14, 16, 19) trong các phép tính, tóm tắt lại chúng và bài học nghiệp quả chính cần lưu ý. Nếu không có, ghi rõ "Không có Số Nợ Nghiệp nào xuất hiện trong các chỉ số cốt lõi.")

5. **Tổng hợp và Liên kết:**
   * (Nhận xét ngắn gọn về sự tương tác, hài hòa hoặc mâu thuẫn tiềm ẩn giữa các chỉ số chính đã tính toán được)
   * (Tóm tắt những điểm nổi bật nhất của hồ sơ thần số học này và đưa ra lời khuyên tổng quát mang tính xây dựng)
`;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
}

// Function to generate tarot reading
export async function generateTarotReading(question: string, cards: string[]): Promise<string> {
  const prompt = `
    Hãy phân tích ý nghĩa của trải bài Tarot với:
    Câu hỏi: "${question}"
    Các lá bài xuất hiện: ${cards.join(", ")}
    
    Phân tích chi tiết về:
    1. Ý nghĩa của từng lá bài trong bối cảnh câu hỏi
    2. Mối liên hệ giữa các lá bài với nhau
    3. Kết luận tổng quan
    
    Trả về kết quả dưới dạng nhiều đoạn văn ngắn với ngôn ngữ huyền bí nhưng dễ hiểu và cụ thể cho người hỏi.
  `;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
}
