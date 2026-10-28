"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { useV3 } from "../V3Context";
import Logo3 from "../ui/Logo3";
import Icon3 from "../ui/Icon3";

const SOCIAL = ["tiktok", "facebook", "instagram", "threads", "youtube", "x"] as const;

export default function Footer3() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  const { contact } = useV3();
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const social = SOCIAL.filter((k) => contact.isSet(k));

  return (
    <footer id="contact" className="v3-footer v3-station">
      <div className="v3-container">
        <div className="v3-cta-panel">
          <p className="v3-eyebrow">{c.stations.contact.no} — {c.stations.contact.nav}</p>
          <h2 className="v3-h2">{t.cta.h2}</h2>
          <p className="v3-lead">{t.cta.sub}</p>
          <div className="v3-ctas">
            <a className="v3-btn v3-btn-light v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta.zalo} →</a>
            {contact.isSet("messenger") && (
              <a className="v3-btn v3-btn-ghost v3-btn-lg" href={contact.messenger} target="_blank" rel="noreferrer">{t.cta.messenger}</a>
            )}
          </div>
        </div>

        <div className="v3-footer-grid">
          <div className="v3-footer-brand">
            <Logo3 size={36} />
            <p className="v3-footer-about">{c.heroTag}.</p>
          </div>

          <div className="v3-footer-col">
            <h4>{t.footer.links}</h4>
            <nav className="v3-footer-links" aria-label={t.footer.links}>
              <a href="#services" onClick={go("services")}>{t.nav.services}</a>
              <a href="#pricing" onClick={go("pricing")}>{c.dock.pricing}</a>
              <a href="#projects" onClick={go("projects")}>{t.nav.projects}</a>
              <Link href={href("/blog")}>{t.nav.blog}</Link>
            </nav>
          </div>

          <div className="v3-footer-col">
            <h4>{t.footer.follow}</h4>
            {social.length > 0 && (
              <div className="v3-social">
                {social.map((k) => (
                  <a key={k} href={contact[k]} target="_blank" rel="noreferrer" aria-label={k}>
                    <Icon3 name={k} size={20} />
                  </a>
                ))}
              </div>
            )}
            <nav className="v3-footer-links" aria-label={t.nav.contact} style={{ marginTop: social.length ? 12 : 0 }}>
              <a href={contact.zalo} target="_blank" rel="noreferrer">Zalo</a>
              {contact.isSet("phone") && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>}
              {contact.isSet("email") && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            </nav>
          </div>
        </div>

        <div className="v3-footer-bar">
          <span>© 2026 VDuyStudio. {t.footer.rights}</span>
          <span>{c.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
