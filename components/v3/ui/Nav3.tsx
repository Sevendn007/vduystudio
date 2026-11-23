"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { useV3 } from "../V3Context";
import { href, hash } from "@/lib/v3/routes";
import Logo3 from "./Logo3";

export default function Nav3({ base, current }: { base?: string; current?: string } = {}) {
  const { lang } = useLang();
  const { contact } = useV3();
  const nav = homeCopy(lang).nav;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(current ?? "hero");
  const [tone, setTone] = useState<"light" | "solid">(base ? "solid" : "light");
  const [hidden, setHidden] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  // Cuộn xuống → ẩn header, cuộn lên → hiện lại. Luôn hiện ở đầu trang, khi mở menu mobile hoặc khi đang focus trong header.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      if (Math.abs(d) < 6) return;
      last = y;
      if (y < 80 || openRef.current) { setHidden(false); return; }
      setHidden(d > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tô sáng mục đang xem — quan sát MỌI section có trên menu (kể cả Dự án).
  useEffect(() => {
    if (base) return; // trang con: không có các section của trang chủ
    const ids = ["hero", "process", "services", "trust", "projects", "feedback", "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Nền trong suốt + chữ trắng khi nằm trên khối chrome lỏng (hero / footer CTA), còn lại nền kem.
  useEffect(() => {
    const dark = [".v3-hero-stage", ".v3-foot-stage"];
    const onScroll = () => {
      const y = 40;
      const over = dark.some((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom - 60 > y;
      });
      setTone(over ? "light" : "solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Trang chủ: neo trong trang (#id). Trang con: về trang chủ rồi cuộn tới mục (/#id).
  const anchor = (id: string) => (base ? `${base.replace(/\/$/, "")}/#${id}` : hash(id));
  const items = [
    { k: "process", label: nav.process, href: anchor("process") },
    { k: "services", label: nav.services, href: anchor("services") },
    { k: "projects", label: nav.projects, href: anchor("projects") },
    { k: "feedback", label: nav.feedback, href: anchor("feedback") },
    { k: "blog", label: nav.blog, href: href("/blog") },
  ];

  const render = (it: (typeof items)[number], onClick?: () => void) =>
    it.href.includes("#") && !base ? (
      <a key={it.k} href={it.href} className={active === it.k ? "is-active" : undefined} onClick={onClick}>{it.label}</a>
    ) : (
      <Link key={it.k} href={it.href} className={active === it.k ? "is-active" : undefined} onClick={onClick}>{it.label}</Link>
    );

  return (
    <header className={`v3-nav is-${tone}${hidden ? " is-hidden" : ""}`} onFocus={() => setHidden(false)}>
      <div className="v3-nav-bar">
        <a href={base ? "/" : hash("hero")} className="v3-brand" aria-label="VDuyStudio — về đầu trang">
          <Logo3 size={30} />
        </a>

        <nav className="v3-nav-menu" aria-label="Chính">
          {items.map((it) => render(it))}
        </nav>

        <div className="v3-nav-right">
          <LangToggle compact />
          <a className="v3-btn v3-nav-cta" href={contact.zalo} target="_blank" rel="noreferrer">Chat Zalo</a>
          <button className="v3-burger" aria-label={nav.menu} aria-expanded={open} onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className="v3-nav-sheet" role="dialog" aria-modal="true" aria-label={nav.menu}>
          <button className="v3-burger v3-nav-close" style={{ display: "flex" }} aria-label="Đóng" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <div className="v3-nav-sheet-inner">
            {items.map((it) => render(it, () => setOpen(false)))}
            <a className="v3-btn v3-btn-blue v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">Chat Zalo</a>
          </div>
        </div>
      )}
    </header>
  );
}
