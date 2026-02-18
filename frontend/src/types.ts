export type Clause = { id: string; text: string };

export type Contract = {
  id: string;
  external_ref: string;
  status: string;
  source_system: string;
};

export type CaseRow = {
  id: string;
  client_name: string;
  contracts: Contract[];
};
