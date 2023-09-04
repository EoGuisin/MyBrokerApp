//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { View } from 'react-native';
//#endregion

//#region Externas
import Icon from 'react-native-vector-icons/MaterialIcons';
import logo from '../../assets/logomenu.png';
import PropTypes from 'prop-types';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes
import {
    Top,
    ViewButtonVoltar,
    ButtonVoltar,
    ButtonVoltarText,
    ViewReturnMenu,
    ReturnMenu,
    Logo,
} from './styles';
//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens

//#endregion

//#endregion






export default class Header extends Component {
    constructor(props)
    {
        super(props);
    }

    //#region Model
    state = {
        visibilidade: true
    };
    //#endregion
   
    //#region View
    render() { 
        return(
            <Top style = {[
                {justifyContent: this.props.opacidade == true ? 'space-between' : "flex-end"},
                {transform: [
                    {scale: this.props.escala}
                ]},
            ]}>
                <ViewButtonVoltar>
                    {this.props.opacidade == true &&
                    <ButtonVoltar activeOpacity = {1} 
                        onPress = {this.props.navigate}>
                        <ButtonVoltarText>Anterior</ButtonVoltarText>
                    </ButtonVoltar>}
                </ViewButtonVoltar>
                <ViewReturnMenu>
                    {this.props.opacidadeHome == true &&
                    <ReturnMenu activeOpacity = {1}
                        onPress = {this.props.returnMenu}
                        ><Logo source = {logo}/>
                    </ReturnMenu>}
                </ViewReturnMenu>
            </Top>
        );
    }
    //#endregion

}

Header.propTypes = { 
    navigate: PropTypes.func, 
    returnMenu: PropTypes.func, 
    opacidade: PropTypes.bool,
    opacidadeHome: PropTypes.bool,
    escala: PropTypes.object,
    opacityHeader: PropTypes.object,
};

Header.defaultProps = {
    opacidade: true,
    opacidadeHome: true,
}