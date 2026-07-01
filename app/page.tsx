"use client";

import { useEffect, useState } from "react";
import OptionA from "@/components/variants/OptionA";
import OptionB from "@/components/variants/OptionB";
import OptionC from "@/components/variants/OptionC";
import VariantSwitcher, { Variant } from "@/components/VariantSwitcher";

const STORAGE_KEY = "vduy-variant";

export default function Home() {
  const [variant, setVariant] = useState<Variant>("A");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Variant | null;
    if (saved === "A" || saved === "B" || saved === "C") {
      setVariant(saved);
    }
    setMounted(true);
  }, []);

  const handleChange = (v: Variant) => {
    setVariant(v);
    window.localStorage.setItem(STORAGE_KEY, v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Avoid a hydration flash before we know the saved preference.
  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "#0a0a0a" }} />;
  }

  return (
    <>
      <VariantSwitcher value={variant} onChange={handleChange} />
      {variant === "A" && <OptionA />}
      {variant === "B" && <OptionB />}
      {variant === "C" && <OptionC />}
    </>
  );
}
