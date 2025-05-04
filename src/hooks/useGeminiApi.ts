import { useState, useCallback } from 'react';
import { callGeminiApi } from '@/services/api/geminiClient';
import { useErrorHandler } from './useErrorHandler';

/**
 * Hook để tương tác với Gemini API
 */
export function useGeminiApi() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { handleApiError, executeWithErrorHandling } = useErrorHandler();

  /**
   * Gửi prompt đến Gemini API
   */
  const sendPrompt = useCallback(async (prompt: string) => {
    setLoading(true);
    setResponse(null);
    
    const result = await executeWithErrorHandling(
      async () => {
        const response = await callGeminiApi(prompt);
        return response.text;
      },
      'Không thể kết nối với AI',
      { promptLength: prompt.length }
    );
    
    if (result) {
      setResponse(result);
    }
    
    setLoading(false);
    return result;
  }, [executeWithErrorHandling]);

  /**
   * Gửi prompt có cấu trúc JSON đến Gemini API
   */
  const sendJsonPrompt = useCallback(async (promptData: Record<string, any>) => {
    try {
      const jsonPrompt = JSON.stringify(promptData);
      return await sendPrompt(jsonPrompt);
    } catch (error) {
      handleApiError(
        error,
        'Lỗi khi xử lý dữ liệu JSON',
        { promptData }
      );
      setLoading(false);
      return null;
    }
  }, [sendPrompt, handleApiError]);

  /**
   * Xóa response hiện tại
   */
  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return {
    loading,
    response,
    sendPrompt,
    sendJsonPrompt,
    clearResponse
  };
} 