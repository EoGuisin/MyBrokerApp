import React from 'react';
import { Alert } from 'react-native';

import moment from 'moment';
import { isBefore, isLeapYear } from 'date-fns';
import PushNotification from 'react-native-push-notification';
import formatoDeTexto from '../Style/formatoDeTexto';
import Photo from '../assets/cam.png';

class Validacoes {
  static = {
    idade: null,
  }

  async ValidarCPF(state) {
    
    if ( !cpf || cpf.length != 11

      || cpf == "00000000000"

      || cpf == "11111111111"

      || cpf == "22222222222" 

      || cpf == "33333333333" 

      || cpf == "44444444444" 

      || cpf == "55555555555" 

      || cpf == "66666666666"

      || cpf == "77777777777"

      || cpf == "88888888888" 

      || cpf == "99999999999" )

    return false

    var soma = 0

      var resto

    for (var i = 1; i <= 9; i++) 

      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)

    resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11))  resto = 0

      if (resto != parseInt(cpf.substring(9, 10)) ) return false

    soma = 0

      for (var i = 1; i <= 10; i++) 

        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)

      resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11))  resto = 0

      if (resto != parseInt(cpf.substring(10, 11) ) ) return false

      return true

  }
  async Data(state) {

    if(state == null || state == "") return await false

    const dia = parseInt((state).split("/")[0])
    const mes = parseInt((state).split("/")[1])
    const ano = parseInt((state).split("/")[2])
    
    if(isNaN(dia) == true || dia == undefined || dia == null)  return await false
    
    if(isNaN(mes) == true || mes == undefined || mes == null)  return await false 
    
    if(isNaN(ano) == true || ano == undefined || ano == null)  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == true && mes == 2 && (dia > 29 || dia < 1))  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == false && mes == 2 && (dia > 28 || dia < 1))  return await false
    
    if(mes > 12 || mes < 1) return await false

    if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30 || dia < 1)) return await false
    
    if((mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) && (dia > 31 || dia < 1)) return await false

    return await true
  }
  async Maioridade(state) {

    if(state == null || state == "") return await false
    
    this.static.idade = null
    
    const dia = parseInt((state).split("/")[0])
    const mes = parseInt((state).split("/")[1])
    const ano = parseInt((state).split("/")[2])

    if(isNaN(dia) == true || dia == undefined || dia == null)  return await false 
    
    if(isNaN(mes) == true || mes == undefined || mes == null)  return await false 
    
    if(isNaN(ano) == true || ano == undefined || ano == null)  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == true && mes == 2 && (dia > 29 || dia < 1))  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == false && mes == 2 && (dia > 28 || dia < 1))  return await false
    
    if(mes > 12 || mes < 1) return await false

    if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30 || dia < 1)) return await false
    
    if((mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) && (dia > 31 || dia < 1)) return await false

    try { this.static.idade = parseInt(new Date().getFullYear() - ano) } catch{}

    if ((parseInt(new Date().getMonth() + 1)) < mes || ((parseInt(new Date().getMonth() + 1)) == mes && parseInt(new Date().getDate()) < dia)) { this.static.idade = this.static.idade - 1 }

    if (this.static.idade < 14) return await false

    return await true
  }
  async DateTodayOrAfter(state) {

    if(state == null || state == "") return await false
    
    const dia = parseInt((state).split("/")[0])
    const mes = parseInt((state).split("/")[1])
    const ano = parseInt((state).split("/")[2])
      
      if(isNaN(dia) == true || dia == undefined || dia == null)  return await false 
      
      if(isNaN(mes) == true || mes == undefined || mes == null)  return await false 
      
      if(isNaN(ano) == true || ano == undefined || ano == null)  return await false 
      
      if(isLeapYear(new Date(ano, (mes - 1), dia)) == true && mes == 2 && (dia > 29 || dia < 1))  return await false 
      
      if(isLeapYear(new Date(ano, (mes - 1), dia)) == false && mes == 2 && (dia > 28 || dia < 1))  return await false
      
      if(mes > 12 || mes < 1) return await false

      if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30 || dia < 1)) return await false
      
      if((mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) && (dia > 31 || dia < 1)) return await false

      if (isBefore(new Date(ano, (mes - 1), dia), new Date(parseInt(new Date().getFullYear()), parseInt(new Date().getMonth()), parseInt(new Date().getDate()))) == true) return await false

      return await true
  }
  async DataIntermediaria(mes, dia) {
    
    const ano = parseInt(new Date().getFullYear())
    
    if(isNaN(dia) == true || dia == undefined || dia == null)  return await false 
      
    if(isNaN(mes) == true || mes == undefined || mes == null)  return await false 
    
    if(isNaN(ano) == true || ano == undefined || ano == null)  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == true && mes == 2 && (dia > 29 || dia < 1))  return await false 
    
    if(isLeapYear(new Date(ano, (mes - 1), dia)) == false && mes == 2 && (dia > 28 || dia < 1))  return await false
    
    if(mes > 12 || mes < 1) return await false
    
    if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30 || dia < 1)) return await false
    
    if((mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) && (dia > 31 || dia < 1)) return await false

    return await true
  }
  async TelaLogin(state) {
    if ((state.CPF == null || state.CPF == "") &&
        (state.Senha == null || state.Senha == "") && 
        (state.Empresa == null || state.Empresa == "")) {
        return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Usuário e a senha`
                  })
    } 
    // else if ( state.Empresa == null || state.Empresa == "") {
    //   return await PushNotification.localNotification({
    //               largeIcon: 'icon',
    //               smallIcon: 'icon',
    //               vibrate: true,
    //               vibration: 300,
    //               title: 'My Broker',
    //               message: `Selecione a empresa`
    //             })
    // } 
    else if ( state.CPF == null || state.CPF == "") {
        return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Prencha: Usuário`
                  })
    } else if ( state.Senha == null || state.Senha == "") {
      return await PushNotification.localNotification({
                  largeIcon: 'icon',
                  smallIcon: 'icon',
                  vibrate: true,
                  vibration: 300,
                  title: 'My Broker',
                  message: `Preencha: Senha`
                })
    } else {
        return true;
    }
  }
  async ModalCadastroDoLead(state, This) {
    if(state.Nome == null || state.Nome == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Nome do Lead`
      })
    } 
    else if (state.OptionSelecionada == null) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione um meio de contato`
      })
    } 
    else if (state.OptionSelecionada.id == 0 && (state.Email == null || state.Email == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Email`
      })
    } 
    else if (state.OptionSelecionada.id == 0 && (This.IsEmail(state.Email) == false && state.Email != null && state.Email != "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: E-mail inválido`
      })
    } 
    else if(state.OptionSelecionada.id == 1 && (state.TelefoneP == null || state.TelefoneP == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Telefone Principal`
      })
    } 
    else if(state.OptionSelecionada.id == 1 && (formatoDeTexto.Telefone(state.TelefoneP).length <= 13 || This.Telefone_validation(state.TelefoneP) == false)) {  
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Telefone principal inválido`
      })
    } 
    else if (state.EmpresaLogada == 5 && (state.finalidade == null || state.finalidade == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione: Local de captação`
      })
    } else {
      return await true;
    }
  }
  async ModalAtualizarProspect(state, This) {
    if(state.Nome == null || state.Nome == "") {
      return await PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Preencha: Nome do Prospect`
            })
    } else if (state.OptionSelecionada == null) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione um meio de contato`
      })
    } else if (state.OptionSelecionada.id == 0 && (state.Email == null || state.Email == "")) {
        return await PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Preencha: Email`
        })
    } else if (state.OptionSelecionada.id == 0 && (This.IsEmail(state.Email) == false && state.Email != null && state.Email != "")) {
        return await PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Aviso: E-mail inválido`
        })
    } else if (state.OptionSelecionada.id == 1 && (state.TelefoneP == null || state.TelefoneP == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Telefone Principal`
      })
    } else if (state.OptionSelecionada.id == 1 && (formatoDeTexto.Telefone(state.TelefoneP).length <= 13 || This.Telefone_validation(state.TelefoneP) == false)) {  
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Telefone principal inválido`
      })
    } else if (state.EmpresaLogada == 5 && (state.finalidade == null || state.finalidade == "")) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Selecione: Local de captação`
      })
    } else {
      return await true;
    }
  }
  async TelaDadosUsuario(state, This, setModal) {
    if ( state.selectedItems == null || state.selectedItems == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione ao menos uma empresa`
      })
    }
    else if ( state.CPFCliente == null || state.CPFCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: CPF`
      })
    }
    else if ( state.CPFCliente != null && state.CPFCliente != "" && formatoDeTexto.TextoValido(state.CPFCliente) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `CPF inválido`
      })
    }
    else if ( state.CPFCliente == null || state.CPFCliente == "" ) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: CPF`
      })
    }
    else if( state.NomeCliente == null || state.NomeCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: O nome do cliente`
      })
    }
    else if(This.IsEmail(state.EmailCliente) == false && state.EmailCliente != null && state.EmailCliente != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: E-mail inválido`
      })
    }
    else if((state.CriarSenha == null || state.CriarSenha == "") && 
      (state.ConfirmarSenha == null || state.ConfirmarSenha == "")) {
        return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: `Preencha: Nova Senha e Confime sua senha`
                      })
    } else if (state.CriarSenha == null || state.CriarSenha == "") {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Nova senha`
                    })
    } else if ((state.CriarSenha).length < 6) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Necessário no mínimo 6 caracteres para a senha.`
                    })
    } else if (state.ConfirmarSenha == null || state.ConfirmarSenha == "") {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Confirme sua senha`
                    })
    } else if ((state.ConfirmarSenha).length < 6) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Necessário no mínimo 6 caracteres para o confirma senha.`
                    })
    } else if (state.CriarSenha != state.ConfirmarSenha) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Senhas diferentes, preencha o mesmo para as duas.`
                    })
    } else if (state.CriarSenha == state.ConfirmarSenha) {
      return await true;
    }
  }
  async TelaCadatrarSenha(state) {
    if((state.CriarSenha == null || state.CriarSenha == "") && 
      (state.ConfirmarSenha == null || state.ConfirmarSenha == "")) {
        return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: `Preencha: Nova Senha e Confime sua senha`
                      })
    } else if (state.CriarSenha == null || state.CriarSenha == "") {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Nova senha`
                    })
    } else if ((state.CriarSenha).length < 6) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Necessário no mínimo 6 caracteres para a senha.`
                    })
    } else if (state.ConfirmarSenha == null || state.ConfirmarSenha == "") {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Confirme sua senha`
                    })
    } else if ((state.ConfirmarSenha).length < 6) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Necessário no mínimo 6 caracteres para o confirma senha.`
                    })
    } else if (state.CriarSenha != state.ConfirmarSenha) {
      return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Senhas diferentes, preencha o mesmo para as duas.`
                    })
    } else if (state.CriarSenha == state.ConfirmarSenha) {
      return await true;
    }
  }
  async TelaDadosCliente(state, This) {
    if ( state.CPFCliente == null || state.CPFCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: CPF`
      })
    } else if ( state.CPFCliente != null && state.CPFCliente != "" && formatoDeTexto.TextoValido(state.CPFCliente) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `CPF do cliente inválido`
      })
    } else if ( state.DataCliente == null ||state.DataCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Data de Nascimento do cliente`
      })
    } else if( formatoDeTexto.Data(state.DataCliente).length != 10) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Data de nascimento do cliente incorreta`
        })
    } else if(await this.Data(state.DataCliente) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Data de nascimento do cliente inválida`
      })
    } else if(await this.Maioridade(state.DataCliente) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: A idade do cliente não atinge o mínimo necessário.`
      })
    } else if( state.NomeCliente == null || state.NomeCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: O nome do cliente`
      })
    } else if( state.RGCliente == null || state.RGCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: O RG do cliente.`
      })
    } else if( state.RGOrgaoEmissorCliente == null || state.RGOrgaoEmissorCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: O Orgão emissor do RG do cliente.`
      })
    } else if( state.RGUFCliente == null || state.RGUFCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: A UF do RG do cliente`
      })
    } else if( state.CargoCliente == null || state.CargoCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: O cargo do cliente.`
      })
    } else if(state.EmpresaLogada == "GAV Resorts" && (state.NacionalidadeCliente.id == null)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione: A nacionalidade do cliente.`
      })
    } else if(state.EmpresaLogada == "Silva Branco" && (formatoDeTexto.DesformatarTexto(state.RendaCliente) == 0 || state.RendaCliente == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: A renda do cliente.`
      })
    } else if(state.EmpresaLogada == "Silva Branco" && (state.SexoCliente.id == null)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione: O sexo do cliente.`
      })
    } else if(state.EmailCliente == null || state.EmailCliente == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: E-mail do cliente.`
      })
    } else if(This.IsEmail(state.EmailCliente) == false && state.EmailCliente != null && state.EmailCliente != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: E-mail inválido`
      })
    } else if(state.StatusCivil == null || state.StatusCivil == 0) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione: Situação atual`
        })
    } else if((state.StatusCivil == 2) && (state.Regime == null || state.Regime == 0)) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione: Regime de bens`
        })
    }
    else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.CPFConjuge == null || state.CPFConjuge == "")) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: CPF do conjugê`
        })
    } else if ((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && state.CPFConjuge != null && state.CPFConjuge != "" && formatoDeTexto.TextoValido(state.CPFConjuge) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `CPF do conjugê inválido`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.DataConjuge == null || state.DataConjuge == "")) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Data de Nasc do conjugê`
        })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && formatoDeTexto.Data(state.DataConjuge).length != 10) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Data de nascimento do conjugê incorreta`
        })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && await this.Data(state.DataConjuge) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Data de nascimento do conjugê inválida`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.NomeConjuge == null || state.NomeConjuge == "")) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Nome do conjugê`
        })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.RGConjuge == null || state.RGConjuge == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Preencha o RG do conjuge`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.RGOrgaoEmissorConjuge == null || state.RGOrgaoEmissorConjuge == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Preencha o orgão emissor do RG do conjuge`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.RGUFConjuge == null || state.RGUFConjuge == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Preencha a UF do RG do conjuge.`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.CargoConjuge == null || state.CargoConjuge == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Preencha o cargo do conjuge.`
      })
    } else if(state.EmpresaLogada == "GAV Resorts" && (state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.NacionalidadeConjuge.id == null)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione: A nacionalidade do conjuge.`
      })
    } else if(state.EmpresaLogada == "Silva Branco" && (state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (formatoDeTexto.DesformatarTexto(state.RendaConjuge) == 0 || state.RendaConjuge == "")) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: A renda do conjuge.`
      })
    } else if(state.EmpresaLogada == "Silva Branco" && (state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.SexoConjugeid == null)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Selecione: O sexo do conjuge.`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && state.EmailConjuge == null || state.EmailConjuge == "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: E-mail conjugê.`
      })
    } else if((state.ValueSwitchConjuge == true) && ((state.StatusCivil == 2 || state.StatusCivil == 7)) && (This.IsEmail(state.EmailConjuge) == false) && state.EmailConjuge != null && state.EmailConjuge != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Email do conjugê inválido`
      })
    } else if(((state.StatusCivil == 2 || state.StatusCivil == 7)) && (state.NomeConjuge == null || state.NomeConjuge == "") && 
      ( (state.CPFConjuge != null && state.CPFConjuge != "") ||
        (state.DataConjuge != null && state.DataConjuge != "") ||
        (state.EmailConjuge != null && state.EmailConjuge != "") ||
        (state.RGConjuge != null && state.RGConjuge != "" )||
        (state.RGOrgaoEmissorConjuge != null && state.RGOrgaoEmissorConjuge != "") ||
        (state.RGUFConjuge != null && state.RGUFConjuge != "") ||
        (state.CargoConjuge != null && state.CargoConjuge != "")
      )) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Preencha o nome do conjugê ou deixe todos os dados dele vazio.`
      })
    }
    else if(state.CEP == null || state.CEP == "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: CEP`
        })
    } else if(state.CEP != null && state.CEP != "" && This.IsCEP(state.CEP) == false) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: CEP inválido`
        })
    } else if(formatoDeTexto.CEPOriginal(state.CEP).length != 8) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: CEP incorreto/inválido`
        })
    } else if((state.Rua ==  null || state.Rua == "")) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Logradouro`
        })
    } else if(state.Bairro == null || state.Bairro == "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Bairro`
        })
    } else if(state.Cidade == null || state.Cidade == "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Cidade`
        })
    } else if(state.Estado == null || state.Estado == "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: UF`
        })
    } else if(state.Telefone == null || state.Telefone == "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Telefone Principal`
        })
    } else if(formatoDeTexto.Telefone(state.Telefone).length <= 13 || This.Telefone_validation(state.Telefone) == false) {  
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Telefone principal inválido`
        })
    } else if((state.TelefoneComercial != "" && state.TelefoneComercial != null) && (formatoDeTexto.Telefone(state.Telefone).length <= 13 || This.Telefone_validation(state.TelefoneComercial) == false)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Telefone recado inválido`
      })
    } else if(state.Telefone == state.TelefoneComercial) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: O telefone de recado tem que ser diferente do original`
      })
    } else {
        return await true;
    }
  }
  async TelaDadosClienteLista(state, This) {
    state.Clientes.map(async cliente => {
      if(cliente.valueSwitch == true) {
        if (cliente.CPFCliente == null || cliente.CPFCliente == "") {
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: `Preencha: CPF`
          })
        } else if (cliente.CPFCliente != null && cliente.CPFCliente != "" && formatoDeTexto.TextoValido(cliente.CPFCliente) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `CPF do cliente inválido`
            })
        } else if (cliente.DataCliente == null ||cliente.DataCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Data de Nascimento do cliente`
            })
        } else if( formatoDeTexto.Data(cliente.DataCliente).length != 10) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Data de nascimento do cliente incorreta`
            })
        } else if(await this.Data(cliente.DataCliente) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Data de nascimento do cliente inválida`
            })
        } else if(await this.Maioridade(cliente.DataCliente) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: A idade do cliente não atinge o mínimo necessário.`
            })
        } else if(cliente.NomeCliente == null || cliente.NomeCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: O nome do cliente`
            })
        } else if(cliente.RGCliente == null || cliente.RGCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Preencha o RG do cliente.`
            })
        } else if( cliente.RGOrgaoEmissorCliente == null || cliente.RGOrgaoEmissorCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Preencha o Orgão emissor do RG do cliente.`
            })
        } else if(cliente.RGUFCliente == null || cliente.RGUFCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Preencha a UF do RG do cliente`
            })
        } else if(cliente.CargoCliente == null || cliente.CargoCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Preencha o cargo do cliente.`
            })
        } else if(cliente.EmailCliente == null || cliente.EmailCliente == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: E-mail do cliente.`
            })
        } else if(This.IsEmail(cliente.EmailCliente) == false && cliente.EmailCliente != null && cliente.EmailCliente != "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: E-mail inválido`
            })
        } else if(cliente.StatusCivil == null || cliente.StatusCivil == 0) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Selecione: Situação atual`
            })
        } else if((cliente.StatusCivil == 2) && (cliente.Regime == null || cliente.Regime == 0)) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Selecione: Regime de bens`
            })
        }
        else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.CPFConjuge == null || cliente.CPFConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: CPF do conjugê`
            })
        } else if ((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && cliente.CPFConjuge != null && cliente.CPFConjuge != "" && formatoDeTexto.TextoValido(cliente.CPFConjuge) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `CPF do conjugê inválido`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.DataConjuge == null || cliente.DataConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Data de Nasc do conjugê`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && formatoDeTexto.Data(cliente.DataConjuge).length != 10) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Data de nascimento do conjugê incorreta`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && await this.Data(cliente.DataConjuge) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Data de nascimento do conjugê inválida`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.NomeConjuge == null || cliente.NomeConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Nome do conjugê`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.RGConjuge == null || cliente.RGConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Preencha o RG do conjuge`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.RGOrgaoEmissorConjuge == null || cliente.RGOrgaoEmissorConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Preencha o orgão emissor do RG do conjuge`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.RGUFConjuge == null || cliente.RGUFConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Preencha a UF do RG do conjuge.`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.CargoConjuge == null || cliente.CargoConjuge == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Preencha o cargo do conjuge.`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && cliente.EmailConjuge == null || cliente.EmailConjuge == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: E-mail conjugê.`
            })
        } else if((cliente.ValueSwitchConjuge == true) && (cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (This.IsEmail(cliente.EmailConjuge) == false) && cliente.EmailConjuge != null && cliente.EmailConjuge != "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Email do conjugê inválido`
            })
        } else if((cliente.StatusCivil == 2 && cliente.Regime != null && cliente.Regime != 0) && (cliente.NomeConjuge == null || cliente.NomeConjuge == "") && 
          ( (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ||
            (cliente.DataConjuge != null && cliente.DataConjuge != "") ||
            (cliente.EmailConjuge != null && cliente.EmailConjuge != "") ||
            (cliente.RGConjuge != null && cliente.RGConjuge != "" ) ||
            (cliente.RGOrgaoEmissorConjuge != null && cliente.RGOrgaoEmissorConjuge != "") ||
            (cliente.RGUFConjuge != null && cliente.RGUFConjuge != "") ||
            (cliente.CargoConjuge != null && cliente.CargoConjuge != "")
          )) {
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: `Aviso: Preencha o nome do conjugê ou deixe todos os dados dele vazio.`
          })
        }
        else if(cliente.CEP == null || cliente.CEP == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: CEP`
            })
        } else if(cliente.CEP != null && cliente.CEP != "" && This.IsCEP(cliente.CEP) == false) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: CEP inválido`
            })
        } else if(formatoDeTexto.CEPOriginal(cliente.CEP).length != 8) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: CEP incorreto/inválido`
            })
        } else if((cliente.Rua ==  null || cliente.Rua == "")) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Logradouro`
            })
        } else if(cliente.Bairro == null || cliente.Bairro == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Bairro`
            })
        } else if(cliente.Cidade == null || cliente.Cidade == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Cidade`
            })
        } else if(cliente.Estado == null || cliente.Estado == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: UF`
            })
        } else if(cliente.Telefone == null || cliente.Telefone == "") {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Preencha: Telefone Principal`
            })
        } else if(formatoDeTexto.Telefone(cliente.Telefone).length <= 13 || This.Telefone_validation(cliente.Telefone) == false) {  
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Telefone principal inválido`
            })
        } else if((cliente.TelefoneComercial != "" && cliente.TelefoneComercial != null) && (formatoDeTexto.Telefone(cliente.Telefone).length <= 13 || This.Telefone_validation(cliente.TelefoneComercial) == false)) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: Telefone recado inválido`
            })
        } else if(cliente.Telefone == cliente.TelefoneComercial) {
            return await PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `Aviso: O telefone de recado tem que ser diferente do original`
            })
        } else {
            return await true;
        }
      }
    })
  }
    async _InputCPF_CNPJ(CPF_CNPJ, This) {
      if(CPF_CNPJ !="" && (
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11
        ||formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14) && (
          This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true 
        ||This.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true
        )) {
          await This.consultaReceitaFederal();
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          This.InputNomeCliente.focus()
        } else {}
      } else {
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
        } else if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CNPJ inválido"
          })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
          })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11 &&
          formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 14){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CNPJ incorreto"
          })
        }
      }
    }
    async _InputCPF_CNPJLista(CPF_CNPJ, This, Data, IDCliente) {
      if(CPF_CNPJ !="" && (
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11
        ||formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14) && (
          This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true 
        ||This.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true
        )) {
          await This.consultaReceitaFederalLista(CPF_CNPJ, Data, IDCliente);
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          // This.InputNomeCliente.focus()
        } else {}
      } else {
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
        } else if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CNPJ inválido"
          })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
                      })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11 &&
          formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 14){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CNPJ incorreto"
          })
        }
      }
    }
    async _InputCPF_CNPJConjuge(CPF_CNPJ, This, state) {
      if(CPF_CNPJ !="" && (
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11) && (
          This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true
        )) {
        await This.loadDadosUsuario();
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          This.InputDataConjuge.focus()
        } else {} 
      }else {
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
                      })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
          })
        }
      }
    }
    async _InputCPF_CNPJConjugeLista(CPF_CNPJ, This, Data, IDCliente) {
      if(CPF_CNPJ !="" && (
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11) && (
          This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true
        )) {
        await This.consultaReceitaFederalConjugeLista(CPF_CNPJ, Data, IDCliente);
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          // This.InputDataConjuge.focus()
        } else {} 
      }else {
        if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
                      })
        } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF incorreto"
          })
        }
      }
    }
    async _InputCPF_CNPJ_API(CPF_CNPJ, This) {
      if((CPF_CNPJ) != "" && (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11) && 
        (This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ) == true))) {
          return await true;
      } else if ((CPF_CNPJ) != "" && (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14) && 
        (This.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ) == true))) {
          return await true;
      } else if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11 && This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ) != true)){
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
      } else if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 14 && This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ) != true)){
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: "CNPJ inválido"
        })
      } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: "CPF incorreto"
                    })
      } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11 &&
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 14){
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: "CNPJ incorreto"
        })
      }
    }
    async _InputCPF_CNPJConjuge_API(CPF_CNPJ, This, state) {
      if(CPF_CNPJ !="" && (
        formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11) && (
          This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) == true
        )) {
          return await true;
      } else if(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length == 11 && This.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ)) != true) {
          return await PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: "CPF inválido"
          })
      } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length < 11){
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: "CPF incorreto"
                    })
      } else if (formatoDeTexto.CPF_CNPJOriginal(CPF_CNPJ).length > 11){
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: "CPF incorreto"
        })
      }
    }
  async TelaFinanciamento(state, ValorMax) {

    const IntermediariasMesReferencia = await state.Intermediarias.filter(element => ((element.Mesref == null || element.Mesref == 0) && element.habilitar == true))
    const IntermediariasVencimento = await state.Intermediarias.filter(element => ((element.Vencimento == null || element.Vencimento == "") && element.habilitar == true))
    const IntermediariasValor = await state.Intermediarias.filter(element => ((element.Valor == null || element.Valor == "") && element.habilitar == true))
    const IntermediariasValorIncorreto = await state.Intermediarias.filter(element => (element.Valor == "R$0,00" && element.habilitar == true))

    if ((state.entradasEditadas == false) && (state.value == true) && ((state.QtdeEntradas == null || state.QtdeEntradas == 0 || state.QtdeEntradas == ""))) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha: Total de parcelas de entrada`
      })
    } else if ((state.entradasEditadas == false) && (state.value == true) && ((state.ValorEntradas ==  null || state.ValorEntradas == ""))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Valor das entradas`
        })
    } else if ((state.entradasEditadas == false) && (state.value == true) && ((state.ValorEntradas == "R$ 0,00"))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Valor das entradas tem quer maior do que R$ 0,00`
        })
    } else if ((state.entradasEditadas == false) && (state.value == true) && ((state.VencimentoEntradas ==  null || state.VencimentoEntradas == ""))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Primeiro Vencimento das entradas`
        })
    } else if ((state.entradasEditadas == false) && (state.value == true) && state.VencimentoEntradas != null && state.VencimentoEntradas != "" && await this.Data(state.VencimentoEntradas) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Data do vencimento das entradas inválida`
      })
    } else if ((state.entradasEditadas == false) && (state.value == true) && state.VencimentoEntradas != null && state.VencimentoEntradas != "" && await this.DateTodayOrAfter(state.VencimentoEntradas) == false) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: A data de inicio das entradas tem que ser no minimo equivalente ao dia de hoje!`
      })
    } else if ((state.entradasEditadas == false) && (state.value == true) && (formatoDeTexto.Data(state.VencimentoEntradas).length != 10)) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Data do vencimento das entradas inválida`
        })
    } else if ((state.entradasEditadas == false && (state.value == true)) && ((state.FormPag == null || state.FormPag == 0))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione: Forma de pagamento para as entradas`
        })
    } else if (IntermediariasMesReferencia != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione: Mês de referência das intermediárias`
        })
    } else if (IntermediariasVencimento != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Dia do vencimento das intermediárias`
        })
    } else if (IntermediariasValor != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Valor das intermediárias`
        })
    } else if (IntermediariasValorIncorreto != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Valor das intermediárias tem que ser maior do que R$ 0,00`
        })
    } else if ((state.value_3 == true) && ((state.QtdeParcelas == null || state.QtdeParcelas == "" || state.QtdeParcelas == 0))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Total de parcelas do financiamento`
        })
    } else if ((state.value_3 == true) && ((state.ValorParcelas == null || state.ValorParcelas == ""))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Valor das parcelas do financiamento`
        })
    } else if ((state.value_3 == true) && ((state.ValorParcelas == "R$ 0,00"))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: Valor das parcelas do financiamento tem que ser maior que R$ 0,00`
        })
    } else if ((state.value_3 == true) && ((state.VencimentoParcelas == null || state.VencimentoParcelas == ""))) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha: Primeiro Vencimento do financiamento`
        })
    } else if ((state.value_3 == true) && ((formatoDeTexto.Data(state.VencimentoParcelas).length != 10))) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Data do vencimento do financiamneto inválida`
      })
    } else if ((state.value_3 == true) && (await this.Data(state.VencimentoParcelas) == false)) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: Data do vencimento do financiamneto inválida`
      })
    } else if ((state.value_3 == true) && (await this.DateTodayOrAfter(state.VencimentoParcelas) == false)) {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Aviso: A data das parcelas de financiamento tem que ser no minimo igual ao dia de hoje`
        })
    } else {
        return await true;
    }
  }
  async TelaPropostaDePagamento(state) {

    var ValorSomadoEntrada = 0;
    var ValorSomadoSinal = 0;
    var ValorSomadoIntermediaria = 0;
    var Verf_QtdeIntermediarias = null;
    var Verf_DataVencIntermediarias = null;
    var Verf_MesRefIntermediarias = null;
    var Verf_ValorIntermediarias = null;
    var VencimentoInvalidoEntrada = 0;
    var VencimentoInvalidoSinal = 0;
    var MeioDePagamentoVazioEntrada = 0;
    var MeioDePagamentoVazioSinal = 0;

    state.ListaDeEntradas.map(entrada => ValorSomadoEntrada += entrada.Valor);
    state.ListaDeSinais.map(sinal => ValorSomadoSinal += sinal.Valor);
    state.ListaDeIntermediarias.map(intermediaria => { ValorSomadoIntermediaria += (intermediaria.Qtde * intermediaria.Valor)})
    
    Verf_QtdeIntermediarias = state.ListaDeIntermediarias.filter(intermediaria => intermediaria.Qtde <= 0)
    Verf_DataVencIntermediarias = state.ListaDeIntermediarias.filter(intermediaria => (intermediaria.DiaVencimento == null || intermediaria.DiaVencimento == '' || intermediaria.DiaVencimento <= 0))
    Verf_MesRefIntermediarias = state.ListaDeIntermediarias.filter(intermediaria => (intermediaria.MesReferencia.descricao == ''))
    Verf_ValorIntermediarias = state.ListaDeIntermediarias.filter(intermediaria => (intermediaria.Valor == 0 || intermediaria.Valor == null || intermediaria.Valor == ''))

    state.ListaDeEntradas.forEach((Item) => {
      VencimentoInvalidoEntrada += ((Item.Vencimento < state.DataDaProposta) ? 1 : 0);
      MeioDePagamentoVazioEntrada += ((Item.MeioDePagamento == "") ? 1 : 0);
    });

    state.ListaDeSinais.forEach((Item) => {
      VencimentoInvalidoSinal += ((Item.Vencimento < state.DataDaProposta) ? 1 : 0);
      MeioDePagamentoVazioSinal += ((Item.MeioDePagamento == "") ? 1 : 0);
    });

    let ValorTotalEntradaGAVResorts = state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    let ValorTotalSinalGAVResorts = state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    let ValorTotalParcelasGAVResorts = state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;

    let ValorTotalEntrada = state.EntradaValorTotal ?? 0;
    let ValorTotalSinal = state.SinalValorTotal ?? 0;
    let ValorTotalFinanciamento =  state.ParcelaBancoValorTotal ?? 0;
    let ValorSomadoFinanciamento = state.ParcelaBancoQtde * state.ParcelaBancoValor;
    let ValorTotalParcelaObra = state.ParcelaObraValorTotal ?? 0;
    let ValorSomadoParcelaObra = (state.ParcelaObraQtde * state.ParcelaObraValor);
    let ValorTotalParcela = (state.ParcelaValorTotal) ?? 0;
    let ValorSomadoParcela = state.ParcelaQtde * state.ParcelaValor;

    if (state.ItemPickerCondicoesDaTabelaDeVenda == '') {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Nenhum modelo de venda selecionado, selecione o modelo de vendas.`
      })
    }
    else if (!state.ParcelaQtde || !state.ParcelaValor || !state.ParcelaVencimento) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Informações pendentes quanto ao pagamento do saldo a financiar, preencha todos os campos para prosseguir.`
      })
    }
    else if (state.EmpresaLogada == "GAV Resorts" && state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && ValorTotalParcelasGAVResorts.toFixed(2) != ValorSomadoParcela.toFixed(2)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Valor gerado de parcela diferente do modelo, O valor total gerado foi de ${(formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorSomadoParcela)))}, enquanto o modelo consta o valor de ${(formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorTotalParcelasGAVResorts)))}`
      })
    }
    else if (state.EmpresaLogada == "GAV Resorts" && ValorTotalEntradaGAVResorts.toFixed(2) != (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorSomadoEntrada)))) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Valor gerado de entrada diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoEntrada))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalEntradaGAVResorts))}`
      })
    }
    else if (state.EmpresaLogada != "GAV Resorts" && ValorTotalEntrada.toFixed(2) != (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorSomadoEntrada)))) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Valor gerado de entrada diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoEntrada))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalEntrada))}`
      })
    }
    else if (state.EntradaExiste == true && (VencimentoInvalidoEntrada > 0)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Vencimento invalido de entrada, existe um vencimento anterior a data da proposta`
      })
    }
    else if (state.EntradaExiste == true && (MeioDePagamentoVazioEntrada > 0)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Meio de pagamento de entrada inválido, existe um meio de pagamento não selecionado nas entradas.`
      })
    }
    else if(Verf_QtdeIntermediarias != "") {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha todas as quantidades de intermediárias.`
      })
    }
    else if(Verf_DataVencIntermediarias != "") {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha todas os dias de vencimento das intermediárias.`
      })
    }
    else if(Verf_MesRefIntermediarias != "") {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha todos os meses de referência das intermediárias.`
      })
    }
    else if(Verf_ValorIntermediarias != "") {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha todos os valores das intermediárias.`
      })
    }
    else if (state.EmpresaLogada == "GAV Resorts" && ValorTotalSinalGAVResorts.toFixed(2) != (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorSomadoSinal)))) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Valor gerado de sinal diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoSinal))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalSinalGAVResorts))}`
      })
    }
    else if (state.EmpresaLogada != "GAV Resorts" && ValorTotalSinal.toFixed(2) != (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorSomadoSinal)))) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Valor gerado de sinal diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoSinal))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalSinal))}`
      })
    }
    else if (state.SinalExiste == true && (VencimentoInvalidoSinal > 0)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Vencimento invalido de sinal, existe um vencimento anterior a data da proposta`
      })
    }
    else if (state.SinalExiste == true && (MeioDePagamentoVazioSinal > 0)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Meio de pagamento de sinal inválido, existe um meio de pagamento não selecionado nos sinais.`
      })
    }
    else if (state.ParcelaObraExiste == true && (!state.ParcelaObraQtde || !state.ParcelaObraValor || !state.ParcelaObraVencimento)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Informações pendentes quanto ao pagamento das parcelas obra, preencha todos os campos para prosseguir.`
      })
    }
    else if (state.ParcelaBancoExiste == true && (state.ParcelaBancoVencimento < state.DataDaProposta)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Vencimento invalido para as parcelas do financiamento bancário, existe um vencimento anterior a data da proposta`
      })
    }
    else if (state.ParcelaVencimento < state.DataDaProposta) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Vencimento invalido para o saldo a financiar, existe um vencimento anterior a data da proposta`
      })
    }
    // else if (state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && (ValorTotalFinanciamento.toFixed(2) != ValorSomadoFinanciamento.toFixed(2))) { 
    //   return await PushNotification.localNotification({
    //     largeIcon: 'icon',
    //     smallIcon: 'icon',
    //     vibrate: true,
    //     vibration: 300,
    //     title: 'My Broker',
    //     message: `Valor gerado de parcela diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto(ValorSomadoFinanciamento)}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalFinanciamento))}`
    //   })
    // }
    // else if (state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && (ValorTotalParcelaObra.toFixed(2) != ValorSomadoParcelaObra.toFixed(2))) { 
    //   return await PushNotification.localNotification({
    //     largeIcon: 'icon',
    //     smallIcon: 'icon',
    //     vibrate: true,
    //     vibration: 300,
    //     title: 'My Broker',
    //     message: `Valor gerado de parcela diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoParcelaObra))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalParcelaObra))}`
    //   })
    // }
    // else if (state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && (ValorTotalParcela.toFixed(2) != ValorSomadoParcela.toFixed(2))) {
    //   return await PushNotification.localNotification({
    //     largeIcon: 'icon',
    //     smallIcon: 'icon',
    //     vibrate: true,
    //     vibration: 300,
    //     title: 'My Broker',
    //     message: `Valor gerado de parcela diferente do modelo, O valor total gerado foi de ${formatoDeTexto.FormatarTexto((ValorSomadoParcela))}, enquanto o modelo consta o valor de ${formatoDeTexto.FormatarTexto((ValorTotalParcela))}`
    //   })
    // }    
    else if ((state.EmpresaId == 20 || state.EmpresaId == 21 || state.EmpresaId == 22 || state.EmpresaId == 23) && (state.IdCasal == "" || state.IdCasal == null)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Id casal não informado, Preencha todos os campos para prosseguir`
      })
    }
    else if ((state.EmpresaId == 20 || state.EmpresaId == 21 || state.EmpresaId == 22 || state.EmpresaId == 23) && (state.DescricaoItemPickerSala == '' || state.DescricaoItemPickerSala == null)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Sala não informada, Preencha todos os campos para prosseguir`
      })
    }
    else if ((state.EmpresaId == 20 || state.EmpresaId == 21 || state.EmpresaId == 22 || state.EmpresaId == 23) && (state.DescricaoItemPickerLiner == '' || state.DescricaoItemPickerLiner == null)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Liner não informado, Preencha todos os campos para prosseguir`
      })
    }
    else if ((state.EmpresaId == 20 || state.EmpresaId == 21 || state.EmpresaId == 22 || state.EmpresaId == 23) && (state.DescricaoItemPickerCloser == '' || state.DescricaoItemPickerCloser == null)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Closer não informado, Preencha todos os campos para prosseguir`
      })
    }
    else if ((state.EmpresaId == 20 || state.EmpresaId == 21 || state.EmpresaId == 22 || state.EmpresaId == 23) && (state.DescricaoItemPickerPEP == '' || state.DescricaoItemPickerPEP == null)) {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `PEP não informado, Preencha todos os campos para prosseguir`
      })
    }
    else if (state.ListaPickerFinalidadeDeCompra.length > 0 && state.ItemPickerFinalidadeDeCompra == "") {
      return await PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Nenhuma finalidade de compra, selecione a finalidade de compra`
      })
    }
    else {
      return await true;
    }
  }
}

export default new Validacoes();