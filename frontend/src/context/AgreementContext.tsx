import React, { createContext, useContext, useMemo, useState } from "react";
import type { Clause, Contract } from "../types";

type AgreementState = {
  contract: Contract | null;
  clauses: Clause[];
  setContractAndInitClauses: (c: Contract, clauseCount: number) => void;
  updateClause: (id: string, text: string) => void;
};

const AgreementContext = createContext<AgreementState | null>(null);

export function useAgreement() {
  const ctx = useContext(AgreementContext);
  if (!ctx) throw new Error("AgreementContext missing");
  return ctx;
}

function makeClauses(contract: Contract, count: number): Clause[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    text: `${contract.external_ref} - clause ${i + 1}`,
  }));
}

export function AgreementProvider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);

  const setContractAndInitClauses = (c: Contract, clauseCount: number) => {
    setContract(c);
    setClauses(makeClauses(c, clauseCount));
  };

  const updateClause = (id: string, text: string) => {
    // PROBLEM: updating one clause rebuilds the whole array (expensive)
    setClauses((prev) => prev.map((x) => (x.id === id ? { ...x, text } : x)));
  };

  // PROBLEM: context value changes on every keystroke => all consumers rerender
  const value = useMemo(
    () => ({ contract, clauses, setContractAndInitClauses, updateClause }),
    [contract, clauses]
  );

  return <AgreementContext.Provider value={value}>{children}</AgreementContext.Provider>;
}
