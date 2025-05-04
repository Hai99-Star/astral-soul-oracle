import styled, { keyframes } from 'styled-components';

const rotateStar = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

export const MysticSymbolWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  animation: ${pulse} 3s ease-in-out infinite;
`;

export const MysticSymbolInner = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.primary.base};
  
  svg {
    animation: ${rotateStar} 24s linear infinite;
    
    .tarot-star-path {
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.primary.light};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  letter-spacing: 0.05em;
  margin-top: ${({ theme }) => theme.spacing[2]};
  margin-bottom: 0;
`; 