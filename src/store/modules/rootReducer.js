import { combineReducers } from 'redux';

import dadosUsuario from './dadosUsuario/reducer';
import Cargos from './Cargos/reducer';
import TabelaFIP from './TabelaFIP/reducer';
import telaAtual from './telaAtual/reducer';
import dadosContratos from './dadosContratos/reducer';
import dadosEmpreendimento from './dadosEmpreendimento/reducer';
import dadosModeloDeVendas from './dadosModeloDeVendas/reducer';
import dadosMeiosDeContato from './dadosMeiosDeContato/reducer';
import dadosLotes from './dadosLotes/reducer';
import dadosLead from './dadosLead/reducer';
import dadosCliente from './dadosCliente/reducer';
import dadosConjuge from './dadosConjuge/reducer';
import dadosEndereco from './dadosEndereco/reducer';
import dadosTelefones from './dadosTelefones/reducer';
import DocumentosOriginais from './DocumentosOriginais/reducer';
import dadosDocumentos from './dadosDocumentos/reducer';
import dadosDocumentosConjuge from './dadosDocumentosConjuge/reducer';
import dadosEntradas from './dadosEntradas/reducer';
import dadosIntermediarias from './dadosIntermediarias/reducer';
import dadosParcelas from './dadosParcelas/reducer';
import dadosTabelaDeVenda from './dadosTabelaDeVenda/reducer';
import dadosCorretagem from './dadosCorretagem/reducer';
import dadosIntermediacao from './dadosIntermediacao/reducer';
import dadosTabelaParcelas from './dadosTabelaParcela/reducer';
import dadosFinanciamento from './dadosFinanciamento/reducer';
import dadosPropostaDeVenda from './dadosPropostaDeVenda/reducer';
import configcssApp from './configcssApp/reducer';
import DocumentosOriginaisLista from './DocumentosOriginaisLista/reducer';
import EmpresaLogada from './empLog/reducer';
import StyleGlobal from './StyleGlobal/reducer';
import StyleLogonCadastro from './StyleLogonCadastro/reducer';
import DocumentosPropostaLista from './DocumentosPropostaLista/reducer';

export default combineReducers({
  dadosUsuario,
  Cargos,
  TabelaFIP,
  telaAtual,
  dadosContratos,
  dadosEmpreendimento,
  dadosMeiosDeContato,
  dadosModeloDeVendas,
  dadosLotes,
  dadosLead,
  dadosCliente,
  dadosConjuge,
  dadosEndereco,
  dadosTelefones,
  DocumentosOriginais,
  dadosDocumentos,
  dadosDocumentosConjuge,
  dadosEntradas,
  dadosIntermediarias,
  dadosParcelas,
  dadosTabelaDeVenda,
  dadosCorretagem,
  dadosIntermediacao,
  dadosTabelaParcelas,
  dadosFinanciamento,
  configcssApp,
  dadosPropostaDeVenda,
  DocumentosOriginaisLista,
  EmpresaLogada,
  StyleGlobal,
  StyleLogonCadastro,
  DocumentosPropostaLista
});