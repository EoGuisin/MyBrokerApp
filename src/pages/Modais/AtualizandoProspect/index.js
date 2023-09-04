//#region Bibliotecas importadas

//#region Nativas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import React, { Component } from 'react';
import { Animated, Modal, View, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Componentes
import { TextInputPadrao } from '../../../components';
import { ModalLocalDeCaptacao } from "../../Modais";
//#endregion

//#endregion
class AtualizandoProspect extends Component {
  constructor(props)
  {
    super(props);
  }

  componentDidMount = async () => {
    try {
      if(Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS)
      {
        const deviceId = getDeviceId()

        const numberId = deviceId.replace("iPhone", "").substr(0, 2)
        
        if (numberId == 'X' || numberId == "X,") 
        {
          this.setState({ID: "X"})
        }
        else
        {
          const ID = parseInt(numberId)
          this.setState({ID: ID})
        }
      }
      else
      {
        const ID = ""
        this.setState({ID: ID})
      }

    } catch {}
  }

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    ID: "",
    OptionsRadioButton: [
      {
        id: 0,
        descricao: "Email",
        checked: false
      },
      {
        id: 1,
        descricao: "Telefone",
        checked: false
      }
    ],
    OptionSelecionada: null,
    ComponentesFormulario: [],
  };
  //#endregion

  //#region View
  render() {

    return(
      <Modal
        animationType = "slide"
        transparent = {false}
        visible = {this.props.visibilidade}>
         <View 
          style = {{
            flex: 1,
            backgroundColor: '#F6F8F5', 
            justifyContent: 'flex-start'
        }}>
          <View
            style = {{
              backgroundColor: this.props.StyleGlobal.cores.background, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 72,
              justifyContent: "center"
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginTop: 10
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Prospect</Text>
              <View style = {{width: 40}}/>
            </View>
          </View>
          <View
            style = {{
              marginHorizontal: 24, 
              marginTop: 24, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 127) : (Dimensions.get('window').height - 107),
              justifyContent: 'space-between'
            }}>
              <View>
                
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Nome</Text>
                  <TextInputPadrao 
                    onChangeText = {this.props.onChangeNome}
                    onSubmitEditing = {this.props.onSubmitNome}
                    returnKeyType = {this.props.returnKeyTypeNome}
                    keyboardType = {this.props.keyboardNome}
                    value = {this.props.valueNome}
                    id = {this.props.idNome}
                  />         
                </View>
                
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367',
                    marginBottom: 5
                }}>Meio de contato</Text>
                <View
                  style = {{flexDirection: "row", alignItems: "center", marginBottom: 5, marginLeft: 5}}>
                  {this.state.OptionsRadioButton.map((item, index) => (
                    <View key = {item.id} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 5, marginBottom: 5}}>
                      <TouchableOpacity
                        style = {[{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: '#677367',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 5
                        }]}
                        onPress = {() => {
                          item.checked = true
                          this.state.OptionsRadioButton.map((Item, Index) => {
                            if (Item.id != item.id)
                            {
                              Item.checked = false
                            }
                          })
                          this.setState({OptionsRadioButton: this.state.OptionsRadioButton, OptionSelecionada: item})
                      }}>
                        {
                          item.checked ?
                            <View
                              style = {{
                                height: 10,
                                width: 10,
                                borderRadius: 6,
                                backgroundColor: '#677367',
                            }}/>
                          : null
                        }
                      </TouchableOpacity>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367',
                      }}>{item.descricao}</Text>
                    </View>
                  ))}
                </View>

                {this.state.OptionSelecionada && this.state.OptionSelecionada.id == 0 &&
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Email</Text>
                  <TextInputPadrao
                    onChangeText = {this.props.onChangeEmail}
                    onSubmitEditing = {this.props.onSubmitEmail}
                    autoCapitalize = {'none'}
                    returnKeyType = {this.props.returnKeyTypeEmail}
                    keyboardType = {this.props.keyboardEmail}
                    value = {this.props.valueEmail}
                    id = {this.props.idEmail}
                  />                
                </View>}

                {this.state.OptionSelecionada && this.state.OptionSelecionada.id == 1 &&
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Telefone</Text>
                  <TextInputPadrao
                    onChangeText = {this.props.onChangeTelefone}
                    onSubmitEditing = {this.props.onSubmitTelefone}
                    returnKeyType = {this.props.returnKeyTypeTelefone}
                    keyboardType = {this.props.keyboardTelefone}
                    value = {this.props.valueTelefone}
                    id = {this.props.idTelefone}
                  />                   
                </View>}

                {this.props.EmpresaLogada[0] == 5 &&
                <View style = {{marginBottom: 8}}>
                  <Text 
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Local de Captação</Text>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = {this.props.onPressLocalCaptacao}
                    style = {{
                      flexDirection: 'column',
                      paddingVertical: 24,
                      paddingHorizontal: 16,
                      height: 65,
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1,
                      borderColor: 'rgba(16, 22, 26, 0.15)',
                      marginTop: 4,
                      borderRadius: 5,
                  }}>
                    <Text
                      style = {{
                        color: '#262825',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 14
                    }}>{(this.props.valorSelecionado == "" || this.props.valorSelecionado == null) ? "Selecione o local de captação" : this.props.valorSelecionado}</Text>
                  </TouchableOpacity>
                </View>}

                {this.props.ComponentesFormularios.map((item, index) => (
                  <>
                    {item.classificacao.id == 1 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {false}
                        onChangeText = {(value) => { 

                          let ListaDeTiposDeComponentesFormulario = [...this.props.ComponentesFormularios];

                          let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                          ItemFiltrado.resposta = value;

                          ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                              if(Item.id == ItemFiltrado.id)
                              {
                                  Item = ItemFiltrado
                              }
                          })

                          this.props.ComponentesFormularios = ListaDeTiposDeComponentesFormulario

                        }}
                        onSubmitEditing = {() => { }}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {item.resposta}
                      />
                    </View>}
                    {item.classificacao.id == 2 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {true}
                        onChangeText = {(value) => {

                          let ListaDeTiposDeComponentesFormulario = [...this.props.ComponentesFormularios];

                          let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                          ItemFiltrado.resposta = value;

                          ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                              if(Item.id == ItemFiltrado.id)
                              {
                                  Item = ItemFiltrado
                              }
                          })

                          this.props.ComponentesFormularios = ListaDeTiposDeComponentesFormulario

                        }}
                        onSubmitEditing = {() => {}}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {""}
                      />
                    </View>}
                    {item.classificacao.id == 3 && <View style = {{marginBottom: 8, flexDirection: "row", alignItems: "center"}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <Switch 
                        style = {{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                        value = {false}
                        thumbColor = {this.props.StyleGlobal.cores.background}
                        trackColor = {{
                          true: "#CCCCCC",
                          false: this.props.StyleGlobal.cores.background
                        }}
                      />
                    </View>}
                    {item.classificacao.id == 4 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {false}
                        onChangeText = {(value) => {

                          let ListaDeTiposDeComponentesFormulario = [...this.props.ComponentesFormularios];

                          let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                          ItemFiltrado.resposta = value;

                          ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                              if(Item.id == ItemFiltrado.id)
                              {
                                  Item = ItemFiltrado
                              }
                          })

                          this.props.ComponentesFormularios = ListaDeTiposDeComponentesFormulario

                        }}
                        onSubmitEditing = {() => {}}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {formatoDeTexto.Data(item.resposta)}
                      />
                    </View>}
                    {item.classificacao.id == 5 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367',
                          marginBottom: 5
                      }}>{item.titulo}</Text>
                      <View
                        style = {{
                          backgroundColor: '#FFFFFF',
                          paddingHorizontal: 3,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          marginBottom: 5,
                          borderRadius: 5,
                          height: 65,
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                        <TouchableOpacity activeOpacity = {0.9}
                          onPress = { async () => { this.setState({showDate: true}) }}
                          style = {{
                            height: 65, 
                            width: "100%", 
                            justifyContent: 'center'
                          }}>
                            <Text style = {{color: "#696969", marginLeft: 10}}>{moment(this.state.Tempo == null ? new Date() : this.state.Tempo, true).format('HH:mm:ss')}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                          isVisible = {this.state.showDate}
                          mode = {"time"}
                          locale = {"pt-BR"}
                          headerTextIOS = {`${item.titulo}`}
                          cancelTextIOS = {"Cancelar"}
                          confirmTextIOS = {"Confirmar"}
                          onConfirm = { async (date) => { this.setState({Tempo: date, showDate: false}) }}
                          onCancel = { async () => { this.setState({showDate: false}) }}
                        />
                      </View>
                    </View>}
                  </>
                ))}

                <ModalLocalDeCaptacao
                  visibilidade = {this.props.VisibilidadeModalLocalDeCaptacao}
                  keyExtractorFlatList = {this.props.keyExtractorLocalCaptacao}
                  renderLocal = {this.props.renderLocalCaptacao}
                  filteredLocal = {this.props.filteredLocalCaptacao}
                  idFlatList = {this.props.idLocalCaptacao}
                  onChangeSearch = {this.props.onChangeSearch}
                  onPressVisibilidade = {this.props.onPressVisibilidadeCaptacao}
                  colorempreendimento = {this.props.StyleGlobal.cores.background}
                />

              </View>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.botao,
                  paddingHorizontal: 0,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5
              }}
                onPress = {this.props.onPressConfirmar}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Confirmar</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  //#endregion
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AtualizandoProspect);

