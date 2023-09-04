export function addToTabelaFIP(TabelaFIP) {
  return {
    type: '@tabelafip/ADD',
    tabelafip: TabelaFIP
  }
}

export function cleanToTabelaFIP() {
  return {
    type: '@tabelafip/INITIAL_STATE'
  }
}