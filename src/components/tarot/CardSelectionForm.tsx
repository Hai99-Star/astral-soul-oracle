import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPREAD_TYPES } from '@/types/tarot';

interface CardSelectionFormProps {
  question: string;
  onQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCardCount: number;
  isDisabled: boolean;
  selectedSpreadType: string;
  onSpreadTypeChange: (value: string) => void;
  onStartReading: () => void;
}

/**
 * Component hiển thị form chọn thông tin trước khi đọc bài
 */
const CardSelectionForm: React.FC<CardSelectionFormProps> = ({
  question,
  onQuestionChange,
  selectedCardCount,
  isDisabled,
  selectedSpreadType,
  onSpreadTypeChange,
  onStartReading
}) => {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <label htmlFor="question" className="block text-sm font-medium text-foreground mb-1">
          Điều bạn muốn tìm hiểu hoặc câu hỏi của bạn
        </label>
        <input
          type="text"
          id="question"
          className="mystical-input"
          placeholder="Nhập câu hỏi hoặc lĩnh vực bạn muốn được soi sáng..."
          value={question}
          onChange={onQuestionChange}
          disabled={isDisabled}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Ví dụ: "Hướng đi nào phù hợp với sự nghiệp của tôi?" hoặc "Tình hình tài chính của tôi trong 3 tháng tới?"
        </p>
      </div>

      {selectedCardCount === 3 && !isDisabled && (
        <div className="max-w-2xl mx-auto">
          <label htmlFor="spread-type" className="block text-sm font-medium text-foreground mb-1">
            Chọn loại trải bài
          </label>
          <Select
            value={selectedSpreadType}
            onValueChange={onSpreadTypeChange}
          >
            <SelectTrigger className="mystical-input">
              <SelectValue placeholder="Chọn loại trải bài" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SPREAD_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Loại trải bài sẽ ảnh hưởng đến cách diễn giải ý nghĩa của mỗi lá bài.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onStartReading}
          className="bg-secondary hover:bg-secondary/90 text-white font-medium px-8 py-3"
          disabled={!question}
        >
          Xáo Bài và Bắt Đầu
        </Button>
      </div>
    </div>
  );
};

export default CardSelectionForm; 