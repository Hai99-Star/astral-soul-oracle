import React, { Component, ErrorInfo, ReactNode } from 'react';
import errorService, { ErrorType } from '@/utils/errorService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component bắt các lỗi xảy ra trong cây component con
 * và hiển thị fallback UI thay vì crash toàn bộ ứng dụng
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để hiển thị fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log lỗi vào service error
    const context = {
      componentStack: errorInfo.componentStack,
    };
    
    errorService.logError(
      errorService.createError(ErrorType.UNKNOWN, error.message, error, context)
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI tùy chỉnh hoặc mặc định
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary-fallback">
          <div className="max-w-md mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mt-10">
            <h2 className="text-xl font-medium text-red-800 dark:text-red-300 mb-4">
              Đã xảy ra lỗi không mong muốn
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              Ứng dụng đã gặp lỗi không xác định. Vui lòng thử tải lại trang.
            </p>
            {this.state.error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800/50 text-sm font-mono overflow-auto max-h-32 text-red-800 dark:text-red-300">
                {this.state.error.message}
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC để bọc component với ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
}

export default ErrorBoundary; 