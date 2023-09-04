import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Top = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ButtonVoltar = styled.TouchableWithoutFeedback``;

export const ViewButtonVoltar = styled.View`
  border-top-width: 1px;
  border-left-width: 1px;
  border-color: rgba(0, 0, 0, 1);
  border-radius: 4px;
  padding: 5px;
  margin-left: 20px;
`;

export const ViewReturnMenu = styled.View``;

export const ButtonVoltarText = styled.Text`
  font-size: 20px;
  letter-spacing: 3.2px;
  margin-bottom: 5px;
  margin-right: 10px;
  margin-left: 5px;
`;

export const ReturnMenu = styled.TouchableWithoutFeedback``;

export const Logo = styled.Image`
  height: 39px;
  width: 80px;
`;
