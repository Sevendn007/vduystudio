"use client";
import Link from "next/link";
import NextImage from "next/image";
import { useLang } from "@/lib/i18n";
import { homeCopy, CLIENTS } from "@/lib/homeCopy";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { useV3 } from "../V3Context";

export default function ResultBelt() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  const { projects } = useV3();
  const items = (projects && projects.length ? projects : DEFAULT_PROJECTS).slice(0, 6);

  return (
    <section id="projects" className="v3-section v3-station v3-belt">
      <span className="v3-giant-word v3-giant-belt" aria-hidden>{c.giant.results}</span>
      <div className="v3-container">
        <div className="v3-section-head">
          <div>
            <p className="v3-eyebrow">{t.projects.eyebrow}</p>
            <h2 className="v3-h2">{t.projects.h2a} <span className="v3-accent">{t.projects.h2b}</span></h2>
          </div>
          <Link className="v3-viewall" href={href("/du-an")}>{t.projects.all}</Link>
        </div>

        <div className="v3-belt-track">
          {items.map((p, i) => {
            const img = p.image_url || `/images/d${(i % 4) + 1}.webp`;
            return (
              <figure className="v3-figure" key={p.id || i}>
                <div className="v3-phone">
                  <NextImage src={img} alt={p.title} fill sizes="(max-width:760px) 70vw, 300px" style={{ objectFit: "cover" }} />
                </div>
                <figcaption>
                  <b>{p.title}</b>
                  {p.result && <span>{p.result}</span>}
                  <span className="v3-figure-tags">
                    {p.tag && <em>{p.tag}</em>}
                    {p.date && <i>{p.date}</i>}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div id="clients" className="v3-container v3-clients">
        <p className="v3-eyebrow">{t.clients.eyebrow}</p>
        <h3 className="v3-clients-h">{t.clients.h2}</h3>
        <div className="v3-clients-row">
          {CLIENTS.map((cl, i) => (
            <span key={i} className="v3-client">{cl}{i < CLIENTS.length - 1 && <i aria-hidden>✦</i>}</span>
          ))}
        </div>
        <ul className="sr-only">{CLIENTS.map((cl) => <li key={cl}>{cl}</li>)}</ul>
      </div>
    </section>
  );
}