AtualizandoProspect.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressLocalCaptacao: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
  Finalidades: PropTypes.array,
  mudandoValorPicker: PropTypes.func,
  valorSelecionado: PropTypes.any,
  valueNome: PropTypes.string,
  valueTelefone: PropTypes.string,
  valueEmail: PropTypes.string,
  onChangeNome: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangeTelefone: PropTypes.func,
  onSubmitNome: PropTypes.func,
  onSubmitEmail: PropTypes.func,
  onSubmitTelefone: PropTypes.func,
  keyboardNome: PropTypes.string,
  keyboardTelefone: PropTypes.string,
  keyboardEmail: PropTypes.string,
  idNome: PropTypes.func,
  idEmail: PropTypes.func,
  idTelefone: PropTypes.func,
  returnKeyTypeNome: PropTypes.string,
  returnKeyTypeEmail: PropTypes.string,
  returnKeyTypeTelefone: PropTypes.string,
  colorheader: PropTypes.string,
  colorbutton: PropTypes.string,
  VisibilidadeModalLocalDeCaptacao: PropTypes.bool,
  renderLocalCaptacao: PropTypes.func,
  filteredLocalCaptacao: PropTypes.array,
  keyExtractorLocalCaptacao: PropTypes.func,
  idLocalCaptacao: PropTypes.func,
  onChangeSearch: PropTypes.func,
  onPressVisibilidadeCaptacao: PropTypes.func,
  ComponentesFormularios: PropTypes.array
}

AtualizandoProspect.defaultProps = {
  VisibilidadeModalLocalDeCaptacao: false,
  ComponentesFormularios: []
}