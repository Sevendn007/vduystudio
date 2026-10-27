"use client";
import dynamic from "next/dynamic";

const LABS = {
  ribbon: dynamic(() => import("./ribbon"), { ssr: false }),
  prism: dynamic(() => import("./prism"), { ssr: false }),
  nebula: dynamic(() => import("./nebula"), { ssr: false }),
} as const;

export default function LabSwitch({ id }: { id: string }) {
  const Comp = LABS[id as keyof typeof LABS];
  if (!Comp) return <p style={{ padding: 40 }}>Không có nguyên mẫu “{id}”.</p>;
  return (
    <div className="v3" style={{ minHeight: "100vh" }}>
      <Comp />
    </div>
  );
}
