export function addToTabelaParcelas(Parcelas) {
  return {
    type: '@tabelaparcelas/ADD',
    tabela: Parcelas
  }
}

export function cleanToTabelaParcelas() {
  return {
    type: '@tabelaparcelas/INITIAL_STATE',
  }
}