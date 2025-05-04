import { GeminiApiResponse } from '@/types/api';
import { GEMINI_API_KEY, GEMINI_API_URL } from '@/constants/apiKeys';
import errorService, { ErrorType } from '@/utils/errorService';

/**
 * Gọi API Gemini với prompt
 * @param prompt Text hoặc JSON prompt để gửi đến API
 * @returns Response từ API
 */
export async function callGeminiApi(prompt: string): Promise<GeminiApiResponse> {
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
      const validationError = errorService.createError(
        ErrorType.VALIDATION,
        "Prompt không đúng định dạng JSON, đang gửi dưới dạng text",
        e,
        { prompt: prompt.substring(0, 100) + "..." }
      );
      // Đây không phải lỗi nghiêm trọng nên chỉ log nó, không throw
      errorService.logError(validationError, { silent: false });
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
        ],
        generationConfig: {
          temperature: 0 // Set temperature to 0 for deterministic results
        }
      });
    } else {
      // For regular text prompts, use the standard format
      requestBody = JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0 // Set temperature to 0 for deterministic results
        }
      });
    }
    
    // Thông tin context để ghi log và debug
    const apiContext = {
      requestType: isJsonPrompt ? "JSON" : "Text",
      promptLength: prompt.length,
      apiUrl: GEMINI_API_URL,
      timestamp: new Date().toISOString(),
      temperature: 0 // Log the temperature setting
    };
    
    // Log request với context rõ ràng
    console.log("Sending request to Gemini API:", apiContext);
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.text();
        
        // Tạo thông tin chi tiết về lỗi API
        const errorContext = {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData.substring(0, 200), // Cắt bớt nếu quá dài
          ...apiContext
        };
        
        // Tạo lỗi với thông tin phù hợp
        throw errorService.createError(
          ErrorType.API,
          `API responded with status: ${response.status} - ${response.statusText}`,
          new Error(errorData),
          errorContext
        );
      }

      const data = await response.json();
      
      // Log the response structure for debugging
      console.log("API Response received, length:", JSON.stringify(data).length);
      
      // Handle the response format from Gemini API
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Không thể tạo kết quả từ API. Vui lòng thử lại sau.";
      
      // Kiểm tra nếu không có text trả về, đây có thể là lỗi về định dạng API response
      if (!text || text === "Không thể tạo kết quả từ API. Vui lòng thử lại sau.") {
        // Log lỗi này dưới dạng warning 
        const warningContext = {
          responseStructure: JSON.stringify(data).substring(0, 200) + "...",
          ...apiContext
        };
        
        errorService.logError(
          errorService.createError(
            ErrorType.API, 
            "API trả về kết quả không có nội dung text", 
            null, 
            warningContext
          ),
          { includeStackTrace: false }
        );
      }
      
      return { text };
    } catch (error) {
      // Nếu lỗi là AppError, ném lại 
      if (error && 'type' in error) {
        throw error;
      }
      
      // Nếu là lỗi network
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw errorService.createError(
          ErrorType.NETWORK,
          "Không thể kết nối đến Gemini API. Vui lòng kiểm tra kết nối mạng.",
          error,
          apiContext
        );
      }
      
      // Mặc định là lỗi API
      throw errorService.createError(
        ErrorType.API,
        "Lỗi khi gọi Gemini API",
        error,
        apiContext
      );
    }
  } catch (error) {
    // Log lỗi với đầy đủ thông tin
    if ('type' in error) {
      errorService.logError(error);
    } else {
      errorService.logError(
        errorService.createError(
          ErrorType.UNKNOWN,
          "Lỗi không xác định khi gọi Gemini API",
          error
        )
      );
    }
    
    // Ném lại lỗi sau khi đã log
    throw error;
  }
} 