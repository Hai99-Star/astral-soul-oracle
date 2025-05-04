import { useCallback } from 'react';
import { useError } from '@/contexts/ErrorContext';
import errorService, { ErrorType, AppError } from '@/utils/errorService';

/**
 * Hook tùy chỉnh để xử lý lỗi trong components
 * Cung cấp các hàm tiện ích để:
 * - Xử lý lỗi API
 * - Xử lý lỗi validation
 * - Hiển thị lỗi toàn cục
 */
export function useErrorHandler() {
  const { handleApiError, addError, setGlobalError } = useError();

  /**
   * Xử lý và ghi log lỗi trong các hàm try/catch
   */
  const handleError = useCallback((error: any, customMessage?: string, context?: Record<string, any>): AppError => {
    // Xác định loại lỗi
    const errorType = errorService.classifyError(error);
    
    // Tạo lỗi với context
    const appError = errorService.createError(
      errorType,
      customMessage || 'Đã xảy ra lỗi không mong muốn',
      error,
      context
    );
    
    // Thêm lỗi vào context và hiển thị toast
    addError(appError);
    
    return appError;
  }, [addError]);

  /**
   * Xử lý lỗi validation từ form
   */
  const handleValidationError = useCallback((
    fieldErrors: Record<string, string>,
    formContext?: Record<string, any>
  ): AppError => {
    const errorMessage = 'Vui lòng kiểm tra lại thông tin nhập vào';
    
    const appError = errorService.createError(
      ErrorType.VALIDATION,
      errorMessage,
      new Error('Form validation failed'),
      {
        fieldErrors,
        ...formContext
      }
    );
    
    addError(appError);
    return appError;
  }, [addError]);

  /**
   * Hiển thị lỗi toàn cục (ví dụ: lỗi phiên, lỗi hệ thống)
   */
  const showGlobalError = useCallback((
    message: string,
    errorType: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, any>
  ): void => {
    const appError = errorService.createError(
      errorType,
      message,
      null,
      context
    );
    
    setGlobalError(appError);
  }, [setGlobalError]);

  /**
   * Thực thi một hàm async và tự động xử lý lỗi
   */
  const executeWithErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    errorMessage: string,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      return await asyncFunction();
    } catch (error) {
      handleError(error, errorMessage, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleValidationError,
    showGlobalError,
    executeWithErrorHandling
  };
} 