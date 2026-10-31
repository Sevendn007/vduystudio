"use client";
import { PROMISES, BRAND } from "@/lib/sitetemplate/xekhach/data";
import { IcBed, IcClock, IcPin, IcSteering } from "../shared/Icons";

const ICONS = [IcClock, IcBed, IcPin, IcSteering];

export default function Promises() {
  return (
    <section className="kl-c-sec">
      <div className="kl-c-wrap">
        <div className="kl-c-head">
          <span>Cam kết</span>
          <h2>Vì sao khách chọn Kim Lý</h2>
          <p>{BRAND.slogan}</p>
        </div>
        <div className="kl-c-promise">
          {PROMISES.map((p, i) => {
            const Ico = ICONS[i % ICONS.length];
            return (
              <div className="kl-c-promise-item" key={p.title}>
                <div className="kl-c-promise-ico">
                  <Ico size={24} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
