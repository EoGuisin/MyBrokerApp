export function addToEntradas(Entradas) {
  return {
    type: '@entradas/ADD',
    entradas: Entradas
  }
}

export function cleanToEntradas() {
  return {
    type: '@entradas/INITIAL_STATE',
  }
}