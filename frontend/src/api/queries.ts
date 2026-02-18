export const GET_CASES_AND_CONTRACTS = `
  query {
    cases {
      id
      client_name
      contracts {
        id
        external_ref
        status
        source_system
      }
    }
  }
`;
