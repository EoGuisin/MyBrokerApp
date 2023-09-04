export function addToEndereco(RegistroExiste, Endereco) {
  return {
    type: '@endereco/ADD',
    registroexiste: RegistroExiste,
    endereco: Endereco,
  }
}

export function cleanToEndereco() {
  return {
    type: '@endereco/INITIAL_STATE',
  }
}