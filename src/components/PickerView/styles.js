import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const AnimaView = styled(Animated.View)``;

export const Title = styled.Text`
  font-size: 14px;
  margin-top: 3px;
  margin-bottom: 2px;
  color: #8d4055;
  letter-spacing: 3.2px;
  text-align: left;
`;

export const Borda = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
`;

export const Alinha = styled.View`
  align-items: flex-end;
`;