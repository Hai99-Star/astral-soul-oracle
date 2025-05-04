import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const HeaderContent = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 64px;
    height: 64px;
    color: ${({ theme }) => theme.colors.secondary.base};
  }
`;

export const HeaderTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.secondary.base};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const HeaderDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  max-width: 600px;
  margin: 0 auto;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.base}80;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[2]};
  transition: color ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.timing.ease};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary.base};
  }
  
  svg {
    margin-right: ${({ theme }) => theme.spacing[1]};
  }
`; 