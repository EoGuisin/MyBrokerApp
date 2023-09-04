const INITIAL_STATE = []

export default function tabelaDeVendas(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@tabeladevendas/ADD_DADOS':
      return [
         action.numerodatabela,
         action.dadosfinanciamento,
         action.disponibilidadeentradas,
         action.disponibilidadeintermediarias,
         action.disponibilidadeparcelas,
         action.disponibilidadeintermediacao,
         action.disponibilidadecorretagem,
         action.primeirovencimento,
         action.tabela
      ];
    case '@tabeladevendas/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}