/**
 * Error Service - Xử lý và logging lỗi một cách nhất quán
 */

// Định nghĩa các loại lỗi khác nhau
export enum ErrorType {
  API = 'API_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// Interface mô tả cấu trúc của AppError
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  timestamp: Date;
  context?: Record<string, any>;
}

// Tùy chọn logging lỗi
interface LogOptions {
  silent?: boolean;
  includeStackTrace?: boolean;
  additionalContext?: Record<string, any>;
}

const defaultLogOptions: LogOptions = {
  silent: false,
  includeStackTrace: true,
  additionalContext: {},
};

/**
 * Tạo và format một đối tượng AppError
 */
export function createError(
  type: ErrorType,
  message: string,
  originalError?: any,
  context?: Record<string, any>
): AppError {
  return {
    type,
    message,
    originalError,
    timestamp: new Date(),
    context,
  };
}

/**
 * Phân loại lỗi dựa trên đối tượng lỗi gốc
 */
export function classifyError(error: any): ErrorType {
  if (error?.name === 'TypeError' && error.message?.includes('Network')) {
    return ErrorType.NETWORK;
  }
  
  if (error?.response?.status === 401 || error?.status === 401) {
    return ErrorType.AUTHENTICATION;
  }
  
  if (error?.response?.status === 400 || error?.status === 400) {
    return ErrorType.VALIDATION;
  }
  
  if (error?.response || error?.request) {
    return ErrorType.API;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Log lỗi ra console với format rõ ràng
 */
export function logError(error: AppError, options: LogOptions = {}): void {
  const opts = { ...defaultLogOptions, ...options };
  if (opts.silent) return;
  
  const timestamp = error.timestamp.toISOString();
  const context = { ...(error.context || {}), ...(opts.additionalContext || {}) };
  
  // Tạo nhóm log cho lỗi
  console.group(`🛑 [${error.type}] ${timestamp}`);
  console.error(`📌 Message: ${error.message}`);
  
  if (Object.keys(context).length > 0) {
    console.log('📊 Context:', context);
  }
  
  if (error.originalError && opts.includeStackTrace) {
    console.error('🔍 Original Error:', error.originalError);
    if (error.originalError.stack) {
      console.log('📚 Stack:', error.originalError.stack);
    }
  }
  
  console.groupEnd();
}

/**
 * Hàm trợ giúp để xử lý lỗi từ API, phân loại và log
 */
export function handleApiError(error: any, customMessage?: string, context?: Record<string, any>): AppError {
  const errorType = classifyError(error);
  
  let message = customMessage || 'Đã xảy ra lỗi khi gọi API';
  if (errorType === ErrorType.NETWORK) {
    message = customMessage || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
  } else if (errorType === ErrorType.AUTHENTICATION) {
    message = customMessage || 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.';
  }
  
  const appError = createError(errorType, message, error, context);
  logError(appError);
  
  return appError;
}

/**
 * Hàm trợ giúp để xử lý lỗi validation
 */
export function handleValidationError(error: any, customMessage?: string, context?: Record<string, any>): AppError {
  const appError = createError(
    ErrorType.VALIDATION,
    customMessage || 'Dữ liệu không hợp lệ',
    error,
    context
  );
  logError(appError);
  
  return appError;
}

export default {
  createError,
  classifyError,
  logError,
  handleApiError,
  handleValidationError,
  ErrorType,
}; 