import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Users = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  align-items: flex-end;
  padding: 5px 15px;
  margin-left: 29px;
  margin-right: 29px;
  border: 1px solid #137CBD75;
  border-radius: 10px;
`;

export const User = styled.Text`
  font-size: 16px;
  color: #4A4A4A;
  margin-bottom: 11px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

export const UserText = styled.TextInput`
  color: #4A4A4A;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  margin-left: 0;
  font-style: normal;
  font-weight: normal;
`;

export const TextAndIcon = styled.View`
  flex-direction: row;
  margin-right: 24px;
`;