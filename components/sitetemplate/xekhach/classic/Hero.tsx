"use client";
// Hero bản cổ điển — dựng theo đúng cách trang chủ VDuyStudio làm: canvas chrome
// lỏng cobalt phủ kín, chữ khổng lồ Archivo và monogram nằm ngay trên dòng tên
// thương hiệu. Không ảnh, không thẻ; ảnh xe để dành cho các mục bên dưới.
import LiquidCanvas from "@/components/v3/canvas/LiquidCanvas";
import KimLyLogo from "../shared/KimLyLogo";
import { BRAND, ROUTES } from "@/lib/sitetemplate/xekhach/data";
import { telHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcArrowRight, IcPhone } from "../shared/Icons";

const BN = ROUTES.find((r) => r.id === "bac-nam")!;

const STATS = [
  { v: "13", k: "chuyến mỗi ngày" },
  { v: "04", k: "tài xe luân phiên" },
  { v: "≈ 6h", k: "Đắk Nông → Sài Gòn" },
  { v: "24/7", k: "nhận đặt chỗ" },
];

export default function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="kl-c-hero" id="top-hero">
      <div className="kl-c-hero-stage">
        <div className="kl-c-liquid" aria-hidden>
          <LiquidCanvas />
        </div>
        <div className="kl-c-hero-shade" aria-hidden />

        <div className="kl-c-hero-inner">
          <p className="kl-c-hero-kicker">
            <span className="kl-c-dot" aria-hidden /> Nhà xe Kim Lý — chuyên tuyến Đắk Nông ⇄ Sài Gòn
          </p>

          <h1 className="kl-c-hero-h1" aria-label={`${BRAND.name} — xe giường nằm cao cấp`}>
            <span className="kl-c-hero-big" aria-hidden>
              <span className="kl-c-hero-brand">
                <KimLyLogo className="kl-c-hero-mark" size={96} tone="light" />
                <span className="kl-c-hero-name">KIM LÝ</span>
              </span>
            </span>
            <span className="kl-c-hero-line2" aria-hidden>
              <span className="kl-c-hero-thin">xe giường nằm</span> <em>cao cấp.</em>
            </span>
          </h1>

          <div className="kl-c-hero-foot">
            <p className="kl-c-hero-sub">
              Mỗi ngày 13 chuyến Đắk Nông ⇄ Sài Gòn, đón khách dọc Đắk Sin – Kiến Đức. Nhà xe còn chạy tuyến Bắc Nam đi{" "}
              {BN.to}.
            </p>
            <div className="kl-c-hero-ctas">
              <button className="kl-c-btn kl-c-btn-red" onClick={onBook}>
                Đặt vé ngay <IcArrowRight size={17} />
              </button>
              <a className="kl-c-btn kl-c-btn-ghost" href={telHref(BRAND.hotline)}>
                <IcPhone size={17} /> {BRAND.hotline}
              </a>
            </div>
          </div>

          <ul className="kl-c-hero-stats">
            {STATS.map((s) => (
              <li key={s.k}>
                <b>{s.v}</b>
                <span>{s.k}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
