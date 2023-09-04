import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Passwords = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  align-items: flex-end;
  padding: 5px 15px;
  margin-left: 29px;
  margin-right: 29px;
  margin-top: 8px;
  border: 1px solid #137CBD75;
  border-radius: 10px;
`;

export const Password = styled.Text`
  font-size: 16px;
  color: #4A4A4A;
  margin-bottom: 11px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

export const PasswordText = styled.Text`
  color: #4A4A4A;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  margin-left: 0;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

export const TextAndIcon = styled.View`
  flex-direction: row;
  margin-right: 24px;
`;