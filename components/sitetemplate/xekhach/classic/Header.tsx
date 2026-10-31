"use client";
import { useEffect, useState } from "react";
import KimLyLogo from "../shared/KimLyLogo";
import { IcClock, IcFacebook, IcMail, IcMenu, IcPhone, IcZalo } from "../shared/Icons";
import { BRAND, NAV } from "@/lib/sitetemplate/xekhach/data";
import { telHref, zaloHref } from "@/lib/sitetemplate/xekhach/booking";

export default function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const onScroll = () => setSmall(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="top">
      <div className="kl-c-topbar">
        <div className="kl-c-wrap kl-c-topbar-in" style={small ? { paddingBlock: 7 } : undefined}>
          <a className="kl-c-brand" href="#top">
            <KimLyLogo size={small ? 40 : 50} />
            <span className="kl-c-brand-tx">
              <b>{BRAND.short}</b>
              <span>Nhà xe · Limousine</span>
            </span>
          </a>

          <div className="kl-c-top-info">
            <div className="kl-c-top-item">
              <IcPhone size={22} />
              <div>
                <span>Đặt vé 24/7</span>
                <b>{BRAND.hotline}</b>
              </div>
            </div>
            <div className="kl-c-top-item">
              <IcClock size={22} />
              <div>
                <span>13 chuyến mỗi ngày</span>
                <b>06:00 – 20:00</b>
              </div>
            </div>
            <div className="kl-c-top-item">
              <IcMail size={22} />
              <div>
                <span>Email</span>
                <b style={{ fontSize: 14 }}>{BRAND.email}</b>
              </div>
            </div>
          </div>

          <div className="kl-c-top-soc">
            <a href={zaloHref()} target="_blank" rel="noreferrer" aria-label="Chat Zalo">
              <IcZalo size={19} />
            </a>
            <a href={BRAND.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook nhà xe">
              <IcFacebook size={19} />
            </a>
          </div>
        </div>
      </div>

      <nav className="kl-c-nav">
        <div className="kl-c-wrap kl-c-nav-in">
          <ul data-open={open ? "true" : "false"}>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="kl-c-burger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Mở menu">
            <IcMenu />
          </button>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a className="kl-c-nav-cta" href={telHref(BRAND.hotline)}>
              <IcPhone size={16} /> {BRAND.hotline}
            </a>
            <button className="kl-c-nav-cta" onClick={onBook} style={{ background: "rgba(0,0,0,.18)", color: "#fff" }}>
              Đặt vé
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
