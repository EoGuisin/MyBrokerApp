export function addToTela(tela) {
  return {
    type: '@tela_atual',
    tela: tela,
  }
}

export function cleanToTela() {
  return {
    type: '@tela_atual/INITIAL_STATE',
  }
}