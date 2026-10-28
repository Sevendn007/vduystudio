"use client";
import { useLang } from "@/lib/i18n";
import { homeCopy, BRANDS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";

export default function Trust() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  // Tuyên ngôn: câu đầu làm tiêu đề lớn, phần còn lại làm lead (thay vì 1 khối chữ đậm 6 dòng).
  const i = t.manifesto.indexOf(". ");
  const head = i > 0 ? t.manifesto.slice(0, i + 1) : t.manifesto;
  const rest = i > 0 ? t.manifesto.slice(i + 2) : "";
  return (
    <section id="trust" className="v3-section v3-station v3-trust">
      <div className="v3-container">
        <p className="v3-eyebrow">{c.stations.trust.no} — {t.trusted}</p>
        <div className="v3-marquee" aria-hidden>
          <div className="v3-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, k) => <span key={k} className="v3-marquee-item">{b}</span>)}
          </div>
        </div>
        <ul className="sr-only">{BRANDS.map((b) => <li key={b}>{b}</li>)}</ul>
        <h2 className="v3-h2 v3-manifesto">{head}</h2>
        {rest && <p className="v3-lead v3-manifesto-sub">{rest}</p>}
      </div>
    </section>
  );
}
