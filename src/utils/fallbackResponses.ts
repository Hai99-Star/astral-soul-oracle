import { FallbackType, FallbackData } from '@/types/api';
import { TarotCard } from '@/types/tarot';

/**
 * Hàm trả về dữ liệu dự phòng khi API gặp lỗi
 * @param type Loại dữ liệu cần trả về
 * @param data Dữ liệu bổ sung (nếu có)
 * @returns Chuỗi phản hồi dự phòng
 */
export function getFallbackResponse(type: FallbackType, data?: FallbackData): string {
  switch (type) {
    case 'astrology':
      return getAstrologyFallbackResponse(data);
    case 'astrologyDetailed':
      return getAstrologyDetailedFallbackResponse(data);
    case 'numerology':
      return getNumerologyFallbackResponse(data);
    case 'tarotSingleCard':
      return getTarotSingleCardFallbackResponse(data);
    case 'tarot3Cards':
      return getTarot3CardsFallbackResponse(data);
    default:
      return "Không thể tạo kết quả từ API. Vui lòng thử lại sau.";
  }
}

/**
 * Tạo phản hồi dự phòng cho Tử vi
 */
function getAstrologyFallbackResponse(data?: FallbackData): string {
  const name = data?.name || "Người dùng";
  const birthDate = data?.birthDate || "01/01/2000";
  
  return `
  # Phân tích Tử Vi cho ${name}

  ## Thông tin cơ bản
  - Họ và Tên: ${name}
  - Ngày Sinh: ${birthDate}

  ## Giới hạn phân tích
  Chúng tôi không thể kết nối với dịch vụ phân tích tử vi vào lúc này. Vui lòng thử lại sau để nhận phân tích chính xác hơn.

  ## Một số thông tin sơ bộ
  Dựa trên ngày sinh của bạn, một số đặc điểm chung có thể được nhận định. Tuy nhiên, phân tích chi tiết và chính xác hơn sẽ được cung cấp khi kết nối với hệ thống thành công.
  
  *Lưu ý: Đây là phân tích tạm thời do không thể kết nối với dịch vụ API. Để có phân tích chi tiết và chính xác hơn, vui lòng thử lại sau.*
  `;
}

/**
 * Tạo phản hồi dự phòng cho Tử vi chi tiết
 */
function getAstrologyDetailedFallbackResponse(data?: FallbackData): string {
  const name = data?.name || "Người dùng";
  const birthDate = data?.birthDate || "01/01/2000";
  
  return `
  # Phân tích Tử Vi Chi Tiết cho ${name}

  ## Thông tin cơ bản
  - Họ và Tên: ${name}
  - Ngày Sinh: ${birthDate}

  ## Giới hạn phân tích
  Chúng tôi không thể kết nối với dịch vụ phân tích tử vi chi tiết vào lúc này. Vui lòng thử lại sau để nhận phân tích chính xác hơn.

  ## Chuyển đổi Lịch và Xác định Can Chi
  Dựa trên ngày ${birthDate}, một số đặc điểm chung có thể được nhận định. Tuy nhiên, phân tích chi tiết sẽ được cung cấp khi kết nối với hệ thống thành công.
  
  ## Nạp Âm và Âm Dương Nam/Nữ
  Thông tin này sẽ được cung cấp khi kết nối thành công.
  
  ## Các Yếu Tố Cố Định Theo Năm Sinh
  Thông tin này sẽ được cung cấp khi kết nối thành công.
  
  ## Giới Hạn Do Thiếu Thông Tin
  Phân tích chi tiết và chính xác hơn sẽ được cung cấp khi kết nối với hệ thống thành công.
  
  *Lưu ý: Đây là phân tích tạm thời do không thể kết nối với dịch vụ API. Để có phân tích chi tiết và chính xác hơn, vui lòng thử lại sau.*
  `;
}

/**
 * Tạo phản hồi dự phòng cho Thần số học
 */
