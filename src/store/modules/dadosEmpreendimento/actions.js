export function addToEmpresaCentroDeCusto(empresa, centrodecusto) {
  return {
    type: '@empreendimento/ADD_EMPRESA_CENTRODECUSTO',
    empresa: empresa,
    centrodecusto: centrodecusto,
  }
}

export function cleanToEmpresaCentroDeCusto() {
  return {
    type: '@empreendimento/INITIAL_STATE',
  }
}