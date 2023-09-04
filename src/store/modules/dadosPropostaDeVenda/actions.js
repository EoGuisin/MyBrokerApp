export function addToPropostaDeVenda(Proposta) {
  return {
    type: '@propostadevenda/ADD_DADOS',
    propostadevenda: Proposta
  }
}

export function cleanToPropostaDeVenda() {
  return {
    type: '@propostadevenda/INITIAL_STATE'
  }
}