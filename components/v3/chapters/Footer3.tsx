"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { useV3 } from "../V3Context";
import { Mark3 } from "../ui/Logo3";
import Icon3 from "../ui/Icon3";
import LiquidCanvas from "../canvas/LiquidCanvas";
import Seal from "../ui/Seal";

const SOCIAL = ["tiktok", "facebook", "instagram", "threads", "youtube", "x"] as const;

// FOOTER: khép lại bằng đúng chất liệu chrome lỏng của hero (chỉ chạy khi hiện trên màn hình).
export default function Footer3() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  const { contact } = useV3();
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const social = SOCIAL.filter((k) => contact.isSet(k));
  const h = t.cta.h2.replace(/\?$/, "");

  return (
    <footer id="contact" className="v3-foot v3-station">
      <div className="v3-foot-stage">
        <LiquidCanvas seed={11} dim={0.85} />
        <div className="v3-foot-cta v3-container">
          <p className="v3-eyebrow v3-eyebrow-light">{c.stations.contact.nav}</p>
          <h2 className="v3-foot-h">{h}<em className="v3-serif">?</em></h2>
          <p className="v3-foot-sub">{t.cta.sub}</p>
          <div className="v3-foot-ctas">
            <a className="v3-btn v3-btn-white v3-btn-xl" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta.zalo} →</a>
            {contact.isSet("messenger") && (
              <a className="v3-btn v3-btn-glass v3-btn-xl" href={contact.messenger} target="_blank" rel="noreferrer">{t.cta.messenger}</a>
            )}
          </div>
        </div>
        <Seal className="v3-foot-seal" text={lang === "en" ? "FREE CONSULTATION · REPLY FAST · VDUYSTUDIO · " : "TƯ VẤN MIỄN PHÍ · PHẢN HỒI NHANH · VDUYSTUDIO · "} />
      </div>

      <div className="v3-foot-base">
        <div className="v3-container v3-foot-grid">
          <div className="v3-foot-brand">
            <span className="v3-logo v3-logo-light"><Mark3 size={34} /><span className="v3-logo-name">VDuy<span>Studio</span></span></span>
            <p>{c.heroTag}.</p>
          </div>
          <nav className="v3-foot-col" aria-label={t.footer.links}>
            <h4>{t.footer.links}</h4>
            <a href="#services" onClick={go("services")}>{t.nav.services}</a>
            <a href="#pricing" onClick={go("pricing")}>{c.dock.pricing}</a>
            <a href="#projects" onClick={go("projects")}>{t.nav.projects}</a>
            <Link href={href("/blog")}>{t.nav.blog}</Link>
          </nav>
          <div className="v3-foot-col">
            <h4>{t.footer.follow}</h4>
            {social.length > 0 && (
              <div className="v3-social">
                {social.map((k) => (
                  <a key={k} href={contact[k]} target="_blank" rel="noreferrer" aria-label={k}><Icon3 name={k} size={20} /></a>
                ))}
              </div>
            )}
            <a href={contact.zalo} target="_blank" rel="noreferrer">Zalo</a>
            {contact.isSet("phone") && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>}
            {contact.isSet("email") && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          </div>
        </div>
        <div className="v3-container v3-foot-wordmark" aria-hidden>VDUYSTUDIO</div>
        <div className="v3-container v3-foot-bar">
          <span>© 2026 VDuyStudio. {t.footer.rights}</span>
          <span>{c.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
