import { Animated, Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const AlinhamentoHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContentQuadroResumo = styled.View`
`;

export const LogoView = styled.View`
  flex: 1;
  position: absolute;
  justify-content: flex-start;
  align-items: flex-start; 
`;

export const QuadroResumoDoCorretor = styled(Animated.ScrollView)``;

export const CircleScrollTo = styled.View`
  flex-direction: row;
  background-color: #ccc;
  padding-top: 10px;
  padding-bottom: 50px;
  padding-right: 30px;
  justify-content: flex-end;
`;

export const CircleItem = styled.TouchableOpacity`
    width: 20px;
    height: 5px;
    border-radius: 2px;
    border-width: 1px;
    border-color: #808080;
    margin-left: 10px;
    background-color: #FFF;
`;

export const InformacoesSuperior = styled.View`
  flex-direction: row; 
  margin-bottom: 8px;
  justify-content: space-between;
`;

export const InformacoesInferior = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const TotalEmVendas = styled.View`
  background-color: #72B35A; 
  padding-vertical: 16px;
  padding-horizontal: 8px;
  width: ${Dimensions.get('window').width * 0.5 - 30}px;
  height: 67px;
  border-width: 1px; 
  border-color: #E2F2E3;
`;

export const TotalEmComissao = styled.View`
  backgroundColor: #72B35A; 
  padding-vertical: 16px;
  padding-horizontal: 8px;
  width: ${Dimensions.get('window').width * 0.5 - 30}px;
  height: 67px; 
  border-width: 1px; 
  border-color: #E2F2E3;
`;

export const TotalDeAprovacao = styled.View`
  backgroundColor: #72B35A; 
  padding-vertical: 16px;
  padding-horizontal: 8px;
  width: ${Dimensions.get('window').width * 0.4 - 30}px; 
  height: 67px; 
  margin-right: 8px; 
  border-width: 1px; 
  border-color: #E2F2E3;
`;

export const PropostasAtivas = styled.View`
  backgroundColor: #72B35A; 
  padding-vertical: 16px;
  padding-horizontal: 8px;
  width: ${Dimensions.get('window').width * 0.4 - 30}px;
  height: 67px; 
  margin-right: 8px; 
  border-width: 1px; 
  border-color: #E2F2E3;
`;

export const Vendas = styled.View`
  backgroundColor: #72B35A; 
  padding-vertical: 16px;
  padding-horizontal: 8px;
  width: ${Dimensions.get('window').width * 0.25 - 30}px; 
  height: 67px;
  border-width: 1px; 
  border-color: #E2F2E3;
`;

export const TituloInfo = styled.Text`
  font-style: normal; 
  font-weight: 500; 
  font-size: 8px;
  color: #FFFFFF; 
  margin-vertical: 0px; 
  margin-horizontal: 4px; 
  align-self: flex-start;
`;

export const DescricaoInfo = styled.Text`
  font-style: normal; 
  font-weight: 500; 
  font-size: 14px; 
  color: #F6F8F5; 
  margin-vertical: 0px; 
  margin-horizontal: 4px; 
  align-self: flex-start;
`;

export const ContainerOpcoesMenu = styled(Animated.View)`
  flex: 1;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: -30px;
`;

export const ScrollContainerOpcoesMenu = styled.ScrollView.attrs({
  contentContainerStyle: {},
  showsVerticalScrollIndicator: false,
})``;

export const OpcoesMenu = styled(Animated.View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const AtividadesRecentes = styled.View`
  background-color: #F6F8F5; 
  margin-top: 20px;
`;

export const AlinhamentoDoIcone = styled.View`
  align-items: center; 
  justify-content: center;
`;

export const AjusteDaPosicaoDoUltimoItem = styled.View`
  width: 100px;
  margin-right: 8px;
`;

export const Atendente = styled.View`
  width: 100%;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E2F2E3; 
  margin-bottom: 8px;
  padding-left: 10px;
  padding-vertical: 20px;
  border-radius: 10px;
`;
