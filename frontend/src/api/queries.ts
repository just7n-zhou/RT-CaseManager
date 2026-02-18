// frontend/src/api/queries.ts
export const GET_CASES_AND_RAW_CONTRACTS = `
  query {
    cases {
      id
      client_name
      status
      sourceAContracts { id AgreementID StatusText RenewalDT }
      sourceBContracts { id ContractRef State RenewalDate }
    }
  }
`;
