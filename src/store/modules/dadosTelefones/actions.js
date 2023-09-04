export function addToTelefones(RegistroExiste, Telefones) {
  return {
    type: '@telefones/ADD',
    registroexiste: RegistroExiste,
    telefones: Telefones
  }
}

export function cleanToTelefones() {
  return {
    type: '@telefones/INITIAL_STATE',
  }
}