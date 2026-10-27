"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { useV3 } from "../V3Context";
import Icon3D from "@/components/brand/Icon3D";
import type { Icon3DName } from "@/lib/homeCopy";

const SOCIAL: { key: "tiktok" | "facebook" | "instagram" | "threads" | "youtube" | "x"; icon: Icon3DName }[] = [
  { key: "tiktok", icon: "tiktok" }, { key: "facebook", icon: "facebook" },
  { key: "instagram", icon: "instagram" }, { key: "threads", icon: "threads" },
  { key: "youtube", icon: "youtube" }, { key: "x", icon: "x" },
];

export default function Footer3() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  const { contact } = useV3();

  return (
    <footer id="contact" className="v3-footer v3-station">
      <div className="v3-container v3-footer-cta">
        <h2 className="v3-h2 v3-footer-h">{t.cta.h2}</h2>
        <p className="v3-lead">{t.cta.sub}</p>
        <div className="v3-ctas">
          <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta.zalo}</a>
          {contact.isSet("messenger") && (
            <a className="v3-btn v3-btn-glass v3-btn-lg" href={contact.messenger} target="_blank" rel="noreferrer">{t.cta.messenger}</a>
          )}
        </div>
      </div>

      <div className="v3-container v3-footer-grid">
        <div className="v3-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo/vduy-mark-128.png" alt="VDuyStudio" width={44} height={44} />
          <div>
            <b>VDuyStudio</b>
            <span>{c.tagline}</span>
          </div>
        </div>

        <nav className="v3-footer-links" aria-label={t.footer.links}>
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>{t.nav.services}</a>
          <Link href={href("/du-an")}>{t.nav.projects}</Link>
          <Link href={href("/blog")}>{t.nav.blog}</Link>
          {contact.isSet("phone") && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>}
          {contact.isSet("email") && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
        </nav>

        <div className="v3-footer-social">
          <span>{t.footer.follow}</span>
          <div>
            {SOCIAL.filter((s) => contact.isSet(s.key)).map((s) => (
              <a key={s.key} href={contact[s.key]} target="_blank" rel="noreferrer" aria-label={s.key}>
                <Icon3D name={s.icon} size={28} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="v3-container v3-footer-bar">
        <span>© 2026 VDuyStudio. {t.footer.rights}</span>
      </div>
    </footer>
  );
}
