import { callGeminiApi } from './geminiClient';
import { TarotCard } from '@/types/tarot';
import { getFallbackResponse } from '@/utils/fallbackResponses';

/**
 * Tạo phần giới thiệu về Tarot
 * @returns Phần giới thiệu Tarot
 */
export async function generateTarotIntroduction(): Promise<string> {
  try {
    const prompt = `
    # YÊU CẦU GIỚI THIỆU TAROT

    Hãy tạo một bài giới thiệu ngắn về bói bài Tarot, bao gồm:
    
    1. Lịch sử và nguồn gốc của bài Tarot
    2. Ý nghĩa và mục đích của việc đọc bài Tarot
    3. Cách tiếp cận việc đọc bài Tarot một cách lành mạnh
    4. Lưu ý rằng đây là công cụ để suy ngẫm, không phải dự đoán chính xác tương lai
    
    ## Hướng dẫn định dạng
    - Viết bằng tiếng Việt, ngôn ngữ dễ hiểu
    - Tự nhiên, không học thuật
    - Giữ giới thiệu ngắn gọn, khoảng 200-300 từ
    `;

    const response = await callGeminiApi(prompt);
    return response.text;
  } catch (error) {
    console.error("Error in generateTarotIntroduction:", error);
    return `
    # Giới thiệu về Tarot
    
    Bài Tarot có nguồn gốc từ thế kỷ 15 tại châu Âu, ban đầu là một trò chơi bài trước khi trở thành công cụ tiên tri và phát triển tâm linh.
    
    Mỗi lá bài Tarot đại diện cho những biểu tượng và năng lượng khác nhau, phản ánh các trải nghiệm phổ quát của con người. Khi đọc Tarot, chúng ta không phải dự đoán tương lai một cách máy móc, mà là khám phá những khả năng, hiểu rõ hơn về tình huống hiện tại và tiềm năng của những lựa chọn khác nhau.
    
    Tarot là công cụ hỗ trợ trực giác và suy ngẫm. Những lá bài có thể giúp chúng ta nhìn nhận các vấn đề từ góc độ mới, kết nối với trực giác và tìm ra hướng đi cho bản thân.
    
    Việc sử dụng Tarot nên được tiếp cận với tâm thế cởi mở, tò mò và trách nhiệm. Hãy nhớ rằng, quyền tự do lựa chọn luôn nằm trong tay bạn, Tarot chỉ là công cụ soi sáng con đường, không định đoạt số phận.
    `;
  }
}

/**
 * Tạo phân tích Tarot cho 1 lá bài
 * @param question Câu hỏi của người dùng
 * @param card Lá bài đã chọn
 * @returns Kết quả phân tích Tarot cho 1 lá
 */
export async function generateSingleCardTarotReading(
  question: string,
  card: TarotCard
): Promise<string> {
  try {
    const prompt = `
    # YÊU CẦU PHÂN TÍCH TAROT - MỘT LÁ BÀI

    ## Thông tin đọc bài
    - Câu hỏi: "${question}"
    - Lá bài đã rút: "${card.name}" (${card.nameVi})

    ## Yêu cầu
    Hãy phân tích ý nghĩa của lá bài này trong bối cảnh câu hỏi đã đặt ra. Phân tích nên bao gồm:
    
    1. Mô tả ngắn gọn về lá bài và ý nghĩa chung
    2. Cách lá bài này liên quan đến câu hỏi cụ thể
    3. Thông điệp chính và lời khuyên từ lá bài
    4. Góc nhìn khác hoặc những điều cần lưu ý
    
    ## Hướng dẫn định dạng
    - Tổ chức phân tích thành các phần rõ ràng
    - Viết bằng tiếng Việt, ngôn ngữ dễ hiểu
    - Tích cực và mang tính xây dựng, tránh những dự đoán tiêu cực
    - Tạo không gian cho người đọc tự suy ngẫm
    - Độ dài khoảng 300-400 từ
    `;

    const response = await callGeminiApi(prompt);
    return response.text;
  } catch (error) {
    console.error("Error in generateSingleCardTarotReading:", error);
    return getFallbackResponse('tarotSingleCard', { question, card });
  }
}

/**
 * Tạo phân tích Tarot cho 3 lá bài
 * @param question Câu hỏi của người dùng
 * @param cards Danh sách 3 lá bài đã chọn
 * @param spreadType Loại trải bài
 * @returns Kết quả phân tích Tarot cho 3 lá
 */
export async function generateTarot3CardReading(
  question: string,
  cards: TarotCard[],
  spreadType: string
): Promise<string> {
  try {
    // Xác định loại trải bài
    let spreadDescription = "Quá khứ / Hiện tại / Tương lai";
    
    switch (spreadType) {
      case "a":
        spreadDescription = "Quá khứ / Hiện tại / Tương lai";
        break;
      case "b":
        spreadDescription = "Tình huống hiện tại / Hành động cần làm / Kết quả";
        break;
      case "c":
        spreadDescription = "Điểm mạnh của bạn / Thách thức chính / Lời khuyên";
        break;
      case "d":
        spreadDescription = "Điều bạn mong muốn / Điều đang cản trở / Cách dung hòa/vượt qua";
        break;
      case "e":
        spreadDescription = "Tâm trí (Suy nghĩ) / Cơ thể (Hành động) / Tinh thần (Cảm xúc/Trực giác)";
        break;
      case "f":
        spreadDescription = "Bản chất vấn đề / Nguyên nhân gốc rễ / Hướng giải quyết";
        break;
      case "g":
        spreadDescription = "Điểm mạnh / Điểm yếu / Lời khuyên";
        break;
      case "h":
        spreadDescription = "Bạn muốn gì / Điều gì cản trở / Làm thế nào để đạt được";
        break;
    }

    const prompt = `
    # YÊU CẦU PHÂN TÍCH TAROT - BA LÁ BÀI

    ## Thông tin đọc bài
    - Câu hỏi: "${question}"
    - Loại trải bài: ${spreadDescription}
    - Lá bài #1: "${cards[0].name}" (${cards[0].nameVi})
    - Lá bài #2: "${cards[1].name}" (${cards[1].nameVi})
    - Lá bài #3: "${cards[2].name}" (${cards[2].nameVi})

    ## Yêu cầu
    Hãy phân tích sâu sắc ý nghĩa của ba lá bài này trong ngữ cảnh của loại trải bài và câu hỏi đã đặt ra. Phân tích nên bao gồm:
    
    1. Giới thiệu ngắn về tổng thể bộ ba lá bài
    2. Phân tích chi tiết từng lá bài theo vị trí của nó trong trải bài (theo loại trải bài đã chọn)
    3. Sự kết hợp và mối quan hệ giữa các lá bài
    4. Thông điệp tổng thể và lời khuyên dựa trên cả ba lá bài
    
    ## Hướng dẫn định dạng
    - Tổ chức phân tích thành các phần rõ ràng
    - Viết bằng tiếng Việt, ngôn ngữ dễ hiểu
    - Tích cực và mang tính xây dựng, tập trung vào giải pháp
    - Phân tích khoảng 600-800 từ
    `;

    const response = await callGeminiApi(prompt);
    return response.text;
  } catch (error) {
    console.error("Error in generateTarot3CardReading:", error);
    return getFallbackResponse('tarot3Cards', { question, cards, spreadType });
  }
} 