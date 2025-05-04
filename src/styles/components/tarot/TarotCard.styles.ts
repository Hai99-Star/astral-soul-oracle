import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(240, 180, 100, 0.4), 0 0 20px rgba(240, 180, 100, 0.2); }
  50% { box-shadow: 0 0 10px rgba(240, 180, 100, 0.6), 0 0 30px rgba(240, 180, 100, 0.3); }
  100% { box-shadow: 0 0 5px rgba(240, 180, 100, 0.4), 0 0 20px rgba(240, 180, 100, 0.2); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  animation: ${fadeIn} 0.8s ease-out forwards;
  padding: 10px;
`;

export const CardWrapper = styled.div<{ isRevealed: boolean; position: number }>`
  perspective: 1000px;
  width: 100%;
  max-width: 240px;
  animation-delay: ${({ position }) => `${position * 0.3}s`};
  cursor: ${({ isRevealed }) => (isRevealed ? 'default' : 'pointer')};
  transition: transform 0.3s ease-out;
  
  &:hover {
    transform: ${({ isRevealed }) => (isRevealed ? 'scale(1)' : 'scale(1.05) translateY(-10px)')};
  }
`;

export const CardInner = styled.div<{ isRevealed: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 360px;
  text-align: center;
  transition: transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  transform: ${({ isRevealed }) => (isRevealed ? 'rotateY(180deg)' : 'rotateY(0)')};
  animation: ${({ isRevealed }) => (isRevealed ? floatAnimation : 'none')} 6s infinite ease-in-out;
`;

export const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  transition: all 0.5s ease;
`;

export const CardBack = styled(CardSide)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.card.dark}, ${({ theme }) => theme.colors.secondary.dark});
  border: 2px solid ${({ theme }) => theme.colors.primary.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.duration.base} ${({ theme }) => theme.transitions.timing.ease};

  &:hover {
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary.light}, 0 0 30px rgba(255, 215, 120, 0.3);
    border-color: ${({ theme }) => theme.colors.primary.light};
  }
`;

export const CardBackDesign = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.primary.dark}80;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.card.dark}80, ${({ theme }) => theme.colors.secondary.dark}80);
  backdrop-filter: blur(4px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const MysticalSymbol = styled.div`
  width: 60%;
  height: 60%;
  color: ${({ theme }) => theme.colors.primary.base};
  opacity: 0.9;
  transition: transform 0.5s ease, opacity 0.5s ease;
  
  &:hover {
    transform: rotate(180deg);
    opacity: 1;
  }
`;

export const CardFront = styled(CardSide)`
  background: ${({ theme }) => theme.colors.card.base};
  transform: rotateY(180deg);
  border: 2px solid ${({ theme }) => theme.colors.primary.base};
  display: flex;
  flex-direction: column;
  animation: ${glowPulse} 3s infinite ease-in-out;
`;

export const CardImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: filter 0.5s ease;
  
  &:hover {
    filter: brightness(1.1) contrast(1.05);
  }
`;

export const CardTitle = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]};
  text-align: center;
  background: linear-gradient(to bottom, 
    ${({ theme }) => theme.colors.card.dark},
    ${({ theme }) => `${theme.colors.card.dark}E6`}
  );
  border-top: 1px solid ${({ theme }) => theme.colors.primary.dark};
  backdrop-filter: blur(5px);
  
  h5 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    color: ${({ theme }) => theme.colors.primary.light};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    text-shadow: 0 0 5px rgba(255, 215, 120, 0.5);
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 0;
    letter-spacing: 0.3px;
    font-weight: 500;
  }
`; 