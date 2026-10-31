"use client";
// Bản tĩnh cho máy không chạy được WebGL, chế độ giảm chuyển động hoặc tiết kiệm
// dữ liệu. Vẫn giữ ngôn ngữ thị giác 2100 (tấm kính, lưới sáng) chứ không rơi về
// bố cục card thông thường.
import { BRAND, OFFICES, ROUTES, VEHICLES } from "@/lib/sitetemplate/xekhach/data";
import { telHref, zaloHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcBus, IcPhone, IcZalo } from "../shared/Icons";
import KimLyLogo from "../shared/KimLyLogo";

const BOOKABLE = ROUTES.filter((r) => r.trips.length > 0);

export default function StaticPoster() {
  return (
    <main className="kl-f-poster">
      <div className="kl-f-poster-hero">
        <span className="kl-f-eyebrow">Hệ thống vận chuyển · Tây Nguyên 2100</span>
        <h1 className="kl-f-title" data-split="1">
          Kim Lý
        </h1>
        <p className="kl-f-sub">
          {BRAND.tagline}. 13 chuyến mỗi ngày nối Đắk Nông với Sài Gòn. Thiết bị của bạn đang ở chế độ giảm chuyển động
          nên trang hiển thị bản tĩnh.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <a className="kl-f-pill kl-f-pill-go" href={telHref(BRAND.hotline)}>
            <IcPhone size={17} /> {BRAND.hotline}
          </a>
          <a className="kl-f-pill" href={zaloHref()} target="_blank" rel="noreferrer">
            <IcZalo size={17} /> Nhắn Zalo
          </a>
        </div>
      </div>

      {BOOKABLE.map((r) => (
        <section key={r.id}>
          <div className="kl-f-board-hd">
            <IcBus size={20} /> {r.label} <small>{r.trips.length} chuyến</small>
          </div>
          {r.trips.map((t) => (
            <div className="kl-f-bar" key={t.time} style={{ transform: "none" }}>
              <span className="kl-f-bar-time">{t.time}</span>
              <span className="kl-f-bar-meta">
                <b>
                  {t.coach ?? VEHICLES[t.vehicle].shortLabel}
                  {t.vehicle === "limousine" && <span className="kl-f-chip-lim">Limousine</span>}
                </b>
                <span>{t.plate ?? VEHICLES[t.vehicle].seats}</span>
              </span>
              <a className="kl-f-bar-call" href={telHref(t.phone)}>
                <IcPhone size={14} /> {t.phone}
              </a>
            </div>
          ))}
          {r.note && <p style={{ fontSize: 13, color: "var(--f-dim)" }}>{r.note}</p>}
        </section>
      ))}

      <section className="kl-f-contact">
        {OFFICES.map((o) => (
          <div className="kl-f-glass kl-f-card" key={o.area}>
            <h4>Văn phòng {o.area}</h4>
            <ul>
              {o.items.map((it) => (
                <li key={it.name}>
                  <b>{it.name}</b>
                  <span>{it.address}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--f-dim)", fontSize: 12.5 }}>
        <KimLyLogo size={38} tone="light" />
        {BRAND.demoNote}
      </footer>
    </main>
  );
}