function getNumerologyFallbackResponse(data?: FallbackData): string {
  // Trích xuất tên và ngày sinh từ data nếu có
  const name = data?.name || "Người dùng";
  const birthDate = data?.birthDate || "01/01/2000";
  
  // Tính toán các con số dựa trên ngày sinh
  const parts = birthDate.split('/');
  const day = parseInt(parts[0] || "0");
  const month = parseInt(parts[1] || "0");
  const year = parseInt(parts[2] || "0");
  
  // Tính số đường đời đơn giản
  let lifePath = day + month + year;
  while (lifePath > 9 && lifePath !== 11 && lifePath !== 22) {
    lifePath = Math.floor(lifePath / 10) + (lifePath % 10);
  }
  
  // Các con số khác
  const soulNumber = 4; // Giá trị mặc định
  const destinyNumber = 2;
  const personalityNumber = 6;
  
  return `
  # Phân tích Thần Số Học cho ${name}

  ## Thông tin cơ bản
  - Họ và Tên: ${name}
  - Ngày Sinh: ${birthDate}

  ## Con Số Đường Đời: ${lifePath}

  Con số đường đời ${lifePath} của bạn thể hiện con đường và mục đích sống cốt lõi. Đây là con số quan trọng nhất trong biểu đồ thần số học của bạn.

  ## Con Số Linh Hồn: ${soulNumber}

  Con số linh hồn ${soulNumber} thể hiện những khao khát sâu thẳm và những gì làm bạn thực sự hạnh phúc. Đây là động lực bên trong thúc đẩy bạn.

  ## Con Số Sứ Mệnh: ${destinyNumber}

  Con số sứ mệnh ${destinyNumber} thể hiện những tài năng và khả năng bạn mang theo khi sinh ra. Đây là con đường mà bạn được định sẵn để theo đuổi.

  ## Con Số Nhân Cách: ${personalityNumber}

  Con số nhân cách ${personalityNumber} thể hiện hình ảnh bên ngoài mà bạn thể hiện với thế giới. Đây là cách người khác nhìn nhận bạn.

  ---

  *Lưu ý: Đây là phân tích thần số học tạm thời do không thể kết nối với dịch vụ API. Để có phân tích chi tiết và chính xác hơn, vui lòng thử lại sau.*
  `;
}

/**
 * Tạo phản hồi dự phòng cho Tarot 1 lá
 */
function getTarotSingleCardFallbackResponse(data?: FallbackData): string {
  const question = data?.question || "Câu hỏi của bạn";
  const card = data?.card as TarotCard || {
    id: 1,
    name: "The Magician",
    nameVi: "Nhà Ảo Thuật",
    image: "https://www.trustedtarot.com/img/cards/the-magician.png",
    meaning: "Sức mạnh ý chí, sự sáng tạo và khả năng biến ước mơ thành hiện thực."
  };
  
  return `
  # Phân tích lá bài ${card.name} (${card.nameVi})

  ## Câu hỏi của bạn
  "${question}"

  ## Ý nghĩa lá bài
  ${card.meaning}

  ## Liên hệ với câu hỏi
  Lá bài ${card.nameVi} xuất hiện trong bối cảnh câu hỏi của bạn cho thấy đây là thời điểm bạn cần tận dụng sức mạnh nội tại và khả năng sáng tạo của mình. Hãy nhìn nhận tình huống hiện tại với niềm tin vào khả năng biến những điều bạn mong muốn thành hiện thực.

  ## Lời khuyên
  Hãy tin tưởng vào khả năng của chính mình. Đây là thời điểm tốt để bạn chủ động tạo ra cơ hội thay vì chờ đợi cơ hội đến. Hãy nhận diện và khai thác những công cụ, nguồn lực sẵn có xung quanh bạn.

  *Lưu ý: Đây là phân tích tạm thời do không thể kết nối với dịch vụ API. Để có phân tích sâu sắc và chính xác hơn, vui lòng thử lại sau.*
  `;
}

/**
 * Tạo phản hồi dự phòng cho Tarot 3 lá
 */
