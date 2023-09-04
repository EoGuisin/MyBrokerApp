export function addToDocumentosPropostaLista(Documentos) {
  return {
    type: '@documentospropostalista/ADD',
    documentos: Documentos
  }
}

export function cleanToDocumentosPropostaLista() {
  return {
    type: '@documentospropostalista/INITIAL_STATE'
  }
}