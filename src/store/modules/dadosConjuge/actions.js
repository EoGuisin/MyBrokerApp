export function addToConjuge(RegistroExiste, Cpf, DataNascimento, Nome, Email, RG, OrgaoEmissor, UFRG, Ocupacao) {
  return {
    type: '@conjuge/ADD',
    registroexiste: RegistroExiste,
    cpf_cnpj: Cpf,
    data_nasc: DataNascimento,
    nome: Nome,
    email: Email,
    rg: RG,
    orgaoemissor: OrgaoEmissor,
    ufrg: UFRG,
    ocupacao: Ocupacao
  }
}

export function cleanToConjuge() {
  return {
    type: '@conjuge/INITIAL_STATE'
  }
}