import React from 'react';
import {
  LoadingContainer,
  MysticSymbolWrapper,
  MysticSymbolInner,
  LoadingText
} from '@/styles/components/tarot/LoadingStar.styles';

interface LoadingStarProps {
  text?: string;
}

/**
 * Component cho animation ngôi sao loading
 */
const LoadingStar: React.FC<LoadingStarProps> = ({ text = "Đang tải..." }) => (
  <LoadingContainer>
    <MysticSymbolWrapper>
      <MysticSymbolInner>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Ngôi sao 4 cánh chính */}
          <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" className="tarot-star-path" />
          
          {/* Thêm chi tiết cho ngôi sao - vòng tròn nhỏ ở giữa */}
          <circle cx="12" cy="12" r="2" className="tarot-star-path" strokeWidth="1" />
          
          {/* Thêm các đường nét mềm mại xung quanh */}
          <circle cx="12" cy="12" r="6" className="tarot-star-path" strokeWidth="0.5" strokeDasharray="1,3" />
          
          {/* Thêm các chi tiết phức tạp hơn - các đường cong trang trí */}
          <path d="M12 4 Q14 8 17 9 Q13 11 12 15 Q10 11 7 9 Q11 8 12 4" className="tarot-star-path" strokeWidth="0.4" />
          <path d="M12 9 Q13 10 14 12 Q13 14 12 15 Q11 14 10 12 Q11 10 12 9" className="tarot-star-path" strokeWidth="0.3" />
          
          {/* Thêm các điểm nhỏ lấp lánh */}
          <circle cx="4" cy="4" r="0.2" className="tarot-star-path" strokeWidth="0.2" fill="currentColor" />
          <circle cx="20" cy="4" r="0.2" className="tarot-star-path" strokeWidth="0.2" fill="currentColor" />
          <circle cx="4" cy="20" r="0.2" className="tarot-star-path" strokeWidth="0.2" fill="currentColor" />
          <circle cx="20" cy="20" r="0.2" className="tarot-star-path" strokeWidth="0.2" fill="currentColor" />
          
          {/* Thêm các đường trang trí thêm */}
          <path d="M3 8 Q8 10 8 12 Q8 14 3 16" className="tarot-star-path" strokeWidth="0.3" strokeDasharray="0.5,2" />
          <path d="M21 8 Q16 10 16 12 Q16 14 21 16" className="tarot-star-path" strokeWidth="0.3" strokeDasharray="0.5,2" />
        </svg>
      </MysticSymbolInner>
    </MysticSymbolWrapper>
    <LoadingText>{text}</LoadingText>
  </LoadingContainer>
);

export default LoadingStar; 