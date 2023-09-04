export function addToIntermediarias(Intermediarias) {
  return {
    type: '@intermediarias/ADD',
    intermediarias: Intermediarias
  }
}

export function cleanToIntermediarias() {
  return {
    type: '@intermediarias/INITIAL_STATE',
  }
}