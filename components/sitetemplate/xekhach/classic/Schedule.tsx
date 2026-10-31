"use client";
// Lịch chạy 2 chiều — gộp khung giờ trên banner và số tài/biển số trên tờ rơi.
import { useState } from "react";
import { ROUTES, VEHICLES } from "@/lib/sitetemplate/xekhach/data";
import { telHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcBus, IcInfo, IcPhone } from "../shared/Icons";

const COLS = ROUTES.filter((r) => r.trips.length > 0);

export default function Schedule() {
  const [tab, setTab] = useState(0);

  return (
    <section className="kl-c-sec kl-c-sec-wash" id="lich-chay">
      <div className="kl-c-wrap">
        <div className="kl-c-head">
          <span>Giờ xuất bến</span>
          <h2>
            Lịch chạy <em>13 chuyến</em> mỗi ngày
          </h2>
          <p>
            Mỗi chuyến đều ghi rõ số tài, biển số và số điện thoại của tài xế — bấm vào số là gọi được ngay.
          </p>
        </div>

        <div className="kl-c-sched-tabs" role="tablist">
          {COLS.map((r, i) => (
            <button key={r.id} role="tab" aria-pressed={tab === i} onClick={() => setTab(i)}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="kl-c-sched">
          {COLS.map((r, i) => (
            <div className="kl-c-sched-col" key={r.id} data-hidden={tab !== i ? "true" : "false"}>
              <div className="kl-c-sched-hd">
                <IcBus size={26} />
                <div>
                  <b>{r.label}</b>
                  <span>{r.trips.length} chuyến / ngày</span>
                </div>
              </div>

              {r.trips.map((t) => (
                <div className="kl-c-trip" key={`${r.id}-${t.time}`}>
                  <div className="kl-c-trip-time">{t.time}</div>
                  <div className="kl-c-trip-meta">
                    <b>
                      {t.coach ?? VEHICLES[t.vehicle].shortLabel}
                      {t.vehicle === "limousine" && <span className="kl-c-tag kl-c-tag-lim">Limousine</span>}
                    </b>
                    <span>{t.plate ?? VEHICLES[t.vehicle].seats}</span>
                  </div>
                  <a className="kl-c-trip-call" href={telHref(t.phone)}>
                    <IcPhone size={15} />
                    {t.phone}
                  </a>
                </div>
              ))}

              {r.note && (
                <div className="kl-c-sched-ft">
                  <IcInfo size={16} />
                  <span>{r.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
