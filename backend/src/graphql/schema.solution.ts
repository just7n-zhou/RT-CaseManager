export const typeDefs = /* GraphQL */ `
  type Case {
    id: ID!
    client_name: String!
    status: String!
    created_at: String!
    contracts: [Contract!]!
  }

  type Contract {
    id: ID!
    case_id: ID!
    external_ref: String!
    status: String!
    renewal_date: String
    source_system: String!
    versions(limit: Int = 20, cursor: String): VersionsPage!
  }

  type ContractVersion {
    id: ID!
    contract_id: ID!
    version_number: Int!
    status: String!
    created_at: String!
  }

  type VersionsPage {
    items: [ContractVersion!]!
    nextCursor: String
  }

  type Query {
    cases: [Case!]!
    case(id: ID!): Case
  }
`;
