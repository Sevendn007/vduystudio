"use client";
/* eslint-disable @next/next/no-img-element */

// 6.10 CTA cuối (Orb WebGL + logo sway) + footer — dùng chung mọi trang public.

import dynamic from "next/dynamic";
import Link from "next/link";
import SplitText from "@/components/rb/SplitText/SplitText";
import ClickSpark from "@/components/rb/ClickSpark/ClickSpark";
import LogoSwayVideo from "@/components/brand/LogoSwayVideo";
import Icon3D from "@/components/brand/Icon3D";
import { useLang } from "@/lib/i18n";
import { homeCopy, type Icon3DName } from "@/lib/homeCopy";
import { useContact, type ContactKey } from "@/lib/useContact";
import WebGLGuard from "@/components/brand/WebGLGuard";
import { useLowPower, useReducedMotion } from "@/lib/motion";

const Orb = dynamic(() => import("@/components/rb/Orb/Orb"), { ssr: false });

const SOCIAL: { key: ContactKey; icon: Icon3DName; label: string }[] = [
  { key: "tiktok", icon: "tiktok", label: "TikTok" },
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "threads", icon: "threads", label: "Threads" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
  { key: "x", icon: "x", label: "X" },
];

export default function SiteFooter() {
  const { lang } = useLang();
  const c = homeCopy(lang);
  const contact = useContact();
  const lowPower = useLowPower();
  const reduced = useReducedMotion();
  const socials = SOCIAL.filter((s) => contact.isSet(s.key));

  return (
    <footer className="footer" id="contact">
      <section className="cta container" aria-labelledby="cta-title">
        <div className="cta-visual" aria-hidden>
          {!lowPower && !reduced && (
            <div className="cta-orb">
              <WebGLGuard>
                <Orb hue={175} hoverIntensity={0.3} rotateOnHover dpr={1} />
              </WebGLGuard>
            </div>
          )}
          <LogoSwayVideo className="cta-logo" />
        </div>
        <h2 id="cta-title" className="cta-h2" aria-label={c.cta.h2}>
          <span aria-hidden>
            <SplitText key={lang} tag="span" text={c.cta.h2} splitType="chars" delay={30} duration={0.9} ease="expo.out"
              from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} />
          </span>
        </h2>
        <p className="cta-sub">{c.cta.sub}</p>
        <div className="cta-btns">
          <ClickSpark sparkColor="#5EF2E6" sparkCount={10} sparkRadius={22}>
            <a className="btn btn-primary btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{c.cta.zalo}</a>
          </ClickSpark>
          {contact.isSet("facebook") && (
            <a className="btn btn-glass btn-lg" href={contact.facebook} target="_blank" rel="noreferrer">{c.cta.messenger}</a>
          )}
        </div>
      </section>

      <div className="footbar container">
        <Link href="/" className="footbar-brand">
          <img src="/brand/logo/vduy-mark-128.png" alt="" width={32} height={32} />
          <span>VDuyStudio</span>
        </Link>
        <nav className="footbar-links" aria-label={c.footer.links}>
          <Link href="/#services">{c.nav.services}</Link>
          <Link href="/du-an">{c.nav.projects}</Link>
          <Link href="/blog">{c.nav.blog}</Link>
        </nav>
        {socials.length > 0 && (
          <div className="footbar-social" aria-label={c.footer.follow}>
            {socials.map((s) => (
              <a key={s.key} href={contact[s.key]} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon3D name={s.icon} size={30} />
              </a>
            ))}
          </div>
        )}
        <p className="footbar-copy">© 2026 VDuyStudio. {c.footer.rights}</p>
      </div>
    </footer>
  );
}
