export function addToDocumentosOriginaisLista(Documentos) {
  return {
    type: '@documentosoriginaislista/ADD',
    documentos: Documentos
  }
}

export function cleanToDocumentosOriginaisLista() {
  return {
    type: '@documentosoriginaislista/INITIAL_STATE'
  }
}