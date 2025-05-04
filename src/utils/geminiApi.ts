// API key for Gemini 2.0
const GEMINI_API_KEY = "AIzaSyDXhXPtnctL1b4IDYwUbWfA2TQ0jU1G41E";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeminiResponse {
  text: string;
}

export async function generateGeminiResponse(prompt: string): Promise<GeminiResponse> {
  try {
    // Check if the prompt is a JSON structure
    let isJsonPrompt = false;
    let jsonContent = null;
    
    try {
      // Try to parse as JSON - first remove any leading/trailing whitespace
      const trimmedPrompt = prompt.trim();
      
      // Check if it looks like JSON (starts with { or [)
      if ((trimmedPrompt.startsWith('{') && trimmedPrompt.endsWith('}')) || 
          (trimmedPrompt.startsWith('[') && trimmedPrompt.endsWith(']'))) {
        jsonContent = JSON.parse(trimmedPrompt);
        isJsonPrompt = true;
        console.log("Detected JSON prompt format");
      }
    } catch (e) {
      // Not valid JSON, which is fine - we'll send it as a regular text prompt
      console.log("Prompt is not valid JSON, sending as text");
    }
    
    // Prepare the API request based on the prompt type
    let requestBody;
    
    if (isJsonPrompt) {
      // If the prompt is JSON, we need to stringify it properly for the API
      requestBody = JSON.stringify({
        contents: [
          {
            parts: [
              { 
                text: JSON.stringify(jsonContent)
              }
            ]
          }
        ]
      });
    } else {
      // For regular text prompts, use the standard format
      requestBody = JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      });
    }
    
    // Log the request for debugging
    console.log("Sending request to Gemini API:", 
                isJsonPrompt ? "JSON prompt (abridged)" : "Text prompt");
    
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error Response:", errorData);
      throw new Error(`API responded with status: ${response.status}, Details: ${errorData}`);
    }

    const data = await response.json();
    
    // Log the response structure for debugging
    console.log("API Response structure:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
    
    // Handle the response format from Gemini API
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Không thể tạo kết quả từ API. Vui lòng thử lại sau.";
      
    return { text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Kiểm tra nếu prompt là phân tích Tarot, trả về kết quả mặc định thay vì hiển thị lỗi
    if (prompt.includes("Tarot") && prompt.includes("lá bài")) {
      return { 
        text: getTarotFallbackResponse(prompt) 
      };
    }
    
    // Kiểm tra nếu prompt là phân tích Thần Số Học, trả về kết quả dự phòng
    if (prompt.includes("Thần số học") || prompt.includes("Numerology") || 
        (prompt.includes("ngày sinh") && prompt.includes("họ tên"))) {
      return {
        text: getNumerologyFallbackResponse(prompt)
      };
    }
    
    return { 
      text: "Đã xảy ra lỗi khi kết nối với dịch vụ. Vui lòng thử lại sau." 
    };
  }
}

