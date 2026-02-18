export const typeDefs = /* GraphQL */ `
  type Case {
    id: ID!
    client_name: String!
    status: String!
    created_at: String!

    # Intentionally bad design: leaking inconsistent schemas
    sourceAContracts: [SourceAContract!]!
    sourceBContracts: [SourceBContract!]!
  }

  type SourceAContract {
    id: ID!
    case_id: String!
    AgreementID: String!
    StatusText: String!
    RenewalDT: String
  }

  type SourceBContract {
    id: ID!
    case_id: String!
    ContractRef: String!
    State: String!
    RenewalDate: String
  }

  type Query {
    cases: [Case!]!
    case(id: ID!): Case
  }
`;
