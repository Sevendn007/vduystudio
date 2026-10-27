"use client";
import { useLang } from "@/lib/i18n";
import { homeCopy, PROCESS_ICONS } from "@/lib/homeCopy";
import { getProcess } from "@/lib/services";
import Icon3D from "@/components/brand/Icon3D";

export default function Process() {
  const { lang } = useLang();
  const t = homeCopy(lang).process;
  const steps = getProcess(lang);
  return (
    <section id="process" className="v3-section v3-station v3-process">
      <div className="v3-container">
        <p className="v3-eyebrow">{t.eyebrow}</p>
        <h2 className="v3-h2">{t.h2a} <span className="v3-accent">{t.h2b}</span></h2>
        <ol className="v3-process-track">
          {steps.map((s, i) => (
            <li className="v3-step" key={i}>
              <span className="v3-step-no" aria-hidden>0{i + 1}</span>
              <Icon3D name={PROCESS_ICONS[i]} size={56} className="v3-step-ic" />
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