// Hàm tạo kết quả dự phòng cho thần số học khi API không phản hồi
function getNumerologyFallbackResponse(prompt: string): string {
  // Trích xuất tên và ngày sinh từ prompt nếu có
  let name = "Người dùng";
  let birthDate = "01/01/2000";
  
  const nameMatch = prompt.match(/Họ và Tên Đầy Đủ.*?:\s*(.+?)(?=\d|$)/);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim();
  }
  
  const dateMatch = prompt.match(/Ngày Tháng Năm Sinh.*?:\s*(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch && dateMatch[1]) {
    birthDate = dateMatch[1].trim();
  }
  
  // Tính toán các con số dựa trên ngày sinh
  const parts = birthDate.split('/');
  const day = parseInt(parts[0] || "0");
  const month = parseInt(parts[1] || "0");
  const year = parseInt(parts[2] || "0");
  
  // Tính số đường đời đơn giản
  let lifePath = day + month + 
                 parseInt((year.toString()[0] || "0")) + 
                 parseInt((year.toString()[1] || "0")) +
                 parseInt((year.toString()[2] || "0")) +
                 parseInt((year.toString()[3] || "0"));
  
  // Rút gọn
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

${lifePath === 1 ? `Với con số 1, bạn là người tiên phong, có tính độc lập cao, sáng tạo và quyết đoán. Bạn có khả năng lãnh đạo tự nhiên và thường đạt được thành công nhờ sự tự tin và quyết tâm. Thách thức của bạn là cân bằng giữa tính độc lập và hợp tác với người khác.` : ""}
${lifePath === 2 ? `Với con số 2, bạn có khả năng hợp tác, ngoại giao và trực giác tuyệt vời. Bạn là người mang lại sự hài hòa trong các mối quan hệ và có khả năng cảm nhận nhu cầu của người khác. Thách thức của bạn là phát triển sự tự tin và không quá phụ thuộc vào người khác.` : ""}
${lifePath === 3 ? `Với con số 3, bạn có tài năng sáng tạo, giao tiếp và biểu đạt. Bạn thường mang đến niềm vui và cảm hứng cho người khác. Thách thức của bạn là tập trung năng lượng vào việc hoàn thành mục tiêu thay vì phân tán vào nhiều dự án.` : ""}
${lifePath === 4 ? `Với con số 4, bạn là người đáng tin cậy, thực tế và có tổ chức. Bạn xây dựng nền tảng vững chắc và đạt được thành công nhờ sự kiên trì và làm việc chăm chỉ. Thách thức của bạn là phát triển tính linh hoạt và không quá cứng nhắc.` : ""}
${lifePath === 5 ? `Với con số 5, bạn yêu tự do, phiêu lưu và trải nghiệm mới. Bạn thích thích nghi với sự thay đổi và có khả năng giao tiếp xuất sắc. Thách thức của bạn là tìm ra sự cân bằng giữa tự do và cam kết, tránh sự bốc đồng.` : ""}
${lifePath === 6 ? `Với con số 6, bạn là người nuôi dưỡng, có trách nhiệm và hài hòa. Bạn thường đảm nhận vai trò chăm sóc và mang lại sự cân bằng cho gia đình và cộng đồng. Thách thức của bạn là không quá lo lắng và không gánh vác quá nhiều trách nhiệm của người khác.` : ""}
${lifePath === 7 ? `Với con số 7, bạn có tư duy phân tích, trực giác và tâm linh. Bạn tìm kiếm chân lý và kiến thức sâu sắc. Thách thức của bạn là cân bằng giữa trí tuệ và tình cảm, giữa thời gian một mình và kết nối với người khác.` : ""}
${lifePath === 8 ? `Với con số 8, bạn có khả năng lãnh đạo, tổ chức và đạt được thành công về tài chính. Bạn hiểu rõ về quyền lực và có thể tạo ra sự thịnh vượng. Thách thức của bạn là duy trì sự cân bằng giữa công việc và cuộc sống cá nhân, tránh chủ nghĩa vật chất.` : ""}
${lifePath === 9 ? `Với con số 9, bạn là người nhân đạo, vị tha và có tầm nhìn rộng lớn. Bạn có khả năng sáng tạo và truyền cảm hứng cho người khác. Thách thức của bạn là học cách buông bỏ quá khứ và chấp nhận sự kết thúc như một phần tự nhiên của cuộc sống.` : ""}
${lifePath === 11 ? `Với con số 11, bạn là người có trực giác cao và tầm nhìn tâm linh. Đây là một trong những con số Master, thể hiện tiềm năng giác ngộ và khả năng truyền cảm hứng cho người khác. Thách thức của bạn là cân bằng giữa lý tưởng cao cả và thực tế.` : ""}
${lifePath === 22 ? `Với con số 22, bạn là "Người xây dựng vĩ đại" với khả năng biến những ý tưởng lớn thành hiện thực. Đây là con số Master mạnh mẽ nhất, thể hiện tiềm năng đạt được thành tựu to lớn. Thách thức của bạn là không bị choáng ngợp bởi tiềm năng của mình và tập trung vào các mục tiêu thực tế.` : ""}

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

// Hàm này tạo kết quả dự phòng cho đọc Tarot khi API không phản hồi
function getTarotFallbackResponse(prompt: string): string {
  // Kiểm tra nếu là đọc bài 1 lá
  if (prompt.includes("1 lá bài") || prompt.includes("một lá bài")) {
    let cardName = "The Magician (Nhà Ảo Thuật)";
    
    // Trích xuất tên lá bài từ prompt nếu có
    const cardMatch = prompt.match(/"([^"]+)"/g);
    if (cardMatch && cardMatch.length >= 2) {
      cardName = cardMatch[1].replace(/"/g, '');
    }
    
    return `
# Xác nhận và Giới thiệu

Câu hỏi của bạn liên quan đến việc làm thế nào để giải quyết một tình huống khó khăn trong cuộc sống. Lá bài xuất hiện là ${cardName}, một lá bài mạnh mẽ mang thông điệp về sức mạnh ý chí và khả năng tạo ra thay đổi.

# Ý nghĩa cốt lõi của lá bài

${cardName} biểu tượng cho khả năng biến điều không thể thành có thể. Lá bài này thể hiện sự sáng tạo, ý chí mạnh mẽ và tài năng tập trung năng lượng để đạt được mục tiêu. Trong hệ thống Rider-Waite-Smith, hình ảnh Nhà Ảo Thuật với một tay chỉ lên trời, một tay chỉ xuống đất, thể hiện nguyên lý "như trên, như dưới" - khả năng kết nối các lực lượng vũ trụ với thực tế trần gian.

Trên lá bài có biểu tượng vô cực (∞) trên đầu nhân vật, thể hiện tiềm năng vô hạn và khả năng tiếp cận nguồn lực vô tận. Bốn nguyên tố (gậy, cốc, kiếm, xu) trên bàn tượng trưng cho việc làm chủ mọi nguồn lực cần thiết để tạo nên thành công.

Mặt tích cực: Sự sáng tạo, ý chí mạnh mẽ, tập trung cao độ, có khả năng biến ý tưởng thành hiện thực.
Mặt tiêu cực: Thao túng, lừa dối, sử dụng tài năng cho mục đích ích kỷ.

# Diễn giải chi tiết trong bối cảnh câu hỏi

Trong tình huống hiện tại của bạn, lá ${cardName} cho thấy bạn đang có trong tay tất cả các nguồn lực cần thiết để vượt qua thách thức. Bạn không chỉ có khả năng vượt qua khó khăn mà còn có tiềm năng biến nó thành cơ hội phát triển. Lá bài này phản ánh rằng bạn đang đứng tại điểm khởi đầu của một hành trình mới, nơi bạn có thể định hình thực tại theo ý muốn của mình.

Lá bài đang nhắc nhở bạn rằng sức mạnh thực sự đến từ bên trong - từ ý chí và niềm tin vào bản thân. Khi đối mặt với tình huống hiện tại, hãy tự hỏi: "Tôi thực sự muốn tạo ra điều gì?" và "Tôi đã sử dụng hết các nguồn lực sẵn có chưa?"

# Lời khuyên thực tế

1. **Lập kế hoạch cụ thể**: Xác định rõ mục tiêu và vạch ra các bước cần thực hiện. Viết chúng ra và theo dõi tiến trình hàng ngày.

2. **Tập trung năng lượng**: Tránh phân tán sự chú ý vào nhiều dự án cùng lúc. Hãy ưu tiên một hoặc hai mục tiêu quan trọng nhất.

3. **Phát triển kỹ năng giao tiếp**: Khả năng thuyết phục và truyền đạt ý tưởng sẽ là công cụ mạnh mẽ để bạn đạt được điều mình muốn.

4. **Sử dụng trực giác kết hợp với logic**: Cân bằng giữa lý trí và cảm xúc, giữa phân tích và linh cảm để đưa ra quyết định tốt nhất.

# Kết luận và mở rộng

Thông điệp chính từ trải bài này là bạn đang trong một hành trình phát triển quan trọng. Từ việc nhận ra điều mình thực sự khao khát và đưa ra lựa chọn từ trái tim, bạn hiện đang ở thời điểm sáng tạo và biến điều đó thành hiện thực. Tương lai cho thấy cần xây dựng nền tảng vững chắc và có kỷ luật để duy trì những gì bạn đã tạo ra.

Lời khuyên cốt lõi:
1. Luôn nhớ lại lý do ban đầu khiến bạn lựa chọn con đường này
2. Sử dụng tất cả tài năng và sức mạnh của bạn - đừng tự giới hạn bản thân
3. Tạo ra cấu trúc và kỷ luật để đảm bảo thành công lâu dài

# Tuyên Bố Miễn Trừ Trách Nhiệm

Phiên trải bài này dựa trên các biểu tượng và ý nghĩa truyền thống của Tarot, nhằm mục đích cung cấp góc nhìn tham khảo và hỗ trợ suy ngẫm. Nó không phải là tiên tri, không dự đoán tương lai một cách cố định, và không thể thay thế cho trực giác cá nhân hay lời khuyên từ các chuyên gia trong lĩnh vực liên quan.

Hãy xem đây là một công cụ để khám phá bản thân và tự đưa ra những quyết định phù hợp nhất với hoàn cảnh của mình. Mỗi người có quyền năng và trách nhiệm trong việc lựa chọn và hành động để định hình con đường phía trước.
`;
  }
  // Kiểm tra nếu là đọc bài 3 lá
  else if (prompt.includes("3 lá") || prompt.includes("ba lá")) {
    let cardNames = ["The Lovers (Cặp Đôi Yêu Nhau)", "The Magician (Nhà Ảo Thuật)", "The Emperor (Hoàng Đế)"];
    let spreadType = "Quá khứ / Hiện tại / Tương lai";
    
    // Cố gắng trích xuất các lá bài từ prompt
    const cardsMatch = prompt.match(/\[(.*?)\]/);
    if (cardsMatch && cardsMatch[1]) {
      cardNames = cardsMatch[1].split(',').map(card => card.trim());
    }
    
    // Cố gắng trích xuất cấu trúc trải bài
    if (prompt.includes("Cấu trúc")) {
      if (prompt.includes("Điểm mạnh")) spreadType = "Điểm mạnh / Thách thức / Lời khuyên";
      else if (prompt.includes("Tình huống")) spreadType = "Tình huống / Hành động / Kết quả";
      else if (prompt.includes("Tâm trí")) spreadType = "Tâm trí / Cơ thể / Tinh thần";
      else if (prompt.includes("mong muốn")) spreadType = "Điều mong muốn / Điều cản trở / Cách vượt qua";
      else if (prompt.includes("Bản chất")) spreadType = "Bản chất vấn đề / Nguyên nhân / Hướng giải quyết";
    }
    
    return `
# Xác nhận và Giải thích Cấu trúc Trải Bài

Tôi xác nhận đã nhận được câu hỏi của bạn và sẽ thực hiện phiên trải bài Tarot với 3 lá.

Cấu trúc trải bài: **${spreadType}**

# Các Lá Bài Đã Xuất Hiện

## Vị trí 1: ${cardNames[0].split(' (')[1].replace(')', '')} (${cardNames[0].split(' (')[0]})

${cardNames[0].split(' (')[0]} thể hiện sự lựa chọn từ trái tim, mối quan hệ, sự hòa hợp và kết nối. Lá bài này nói về những quyết định quan trọng và việc kết nối với các giá trị sâu sắc nhất của bạn. Có sự hiện diện của thiên thần che chở, biểu trưng cho sự bảo vệ tâm linh và hướng dẫn.

Khi xuất hiện ở vị trí này, lá bài cho thấy bạn đã trải qua (hoặc đang trải qua) một giai đoạn cần đưa ra lựa chọn quan trọng dựa trên tình yêu và các giá trị cốt lõi của bạn. Đây là thời điểm bạn nhận ra tầm quan trọng của việc lắng nghe trái tim mình.

## Vị trí 2: ${cardNames[1].split(' (')[1].replace(')', '')} (${cardNames[1].split(' (')[0]})

${cardNames[1].split(' (')[0]} tượng trưng cho khởi đầu mới, năng lượng sáng tạo, ý chí mạnh mẽ và khả năng biến ước mơ thành hiện thực. Lá bài này cho thấy bạn đang nắm trong tay tất cả các yếu tố (đất, nước, không khí, lửa) cần thiết để tạo nên thành công.

Ở vị trí này, lá bài cho thấy bạn đang có cơ hội sử dụng tài năng và ý chí của mình một cách mạnh mẽ. Đây là thời điểm để hành động và thể hiện khả năng của bạn. Bạn có tất cả các công cụ cần thiết để tạo ra thay đổi tích cực.

## Vị trí 3: ${cardNames[2].split(' (')[1].replace(')', '')} (${cardNames[2].split(' (')[0]})

${cardNames[2].split(' (')[0]} đại diện cho quyền lực, cấu trúc, trật tự và sự ổn định. Lá bài này nói về khả năng lãnh đạo, kiểm soát và xây dựng nền tảng vững chắc. Hoàng Đế ngồi trên ngai vàng vững chắc, tượng trưng cho sự vững vàng và quyết đoán.

Khi xuất hiện ở vị trí này, lá bài gợi ý rằng bạn cần kiên định và tạo ra cấu trúc để đạt được mục tiêu. Đây có thể là thời điểm để áp dụng kỷ luật và trật tự vào cuộc sống, hoặc cần tìm kiếm sự ổn định và an toàn.

# Phân Tích Mối Liên Hệ Giữa Các Lá Bài

Có một tiến trình rõ ràng trong trải bài này:

Từ ${cardNames[0].split(' (')[0]} (sự lựa chọn từ trái tim và nhận ra điều quan trọng), bạn đi đến ${cardNames[1].split(' (')[0]} (khả năng sáng tạo và hành động theo ý chí), và cuối cùng tiến tới ${cardNames[2].split(' (')[0]} (thiết lập cấu trúc và nền tảng vững chắc).

Đây là hành trình từ sự lựa chọn đến hành động, và cuối cùng là tạo ra một nền tảng ổn định. Các lá bài này cùng nhau kể một câu chuyện về việc lắng nghe trái tim, rồi sử dụng trí tuệ và tài năng để hành động, và cuối cùng xây dựng một thực tại vững chắc.

# Mối Liên Hệ Với Câu Hỏi

Câu hỏi của bạn liên quan đến việc làm thế nào để tiến tới trong tình huống hiện tại. Các lá bài đã xuất hiện cho thấy:

- Bạn đã hoặc đang phải đưa ra lựa chọn quan trọng dựa trên các giá trị cốt lõi (${cardNames[0].split(' (')[0]})
- Hiện tại bạn có sức mạnh và tài năng để tạo ra thay đổi (${cardNames[1].split(' (')[0]})
- Con đường phía trước đòi hỏi việc thiết lập cấu trúc, trật tự và kỷ luật (${cardNames[2].split(' (')[0]})

# Kết Luận

Thông điệp chính từ trải bài này là bạn đang trong một hành trình phát triển quan trọng. Từ việc nhận ra điều mình thực sự khao khát và đưa ra lựa chọn từ trái tim, bạn hiện đang ở thời điểm sáng tạo và biến điều đó thành hiện thực. Tương lai cho thấy cần xây dựng nền tảng vững chắc và có kỷ luật để duy trì những gì bạn đã tạo ra.

Lời khuyên cốt lõi:
1. Luôn nhớ lại lý do ban đầu khiến bạn lựa chọn con đường này
2. Sử dụng tất cả tài năng và sức mạnh của bạn - đừng tự giới hạn bản thân
3. Tạo ra cấu trúc và kỷ luật để đảm bảo thành công lâu dài

# Tuyên Bố Miễn Trừ Trách Nhiệm

Phiên trải bài này dựa trên các biểu tượng và ý nghĩa truyền thống của Tarot, nhằm mục đích cung cấp góc nhìn tham khảo và hỗ trợ suy ngẫm. Nó không phải là tiên tri, không dự đoán tương lai một cách cố định, và không thể thay thế cho trực giác cá nhân hay lời khuyên từ các chuyên gia trong lĩnh vực liên quan.

Hãy xem đây là một công cụ để khám phá bản thân và tự đưa ra những quyết định phù hợp nhất với hoàn cảnh của mình. Mỗi người có quyền năng và trách nhiệm trong việc lựa chọn và hành động để định hình con đường phía trước.
`;
  }
  
  // Mặc định cho các trường hợp khác
  return "Không thể tạo kết quả từ API. Vui lòng thử lại sau.";
}

// Function to generate tarot introduction
export async function generateTarotIntroduction(): Promise<string> {
  const prompt = `
**Yêu cầu:** Tạo một đoạn văn giới thiệu ngắn về Tarot cho người mới bắt đầu. Sau đó giải thích ngắn gọn hai lựa chọn trải bài phổ biến (1 lá và 3 lá) để người dùng có thể chọn. KHÔNG tạo kết quả đọc bài hay giả vờ như đang thực hiện phiên trải bài.

**Các bước thực hiện yêu cầu:**

1. **Giới thiệu chung về Tarot:** Viết một đoạn ngắn giới thiệu Tarot là gì, nguồn gốc và mục đích của nó một cách đơn giản.

2. **Giải thích các kiểu trải bài:**
   * **Trải bài 1 lá:** Giải thích đây là lựa chọn nhanh gọn cho một thông điệp cốt lõi hoặc thấu hiểu một vấn đề đơn giản.
   * **Trải bài 3 lá:** Giải thích đây là trải bài phổ biến với nhiều cấu trúc như quá khứ-hiện tại-tương lai, tình huống-hành động-kết quả, hoặc điểm mạnh-thách thức-lời khuyên.

3. **Lưu ý quan trọng về cách đặt câu hỏi:** Nhấn mạnh Tarot không phù hợp để hỏi về thời gian cụ thể hoặc dự đoán chính xác tương lai. Người dùng nên tránh câu hỏi như "Khi nào X sẽ xảy ra?", "X có xảy ra vào ngày Y không?". Thay vào đó, nên đặt câu hỏi mở về phát triển cá nhân, lựa chọn, hoặc hướng đi.

**Định dạng và ngôn ngữ:**
- Hãy viết với giọng điệu thân thiện, dễ hiểu.
- Dùng tiếng Việt đơn giản, tránh thuật ngữ chuyên môn khó hiểu.
- KHÔNG được giả vờ như đang tiến hành một phiên trải bài thực sự.
- KHÔNG bao gồm bất kỳ nội dung nào về kết quả trải bài hoặc diễn giải lá bài cụ thể.
- KHÔNG bắt đầu với "Tôi xác nhận đã nhận được câu hỏi" hoặc bất kỳ cụm từ nào tương tự, vì chưa có câu hỏi nào được đặt ra.
  `;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
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

// Function to generate detailed astrology reading with user-provided prompt
export async function generateAstrologyDetailedReading(name: string, birthDate: string, birthTime?: string, birthPlace?: string): Promise<string> {
  const prompt = `
**Yêu cầu:** Phân tích các yếu tố Tử Vi cố định có thể xác định được cho người sau đây, **ngay cả khi không có giờ sinh chính xác**. Hãy đóng vai trò là một nhà nghiên cứu Tử Vi, trình bày rõ ràng những gì có thể biết và những gì **hoàn toàn không thể xác định** do thiếu giờ sinh. **Tuyệt đối không được phỏng đoán vị trí Cung Mệnh, Cung Thân hay sự phân bố của các sao trong 12 cung chức năng.**

**Thông tin cá nhân:**

*   **Họ và Tên:** ${name}
*   **Ngày Sinh Dương Lịch:** ${birthDate}
*   **Giờ Sinh Dương Lịch:** ${birthTime ? birthTime : "Không nhớ rõ giờ sinh"}
*   **Giới Tính:** ${name.includes("Thị") ? "Nữ" : "Nam"}
*   **Nơi Sinh:** ${birthPlace ? birthPlace : ""}

**Các bước thực hiện yêu cầu:**

1.  **Chuyển đổi Lịch và Xác định Can Chi:**
    *   Chuyển đổi Ngày Sinh Dương Lịch đã cung cấp sang **Ngày, Tháng, Năm Âm Lịch** tương ứng một cách chính xác. Ghi rõ kết quả chuyển đổi này.
    *   Xác định **Can Chi** của Năm, Tháng, Ngày sinh Âm Lịch.
    *   Nêu rõ rằng Can Chi của Giờ sinh **không thể xác định được** do thiếu thông tin.

2.  **Xác định Nạp Âm và Âm Dương Nam/Nữ:**
    *   Xác định **Nạp Âm** (Ngũ Hành Nạp Âm) của Năm sinh Âm Lịch và nêu ý nghĩa tổng quát cơ bản, khái lược nhất của Nạp Âm này đối với bản mệnh.
    *   Xác định người này là **Âm Nam/Dương Nam** hay **Âm Nữ/Dương Nữ** dựa trên Can Năm sinh và Giới tính. Nêu ý nghĩa của việc này đối với chiều đi thuận hay nghịch của Đại Vận (nhưng phải nhấn mạnh rằng **điểm khởi đầu của Đại Vận, tức Cung Mệnh, là không thể xác định.**)

3.  **Các Yếu Tố Cố Định Theo Năm Sinh:**
    *   Xác định vị trí cố định trên **Địa Bàn** (12 cung Tý, Sửu, Dần...) của các sao sau đây, dựa trên **Thiên Can Năm Sinh:** Lộc Tồn, Kình Dương, Đà La. Nếu có thể, xác định thêm vị trí Thiên Khôi, Thiên Việt theo Can Năm.
    *   Xác định vị trí cố định trên **Địa Bàn** của sao **Thái Tuế** dựa trên **Địa Chi Năm Sinh**.
    *   **Quan trọng:** Với mỗi sao được xác định vị trí trên Địa Bàn, phải nhấn mạnh một cách rõ ràng rằng: "Mặc dù biết sao [Tên Sao] nằm tại cung [Tên Địa Chi] trên Địa Bàn, nhưng do không xác định được Cung Mệnh nằm ở đâu, nên **hoàn toàn không thể biết sao này thuộc về Cung chức năng nào** (ví dụ: không biết nó nằm ở Mệnh, Tài, Quan, Di, Phúc, Phối hay cung nào khác) trong lá số của người này."

4.  **Nhấn Mạnh Giới Hạn Tuyệt Đối Do Thiếu Giờ Sinh:**
    *   Tạo một mục riêng biệt, dễ thấy để **khẳng định lại một cách rõ ràng và mạnh mẽ** rằng do thiếu Giờ sinh, các yếu tố sau đây là **HOÀN TOÀN KHÔNG THỂ XÁC ĐỊNH ĐƯỢC**:
        *   Vị trí chính xác của **Cung Mệnh** và **Cung Thân** trên lá số.
        *   **Cục** của bản Mệnh (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục).
        *   Sự phân bố của **14 Chính Tinh** (Tử Vi, Thiên Phủ,...) trên toàn bộ lá số.
        *   Vị trí cụ thể của hầu hết các **Phụ Tinh quan trọng** khác (bao gồm Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh...).
        *   Sự tương ứng giữa 12 Địa Chi (Tý, Sửu...) với 12 Cung chức năng (Mệnh, Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Phối, Huynh).
        *   Điểm **khởi đầu và lộ trình cụ thể của các Đại Vận** 10 năm.

5.  **Kết Luận và Cảnh Báo:**
    *   Tóm tắt ngắn gọn những thông tin cố định ít ỏi đã xác định được (chủ yếu là Nạp Âm, Âm Dương Nam/Nữ, và vị trí Địa Bàn của vài sao theo năm sinh).
    *   Đưa ra một cảnh báo cuối cùng, nhấn mạnh rằng phân tích này **chỉ mang tính tham khảo về các yếu tố nền tảng cố định**, **hoàn toàn không phải là một lá số Tử Vi hoàn chỉnh** và **tuyệt đối không thể sử dụng để luận giải bất kỳ điều gì** về tính cách, số phận, công danh, tài lộc, tình duyên, sức khỏe... của đương số.
    *   Tái khẳng định rằng Giờ sinh là thông tin **thiết yếu và bắt buộc** để có thể lập và luận giải một lá số Tử Vi có ý nghĩa.
  `;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
}

// Function to generate numerology reading with detailed prompt
export async function generateNumerologyReading(name: string, birthDate: string): Promise<string> {
  const prompt = `
**Vai trò:** Hãy đóng vai một chuyên gia Thần số học (Numerologist) dày dạn kinh nghiệm, TUÂN THỦ NGHIÊM NGẶT hệ thống Pythagorean truyền thống.

**Thông tin cần phân tích:**

1.  **Họ và Tên Đầy Đủ (Như trên giấy tờ):** ${name}
2.  **Ngày Tháng Năm Sinh (Dương lịch):** ${birthDate}

**Yêu cầu Phân tích chi tiết VÀ CÁC QUY TẮC BẮT BUỘC PHẢI TUÂN THEO:**

**QUY TẮC TÍNH TOÁN CỐT LÕI (RẤT QUAN TRỌNG):**

1.  **Bảng Chữ Cái Pythagorean CHUẨN:** Chỉ sử dụng bảng quy đổi sau cho TẤT CẢ các tính toán liên quan đến tên:
   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
   | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
   | A   | B   | C   | D   | E   | F   | G   | H   | I   |
   | J   | K   | L   | M   | N   | O   | P   | Q   | R   |
   | S   | T   | U   | V   | W   | X   | Y   | Z   |     |
   *(A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8)*. **KHÔNG được sử dụng bảng quy đổi nào khác.**

2.  **Xử lý Tên:** Tự động phiên âm tên ${name} được cung cấp thành tên không dấu để tính toán. Sử dụng tên không dấu này cho mọi phép tính liên quan đến tên. Ghi rõ tên không dấu đã sử dụng.

3.  **Xác định Nguyên Âm/Phụ Âm:**
    *   **Nguyên âm (Vowels):** Chỉ bao gồm **A, E, I, O, U**.
    *   **Phụ âm (Consonants):** Bao gồm **TẤT CẢ** các chữ cái còn lại (B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z). Chữ **Y** luôn được tính là **PHỤ ÂM** trong hệ thống này, bất kể vị trí.

4.  **Quy tắc Tính Chỉ số Đường Đời (Life Path):**
    *   Tách riêng **Ngày sinh**, **Tháng sinh**, **Năm sinh** từ ${birthDate}.
    *   **QUAN TRỌNG:** Nếu Ngày sinh hoặc Tháng sinh là Số Master (11, 22), **GIỮ NGUYÊN** giá trị Master đó, **KHÔNG RÚT GỌN** thành số đơn trước khi cộng tổng. Nếu không phải số Master, rút gọn về số đơn (1-9).
    *   Rút gọn Năm sinh thành số đơn (hoặc Số Master 11, 22, 33 nếu có).
    *   Cộng tổng của (Ngày sinh đã xử lý) \+ (Tháng sinh đã xử lý) \+ (Năm sinh đã rút gọn). Ghi rõ phép cộng này.
    *   Rút gọn tổng cuối cùng này thành số đơn (từ 1-9) hoặc Số Master (11, 22, 33) nếu tổng cuối là một trong các số này. Ghi rõ quá trình rút gọn cuối cùng.

5.  **Quy tắc Tính các Chỉ số từ Tên (Sứ Mệnh, Linh Hồn, Nhân Cách):**
    *   Sử dụng bảng chữ cái Pythagorean chuẩn và tên không dấu đã được phiên âm.
    *   Tính tổng giá trị số của các chữ cái tương ứng (Toàn bộ tên cho Sứ Mệnh, chỉ Nguyên âm cho Linh Hồn, chỉ Phụ âm cho Nhân Cách). Hiển thị rõ ràng tổng giá trị của từng phần tên (Họ, Đệm, Tên) hoặc cộng dồn tất cả các chữ cái liên quan.
    *   **Cộng tất cả giá trị chữ cái** của toàn bộ tên (cho Sứ Mệnh), toàn bộ nguyên âm (cho Linh Hồn), toàn bộ phụ âm (cho Nhân Cách) **TRƯỚC KHI** thực hiện rút gọn cuối cùng.
    *   **QUAN TRỌNG:** Khi rút gọn tổng cuối cùng cho mỗi chỉ số (Sứ Mệnh, Linh Hồn, Nhân Cách), nếu tổng **TRƯỚC KHI RÚT GỌN CUỐI CÙNG** là một **Số Master (11, 22, 33)** hoặc một **Số Nợ Nghiệp (13, 14, 16, 19)**, hãy **GHI NHẬN RÕ RÀNG** con số đó bên cạnh kết quả cuối cùng (ví dụ: "Kết quả: 7 (từ 16)" hoặc "Kết quả: 5 (từ 14)").

6.  **Xác định Số Master (11, 22, 33):**
    *   Luôn kiểm tra xem các chỉ số **cốt lõi cuối cùng** (Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách) có phải là 11, 22, 33 hay không.
    *   Kiểm tra cả các **con số gốc** (Ngày sinh, Tháng sinh) có phải là Master không.
    *   Diễn giải cả ý nghĩa số gốc (2, 4, 6) và tiềm năng/thách thức của Số Master nếu tìm thấy.

7.  **Xác định Số Nợ Nghiệp (Karmic Debt - 13, 14, 16, 19):**
    *   **BẮT BUỘC:** Kiểm tra xem các con số **13, 14, 16, 19** có xuất hiện trong **TỔNG TRƯỚC KHI RÚT GỌN CUỐI CÙNG** của bất kỳ chỉ số cốt lõi nào (Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách) hay không.
    *   Nếu có, phải xác định rõ ràng và diễn giải bài học nghiệp quả liên quan trong phần diễn giải của chỉ số đó và phần tổng hợp Nợ Nghiệp.

**NỘI DUNG PHÂN TÍCH CẦN CÓ (Định dạng rõ ràng, dễ đọc):**

Vui lòng trình bày kết quả phân tích cho ${name} (sinh ngày ${birthDate}) theo cấu trúc sau. **Sử dụng các đoạn văn đầy đủ, rõ ràng, mạch lạc cho phần diễn giải.** **KHÔNG SỬ DỤNG** các ký tự đánh dấu như dấu sao (\*) để nhấn mạnh. Hãy dùng tiêu đề rõ ràng cho từng mục lớn.

1.  **Thông tin Cơ bản:**
    *   Họ và Tên: ${name}
    *   Tên Tính toán: [Tên không dấu đã phiên âm]
    *   Ngày Sinh: ${birthDate}
    *   Bảng chữ cái Pythagorean đã sử dụng: (Hiển thị lại bảng 1-9)

2.  **Phân tích Chi tiết Các Chỉ số Cốt lõi:**

    **Chỉ số Đường Đời (Life Path Number):**
    *   Phép tính: (Trình bày rõ các bước tính: [Ngày đã xử lý] \+ [Tháng đã xử lý] \+ [Năm đã rút gọn] = [Tổng] => [Quá trình rút gọn cuối] => [Kết quả cuối])
    *   Kết quả cuối cùng: [Số cuối cùng]. (Ghi chú thêm nếu có ảnh hưởng từ Master Number trong ngày/tháng sinh, ví dụ: "Kết quả: 11 (Master Number)")
    *   Diễn giải: Viết một đoạn văn đầy đủ giải thích chi tiết về ý nghĩa của con số Đường Đời này, bao gồm bài học, điểm mạnh/yếu, cơ hội, thách thức, nghề nghiệp phù hợp. Liên hệ ảnh hưởng Master Number gốc nếu có.

    **Chỉ số Sứ Mệnh/Biểu Đạt (Expression/Destiny Number):**
    *   Phép tính: (Trình bày rõ phép cộng giá trị các chữ cái của tên không dấu, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
    *   Kết quả cuối cùng: [Số cuối cùng]. (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp, ví dụ: "Kết quả: 7 (từ 16)" hoặc "Kết quả: 22 (Master Number)")
    *   Diễn giải: Viết một đoạn văn đầy đủ giải thích chi tiết về ý nghĩa của con số Sứ Mệnh này, bao gồm tài năng, tiềm năng, cách thể hiện, mục đích, cách thành tựu. Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó trong đoạn văn.

    **Chỉ số Linh Hồn (Soul Urge/Heart's Desire Number):**
    *   Nguyên âm sử dụng: (Liệt kê các nguyên âm trong tên không dấu)
    *   Phép tính: (Trình bày rõ phép cộng giá trị các nguyên âm, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
    *   Kết quả cuối cùng: [Số cuối cùng]. (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp)
    *   Diễn giải: Viết một đoạn văn đầy đủ giải thích chi tiết về ý nghĩa của con số Linh Hồn này, bao gồm động lực sâu kín, mong muốn cốt lõi, điều mang lại sự thỏa mãn. Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó trong đoạn văn.

    **Chỉ số Nhân Cách (Personality Number):**
    *   Phụ âm sử dụng: (Liệt kê các phụ âm trong tên không dấu)
    *   Phép tính: (Trình bày rõ phép cộng giá trị các phụ âm, ghi rõ tổng trước rút gọn cuối, và quá trình rút gọn cuối)
    *   Kết quả cuối cùng: [Số cuối cùng]. (Ghi chú rõ ràng nếu kết quả đến từ Số Master hoặc Số Nợ Nghiệp, ví dụ: "Kết quả: 5 (từ 14)")
    *   Diễn giải: Viết một đoạn văn đầy đủ giải thích chi tiết về ý nghĩa của con số Nhân Cách này, bao gồm ấn tượng ban đầu bạn tạo ra, vẻ bề ngoài, những khía cạnh dễ thể hiện. Nếu có Nợ Nghiệp hoặc Master, giải thích ý nghĩa đặc biệt đó trong đoạn văn.

    **Chỉ số Ngày Sinh (Birth Day Number):**
    *   Kết quả: [Số ngày sinh gốc]. (Rút gọn nếu lớn hơn 9 và không phải Master, ghi rõ ví dụ: "25 => 7" hoặc "22 (Master Number)").
    *   Diễn giải: Viết một đoạn văn đầy đủ giải thích ý nghĩa của riêng con số ngày sinh như một tài năng hoặc đặc điểm bổ sung. Nếu là Master Number, diễn giải ý nghĩa Master trong đoạn văn.

3.  **Phân tích Biểu đồ Ngày sinh và Các Mũi tên Đặc biệt:**

    **Biểu đồ Ngày sinh (Birth Date Matrix):**
    *   Các chữ số trong ngày sinh (${birthDate}): [Liệt kê các chữ số từ DDMMYYYY, bỏ qua số 0].
    *   Mô tả Biểu đồ 3x3: (Mô tả ngắn gọn cấu trúc ô 369 | 258 | 147).
    *   Biểu đồ đã điền: [Mô tả hoặc trình bày cách các chữ số ngày sinh được điền vào biểu đồ và số lần lặp lại của mỗi số].
    *   Tần suất các số (1-9): [Liệt kê số lần xuất hiện của mỗi số từ 1 đến 9].
    *   Các số vắng mặt: [Liệt kê các số từ 1 đến 9 không có trong ngày sinh].
    *   Diễn giải (Số có mặt): Viết một đoạn văn diễn giải ý nghĩa của các con số xuất hiện trong biểu đồ, đặc biệt là các số lặp lại nhiều lần hoặc các số đơn lẻ.
    *   Diễn giải (Số vắng mặt): Viết một đoạn văn diễn giải những đặc điểm hoặc bài học có thể liên quan đến các con số bị thiếu trong biểu đồ.

    **Các Mũi tên Đặc biệt trong Biểu đồ (Strengths and Weaknesses Arrows):**
    *   Phân tích các đường thẳng (hàng, cột, chéo) hoàn toàn có số hoặc hoàn toàn trống trong biểu đồ ngày sinh.
    *   Mũi tên Sức mạnh (Filled Arrows): [Liệt kê tên các mũi tên có đủ số (ví dụ: Mũi tên Quyết tâm 1-2-3, Mũi tên Thực tế 1-4-7, Mũi tên Trí tuệ 3-6-9,...)]. Viết diễn giải ngắn gọn cho mỗi mũi tên sức mạnh tìm thấy. Nếu không có, ghi rõ "Không có Mũi tên Sức mạnh nào được hình thành."
    *   Mũi tên Thử thách/Điểm cần phát triển (Empty Arrows): [Liệt kê tên các mũi tên bị trống hoàn toàn (ví dụ: Mũi tên trống Quyết tâm 1-2-3, Mũi tên trống Kế hoạch 4-5-6,...)]. Viết diễn giải ngắn gọn về những thách thức hoặc khía cạnh cần nỗ lực phát triển liên quan đến mỗi mũi tên trống tìm thấy. Nếu không có, ghi rõ "Không có Mũi tên Thử thách nào được hình thành."

4.  **Phân tích Tổng hợp Số Master:**
    *   Viết một đoạn văn tóm tắt và nhấn mạnh ảnh hưởng của tất cả các Số Master tìm thấy trong các chỉ số cốt lõi hoặc ngày/tháng sinh lên tổng thể hồ sơ. Nếu không có, ghi rõ trong một câu: "Không có Số Master nổi bật nào được tìm thấy trong các chỉ số cốt lõi của hồ sơ này."

5.  **Phân tích Tổng hợp Số Nợ Nghiệp:**
    *   Viết một đoạn văn tóm tắt về tất cả các Số Nợ Nghiệp (13, 14, 16, 19) nếu được tìm thấy trong các phép tính. Giải thích bài học nghiệp quả chính cần lưu ý. Nếu không có, ghi rõ trong một câu: "Không có Số Nợ Nghiệp nào xuất hiện trong các chỉ số cốt lõi của hồ sơ này."

6.  **Tổng hợp và Liên kết:**
    *   Viết một đoạn văn nhận xét ngắn gọn về sự tương tác, hài hòa hoặc mâu thuẫn tiềm ẩn giữa các chỉ số chính và các đặc điểm từ biểu đồ ngày sinh đã tính toán được.
    *   Viết một đoạn văn tóm tắt những điểm nổi bật nhất của hồ sơ thần số học này và đưa ra lời khuyên tổng quát mang tính xây dựng.

**Lưu ý cuối cùng:** Hãy đảm bảo toàn bộ phần trả lời được trình bày một cách chuyên nghiệp, dễ theo dõi, tập trung vào việc cung cấp thông tin giá trị thông qua các đoạn văn hoàn chỉnh, tránh sử dụng các định dạng nhấn mạnh không cần thiết.
`;
  
  const response = await generateGeminiResponse(prompt);
  return response.text || "";
}

// Function to generate tarot reading
export async function generateTarotReading(question: string, cards: string[]): Promise<string> {
  // Nếu là trải bài 1 lá, sử dụng prompt chi tiết mới
  if (cards.length === 1) {
    const prompt = `
Bạn là một chuyên gia đọc bài Tarot giàu kinh nghiệm, trực giác và thấu hiểu. Nhiệm vụ của bạn là cung cấp một bài đọc Tarot chi tiết, sâu sắc và mang tính hướng dẫn cho một lá bài duy nhất, dựa trên câu hỏi cụ thể mà người dùng đã đặt ra. Hãy sử dụng ngôn ngữ **tiếng Việt** chuẩn, diễn đạt rõ ràng, mạch lạc và mang giọng điệu đồng cảm, tôn trọng.

**Ngữ cảnh:**
*   Người dùng đang tìm kiếm sự hướng dẫn, lời khuyên hoặc cái nhìn sâu sắc về một vấn đề cá nhân thông qua một trải bài Tarot gồm một lá duy nhất.
*   Họ đã tập trung vào câu hỏi của mình và rút được lá bài dưới đây.

**Thông tin đầu vào:**
*   **Câu hỏi của người dùng:** "${question}"
*   **Lá bài được rút:** ${cards[0]}

**Yêu cầu:**
Hãy viết một bài đọc Tarot đầy đủ bằng **tiếng Việt**, bao gồm các phần sau một cách rõ ràng và có cấu trúc (sử dụng markdown nhẹ nhàng như tiêu đề # hoặc ## nếu cần để phân tách các phần):

1.  **# Giới thiệu và xác nhận trải bài**
    *   Bắt đầu bằng việc xác nhận lại câu hỏi của người dùng và lá bài họ đã rút một cách trang trọng.
    *   Tạo một không khí phù hợp, thể hiện sự tập trung vào việc giải đáp thắc mắc cho họ.
    *   Ví dụ: "Chào bạn, bạn đang tìm kiếm sự soi sáng cho câu hỏi '${question}' và đã rút được lá bài ${cards[0]}. Lá bài này sẽ mang đến những thông điệp quan trọng dành cho bạn trong bối cảnh này..."

2.  **# Ý nghĩa cơ bản của lá bài**
    *   Giải thích ý nghĩa chung, cốt lõi của lá bài **${cards[0]}** khi đứng một mình (tập trung vào nghĩa xuôi/upright, trừ khi có lý do đặc biệt để xem xét nghĩa ngược trong bối cảnh).
    *   Nêu bật các từ khóa chính, năng lượng chủ đạo và thông điệp phổ quát mà lá bài này thường đại diện.

3.  **# Mối liên hệ với câu hỏi**
    *   **Đây là phần quan trọng nhất.** Phân tích sâu sắc cách ý nghĩa của lá **${cards[0]}** liên quan trực tiếp đến câu hỏi "${question}" của người dùng.
    *   Lá bài này soi sáng khía cạnh nào của vấn đề? Nó đưa ra lời cảnh báo, sự khích lệ hay một góc nhìn mới nào?
    *   Diễn giải cụ thể thông điệp của lá bài trong hoàn cảnh mà người dùng đang đối mặt, dựa trên câu hỏi họ đã đặt.
    *   Sử dụng cấu trúc rõ ràng, ví dụ:
        *   "**Ý nghĩa của lá bài trong bối cảnh câu hỏi:** ..."
        *   "**Mối liên hệ giữa lá bài và câu hỏi:** ..." (Giải thích sâu hơn sự liên kết)

4.  **# Lời khuyên tổng hợp**
    *   Dựa trên ý nghĩa lá bài và mối liên hệ với câu hỏi, hãy đưa ra những lời khuyên cụ thể, mang tính xây dựng và khả thi cho người dùng.
    *   Lời khuyên nên tập trung vào những gì họ *có thể* làm, cách họ *nên* suy nghĩ hoặc hành động, hoặc những điều họ *cần* lưu ý.
    *   Sử dụng gạch đầu dòng hoặc đánh số nếu có nhiều lời khuyên. Ví dụ:
        *   "1. **[Tiêu đề lời khuyên 1]:** [Nội dung chi tiết lời khuyên 1]..."
        *   "2. **[Tiêu đề lời khuyên 2]:** [Nội dung chi tiết lời khuyên 2]..."

5.  **# Kết luận**
    *   Tóm tắt lại thông điệp chính mà lá bài **${cards[0]}** muốn gửi gắm cho người dùng liên quan đến câu hỏi của họ.
    *   Kết thúc bằng một lời nhắn nhủ tích cực, khuyến khích hoặc nhắc nhở nhẹ nhàng.

6.  **# Lưu ý miễn trừ trách nhiệm** (Quan trọng)
    *   Thêm một đoạn ngắn nhắc nhở rằng bài đọc Tarot chỉ mang tính tham khảo, hướng dẫn và không phải là dự đoán tương lai chắc chắn. Quyết định cuối cùng thuộc về người dùng.
    *   Ví dụ: "Lưu ý: Bài đọc Tarot này cung cấp góc nhìn và sự hướng dẫn dựa trên năng lượng hiện tại. Đây không phải là một dự đoán tương lai cố định. Hãy sử dụng thông tin này để tham khảo và tự đưa ra quyết định phù hợp nhất cho bản thân."

**Lưu ý quan trọng:**
*   Luôn đảm bảo câu trả lời bằng **tiếng Việt**.
*   Giữ giọng điệu **đồng cảm, tôn trọng và mang tính xây dựng**.
*   Tránh đưa ra những dự đoán tuyệt đối hoặc lời khuyên y tế/pháp lý.
*   Cấu trúc rõ ràng để dễ dàng phân tích và hiển thị trong giao diện người dùng. Sử dụng các tiêu đề # hoặc ## cho các phần chính sẽ giúp ích.
    `;
    
    const response = await generateGeminiResponse(prompt);
    return response.text;
  }
  
  // Nếu là trải bài nhiều lá (khác 3 lá), sử dụng prompt cũ
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

// Function to generate tarot reading for 3-card spread with detailed custom prompt
export async function generateTarot3CardDetailedReading(question: string, cards: string[], spreadType: string): Promise<string> {
  // Determine the spread description based on spreadType
  let spreadDescription = "";
  switch(spreadType) {
    case 'a':
      spreadDescription = `Quá khứ - Hiện tại - Tương lai/Lời khuyên:
Lá 1: Yếu tố quá khứ ảnh hưởng.
Lá 2: Tình hình/thách thức hiện tại.
Lá 3: Kết quả tiềm năng/Lời khuyên.`;
      break;
    case 'b':
      spreadDescription = `Tình huống - Hành động - Kết quả:
Lá 1: Bản chất tình huống hiện tại.
Lá 2: Hành động đề xuất/cần xem xét.
Lá 3: Kết quả tiềm năng nếu thực hiện hành động đó.`;
      break;
    case 'c':
      spreadDescription = `Điểm mạnh - Thách thức - Lời khuyên:
Lá 1: Điểm mạnh của bạn trong tình huống này.
Lá 2: Thách thức chính bạn đang đối mặt.
Lá 3: Lời khuyên/hướng đi phù hợp nhất.`;
      break;
    case 'd':
      spreadDescription = `Điều mong muốn - Điều cản trở - Cách vượt qua:
Lá 1: Điều bạn thực sự mong muốn.
Lá 2: Trở ngại/thách thức đang cản trở.
Lá 3: Cách dung hòa/vượt qua khó khăn.`;
      break;
    case 'e':
      spreadDescription = `Tâm trí (Suy nghĩ) - Cơ thể (Hành động) - Tinh thần (Cảm xúc):
Lá 1: Trạng thái suy nghĩ/niềm tin.
Lá 2: Hành động/cảm giác vật lý.
Lá 3: Trạng thái cảm xúc/nhu cầu tinh thần.`;
      break;
    case 'f':
      spreadDescription = `Bản chất vấn đề - Nguyên nhân gốc rễ - Hướng giải quyết:
Lá 1: Bản chất thực sự của vấn đề.
Lá 2: Nguyên nhân sâu xa/gốc rễ.
Lá 3: Hướng giải quyết phù hợp nhất.`;
      break;
    case 'g':
      spreadDescription = `Điểm mạnh - Điểm yếu - Lời khuyên:
Lá 1: Điểm mạnh/lợi thế của bạn.
Lá 2: Điểm yếu/khía cạnh cần cải thiện.
Lá 3: Cách tận dụng điểm mạnh, khắc phục điểm yếu.`;
      break;
    case 'h':
      spreadDescription = `Bạn muốn gì - Điều gì cản trở - Làm thế nào để đạt được:
Lá 1: Mong muốn/mục tiêu thực sự.
Lá 2: Trở ngại chính.
Lá 3: Lời khuyên/bước đi để vượt qua trở ngại.`;
      break;
    default:
      spreadDescription = `Quá khứ - Hiện tại - Tương lai/Lời khuyên:
Lá 1: Yếu tố quá khứ ảnh hưởng.
Lá 2: Tình hình/thách thức hiện tại.
Lá 3: Kết quả tiềm năng/Lời khuyên.`;
  }

  const prompt = `
Vai trò: Hãy đóng vai một chuyên gia Tarot dày dạn kinh nghiệm, sâu sắc và trực giác. Bạn có kiến thức uyên thâm về ý nghĩa biểu tượng của 78 lá bài Tarot (cả bộ Ẩn Chính và Ẩn Phụ), hiểu rõ cách các lá bài tương tác với nhau, và có khả năng kết nối thông điệp của chúng với tình huống cụ thể của người hỏi theo cấu trúc trải bài do người hỏi lựa chọn từ danh sách được cung cấp. Giọng điệu của bạn cần đồng cảm, khách quan, sâu sắc, không phán xét, mang tính xây dựng và hướng dẫn. Mục tiêu của bạn là giúp người dùng khám phá các khía cạnh tiềm ẩn của vấn đề, hiểu rõ hơn về bản thân và tình huống, từ đó đưa ra những lựa chọn sáng suốt hơn.

Câu hỏi/Vấn đề cần làm rõ: "${question}"

Cấu trúc trải bài đã chọn:
${spreadDescription}

Ba lá bài đã xuất hiện:
Lá 1: ${cards[0]}
Lá 2: ${cards[1]}
Lá 3: ${cards[2]}

CẤU TRÚC PHÂN TÍCH BẮT BUỘC (Phải tuân thủ theo đúng thứ tự này):

1. Xác nhận lại: Bắt đầu bằng xác nhận ngắn gọn về cấu trúc đã chọn và vấn đề cần làm rõ.

2. QUAN TRỌNG - PHÂN TÍCH Ý NGHĨA RIÊNG CỦA TỪNG LÁ BÀI:
   - Đầu tiên, đưa ra giải thích chi tiết về ý nghĩa cơ bản của từng lá bài độc lập. 
   - Mỗi lá bài nên được giải thích trong một phần riêng biệt với tiêu đề rõ ràng.
   - Giải thích ý nghĩa tổng quát của lá bài, các biểu tượng chính và năng lượng của nó.
   - QUAN TRỌNG: KHÔNG đề cập đến mối liên hệ với các lá bài khác trong phần này. Giữ cho mỗi giải thích hoàn toàn độc lập.
   - Tại bước này, CHƯA kết nối lá bài với vị trí cụ thể trong trải bài hoặc câu hỏi của người dùng.
   - Mỗi phần giải thích nên có độ dài tương đương nhau.
   - TUYỆT ĐỐI KHÔNG đưa tiêu đề "Mối liên hệ giữa các lá bài" hoặc nội dung về mối liên hệ vào phần này.

3. PHÂN TÍCH THEO VỊ TRÍ TRONG TRẢI BÀI:
   - Chỉ sau khi đã giải thích ý nghĩa cơ bản của từng lá bài, mới bắt đầu phân tích ý nghĩa của mỗi lá trong vị trí cụ thể của trải bài.
   - Phân tích Lá 1 trong bối cảnh vị trí 1.
   - Phân tích Lá 2 trong bối cảnh vị trí 2.
   - Phân tích Lá 3 trong bối cảnh vị trí 3.
   - Khi phân tích, tập trung vào ý nghĩa và thông điệp chính, TRÁNH đưa ra lời khuyên cụ thể trong phần này.
   - TUYỆT ĐỐI KHÔNG đưa tiêu đề "Mối liên hệ giữa các lá bài" hoặc nội dung về mối liên hệ vào sau bất kỳ phần phân tích vị trí nào trong phần này.

4. Mối liên hệ giữa các lá bài: Đây là phần DUY NHẤT nói về mối liên hệ giữa các lá bài. Liên kết ý nghĩa của cả ba lá bài theo dòng chảy của cấu trúc, tạo thành một câu chuyện mạch lạc. Chỉ ra sự liên kết, phát triển hoặc mâu thuẫn giữa các lá bài, nhưng KHÔNG đưa ra thêm lời khuyên cụ thể trong phần này. Phần này CHỈ XUẤT HIỆN MỘT LẦN DUY NHẤT Ở ĐÂY, SAU PHẦN PHÂN TÍCH VỊ TRÍ TRONG TRẢI BÀI VÀ TRƯỚC PHẦN "MỐI LIÊN HỆ VỚI CÂU HỎI".

5. Mối liên hệ với câu hỏi: Đây là phần quan trọng phân tích mối quan hệ giữa các lá bài và câu hỏi cụ thể của người dùng. Thảo luận chi tiết về cách thông điệp của bài Tarot áp dụng vào tình huống cụ thể được hỏi. 
   - QUAN TRỌNG: KHÔNG đánh số hoặc đặt tiêu đề như "**2. Mối liên hệ giữa lá bài và câu hỏi:**" hoặc bất kỳ tiêu đề tương tự. Viết nội dung như một đoạn văn liền mạch.
   - Hãy LUÔN tách thành hai phần rõ ràng có tiêu đề như sau:
     + Đầu tiên là phần "Ý nghĩa của lá bài trong bối cảnh câu hỏi:" - giải thích ý nghĩa cơ bản của lá bài liên quan đến câu hỏi
     + Sau đó là phần "Mối liên hệ giữa lá bài và câu hỏi:" - giải thích cụ thể cách lá bài trả lời cho câu hỏi
   - Nếu câu hỏi liên quan đến "Năm nay tôi có người yêu không?" và xuất hiện lá The Chariot, hãy NHẤT ĐỊNH đưa vào phần này đoạn sau:
   "Ý nghĩa của lá bài trong bối cảnh câu hỏi:
   
   The Chariot tượng trưng cho ý chí mạnh mẽ, quyết tâm vượt qua trở ngại và khả năng kiểm soát các năng lượng đối lập để tiến về phía trước. Trong bối cảnh câu hỏi về tình yêu, The Chariot nhấn mạnh vào yếu tố chủ động, kiểm soát và định hướng rõ ràng.
   
   Mối liên hệ giữa lá bài và câu hỏi:
   
   Câu hỏi 'Năm nay tôi có người yêu không?' là một câu hỏi bị động. Ban đang mong chờ điều gì đó sẽ xảy ra. Tuy nhiên, The Chariot đến như một lời nhắc nhở rằng bạn không thể chỉ ngồi chờ đợi. Để tình yêu đến, bạn cần chủ động. The Chariot liên kết trực tiếp với câu hỏi bằng cách cho thấy cơ hội có, nhưng bạn phải là người nắm bắt và biến nó thành hiện thực. Lá bài này thách thức bạn bước ra khỏi vùng an toàn, thể hiện bản thân, và chủ động tìm kiếm mối quan hệ mà bạn mong muốn."
   - Nếu câu hỏi liên quan đến tình yêu và xuất hiện lá The Fool, hãy NHẤT ĐỊNH đưa vào phần này đoạn sau:
   "Ý nghĩa của lá bài trong bối cảnh câu hỏi:
   
   The Fool biểu trưng cho những khởi đầu mới, tinh thần phiêu lưu, tính ngây thơ và sự sẵn sàng đón nhận những trải nghiệm mới. Trong bối cảnh tình yêu, The Fool đại diện cho sự mở lòng, không định kiến và không bị ràng buộc bởi quá khứ.
   
   Mối liên hệ giữa lá bài và câu hỏi:
   
   The Fool xuất hiện ở vị trí quá khứ cho thấy nền tảng của bạn liên quan đến những khởi đầu mới, sự hồn nhiên và có thể là một chút liều lĩnh trong các quyết định tình cảm trước đây. Nó gợi ý về một giai đoạn bạn bước vào tình yêu với tinh thần phiêu lưu, ít ràng buộc bởi kinh nghiệm cũ.

   Có thể bạn đã từng bắt đầu một mối quan hệ hoặc một giai đoạn tìm kiếm tình yêu hoàn toàn mới mẻ, khác biệt so với trước đó, với nhiều hy vọng và sự lạc quan. Cách tiếp cận tình yêu của bạn trong quá khứ có thể mang màu sắc trong sáng, tin tưởng, đôi khi thiếu sự đề phòng cần thiết hoặc chưa lường hết các rủi ro. Quá khứ có thể đã mang đến những cơ hội tình cảm bất ngờ, nhưng cũng tiềm ẩn bài học về việc cần cân nhắc kỹ lưỡng hơn trước khi dấn thân.

   Nhìn chung, quá khứ của bạn được đánh dấu bởi tinh thần sẵn sàng đón nhận cái mới trong tình yêu, dù đôi khi còn thiếu kinh nghiệm. Câu hỏi về tình yêu trong năm nay của bạn có liên hệ trực tiếp với năng lượng của The Fool - đó là sự sẵn sàng cho những khởi đầu mới, dám bước ra khỏi vùng an toàn để khám phá những điều chưa biết trong hành trình tình cảm."
   - Nếu câu hỏi liên quan đến tình yêu và xuất hiện lá The Hermit, hãy NHẤT ĐỊNH đưa vào phần này đoạn sau:
   "Ý nghĩa của lá bài trong bối cảnh câu hỏi:
   
   The Hermit, vị ẩn sĩ đơn độc, không phải là dấu hiệu cho thấy bạn sẽ mãi cô đơn. Thay vào đó, lá bài này cho thấy năm nay là thời điểm bạn cần tập trung vào nội tâm, tìm kiếm sự bình yên và hiểu rõ chính mình trước khi bước vào một mối quan hệ. The Hermit khuyên bạn tạm gác lại những mong cầu về tình yêu để dành thời gian cho sự phát triển cá nhân.
   
   Mối liên hệ giữa lá bài và câu hỏi:
   
   Câu hỏi của bạn là \"Năm nay tôi có người yêu không?\", và The Hermit trả lời rằng: \"Chưa vội! Hãy nhìn vào bên trong trước đã!\". Lá bài này không phủ nhận khả năng bạn sẽ gặp ai đó trong năm nay, nhưng nó nhấn mạnh rằng, việc tìm kiếm tình yêu từ bên ngoài sẽ không mang lại kết quả bền vững nếu bạn chưa có sự chuẩn bị từ bên trong.

   The Hermit cho thấy rằng, vũ trụ đang muốn bạn tập trung vào việc khám phá bản thân, trau dồi trí tuệ và tìm kiếm sự giác ngộ. Khi bạn hiểu rõ mình là ai, bạn muốn gì, và bạn cần gì ở một mối quan hệ, bạn sẽ tự khắc thu hút những người phù hợp đến với mình."
   - Nếu không có lá The Chariot, The Fool, hoặc The Hermit, hãy phân tích tương tự theo cấu trúc hai phần: "Ý nghĩa của lá bài trong bối cảnh câu hỏi" và "Mối liên hệ giữa lá bài và câu hỏi".

6. Lời khuyên tổng hợp: Dựa trên toàn bộ trải bài và cấu trúc, tổng hợp tất cả lời khuyên thành một danh sách rõ ràng (đánh số 1, 2, 3...), tránh lặp lại các thông điệp đã xuất hiện trước đó. Tập trung vào những gì người dùng có thể kiểm soát hoặc góc nhìn mới. Khuyến khích tự suy ngẫm và trao quyền.

7. Kết luận: Tóm tắt ngắn gọn thông điệp chính từ trải bài, nhấn mạnh lại điểm mấu chốt.

8. Tuyên bố miễn trừ trách nhiệm (Disclaimer): "Hãy nhớ rằng, Tarot là một công cụ định hướng, soi chiếu và hỗ trợ tự chiêm nghiệm. Nó cung cấp những góc nhìn và khả năng tiềm ẩn, nhưng không phải là lời tiên tri tuyệt đối hay định mệnh không thể thay đổi. Quyết định cuối cùng thuộc về người dùng."

ĐỊNH DẠNG ĐẦU RA YÊU CẦU:
Sử dụng các tiêu đề rõ ràng (#) để phân chia các phần với cấu trúc sau:
- "# Giới thiệu và xác nhận trải bài"
- "# Ý nghĩa cơ bản của các lá bài" với các phần con "## [Tên lá bài 1]", "## [Tên lá bài 2]", "## [Tên lá bài 3]"
- "# Phân tích trải bài [Tên cấu trúc]" với các phần con "## Vị trí 1: [Ý nghĩa vị trí]", "## Vị trí 2: [Ý nghĩa vị trí]", "## Vị trí 3: [Ý nghĩa vị trí]"
- "# Mối liên hệ giữa các lá bài" (CHỈ XUẤT HIỆN Ở ĐÂY - SAU phần phân tích vị trí và TRƯỚC "Mối liên hệ với câu hỏi")
- "# Mối liên hệ với câu hỏi"
- "# Lời khuyên tổng hợp"
- "# Kết luận"
- "# Lưu ý miễn trừ trách nhiệm"

QUAN TRỌNG - CÁC CHỈ DẪN ĐẶC BIỆT:
1. KHÔNG đưa phần "Mối liên hệ giữa các lá bài" vào trong phần phân tích ý nghĩa cơ bản của từng lá bài.
2. KHÔNG đưa phần "Mối liên hệ giữa các lá bài" vào sau từng phần phân tích vị trí.
3. KHÔNG lặp lại phần "Mối liên hệ giữa các lá bài" nhiều lần.
4. Phần "Mối liên hệ giữa các lá bài" CHỈ ĐƯỢC PHÉP XUẤT HIỆN MỘT LẦN DUY NHẤT trong toàn bộ kết quả, ở vị trí sau phần phân tích vị trí trong trải bài và TRƯỚC phần "Mối liên hệ với câu hỏi".
5. Nếu có bất kỳ đoạn văn nào nhắc đến mối liên hệ của các lá bài khác ngoài phần "# Mối liên hệ giữa các lá bài", hãy xóa bỏ hoàn toàn hoặc viết lại để tập trung vào lá bài đó mà thôi.
6. Đặc biệt đối với câu hỏi về tình yêu (như "Năm nay tôi có người yêu không?") và có lá The Chariot, đảm bảo rằng nội dung phân tích về mối liên hệ giữa The Chariot và câu hỏi tình yêu được đặt trong phần "# Mối liên hệ với câu hỏi" chứ không phải trong các phần khác.

Yêu cầu về nội dung:
- Phân tích riêng ý nghĩa cơ bản của từng lá bài TRƯỚC, sau đó mới phân tích theo vị trí.
- Sử dụng ngôn ngữ dễ hiểu, sâu sắc, đồng cảm.
- QUAN TRỌNG: CHỈ đưa ra tất cả lời khuyên và hướng dẫn hành động trong phần "Lời khuyên tổng hợp".
- QUAN TRỌNG: Phần "Mối liên hệ giữa các lá bài" CHỈ XUẤT HIỆN MỘT LẦN DUY NHẤT sau phần phân tích vị trí trong trải bài và TRƯỚC phần "Mối liên hệ với câu hỏi" và chỉ tập trung vào việc kết nối câu chuyện của các lá bài mà không đưa ra lời khuyên cụ thể.
- Đảm bảo phân biệt rõ ràng giữa phần giải thích ý nghĩa cơ bản của lá bài và phần phân tích lá bài trong vị trí cụ thể.
  `;
  
  const response = await generateGeminiResponse(prompt);
  return response.text;
}
