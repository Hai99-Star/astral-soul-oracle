import React from 'react';
import AstrologyIcon from '../AstrologyIcon';
import {
  HeaderContainer,
  HeaderContent,
  IconWrapper,
  HeaderTitle,
  HeaderDescription,
  BackButton
} from '@/styles/components/tarot/TarotHeader.styles';

interface TarotHeaderProps {
  showIntroduction: boolean;
  readingComplete: boolean;
  onToggleIntroduction: () => void;
}

/**
 * Component hiển thị header của phần Tarot
 */
const TarotHeader: React.FC<TarotHeaderProps> = ({
  showIntroduction,
  readingComplete,
  onToggleIntroduction
}) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <IconWrapper>
          <AstrologyIcon />
        </IconWrapper>
        <HeaderTitle>Tarot</HeaderTitle>
        <HeaderDescription>
          Khám phá thông điệp từ lá bài Tarot để soi sáng con đường của bạn
        </HeaderDescription>
      </HeaderContent>
      
      {/* Nếu đang ở trang giới thiệu, hiển thị nút "Quay lại" */}
      {!showIntroduction && !readingComplete && (
        <BackButton onClick={onToggleIntroduction}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Quay lại
        </BackButton>
      )}
    </HeaderContainer>
  );
};

export default TarotHeader; 