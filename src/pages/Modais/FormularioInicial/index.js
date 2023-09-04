//#region Bibliotecas importadas

//#region Nativas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getDeviceId } from "react-native-device-info";
import React, { Component } from 'react';
import { Animated, Modal, View, TouchableOpacity, Text, TextInput, Dimensions, Platform, Switch } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//#endregion

//#region Chaves de filtragem

//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Estilização da tela e efeitos

//#endregion

//#region Componentes
import { PickerView, TextInputPadrao } from '../../../components';
import { ModalLocalDeCaptacao } from '../../Modais';
//#endregion

//#region Imagens

//#endregion

//#endregion

class FormularioInicial extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region View
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
  //#endregion

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    ID: "",
    showDate: false,
    Tempo: null,
    VisibilidadeModalFormularioInicial: false,
    VisibilidadeModalCustomComponent: false,
    OpcoesFormulario: [
      {
          id: 0,
          titulo: "",
          classificacao: {
            id: 0,
            descricao: "Texto curto"
          },
          obrigatorio: true,
          formato: {
            id: 0,
            descricao: "text"
          },
          valores: []
      },
      {
          id: 1,
          titulo: "",
          classificacao: {
              id: 1,
              descricao: "Texto longo"
          },
          obrigatorio: true,
          formato: {
              id: 1,
              descricao: "text"
          },
          valores: []
      },
      {
          id: 2,
          titulo: "",
          classificacao: {
              id: 2,
              descricao: "Sim/Não"
          },
          obrigatorio: true,
          formato: {
              id: 2,
              descricao: "switch"
          },
          valores: []
      },
      {
          id: 3,
          titulo: "",
          classificacao: {
              id: 3,
              descricao: "Data"
          },
          obrigatorio: true,
          formato: {
              id: 3,
              descricao: "date"
          },
          valores: []
      },
      {
          id: 4,
          titulo: "",
          classificacao: {
              id: 4,
              descricao: "Hora"
          },
          obrigatorio: true,
          formato: {
              id: 4,
              descricao: "time"
          },
          valores: []
      }
    ],
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
    ComponenteSelecionado: null,
  };
  //#endregion

  //#region View
  render() {

    return(
      <Modal
        animationType = {"slide"}
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
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
              justifyContent: "center"
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{marginLeft: 10}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Formulário inicial</Text>
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
                    returnKeyType = {this.props.returnKeyTypeEmail}
                    autoCapitalize = {'none'}
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
                  <TouchableOpacity
                    activeOpacity = {1}
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
                      borderRadius: 5
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
                
                {this.state.ComponentesFormulario.map((item, index) => (
                  <>
                    {item.classificacao.id == 0 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {false}
                        onChangeText = {() => { }}
                        onSubmitEditing = {() => { }}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {""}
                      />
                    </View>}
                    {item.classificacao.id == 1 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {true}
                        onChangeText = {() => {}}
                        onSubmitEditing = {() => {}}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {""}
                      />
                    </View>}
                    {item.classificacao.id == 2 && <View style = {{marginBottom: 8, flexDirection: "row", alignItems: "center"}}>
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
                    {item.classificacao.id == 3 && <View style = {{marginBottom: 8}}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{item.titulo}</Text>
                      <TextInputPadrao
                        multilines = {false}
                        onChangeText = {() => {}}
                        onSubmitEditing = {() => {}}
                        returnKeyType = {"go"}
                        keyboardType = {"default"}
                        value = {""}
                      />
                    </View>}
                    {item.classificacao.id == 4 && <View style = {{marginBottom: 8}}>
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

              </View>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: 0,
                  height: 58,
                  flexDirection: "row",
                  alignItems: 'center',
                  justifyContent: "center",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderStyle: "dotted"
              }}
                onPress = { async () => { this.setState({VisibilidadeModalFormularioInicial: true})}}>
                <View style = {{borderWidth: 2, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 10}}>
                  <Icon name = "add" size = {20} color = {"#000000"}/>
                </View>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#000000',
                    alignSelf: 'center',
                }}>Customize o seu formulário</Text>
              </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType = {"slide"}
          visible = {this.state.VisibilidadeModalFormularioInicial}
          transparent = {false}>
          <View
            style = {{
              flex: 1,
              backgroundColor: '#F6F8F5', 
              justifyContent: 'flex-start'
        }}>
            <View
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                justifyContent: "center"
            }}>
              <View
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10
              }}>
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{marginLeft: 10}}
                  onPress = { () => { this.setState({VisibilidadeModalFormularioInicial: false}) }}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>Escolha um campo de formulário</Text>
                <View style = {{width: 40}}/>
              </View>
            </View>
            <View
              style = {{
                marginHorizontal: 24, 
                marginTop: 24, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 127) : (Dimensions.get('window').height - 107),
                justifyContent: 'flex-start'
            }}>
              
                {this.state.OpcoesFormulario.map((item, index) => (
                  <>
                    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8, flexDirection: "row", alignItems: "center", marginBottom: 10}} activeOpacity = {0.5}>
                        <View
                          style = {{
                            backgroundColor: "#FFFFFF",
                            width: '100%',
                            borderWidth: 1,
                            borderColor: 'rgba(16, 22, 26, 0.15)',
                            marginVertical: 5,
                            borderRadius: 5,
                            height: 58,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 20,
                        }}>
                          <View
                            style = {{
                              flexDirection: "row",
                              alignItems: "center",
                          }}>
                            <Icon name = "input" size = {20} color = {"#000000"} style = {{marginRight: 10}}/>
                            <Text
                              style = {{
                                paddingVertical: 0,
                                fontSize: 13,
                                color: '#262825',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}>{item.classificacao.descricao}</Text>
                          </View>
                          <TouchableOpacity 
                            activeOpacity = {0.9}
                            style = {{
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              borderRadius: 5,
                              alignItems: 'center',
                              justifyContent: "center",
                              paddingHorizontal: 10,
                              paddingVertical: 5
                            }}
                            onPress = { async () => {
                              item.titulo = ""
                              this.setState({VisibilidadeModalCustomComponent: true, ComponenteSelecionado: item})
                          }}>
                            <View>
                              <Text style = {{color: "#FFFFFF", fontWeight: "bold"}}>Adicionar</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                  </>
                ))}

            </View>
          </View>
          <Modal
            animationType = {"slide"}
            visible = {this.state.VisibilidadeModalCustomComponent}
            transparent = {false}>
            <View
              style = {{
                flex: 1,
                backgroundColor: '#F6F8F5', 
                justifyContent: 'flex-start'
            }}>
              <View
                style = {{
                  backgroundColor: this.props.StyleGlobal.cores.background, 
                  height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                  justifyContent: "center"
              }}>
                <View
                  style = {{
                    flexDirection: 'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}>
                  <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{marginLeft: 10}}
                    onPress = {() => {this.setState({VisibilidadeModalCustomComponent: false})}}/>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#FFFFFF'
                  }}>Customizar componente</Text>
                  <View style = {{width: 40}}/>
                </View>
              </View>
              <View 
                style = {{
                  marginHorizontal: 24, 
                  marginTop: 24, 
                  height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 187) : (Dimensions.get('window').height - 167),
                  justifyContent: 'center'
              }}>
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>{'Titulo'}</Text>
                  <TextInputPadrao
                    multilines = {false}
                    onChangeText = {(value) => {
                      if(this.state.ComponenteSelecionado)
                      {
                        this.state.ComponenteSelecionado.titulo = value;
                        this.setState({ComponenteSelecionado: this.state.ComponenteSelecionado})
                      }
                    }}
                    onSubmitEditing = {() => {}}
                    returnKeyType = {"go"}
                    keyboardType = {"default"}
                    value = {this.state.ComponenteSelecionado ? this.state.ComponenteSelecionado.titulo : ""}
                  />
                </View>
                <View style = {{marginBottom: 8, flexDirection: 'row', alignItems: "center"}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>{'Esse campo é obrigatório'}</Text>
                  <Switch 
                    style = {{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                    value = {this.state.ComponenteSelecionado ? this.state.ComponenteSelecionado.obrigatorio : false}
                    thumbColor = {this.props.StyleGlobal.cores.background}
                    trackColor = {{
                      true: "#CCCCCC",
                      false: this.props.StyleGlobal.cores.background
                    }}
                    onValueChange = {() => {
                      if (this.state.ComponenteSelecionado.obrigatorio == false)
                      {
                        this.state.ComponenteSelecionado.obrigatorio = true
                        this.setState({ComponenteSelecionado: this.state.ComponenteSelecionado})
                      }
                      else
                      {
                        this.state.ComponenteSelecionado.obrigatorio = false
                        this.setState({ComponenteSelecionado: this.state.ComponenteSelecionado})
                      }
                  }}
                  />
                </View>
              </View>
              <View style = {{ paddingHorizontal: 24 }}>
                <TouchableOpacity
                  style = {{
                    width: '100%', 
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    height: 58,
                    alignItems: 'center',
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                  onPress = { async () => {
                    let ListaDeComponentes = [...this.state.ComponentesFormulario]

                    let Componente = this.state.ComponenteSelecionado

                    ListaDeComponentes.push({
                      id: Componente.id,
                      titulo: Componente.titulo,
                      classificacao: Componente.classificacao,
                      obrigatorio: Componente.obrigatorio,
                      formato: Componente.formato,
                      valores: Componente.valores
                  })

                    this.setState({ComponentesFormulario: ListaDeComponentes, VisibilidadeModalCustomComponent: false, VisibilidadeModalFormularioInicial: false})
                  }}>
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
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormularioInicial);

FormularioInicial.propTypes = {
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
}

FormularioInicial.defaultProps = {
  VisibilidadeModalLocalDeCaptacao: false,
}