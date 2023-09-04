export function addToModelo(Modelo) {
  return {
    type: '@modelo/ADD',
    modelodevendas: Modelo
  }
}

export function cleanToModelo() {
  return {
    type: '@modelo/INITIAL_STATE',
  }
}