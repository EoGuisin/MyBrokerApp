export function addToDocumentosOriginais(Documentos) {
  return {
    type: '@documentosoriginais/ADD',
    documentos: Documentos
  }
}

export function cleanToDocumentosOriginais() {
  return {
    type: '@documentosoriginais/INITIAL_STATE'
  }
}