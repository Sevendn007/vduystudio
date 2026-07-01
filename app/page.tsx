"use client";

import { useEffect, useState } from "react";
import OptionA from "@/components/variants/OptionA";
import OptionB from "@/components/variants/OptionB";
import OptionC from "@/components/variants/OptionC";
import OptionG from "@/components/variants/OptionG";
import OptionE from "@/components/variants/OptionE";
import OptionF from "@/components/variants/OptionF";
import VariantSwitcher, { Variant } from "@/components/VariantSwitcher";

const STORAGE_KEY = "vduy-variant";

export default function Home() {
  const [variant, setVariant] = useState<Variant>("A");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Variant | null;
    if (saved && ["A", "B", "C", "D", "E", "F"].includes(saved)) {
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
      {variant === "D" && <OptionG />}
      {variant === "E" && <OptionE />}
      {variant === "F" && <OptionF />}
    </>
  );
}
