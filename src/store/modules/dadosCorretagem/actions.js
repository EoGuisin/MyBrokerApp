export function addToCorretagem(corretagem) {
  return {
    type: '@corretagem/ADD',
    dadoscorretagem: corretagem
  }
}

export function cleanToCorretagem() {
  return {
    type: '@corretagem/INITIAL_STATE',
  }
}