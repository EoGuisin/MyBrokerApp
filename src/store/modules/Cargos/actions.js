export function addToCargos(Cargos) {
  return {
    type: '@cargos/ADD',
    cargos: Cargos
  }
}

export function cleanToCargos() {
  return {
    type: '@cargos/INITIAL_STATE'
  }
}