"use client";
import { useLang } from "@/lib/i18n";
import { homeCopy, BRANDS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";

export default function Trust() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  return (
    <section id="trust" className="v3-section v3-station v3-trust">
      <div className="v3-container">
        <p className="v3-eyebrow">{c.stations.trust.no} — {t.trusted}</p>
        <div className="v3-marquee" aria-label={t.trusted}>
          <div className="v3-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="v3-marquee-item">{b}<i aria-hidden>✦</i></span>
            ))}
          </div>
        </div>
        <ul className="sr-only">{BRANDS.map((b) => <li key={b}>{b}</li>)}</ul>
        <p className="v3-manifesto">{t.manifesto}</p>
      </div>
    </section>
  );
}
