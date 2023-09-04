import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const BotaoAlterar = styled.TouchableOpacity`
  background-color: #0e4688;
  width: ${Dimensions.get('window').width - 20}px;
  height: 50px;
  margin-top: 24px;
  border: 1px solid #0e4688;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const BotaoAlterarTexto = styled.Text`
  color: #FFFFFF;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  text-align-vertical: center;
`;