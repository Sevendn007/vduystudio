"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { siteText } from "@/lib/site";
import { v3Copy } from "@/lib/v3/copy";
import { stripNo, tidy } from "@/lib/v3/format";
import { useV3 } from "../V3Context";

// FEEDBACK: tường masonry, mỗi thẻ có dấu ngoặc serif cobalt khổng lồ; thẻ thứ 2 đảo màu cobalt.
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
  const avg = (list.reduce((a, f) => a + Math.min(5, Math.max(1, f.rating ?? 5)), 0) / list.length).toFixed(1);

  return (
    <section id="feedback" className="v3-fbk v3-station">
      <div className="v3-container">
        <div className="v3-fbk-head">
          <div>
            <p className="v3-eyebrow">{stripNo(t.eyebrow)}</p>
            <h2 className="v3-xl">{t.h2}<em className="v3-serif">{lang === "en" ? "." : "?"}</em></h2>
          </div>
          <div className="v3-fbk-score" aria-label={`${avg}/5`}>
            <b>{lang === "en" ? avg : avg.replace(".", ",")}</b>
            <span><i aria-hidden>★★★★★</i>{list.length} {lang === "en" ? "reviews" : "đánh giá"}</span>
          </div>
        </div>
        <div className="v3-fbk-grid">
          {shown.map((f, idx) => {
            const stars = Math.min(5, Math.max(1, f.rating ?? 5));
            const long = (f.quote?.length ?? 0) > 260;
            const isOpen = Boolean(open[f.id]);
            return (
              <figure className={`v3-q${idx === 1 ? " is-blue" : ""}`} key={f.id}>
                <span className="v3-q-mark" aria-hidden>“</span>
                <div className="v3-q-stars" role="img" aria-label={`${stars}/5`}>{"★".repeat(stars)}</div>
                <blockquote className={long && !isOpen ? "v3-q-clamp" : undefined}>{f.quote}</blockquote>
                {long && (
                  <button className="v3-q-toggle" onClick={() => setOpen((o) => ({ ...o, [f.id]: !isOpen }))} aria-expanded={isOpen}>
                    {isOpen ? more[1] : more[0]}
                  </button>
                )}
                <figcaption>
                  <span className="v3-q-avatar" aria-hidden>
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
          <div className="v3-fbk-more">
            <button className="v3-btn v3-btn-ink" onClick={() => setExpanded((v) => !v)}>
              {expanded ? c.collapse : c.allReviews(list.length)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
