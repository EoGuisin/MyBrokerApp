import styled from 'styled-components/native';
import { Animated, StyleSheet, Dimensions } from 'react-native';

export const ContainerMapa = styled(Animated.View)`
  flex: 1;
  justify-content: flex-end;
  background: #F6F8F5;
`;

export const HeaderMapa = styled.View`
  border-right-width: 1px;
  border-right-color: #707070;
  margin-right: 20px;
  margin-top: 10px;
`;

export const AnimaView = styled(Animated.View)``;

export const TopMapa = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ReturnMenu = styled.TouchableOpacity`
`;

export const ButtomVoltarMapa = styled.TouchableOpacity`
  margin-left: 20px;
  border-color: #000;
  border-width: 1px;
  border-radius: 10px;
  background-color: #8b8b8b;
`;

export const ButtomVoltarTextMapa = styled.Text`
  font-size: 24px;
  letter-spacing: 3.2px;
  color: #FFF;
  margin-bottom: 5px;
  margin-right: 10px;
  margin-left: 5px;
`;

export const TabScroll = styled(Animated.ScrollView)`
  margin-bottom: 10px;
`;

export const DescriptionUnidade = styled.View`
  background: #FFF;
  marginHorizontal: 20px;
  border: 0.5px;
  border-color: #808080;
`;

export const RenderText = styled.Text`
  font-size: 14px;
`;

export const ReservaouVender = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ReservaView = styled(Animated.View)``;

export const ReservaButtom = styled.TouchableOpacity`
  width: 110px;
  margin-right: 15px;
  padding: 8px;
  border: 1px;
  border-color: #67606A;
  align-items: center;
`;

export const ButtomText = styled.Text`
  font-size: 14px;
  letter-spacing: 2.2px;
  color: #fff;
  text-align: center;
`;

export const TabelaVendaView = styled(Animated.View)``;

export const TabelaButtom = styled.TouchableOpacity`
  width: 123px;
  padding: 8px;
  border: 1px;
  border-color: #67606A;
  align-items: center;
`;

export const TitleLoteAnimado = styled(Animated.Text)`
  font-size: 25px;
  text-align: right;
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const ContainerScroll = styled(Animated.View)`
`;

export const ViewConfirmaButtom = styled.View`
  border-color: #000;
  border-width: 1px;
  border-radius: 10px;
  background-color: #8b8b8b;
`;

export const ConfirmaButtom = styled.TouchableWithoutFeedback``;

export const ConfirmaButtomText = styled.Text`
  font-size: 24px;
  color: #FFF;
  letter-spacing: 3.2px;
  margin-bottom: 5px;
  margin-right: 10px;
  margin-left: 5px;
`;

export const ViewListaButttom = styled(Animated.View)`
  border-color: #000;
  border-width: 1px;
  border-radius: 10px;
  background-color: #8b8b8b;
`;

export const ListaButtom = styled.TouchableWithoutFeedback``;

export const ListaButtomText = styled.Text`
  font-size: 24px;
  color: #fff;
  letter-spacing: 3.2px;
  margin-bottom: 5px;
  margin-right: 10px;
  margin-left: 5px;
`;

export const FooterButtom = styled.View`
  width: ${Dimensions.get('screen').width - 40}
  margin-horizontal: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
`;

export const IndicatorView = styled.View`
  flex-direction: row;
`;