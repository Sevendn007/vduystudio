"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { siteText } from "@/lib/site";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";

const square = (u: string | null) => Boolean(u); // avatar tròn cho ảnh vuông (dữ liệu thật 6/7)

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
  const shown = expanded ? list : list.slice(0, 6);

  return (
    <section id="feedback" className="v3-section v3-station">
      <div className="v3-container">
        <p className="v3-eyebrow">{t.eyebrow}</p>
        <h2 className="v3-h2">{t.h2}</h2>
        <div className="v3-fb-grid">
          {shown.map((f) => (
            <figure className="v3-fb v3-glass" key={f.id}>
              <div className="v3-fb-stars" aria-label={`${f.rating ?? 5}/5`}>{"★".repeat(Math.min(5, Math.max(1, f.rating ?? 5)))}</div>
              <blockquote>“{f.quote}”</blockquote>
              <figcaption className="v3-fb-person">
                <span className="v3-fb-avatar" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {square(f.image_url) ? <img src={f.image_url!} alt="" /> : (f.name?.charAt(0) ?? "?")}
                </span>
                <span>
                  <b>{f.name}</b>
                  {f.company && <em>{f.company}</em>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {list.length > 6 && (
          <button className="v3-btn v3-btn-glass v3-fb-more" onClick={() => setExpanded((v) => !v)}>
            {expanded ? c.collapse : c.allReviews(list.length)}
          </button>
        )}
      </div>
    </section>
  );
}
