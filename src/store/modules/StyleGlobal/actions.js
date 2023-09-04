export function addStyleGlobal(configuracoes) {
  return {
    type: '@style/ADD_STYLE',
    style: configuracoes
  }
}

export function cleanToStyleGlobal() {
  return {
    type: '@style/INITIAL_STATE'
  }
}