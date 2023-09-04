
import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';

import Boletos from './pages/Formularios/Boletos';
import ContratosPendentes from './pages/Formularios/ContratosPendentes';
import Configuracoes from './pages/Configuracoes';
import ConfiguracoesFunilDeVendas from './pages/Configuracoes/FunilDeVendas';
import CriarSenha from './pages/Formularios/CriarSenha';
import DadosCliente from './pages/Formularios/DadosCliente';
import DadosUsuario from './pages/Formularios/DadosUsuario';
import DemonstrativoIR from "./pages/Formularios/DemonstrativoIR";
import Disponibilidade from './pages/Formularios/Disponibilidade';
import Empreendimento from './pages/Formularios/Empreendimento';
import EsqueceuSenha from './pages/Formularios/EsqueceuSenha';
import Informativos from './pages/Formularios/Informativos';
import Intermediacao from './pages/Formularios/Intermediacao';
import Leads from './pages/Formularios/Leads';
import Login from '~/pages/Formularios/Login';
import Menu from './pages/Menu';
import MinhasReservas from './pages/Formularios/MinhaReservas';
import OpcoesContratos from './pages/Formularios/OpcoesContratos';
import Pagamentos from './pages/Formularios/Pagamentos';
import Permissoes from './pages/Formularios/PermissoesDeUsuario';
import PropostaDePagamento from './pages/Formularios/PropostaDePagamento';
import PropostasPendentes from './pages/Formularios/PropostasPendentes';
import Prospects from './pages/Formularios/Prospects';
import QuadroResumo from './pages/Formularios/QuadroResumo';
import ReservaLista from './pages/Formularios/ReservaLista';
import ReservaMapa from './pages/Formularios/ReservaMapa';
import TabelaDePrecos from './pages/Formularios/TabelaDePrecos';

let SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [width, 0],
  })
  return { transform: [ {translateX} ] }
};

let SlideFromLeft = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index, index + 1],
    outputRange: [0, width],
  })
  return { transform: [ {translateX} ] }
};

let SlideFromTop = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index, index + 1],
    outputRange: [0, height],
  })
  return { transform: [ {translateY} ] }
};

let SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  })
  return { transform: [ {translateY} ] }
};

let ExpandScreen = (index, position) => {
  const opacity = position.interpolate({
    inputRange: [index-1, index, index + 1],
    outputRange: [0, 1, 1],
  });
  const scaleY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1],
  });
  return {
    opacity,
    transform: [{ scaleY }],
  }
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 600,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const height = layout.initHeight;
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition ||'default';
      return {
        default: SlideFromRight(index, position, width),
        Left: SlideFromLeft(index, position, width),
        Top: SlideFromTop(index, position, height),
        Bottom: SlideFromBottom(index, position, height),
        Expand: ExpandScreen(index, position),
      }[transition];
    },
  }
}

