import React from 'react';
import formatoDeTexto from '../Style/formatoDeTexto'; 
import PushNotification from 'react-native-push-notification';

class CalculosFinanceiros {
  static = {
    ValorTotalDeBalao: 0
  };

  async simulacaoDeVenda(SimulacaoDeVenda) {
    const ValorTotalReservado = Object.keys(SimulacaoDeVenda.unidadesReservadas).length > 0 ?  SimulacaoDeVenda.unidadesReservadas.reduce((total, lote) => total + lote.valorAVista, 0) : 0;
    const ValorTotalDeEntrada = Object.keys(SimulacaoDeVenda.titulosDeEntrada).length > 0 ? SimulacaoDeVenda.titulosDeEntrada.reduce((total, entrada) => total + entrada.valor, 0) : 0;
    const ValorTotalDeParcela = Object.keys(SimulacaoDeVenda.titulosDeParcela).length > 0 ? SimulacaoDeVenda.titulosDeParcela.qtde * SimulacaoDeVenda.titulosDeParcela.valor : 0;
    this.static.ValorTotalDeBalao = 0;
    for (let i = 1; i < SimulacaoDeVenda.titulosDeParcela.qtde; i++) {
      try {
      
        this.static.ValorTotalDeBalao = this.static.ValorTotalDeBalao + SimulacaoDeVenda.titulosDeBalao.find(balao => balao.mesDeReferencia == i % 12).valor;
      
      } catch { }
    }
    
    const ValorTotal = ValorTotalDeEntrada + ValorTotalDeParcela + this.static.ValorTotalDeBalao;

    if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) < -1) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: O valor da venda ultrapassou em ${formatoDeTexto.Moeda((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)))} por favor reveja os critérios`
        })
    } else if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) > 1) {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Aviso: O valor da venda esta faltando ${formatoDeTexto.Moeda(((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100))))} por favor reveja os critérios`
        })
    } else if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) >= -1 && ((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) <= 1) {
      return await true;
    }
  }
  async valoraDistribuir(SimulacaoDeVenda) {
    const ValorTotalReservado = Object.keys(SimulacaoDeVenda.unidadesReservadas).length > 0 ?  SimulacaoDeVenda.unidadesReservadas.reduce((total, lote) => total + lote.valorAVista, 0) : 0;
    const ValorTotalDeEntrada = Object.keys(SimulacaoDeVenda.titulosDeEntrada).length > 0 ? SimulacaoDeVenda.titulosDeEntrada.reduce((total, entrada) => total + entrada.valor, 0) : 0;
    const ValorTotalDeParcela = Object.keys(SimulacaoDeVenda.titulosDeParcela).length > 0 ? SimulacaoDeVenda.titulosDeParcela.qtde * SimulacaoDeVenda.titulosDeParcela.valor : 0;
    this.static.ValorTotalDeBalao = 0;
    if(Object.keys(SimulacaoDeVenda.titulosDeParcela).length > 0) {
      for (let i = 1; i < SimulacaoDeVenda.titulosDeParcela.qtde; i++) {
        try {
        
          this.static.ValorTotalDeBalao = this.static.ValorTotalDeBalao + SimulacaoDeVenda.titulosDeBalao.find(balao => balao.mesDeReferencia == i % 12).valor;
        
        } catch { }
      }
    }
    const ValorTotal = ValorTotalDeEntrada + ValorTotalDeParcela + this.static.ValorTotalDeBalao;

    if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) < -1) {
      return await [
        {
          Valor: formatoDeTexto.Moeda((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100))),
          colorTexto: '#F00',
          colorTexto_2: '#F00',
        }
      ]
    } else if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) > 1) {
      return await [
        {
          Valor: formatoDeTexto.Moeda(((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)))),
          colorTexto: '#FFF',
          colorTexto_2: '#000'
        }
      ]
    } else if (((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) >= -1 && ((parseInt(ValorTotalReservado * 100) - parseInt(ValorTotal * 100)) / 100) <= 1) {
      return await [
        {
          Valor: formatoDeTexto.Moeda(0),
          colorTexto: '#FFF',
          colorTexto_2: '#000'
        }
      ];
    }
  }
}

export default new CalculosFinanceiros();