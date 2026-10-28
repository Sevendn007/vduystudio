"use client";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";
import CountUp from "../ui/CountUp";
import RotatingText from "../ui/RotatingText";
import HeroArt from "../ui/HeroArt";

// Hero: chữ cột trái, logo (3D trên desktop / phẳng trên mobile) cột phải, dải số liệu bên dưới.
// Reveal bằng CSS animation lúc tải — không phụ thuộc canvas (trước đây chữ ẩn tới 2.5s).
export default function Hero() {
  const { lang } = useLang();
  const t = homeCopy(lang).hero;
  const c = v3Copy(lang);
  const { contact } = useV3();
  const stats = STATS(lang);
  const sep = lang === "en" ? "," : ".";

  // "… booking báo chí cho" + chữ xoay: giữ "cho" dính với chữ xoay, không mồ côi cuối dòng.
  const subWords = t.sub.split(" ");
  const subLast = subWords.pop();
  const parts = c.priceAnchorFallback.split(" · ");
  const cap = (x: string) => x.charAt(0).toLocaleUpperCase("vi") + x.slice(1);
  const chips: [string, string] | null = parts.length >= 2 ? [parts[0], cap(parts.slice(1).join(" · "))] : null;

  return (
    <section id="hero" className="v3-hero v3-station" aria-labelledby="v3-hero-title">
      <div className="v3-container v3-hero-grid">
        <div className="v3-hero-copy">
          <p className="v3-eyebrow v3-kicker v3-fade"><i aria-hidden /> VDuyStudio · {c.tagline}</p>
          <h1 id="v3-hero-title" className="v3-hero-h1">
            <span className="v3-line"><span>{t.h1a}</span></span>
            <span className="v3-line"><span>{t.h1b}</span></span>
            <span className="v3-line"><span className="v3-accent">{t.accent}</span></span>
          </h1>
          <p className="v3-hero-sub v3-fade v3-d1">
            {subWords.join(" ")} <span className="v3-nowrap">{subLast} <RotatingText texts={t.rotating} /></span>
          </p>
          <div className="v3-ctas v3-fade v3-d2">
            <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta1}</a>
            <a
              className="v3-btn v3-btn-outline v3-btn-lg" href="#pricing"
              onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              {c.viewPricing}
            </a>
          </div>
        </div>
        <HeroArt chips={chips} />
      </div>

      <div className="v3-container">
        <ul className="v3-hero-stats v3-fade v3-d3">
          {stats.map((s, i) => (
            <li key={i}>
              <b><CountUp to={s.to} decimals={s.decimals} separator={sep} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
