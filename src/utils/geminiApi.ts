
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

// Function to generate numerology reading
export async function generateNumerologyReading(name: string, birthDate: string): Promise<string> {
  const prompt = `
    Hãy phân tích thần số học cho người có thông tin sau:
    Tên đầy đủ: ${name}
    Ngày sinh: ${birthDate}
    
    Phân tích chi tiết về:
    1. Con số đường đời và ý nghĩa
    2. Con số linh hồn và đặc điểm
    3. Con số sứ mệnh và ý nghĩa
    4. Con số nhân cách và đặc điểm
    
    Đối với mỗi con số, đưa ra số cụ thể (từ 1-9) và diễn giải chi tiết về ý nghĩa. Trả về kết quả dưới dạng nhiều đoạn văn ngắn với ngôn ngữ huyền bí nhưng dễ hiểu và cụ thể cho người này.
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