function getTarot3CardsFallbackResponse(data?: FallbackData): string {
  const question = data?.question || "Câu hỏi của bạn";
  const spreadType = data?.spreadType || "a";
  const cards = (data?.cards as TarotCard[]) || [
    {
      id: 1,
      name: "The Magician",
      nameVi: "Nhà Ảo Thuật",
      image: "https://www.trustedtarot.com/img/cards/the-magician.png",
      meaning: "Sức mạnh ý chí, sự sáng tạo và khả năng biến ước mơ thành hiện thực."
    },
    {
      id: 7,
      name: "The Chariot",
      nameVi: "Cỗ Xe",
      image: "https://www.trustedtarot.com/img/cards/the-chariot.png",
      meaning: "Quyết tâm, ý chí mạnh mẽ và chiến thắng."
    },
    {
      id: 17,
      name: "The Star",
      nameVi: "Ngôi Sao",
      image: "https://www.trustedtarot.com/img/cards/the-star.png",
      meaning: "Hy vọng, cảm hứng và sự bình yên tâm hồn."
    }
  ];
  
  // Xác định mô tả loại trải bài
  let spreadDescription = "Quá khứ / Hiện tại / Tương lai";
  switch (spreadType) {
    case "a": spreadDescription = "Quá khứ / Hiện tại / Tương lai"; break;
    case "b": spreadDescription = "Tình huống hiện tại / Hành động cần làm / Kết quả"; break;
    case "c": spreadDescription = "Điểm mạnh của bạn / Thách thức chính / Lời khuyên"; break;
    case "d": spreadDescription = "Điều bạn mong muốn / Điều đang cản trở / Cách dung hòa/vượt qua"; break;
    case "e": spreadDescription = "Tâm trí (Suy nghĩ) / Cơ thể (Hành động) / Tinh thần (Cảm xúc/Trực giác)"; break;
    case "f": spreadDescription = "Bản chất vấn đề / Nguyên nhân gốc rễ / Hướng giải quyết"; break;
    case "g": spreadDescription = "Điểm mạnh / Điểm yếu / Lời khuyên"; break;
    case "h": spreadDescription = "Bạn muốn gì / Điều gì cản trở / Làm thế nào để đạt được"; break;
  }
  
  // Tạo mô tả cho từng vị trí
  const positions = spreadDescription.split(' / ');
  
  return `
  # Phân tích Trải Bài Tarot 3 Lá

  ## Câu hỏi của bạn
  "${question}"

  ## Loại trải bài
  ${spreadDescription}

  ## Tổng quan
  Bộ ba lá bài này tạo nên một câu chuyện về hành trình của bạn liên quan đến câu hỏi đã đặt ra. Hãy cùng khám phá ý nghĩa của từng lá bài và mối liên hệ giữa chúng.

  ## ${positions[0]}: ${cards[0].name} (${cards[0].nameVi})
  ${cards[0].meaning}
  
  Ở vị trí ${positions[0].toLowerCase()}, lá ${cards[0].nameVi} cho thấy ${getPositionInterpretation(0, spreadType)}.

  ## ${positions[1]}: ${cards[1].name} (${cards[1].nameVi})
  ${cards[1].meaning}
  
  Ở vị trí ${positions[1].toLowerCase()}, lá ${cards[1].nameVi} đại diện cho ${getPositionInterpretation(1, spreadType)}.

  ## ${positions[2]}: ${cards[2].name} (${cards[2].nameVi})
  ${cards[2].meaning}
  
  Ở vị trí ${positions[2].toLowerCase()}, lá ${cards[2].nameVi} gợi ý rằng ${getPositionInterpretation(2, spreadType)}.

  ## Mối liên hệ giữa các lá bài
  Ba lá bài này cùng nhau tạo nên một câu chuyện về sự phát triển. Từ ${cards[0].nameVi} đến ${cards[1].nameVi} và cuối cùng là ${cards[2].nameVi}, bạn có thể thấy một tiến trình rõ ràng từ khởi đầu đến kết quả cuối cùng.

  ## Thông điệp tổng thể
  Thông điệp chính từ trải bài này là bạn đang trong quá trình phát triển và chuyển đổi. Hãy tin tưởng vào con đường bạn đang đi và tận dụng những nguồn lực sẵn có để đạt được mục tiêu của mình.

  *Lưu ý: Đây là phân tích tạm thời do không thể kết nối với dịch vụ API. Để có phân tích sâu sắc và chính xác hơn, vui lòng thử lại sau.*
  `;
}

/**
 * Hàm phụ trợ để tạo mô tả cho từng vị trí trong trải bài Tarot
 */
function getPositionInterpretation(position: number, spreadType: string): string {
  switch (spreadType) {
    case "a": // Quá khứ / Hiện tại / Tương lai
      if (position === 0) return "những trải nghiệm trong quá khứ đã ảnh hưởng đến tình huống hiện tại của bạn";
      if (position === 1) return "năng lượng đang bao quanh bạn ở thời điểm hiện tại";
      if (position === 2) return "một khả năng có thể xảy ra trong tương lai nếu bạn tiếp tục con đường hiện tại";
      break;
    case "b": // Tình huống hiện tại / Hành động cần làm / Kết quả
      if (position === 0) return "bản chất của tình huống bạn đang đối mặt";
      if (position === 1) return "hành động hoặc thái độ bạn nên thực hiện để đạt kết quả tốt nhất";
      if (position === 2) return "kết quả tiềm năng nếu bạn áp dụng lời khuyên từ lá bài thứ hai";
      break;
    case "c": // Điểm mạnh / Thách thức / Lời khuyên
      if (position === 0) return "điểm mạnh hoặc nguồn lực bạn có thể tận dụng";
      if (position === 1) return "thách thức chính bạn đang đối mặt trong tình huống này";
      if (position === 2) return "cách tốt nhất để vượt qua thách thức và tận dụng điểm mạnh của bạn";
      break;
    default:
      if (position === 0) return "yếu tố quan trọng đầu tiên bạn cần xem xét";
      if (position === 1) return "yếu tố thứ hai bạn cần cân nhắc";
      if (position === 2) return "giải pháp hoặc kết quả cuối cùng cho tình huống";
  }
  return "một khía cạnh quan trọng đáng suy ngẫm";
} 