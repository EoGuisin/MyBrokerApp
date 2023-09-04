import { Animated, Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const EsqueciSenha = styled.TouchableWithoutFeedback``;

export const EsqueciSenhaTexto = styled.Text`
  color: #26A77C;
  alignSelf: flex-end;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 5px;
`;

export const LoginButtom = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
`;

export const Header = styled.View``;

export const Footer = styled.View``;

export const ContentFooter = styled.View``;

export const BotaoEntrar = styled.View`
  background-color: #26A77C;
  width: ${Dimensions.get('window').width - 29}px;
  height: 50px;
  margin-top: 24px;
  border: 1px solid #26A77C;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const BotaoEntrarTexto = styled.Text`
  color: #FFFFFF;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  text-align-vertical: center;
`;

export const BotaoCriarConta = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
`;

export const CriarConta = styled.View`
  background-color: #F6F7F8;
  width: ${Dimensions.get('window').width - 29}px;
  height: 50px;
  margin-top: 8px;
  border: 1px solid #F3F2F1;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const CriarContaTexto = styled.Text`
  color: #26A77C;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  text-align-vertical: center;
`;

export const BotaoTermos = styled.TouchableWithoutFeedback`
  flex: 1;
`;

export const Termos = styled.View`
  align-items: center;
  opacity: 0.7;
  margin-top: 32px; 
  margin-bottom: 35px;
`;

export const TermosTexto = styled.Text`
  color: #26A77C;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-decoration-line: underline;
`;

export const Versao = styled.View`
  align-items: center;
  opacity: 0.7;
  margin-bottom: 35px;
`;

export const VersaoTexto = styled.Text`
  color: #26A77C;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
`;