export function addToDocumentosConjuge(RegistroRGExiste, DocumentosConjuge) {
  return {
    type: '@documentosconjuge/ADD',
    registrorgexiste: RegistroRGExiste,
    documentosconjuge: DocumentosConjuge
  }
}

export function cleanToDocumentosConjuge() {
  return {
    type: '@documentosconjuge/INITIAL_STATE'
  }
}