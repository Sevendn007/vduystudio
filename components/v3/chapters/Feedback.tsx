"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { siteText } from "@/lib/site";
import { v3Copy } from "@/lib/v3/copy";
import { stripNo, tidy } from "@/lib/v3/format";
import { useV3 } from "../V3Context";

export default function Feedback() {
  const { lang } = useLang();
  const t = homeCopy(lang).feedback;
  const c = v3Copy(lang);
  const { feedbacks } = useV3();
  const list =
    feedbacks && feedbacks.length
      ? feedbacks
      : siteText(lang).testimonials.map((f, i) => ({ id: `t${i}`, name: f.name, company: f.company, quote: f.quote, rating: 5, image_url: null as string | null, date: null as string | null }));
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const shown = expanded ? list : list.slice(0, 6);
  const more = lang === "en" ? ["Read more", "Show less"] : ["Đọc thêm", "Thu gọn"];

  return (
    <section id="feedback" className="v3-section v3-station">
      <div className="v3-container">
        <p className="v3-eyebrow">{c.stations.feedback.no} — {stripNo(t.eyebrow)}</p>
        <h2 className="v3-h2">{t.h2}</h2>
        <div className="v3-fb-grid">
          {shown.map((f) => {
            const stars = Math.min(5, Math.max(1, f.rating ?? 5));
            const long = (f.quote?.length ?? 0) > 260;
            const isOpen = Boolean(open[f.id]);
            return (
              <figure className="v3-fb v3-card" key={f.id}>
                <div className="v3-fb-stars" role="img" aria-label={`${stars}/5`}>{"★".repeat(stars)}</div>
                <blockquote className={long && !isOpen ? "v3-fb-clamp" : undefined}>“{f.quote}”</blockquote>
                {long && (
                  <button className="v3-link v3-fb-toggle" onClick={() => setOpen((o) => ({ ...o, [f.id]: !isOpen }))} aria-expanded={isOpen}>
                    {isOpen ? more[1] : more[0]}
                  </button>
                )}
                <figcaption className="v3-fb-person">
                  <span className="v3-fb-avatar" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {f.image_url ? <img src={f.image_url} alt="" loading="lazy" /> : (f.name?.charAt(0) ?? "?")}
                  </span>
                  <span>
                    <b>{f.name}</b>
                    {f.company && <em>{tidy(f.company)}</em>}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        {list.length > 6 && (
          <button className="v3-btn v3-btn-ghost v3-fb-more" onClick={() => setExpanded((v) => !v)}>
            {expanded ? c.collapse : c.allReviews(list.length)}
          </button>
        )}
      </div>
    </section>
  );
}