const Routes = createAppContainer(
      createStackNavigator(
        {
        Login: {
          screen: Login,
          navigationOptions: {
            title: 'Login',
            gestureEnabled: false
          }
        },
        Configuracoes: {
          screen: Configuracoes,
          navigationOptions: {
            title: 'Configuracoes',
            gestureEnabled: false
          }
        },
        ConfiguracoesFunilDeVendas: {
          screen: ConfiguracoesFunilDeVendas,
          navigationOptions: {
            title: 'ConfiguracoesFunilDeVendas',
            gestureEnabled: false
          }
        },
        Menu: {
          screen: Menu,
          navigationOptions: {
            title: 'Menu',
            gestureEnabled: false
          }
        },
        Leads: {
          screen: Leads,
          navigationOptions: {
            title: 'Leads',
            gestureEnabled: false
          }
        },
        Empreendimento: {
          screen: Empreendimento,
          navigationOptions: {
            title: 'Empreendimento',
            gestureEnabled: false
          }
        },
        Prospects: {
          screen: Prospects,
          navigationOptions: {
            title: 'Prospects',
            gestureEnabled: false
          }
        },
        ReservaLista: {
          screen: ReservaLista,
          navigationOptions: {
            title: 'ReservaLista',
            gestureEnabled: false
          }
        },        
        Disponibilidade: {
          screen: Disponibilidade,
          navigationOptions: {
            title: 'Disponibilidade',
            gestureEnabled: false
          }
        },
        ReservaMapa: {
          screen: ReservaMapa,
          navigationOptions: {
            title: 'ReservaMapa',
            gestureEnabled: false,
          }
        },
        Intermediacao: {
          screen: Intermediacao,
          navigationOptions: {
            title: 'Intermediacao',
            gestureEnabled: false,
          }
        },
        PropostaDePagamento: {
          screen: PropostaDePagamento,
          navigationOptions: {
            title: 'PropostaDePagamento',
            gestureEnabled: false,
          }
        },
        DadosCliente: {
          screen: DadosCliente,
          navigationOptions: {
            title: 'DadosCliente',
            gestureEnabled: false,
          }
        },
        QuadroResumo: {
          screen: QuadroResumo,
          navigationOptions: {
            title: 'QuadroResumo',
            gestureEnabled: false,
          }
        },
        DadosUsuario: {
          screen: DadosUsuario,
          navigationOptions: {
            title: 'DadosUsuario',
            gestureEnabled: false,
          }
        },
        CriarSenha: {
          screen: CriarSenha,
          navigationOptions: {
            title: 'CriarSenha',
            gestureEnabled: false,
          }
        },
        TabelaDePrecos: {
          screen: TabelaDePrecos,
          navigationOptions: {
            title: 'TabelaDePrecos',
            gestureEnabled: false,
          }
        },
        ContratosPendentes: {
          screen: ContratosPendentes,
          navigationOptions: {
            title: 'ContratosPendentes',
            gestureEnabled: false,
          }
        },
        Pagamentos: {
          screen: Pagamentos,
          navigationOptions: {
            title: 'Pagamentos',
            gestureEnabled: false,
          }
        },
        Informativos: {
          screen: Informativos,
          navigationOptions: {
            title: 'Informativos',
            gestureEnabled: false,
          }
        },
        Boletos: {
          screen: Boletos,
          navigationOptions: {
            title: 'Boletos',
            gestureEnabled: false,
          }
        },
        EsqueceuSenha: {
          screen: EsqueceuSenha,
          navigationOptions: {
            title: 'EsqueceuSenha',
            gestureEnabled: false,
          },
          path: 'esqueceusenha/:esqueceusenha'
        },
        MinhasReservas: {
          screen: MinhasReservas,
          navigationOptions: {
            title: 'MinhasReservas',
            gestureEnabled: false,
          }
        },
        PropostasPendentes: {
          screen: PropostasPendentes,
          navigationOptions: {
            title: 'PropostasPendentes',
            gestureEnabled: false,
          }
        },
        Permissoes: {
          screen: Permissoes,
          navigationOptions: {
            title: 'Permissoes',
            gestureEnabled: false,
          }
        }, 
        DemonstrativoIR: {
          screen: DemonstrativoIR,
          navigationOptions: {
            title: 'DemonstrativoIR',
            gestureEnabled: false,
          }
        },
        OpcoesContratos: {
          screen: OpcoesContratos,
          navigationOptions: {
            title: 'OpcoesContratos',
            gestureEnabled: false,
          }
        }
      },
      {
        InitialRouterName: 'Login',
        headerMode: 'none',
        defaultNavigationOptions: {
          ...TransitionPresets.SlideFromRightIOS
        },
        // transitionConfig: TransitionConfiguration,
      },
      ),
);

const prefix = (Platform.OS === "ios")
? 'pattro://'
: 'pattro://pattro/'

export default() => <Routes uriPrefix = {prefix}/>;
