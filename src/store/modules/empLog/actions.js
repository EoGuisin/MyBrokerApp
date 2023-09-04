export function addEmpLogada(NomeEmpresa) {
  return {
    type: '@emp/ADD',
    empresa: NomeEmpresa,
  }
}

export function cleanEmpLogada() {
  return {
    type: '@emp/INITIAL_STATE'
  }
}