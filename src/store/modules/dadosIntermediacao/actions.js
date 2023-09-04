export function addToIntermediacao(intermediacao) {
  return {
    type: '@intermediacao/ADD',
    dadosintermediacao: intermediacao
  }
}

export function cleanToIntermediacao() {
  return {
    type: '@intermediacao/INITIAL_STATE',
  }
}