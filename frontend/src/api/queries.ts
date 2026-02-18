export const GET_CASES_AND_CONTRACTS_SOLUTION = `
  query {
    cases {
      id
      client_name
      status
      contracts {
        id
        external_ref
        status
        source_system
      }
    }
  }
`;
