export function addToLotes(Lotes) {
  return {
    type: '@lotes/ADD',
    lotes: Lotes
  }
}

export function cleanToLotes() {
  return {
    type: '@lotes/INITIAL_STATE',
  }
}