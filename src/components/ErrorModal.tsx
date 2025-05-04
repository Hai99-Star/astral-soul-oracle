import React from 'react';
import { AppError, ErrorType } from '@/utils/errorService';

interface ErrorModalProps {
  error: AppError;
  onClose: () => void;
}

// Helper để xác định tiêu đề theo loại lỗi
const getErrorTitle = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.API:
      return "Lỗi API";
    case ErrorType.VALIDATION:
      return "Lỗi dữ liệu";
    case ErrorType.AUTHENTICATION:
      return "Lỗi xác thực";
    case ErrorType.NETWORK:
      return "Lỗi kết nối";
    default:
      return "Lỗi";
  }
};

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-4">
          {getErrorTitle(error.type)}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {error.message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 