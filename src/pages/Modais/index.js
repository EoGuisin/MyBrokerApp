//#region Bibliotecas importadas

//#region Nativas
import React from 'react';
import { Modal } from 'react-native';
//#endregion

//#region Modais
import ModalPerfil from './Perfil';
import ModalImpressaoDigital from './ImpressaoDigital';
import ModalSucesso from './Sucesso';
import ModalFalha from './Falha';
import ModalCadastro from './Cadastro';
import ModalCadastroDoLead from './CadastroLead';
import ModalLoading from './Loading';
import ModalEnviandoArquivos from './EnviandoArquivos';
import ModalDeletandoArquivos from './DeletandoArquivos';
import ModalAtualizandoProspect from './AtualizandoProspect';
import ModalEmpreendimento from './Empreendimento';
import ModalMapa from './Mapa';
import ModalCorretor from './Corretor';
import ModalImobiliaria from './Imobiliaria';
import ModalEntradas from './Entradas';
import ModalFinanciamento from './Financiamento';
import ModalFinanciamentoPersonalizado from './FinanciamentoPersonalizado';
import ModalFormularioInicial from './FormularioInicial';
import ModalPropostaEnviada from './PropostaEnviada';
import ModalConfirmarDados from './ConfirmarDados';
import ModalReservaConfirmada from './ReservaConfirmada';
import ModalListaLotes from './ListaLotes';
import ModalEstadoCivil from './EstadoCivil';
import ModalRegimeDeBens from './RegimeDeBens';
import ModalEndereco from './Endereco';
import ModalAnexos from './AnexosDocumentos';
import ModalCalculator from './Calculator';
import ModalFormaDePagamento from './FormaPagamento';
import ModalEntradasPersonalizadas from './EntradasPersonalizadas';
import ModalOption from './Option';
import ModalOptionSenha from './OptionSenha';
import ModalProcurandoDadosCliente from './ProcurandoDadosCliente';
import ModalValidandoArquivos from './ValidandoArquivos';
import ModalAviso from './Aviso';
import ModalUFDoRG from './UFDoRG';
import ModalCargos from './Cargos';
import ModalListaProspect from './ListaProspect';
import ModalCondicoesTabelaDeVenda from './CondicoesTabelaDeVenda';
import ModalSala from './Salas';
import ModalLiner from './Liner';
import ModalCloser from './Closer';
import ModalPEP from './PEP';
import ModalSubGerente from './SubGerenteSala';
import ModalGerente from './GerenteSala';
import ModalEmpresa from './Empresas';
import ModalLoadingGoBack from './LoadingGoBack';
import ModalPrimeiroLogin from './PrimeiroLogin';
import ModalLocalDeCaptacao from './LocalDeCaptacao';
import ModalTlmkt from "./Tlmkt";
import ModalPoliticaDePrivacidade from "./PoliticaDePrivacidade"
import ModalPromotor from "./Promotor";
import ModalFinalidadesDeCompra from "./FinalidadesDeCompra";
import ModalNacionalidade from "./Nacionalidade";
import ModalSexualidade from "./Sexo";
//#endregion

//#region Imagens
import ImagemDeFundo from '../../assets/imagemdefundologin.png';
//#endregion

//#region Efeitos Lottie
import EfeitoDaImpressaoDigital from '../../effects/impressaodigital.json';
import EfeitoSucesso from '../../effects/sucesso.json';
import EfeitoFalha from '../../effects/falha.json';
import EfeitoCadastro from '../../effects/settings.json';
import EfeitoLoading from '../../effects/loader.json';
import EfeitoEnviandoArquivos from '../../effects/check-files.json';
import EfeitoDeletandoArquivos from '../../effects/delete_files.json';
import EfeitoMapa from '../../effects/maps.json';
import EfeitoLocalizacao from '../../effects/location-map.json';
import Calculator from '../../effects/calculator.json';
import EfeitoProcurandoCliente from '../../effects/cliente-scan.json';
import EfeitoValidandoArquivso from '../../effects/check-files.json';
//#endregion

//#endregion

//#region Export Modais
export {
  ModalImpressaoDigital,
  ModalSucesso,
  ModalFalha,
  ModalCadastro,
  ModalCadastroDoLead,
  ModalLoading,
  ModalEnviandoArquivos,
  ModalDeletandoArquivos,
  ModalAtualizandoProspect,
  ModalEmpreendimento,
  ModalMapa,
  ModalCorretor,
  ModalImobiliaria,
  ModalEntradas,
  ModalFinanciamento,
  ModalFinanciamentoPersonalizado,
  ModalFormularioInicial,
  ModalPropostaEnviada,
  ModalConfirmarDados,
  ModalReservaConfirmada,
  ModalListaLotes,
  ModalEstadoCivil,
  ModalRegimeDeBens,
  ModalEndereco,
  ModalAnexos,
  ModalCalculator,
  ModalEntradasPersonalizadas,
  ModalOption,
  ModalOptionSenha,
  ModalFormaDePagamento,
  ModalProcurandoDadosCliente,
  ModalValidandoArquivos,
  ModalAviso,
  ModalUFDoRG,
  ModalCargos,
  ModalListaProspect,
  ModalCondicoesTabelaDeVenda,
  ModalEmpresa,
  ModalSala,
  ModalTlmkt,
  ModalPoliticaDePrivacidade,
  ModalPromotor,
  ModalLiner,
  ModalCloser,
  ModalPEP,
  ModalGerente,
  ModalSubGerente,
  ModalLoadingGoBack,
  ModalPrimeiroLogin,
  ModalLocalDeCaptacao,
  ModalFinalidadesDeCompra,
  ModalNacionalidade,
  ModalSexualidade,
  ModalPerfil,
}
//#endregion