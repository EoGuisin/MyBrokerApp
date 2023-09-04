export function addToContratos(Contratos, listaContratos) {
  return {
    type: '@contratos/ADD',
    contrato: Contratos,
    lista: listaContratos
  }
}

export function cleanToContratos() {
  return {
    type: '@contratos/INITIAL_STATE',
  }
}