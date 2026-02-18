// frontend/src/types.ts
export type Clause = { id: string; text: string };

export type SourceAContract = {
  id: string;
  AgreementID: string;
  StatusText: string;
  RenewalDT?: string | null;
};

export type SourceBContract = {
  id: string;
  ContractRef: string;
  State: string;
  RenewalDate?: string | null;
};

export type CaseRow = {
  id: string;
  client_name: string;
  status: string;
  sourceAContracts: SourceAContract[];
  sourceBContracts: SourceBContract[];
};

// A unified frontend “view model” (NOT backend normalization)
// This keeps UI code simple while still reflecting the backend problem.
export type RawAgreement = {
  id: string;
  source: "A" | "B";
  ref: string; // AgreementID or ContractRef
  status: string; // StatusText or State
  renewal?: string | null; // RenewalDT or RenewalDate
};
