export function addToDadosTabelaDeVendas(numTabelaDeVendas, Financiamento, Vencimento, DisponibilidadeEntradas, DisponibilidadeIntermediaria, DisponibilidadeParcelas, DisponibilidadeIntermediacao, DisponibilidadeCorretagem, tabelacompleta) {
  return {
    type: '@tabeladevendas/ADD_DADOS',
    numerodatabela: numTabelaDeVendas,
    dadosfinanciamento: Financiamento,
    disponibilidadeentradas: DisponibilidadeEntradas,
    disponibilidadeintermediarias: DisponibilidadeIntermediaria,
    disponibilidadeparcelas: DisponibilidadeParcelas,
    disponibilidadeintermediacao: DisponibilidadeIntermediacao,
    disponibilidadecorretagem: DisponibilidadeCorretagem,
    primeirovencimento: Vencimento,
    tabela: tabelacompleta
  }
}

export function cleanToDadosTabelaDeVendas() {
  return {
    type: '@tabeladevendas/INITIAL_STATE'
  }
}