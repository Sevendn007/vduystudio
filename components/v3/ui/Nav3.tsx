"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { useV3 } from "../V3Context";
import { href, hash } from "@/lib/v3/routes";
import Logo3 from "./Logo3";

export default function Nav3() {
  const { lang } = useLang();
  const { contact } = useV3();
  const nav = homeCopy(lang).nav;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  // Tô sáng mục đang xem — quan sát MỌI section có trên menu (kể cả Dự án).
  useEffect(() => {
    const ids = ["hero", "services", "trust", "projects", "process", "feedback", "contact"];
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = [
    { k: "services", label: nav.services, href: hash("services") },
    { k: "projects", label: nav.projects, href: hash("projects") },
    { k: "process", label: nav.process, href: hash("process") },
    { k: "feedback", label: nav.feedback, href: hash("feedback") },
    { k: "blog", label: nav.blog, href: href("/blog") },
  ];

  const render = (it: (typeof items)[number], onClick?: () => void) =>
    it.href.includes("#") ? (
      <a key={it.k} href={it.href} className={active === it.k ? "is-active" : undefined} onClick={onClick}>{it.label}</a>
    ) : (
      <Link key={it.k} href={it.href} onClick={onClick}>{it.label}</Link>
    );

  return (
    <header className="v3-nav">
      <div className="v3-nav-bar">
        <a href={hash("hero")} className="v3-brand" aria-label="VDuyStudio — về đầu trang">
          <Logo3 size={30} />
        </a>

        <nav className="v3-nav-menu" aria-label="Chính">
          {items.map((it) => render(it))}
        </nav>

        <div className="v3-nav-right">
          <LangToggle compact />
          <a className="v3-btn v3-btn-primary v3-nav-cta" href={contact.zalo} target="_blank" rel="noreferrer">Chat Zalo</a>
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
            <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">Chat Zalo</a>
          </div>
        </div>
      )}
    </header>
  );
}
