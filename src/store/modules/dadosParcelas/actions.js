export function addToParcelas(Parcelas) {
  return {
    type: '@parcelas/ADD',
    parcelas: Parcelas
  }
}

export function cleanToParcelas() {
  return {
    type: '@parcelas/INITIAL_STATE',
  }
}