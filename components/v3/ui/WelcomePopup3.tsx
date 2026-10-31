"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang, Lang } from "@/lib/i18n";
import { useContact } from "@/lib/useContact";
import type { Icon3DName } from "@/lib/homeCopy";
import { Mark3 } from "./Logo3";
import Icon3 from "./Icon3";

const SEEN_KEY = "vds_v3_welcome_seen";
const OPEN_DELAY = 1000;

const SERVICES = (lang: Lang): { slug: string; icon: Icon3DName; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Verification · Unlock · Live" : "Tích xanh, mở khóa, live" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Blue badge · Recovery" : "Tích xanh, kháng page & nick" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram", desc: lang === "en" ? "Meta badge & recovery" : "Tích xanh & bảo mật nick" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press" : "Báo chí", desc: lang === "en" ? "PR booking · SEO" : "Booking báo, bài PR chuẩn SEO" },
  { slug: "website", icon: "website", name: "Website", desc: lang === "en" ? "Landing · Store · Tool" : "Landing page, web thương hiệu" },
];

const TX = {
  vi: {
    kicker: "VDuyStudio Verification",
    title: "HỖ TRỢ DỊCH VỤ",
    subtitle: "Xây dựng uy tín số & dấu tích xanh chính chủ cho thương hiệu.",
    explore: "Xem bảng giá & dịch vụ",
    zalo: "Tư vấn Zalo 24/7",
    close: "Đóng cửa sổ",
    trust: [
      { t: "3+ NĂM", s: "Kinh nghiệm thực chiến" },
      { t: "24–72H", s: "Tốc độ xử lý chuẩn" },
      { t: "100%", s: "Bảo mật & cam kết" },
    ],
  },
  en: {
    kicker: "VDuyStudio Verification",
    title: "SERVICE SUPPORT",
    subtitle: "Building digital trust & official badges for brands and creators.",
    explore: "Explore services & pricing",
    zalo: "Chat on Zalo 24/7",
    close: "Close dialog",
    trust: [
      { t: "3+ YRS", s: "Proven track record" },
      { t: "24–72H", s: "Fast turnaround" },
      { t: "100%", s: "Confidential & guaranteed" },
    ],
  },
};

export default function WelcomePopup3({ deferOpen = false }: { deferOpen?: boolean } = {}) {
  const { lang } = useLang();
  const contact = useContact();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const t = TX[lang];
  const services = SERVICES(lang);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, 280);
  }, []);

  const handleServiceClick = useCallback((slug: string) => {
    close();
    setTimeout(() => {
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, [close]);

  const handleExplore = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    close();
    setTimeout(() => {
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, [close]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const force = new URLSearchParams(window.location.search).get("popup") === "1";
    if (!force) {
      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
      } catch {}
    }

    if (!deferOpen || force) {
      const id = setTimeout(() => setMounted(true), OPEN_DELAY);
      return () => clearTimeout(id);
    }

    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      setMounted(true);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.4) open();
    };
    const id = setTimeout(open, 10000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [deferOpen]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, close]);

  if (!mounted) return null;

  return (
    <div
      className={`v3-pop-overlay ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={`v3-pop-card ${closing ? "is-closing" : ""}`}>
        <button
          type="button"
          className="v3-pop-close"
          onClick={close}
          aria-label={t.close}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="v3-pop-head">
          <div className="v3-pop-mark">
            <Mark3 size={44} />
          </div>
          <div className="v3-pop-head-info">
            <span className="v3-pop-kicker">
              <span className="v3-pop-live-dot" /> {t.kicker}
            </span>
            <h2 className="v3-pop-title">{t.title}</h2>
          </div>
        </div>

        <p className="v3-pop-sub">{t.subtitle}</p>

        <div className="v3-pop-services">
          {services.map((svc) => (
            <button
              key={svc.slug}
              type="button"
              className="v3-pop-svc-row"
              onClick={() => handleServiceClick(svc.slug)}
            >
              <span className="v3-pop-svc-icon">
                <Icon3 name={svc.icon} size={20} />
              </span>
              <span className="v3-pop-svc-text">
                <span className="v3-pop-svc-name">{svc.name}</span>
                <span className="v3-pop-svc-desc">{svc.desc}</span>
              </span>
              <span className="v3-pop-svc-arrow">→</span>
            </button>
          ))}
        </div>

        <div className="v3-pop-trust-row">
          {t.trust.map((item, idx) => (
            <div key={idx} className="v3-pop-trust-item">
              <b>{item.t}</b>
              <span>{item.s}</span>
            </div>
          ))}
        </div>

        <div className="v3-pop-actions">
          <a
            href={contact.zalo}
            target="_blank"
            rel="noreferrer"
            className="v3-pop-btn-zalo"
            onClick={close}
          >
            <span className="v3-pop-btn-glow" />
            {t.zalo}
          </a>
          <button
            type="button"
            className="v3-pop-btn-explore"
            onClick={handleExplore}
          >
            {t.explore}
          </button>
        </div>
      </div>
    </div>
  );
}
