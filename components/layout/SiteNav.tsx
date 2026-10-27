"use client";
/* eslint-disable @next/next/no-img-element */

// Thanh điều hướng kính dạng viên thuốc nổi: indicator trượt theo section
// đang xem, thu gọn khi cuộn, ẩn khi cuộn xuống nhanh / hiện khi cuộn lên.
// Mobile: hamburger → sheet toàn màn hình (trap focus, Esc để đóng).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { useContact } from "@/lib/useContact";
import { HOLO_HOME } from "@/lib/uiMode";

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const t = homeCopy(lang).nav;
  const contact = useContact();
  const pathname = usePathname();
  const onHome = pathname === HOLO_HOME;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const sheetRef = useRef<HTMLDivElement>(null);

  const items = [
    { id: "services", label: t.services, href: onHome ? "#services" : `${HOLO_HOME}#services` },
    { id: "process", label: t.process, href: onHome ? "#process" : `${HOLO_HOME}#process` },
    { id: "projects", label: t.projects, href: "/du-an" },
    { id: "feedback", label: t.feedback, href: onHome ? "#feedback" : `${HOLO_HOME}#feedback` },
    { id: "blog", label: t.blog, href: "/blog" },
  ];

  // thu gọn / ẩn hiện theo hướng cuộn
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 120);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // active section (chỉ ở trang chủ); trang con: theo pathname
  useEffect(() => {
    if (!onHome) {
      setActive(pathname.startsWith("/du-an") ? "projects" : pathname.startsWith("/blog") ? "blog" : "");
      return;
    }
    const ids = ["services", "projects", "process", "feedback"];
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
  }, [onHome, pathname]);

  // sheet mobile: khóa cuộn, Esc, trap focus
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && sheet) {
        const f = Array.from(sheet.querySelectorAll<HTMLElement>("a,button"));
        const first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), lastEl.focus());
        else if (!e.shiftKey && document.activeElement === lastEl) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const langToggle = (
    <div className="nav-lang" role="group" aria-label="Language">
      {(["vi", "en"] as const).map((l) => (
        <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}`}>
        <nav className="nav-bar glass" aria-label="Main">
          <Link href={HOLO_HOME} className="nav-brand" aria-label="VDuyStudio — trang chủ">
            <img src="/brand/logo/vduy-mark-128.png" srcSet="/brand/logo/vduy-mark-256.png 2x" alt="" width={40} height={40} />
            <span>VDuyStudio</span>
          </Link>
          <ul className="nav-menu">
            {items.map((it) => (
              <li key={it.id}>
                <Link href={it.href} className={active === it.id ? "on" : ""} aria-current={active === it.id ? "true" : undefined}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            {langToggle}
            <a className="btn btn-primary btn-sm nav-cta" href={contact.zalo} target="_blank" rel="noreferrer">
              {t.contact}
            </a>
            <button
              className="nav-burger"
              aria-label={t.menu}
              aria-expanded={open}
              aria-controls="nav-sheet"
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </nav>
      </header>

      <div id="nav-sheet" ref={sheetRef} className={`nav-sheet${open ? " open" : ""}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={t.menu}>
        <ul>
          {items.map((it, i) => (
            <li key={it.id} style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}>
              <Link href={it.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <small>0{i + 1}</small> {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-sheet-foot">
          {langToggle}
          <a className="btn btn-primary" href={contact.zalo} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            {t.contact} Zalo
          </a>
        </div>
      </div>
    </>
  );
}
