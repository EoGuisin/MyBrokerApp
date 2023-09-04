export function addToMeiosDeContato(meiosdecontato) {
  return {
    type: '@meiosdecontato/ADD_MEIOS_DE_CONTATO',
    meios: meiosdecontato,
  }
}

export function cleanToMeiosDeContato() {
  return {
    type: '@meiosdecontato/INITIAL_STATE',
  }
}