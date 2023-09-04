export function addToDocumentos(RegistrosExiste, Documentos) {
  return {
    type: '@documentos/ADD',
    registrosexiste: RegistrosExiste,
    documentos: Documentos
  }
}

export function cleanToDocumentos() {
  return {
    type: '@documentos/INITIAL_STATE'
  }
}