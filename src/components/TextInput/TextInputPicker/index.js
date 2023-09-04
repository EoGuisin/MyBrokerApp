//#region Bibliotecas importadas

//#region Nativas

//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes

//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens

//#endregion

//#endregion
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, View, TextInput, Text, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class TextInputPicker extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <View style = {[this.props.estilo]}>
          <Text
            style = {{
              fontStyle: 'normal', 
              fontWeight: 'normal', 
              fontSize: 14, 
              color: this.props.StyleGlobal.fontes.corpadrao,
              marginBottom: 10
          }}>{this.props.title}</Text>
          <View 
            style = {{
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(16, 22, 26, 0.15)',
              borderWidth: 1,
              height: 52,
              paddingHorizontal: 16,
              borderRadius: 5,
              justifyContent: "center"
          }}>
            <Text 
              style = {{
                flexDirection: 'column',
                color: '#262825',
                fontStyle: 'normal',
                fontWeight: 'normal',
                textAlignVertical: "center",
                fontSize: 12,
            }}
            >{this.props.value}</Text>
          </View>
        </View>
    );
  }
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TextInputPicker);

TextInputPicker.propTypes = {
  animated: PropTypes.object,
  title: PropTypes.string,
  estilo: ViewPropTypes.style,
  onChangeText: PropTypes.func,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  autoCapitalize: PropTypes.string,
  textAlignVertical: PropTypes.string,
  value: PropTypes.any,
  id: PropTypes.func,
  editable: PropTypes.bool,
  onBlur: PropTypes.func,
  visibilidade: PropTypes.bool,
  keyboardType: PropTypes.string,
  placeholder: PropTypes.string,
  placeholdercolor: PropTypes.string,
  onPress: PropTypes.func,
};

TextInputPicker.defaultProps = {
  visibilidade: false,
  value: ""
}