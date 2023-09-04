export function addToCliente(RegistroExiste, Cpf, DataNascimento, Nome, Email, EstadoCivil, RegimeDeBens, RG, OrgaoEmissor, UFRG, Ocupacao, AssinaturaConjuge) {
  return {
    type: '@cliente/ADD_CPF_DATA_NOME_EMAIL',
    registroexiste: RegistroExiste,
    cpf_cnpj: Cpf,
    data_nasc: DataNascimento,
    nome: Nome,
    email: Email,
    estadocivil: EstadoCivil,
    regimedebens: RegimeDeBens,
    rg: RG,
    orgaoemissor: OrgaoEmissor,
    ufrg: UFRG,
    ocupacao: Ocupacao,
    assinaturaconjuge: AssinaturaConjuge
  }
}

export function cleanToCliente() {
  return {
    type: '@cliente/INITIAL_STATE'
  }
}