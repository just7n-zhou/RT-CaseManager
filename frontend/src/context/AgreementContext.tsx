// frontend/src/context/AgreementContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type { Clause, RawAgreement } from "../types";

type AgreementState = {
  agreement: RawAgreement | null;
  clauses: Clause[];
  setAgreementAndInitClauses: (a: RawAgreement, clauseCount: number) => void;
  updateClause: (id: string, text: string) => void;
};

const AgreementContext = createContext<AgreementState | null>(null);

export function useAgreement() {
  const ctx = useContext(AgreementContext);
  if (!ctx) throw new Error("AgreementContext missing");
  return ctx;
}

function makeClauses(a: RawAgreement, count: number): Clause[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    text: `${a.ref} - clause ${i + 1}`,
  }));
}

export function AgreementProvider({ children }: { children: React.ReactNode }) {
  const [agreement, setAgreement] = useState<RawAgreement | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);

  const setAgreementAndInitClauses = (a: RawAgreement, clauseCount: number) => {
    setAgreement(a);
    setClauses(makeClauses(a, clauseCount));
  };

  const updateClause = (id: string, text: string) => {
    // Problem: rebuild whole clauses array on every keystroke
    setClauses((prev) => prev.map((x) => (x.id === id ? { ...x, text } : x)));
  };

  // Problem: context value changes when clauses changes => rerender tree
  const value = useMemo(
    () => ({ agreement, clauses, setAgreementAndInitClauses, updateClause }),
    [agreement, clauses]
  );

  return <AgreementContext.Provider value={value}>{children}</AgreementContext.Provider>;
}
