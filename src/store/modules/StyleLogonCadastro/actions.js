export function addStyleLogonCadastro(configuracoes) {
  return {
    type: '@stylelogon/ADD_STYLE',
    style: configuracoes
  }
}

export function cleanToStyleLogonCadastro() {
  return {
    type: '@stylelogon/INITIAL_STATE'
  }
}