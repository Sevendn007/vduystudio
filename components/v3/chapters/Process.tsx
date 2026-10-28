"use client";
import { useLang } from "@/lib/i18n";
import { homeCopy, PROCESS_ICONS } from "@/lib/homeCopy";
import { getProcess } from "@/lib/services";
import { v3Copy } from "@/lib/v3/copy";
import { stripNo } from "@/lib/v3/format";
import Icon3 from "../ui/Icon3";

export default function Process() {
  const { lang } = useLang();
  const t = homeCopy(lang).process;
  const c = v3Copy(lang);
  const steps = getProcess(lang);
  return (
    <section id="process" className="v3-section v3-station">
      <div className="v3-container">
        <p className="v3-eyebrow">{c.stations.process.no} — {stripNo(t.eyebrow)}</p>
        <h2 className="v3-h2">{t.h2a} <span className="v3-accent">{t.h2b}</span></h2>
        <ol className="v3-process-track">
          {steps.map((s, i) => (
            <li className="v3-step v3-card" key={i}>
              <div className="v3-step-top">
                <span className="v3-svc-ic"><Icon3 name={PROCESS_ICONS[i] ?? "verify"} size={26} /></span>
                <span className="v3-step-no" aria-hidden>0{i + 1}</span>
              </div>
              <h3 className="v3-h3">{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
