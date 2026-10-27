"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { DbProject, DbFeedback, DbPriceRow } from "@/lib/data";
import { makeContact, type V3Contact, type V3Settings } from "@/lib/v3/contact";
import { resolveTier, type Tier } from "@/lib/v3/quality";

export type V3Data = {
  projects: DbProject[] | null;
  feedbacks: DbFeedback[] | null;
  settings: V3Settings | null;
  pricing: Record<string, DbPriceRow[] | null>;
};

type V3Ctx = V3Data & { contact: V3Contact; tier: Tier; tierReady: boolean };

const Ctx = createContext<V3Ctx | null>(null);

export function V3Provider({ data, children }: { data: V3Data; children: React.ReactNode }) {
  const contact = useMemo(() => makeContact(data.settings), [data.settings]);
  // SSR = 2 (desktop giả định); client resolve thật sau mount → tránh hydration mismatch
  const [tier, setTier] = useState<Tier>(2);
  const [tierReady, setTierReady] = useState(false);
  useEffect(() => {
    setTier(resolveTier());
    setTierReady(true);
  }, []);
  const value = useMemo<V3Ctx>(() => ({ ...data, contact, tier, tierReady }), [data, contact, tier, tierReady]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useV3(): V3Ctx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useV3 must be used within V3Provider");
  return v;
}
