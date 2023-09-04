export function addToFinanciamento(financiamento) {
  return {
    type: '@financiamento/ADD',
    dadosfinanciamento: financiamento
  }
}

export function cleanToFinanciamento() {
  return {
    type: '@financiamento/INITIAL_STATE',
  }
}