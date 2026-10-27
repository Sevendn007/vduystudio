"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { useV3 } from "../V3Context";
import { href, hash } from "@/lib/v3/routes";

export default function Nav3() {
  const { lang } = useLang();
  const { contact } = useV3();
  const nav = homeCopy(lang).nav;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  // Active section (không ẩn nav, chỉ tô sáng mục hiện tại).
  useEffect(() => {
    const ids = ["services", "process", "feedback", "contact"];
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

  const items = [
    { k: "services", label: nav.services, href: hash("services") },
    { k: "process", label: nav.process, href: hash("process") },
    { k: "projects", label: nav.projects, href: href("/du-an") },
    { k: "feedback", label: nav.feedback, href: hash("feedback") },
    { k: "blog", label: nav.blog, href: href("/blog") },
  ];

  return (
    <header className="v3-nav">
      <div className="v3-nav-bar">
        <a href={hash("hero")} className="v3-brand" aria-label="VDuyStudio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo/vduy-mark-128.png" alt="" width={34} height={34} className="v3-brand-mark" />
          <span className="v3-brand-name">VDuyStudio</span>
        </a>

        <nav className="v3-nav-menu" aria-label="Chính">
          {items.map((it) =>
            it.href.includes("#") ? (
              <a key={it.k} href={it.href} className={active === it.k ? "is-active" : ""}>
                {it.label}
              </a>
            ) : (
              <Link key={it.k} href={it.href}>
                {it.label}
              </Link>
            )
          )}
        </nav>

        <div className="v3-nav-right">
          <LangToggle compact />
          <a className="v3-btn v3-btn-primary v3-nav-cta" href={contact.zalo} target="_blank" rel="noreferrer">
            Chat Zalo
          </a>
          <button
            className="v3-burger"
            aria-label={nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className="v3-nav-sheet" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="v3-nav-sheet-inner" onClick={(e) => e.stopPropagation()}>
            {items.map((it) =>
              it.href.includes("#") ? (
                <a key={it.k} href={it.href} onClick={() => setOpen(false)}>{it.label}</a>
              ) : (
                <Link key={it.k} href={it.href} onClick={() => setOpen(false)}>{it.label}</Link>
              )
            )}
            <a className="v3-btn v3-btn-primary" href={contact.zalo} target="_blank" rel="noreferrer">
              Chat Zalo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
