"use client";
// Ẩn nền WebGL nếu GPU mất context / crash (tránh khối xám + icon lỗi của Chrome).
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.err ? null : this.props.children;
  }
}

export default function WebGLGuard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dead, setDead] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kill = () => setDead(true);
    // webglcontextlost không bubble → bắt ở capture phase
    el.addEventListener("webglcontextlost", kill, true);
    el.addEventListener("webglcontextcreationerror", kill, true);
    return () => {
      el.removeEventListener("webglcontextlost", kill, true);
      el.removeEventListener("webglcontextcreationerror", kill, true);
    };
  }, []);
  if (dead) return null;
  return (
    <div ref={ref} className={className} style={{ display: "contents" }}>
      <Boundary onError={() => setDead(true)}>{children}</Boundary>
    </div>
  );
}
