"use client";
// Lớp chữ phủ lên cảnh 3D. Mỗi chương đọc biến --cN (độ hiện) và --tN (độ trượt)
// do ScrollDriver ghi, nên không phải render lại khi cuộn. Toàn bộ nội dung
// tiếng Việt ở đây — WebGL không dựng được chữ có dấu bằng font 3D.
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { BRAND, ROUTES, VEHICLES, OFFICES, GALLERY, RENTALS, formatPrice } from "@/lib/sitetemplate/xekhach/data";
import { telHref, zaloHref } from "@/lib/sitetemplate/xekhach/booking";
import type { Route, VehicleId } from "@/lib/sitetemplate/xekhach/data";
import KimLyLogo from "../../shared/KimLyLogo";
import {
  IcBed,
  IcBus,
  IcCheck,
  IcFacebook,
  IcInfo,
  IcMail,
  IcPhone,
  IcPin,
  IcShield,
  IcWifi,
  IcZalo,
} from "../../shared/Icons";

const DN = ROUTES.find((r) => r.id === "dn-sg")!;
const SG = ROUTES.find((r) => r.id === "sg-dn")!;
const BN = ROUTES.find((r) => r.id === "bac-nam")!;

function Chapter({ i, children, style }: { i: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <section
      className="kl-f-ch"
      data-chapter={i}
      style={
        {
          opacity: `var(--c${i}, 0)`,
          transform: `translate3d(0, calc(var(--t${i}, 0) * 1px), 0)`,
          ...style,
        } as CSSProperties
      }
      data-on="0"
    >
      {children}
    </section>
  );
}

function Photo({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="kl-f-photo">
      <Image src={src} alt={alt} width={1600} height={1000} sizes="(max-width:1000px) 92vw, 42vw" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------- MỞ ĐẦU ----
export function ChapterHero() {
  return (
    <Chapter i={0}>
      <div>
        <span className="kl-f-eyebrow" data-boot="eyebrow">
          <span className="kl-f-eyebrow-dot" /> Nhà xe Kim Lý · 13 chuyến mỗi ngày
        </span>

        <h1 className="kl-f-title" data-boot="title">
          <span className="kl-f-brand" aria-hidden>
            <KimLyLogo className="kl-f-mark" size={110} tone="light" />
            <span className="kl-f-brand-name">KIM LÝ</span>
          </span>
          <span className="kl-sr">Nhà xe Kim Lý</span>
        </h1>

        <p className="kl-f-route-line" data-boot="sub">
          chuyên tuyến <strong>Đắk Nông</strong> <span aria-hidden>⇄</span> <strong>Sài Gòn</strong>
        </p>

        <p className="kl-f-sub" data-boot="sub">
          Xe giường nằm và limousine cabin, đón khách dọc Đắk Sin – Đạo Nghĩa – Nhân Đạo – Nhân Cơ – Kiến Đức. Nhà xe
          còn chạy <strong>tuyến Bắc Nam</strong>: Đắk Nông · Đắk Lắk · Gia Lai đi Nam Định, Thái Bình, Hải Dương, Hưng
          Yên.
        </p>

        <ul className="kl-f-tags" data-boot="chips">
          <li>
            <IcBed size={16} /> Limousine 22 phòng
          </li>
          <li>
            <IcBus size={16} /> Giường nằm 40 chỗ
          </li>
          <li>
            <IcWifi size={16} /> Wi-Fi &amp; WC trên xe
          </li>
        </ul>
      </div>
    </Chapter>
  );
}

// -------------------------------------------------------------- KHOANG XE ---
export function ChapterBus() {
  return (
    <Chapter i={1}>
      <div className="kl-f-split">
        <div>
          <span className="kl-f-eyebrow">Khoang hành khách</span>
          <h2 className="kl-f-h2">
            Hai hạng xe, <em>một tiêu chuẩn</em>
          </h2>
          <p className="kl-f-sub">
            Cabin đôi có rèm che và màn hình riêng; giường nằm tầng dưới rộng rãi. Mọi xe đều có WC khép kín, Wi-Fi,
            chăn gối và nước uống.
          </p>
          <div className="kl-f-veh">
            {(Object.keys(VEHICLES) as VehicleId[]).map((v) => (
              <div key={v}>
                <h4>
                  {VEHICLES[v].label} <span>· {VEHICLES[v].seats}</span>
                </h4>
                <ul>
                  {VEHICLES[v].features.map((f) => (
                    <li key={f}>
                      <IcCheck size={14} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="kl-f-photo-pair">
          <Photo src={GALLERY.cabinAmber} alt="Lối đi khoang cabin" caption="Khoang cabin" />
          <Photo src={GALLERY.berthNight} alt="Khoang giường nằm ban đêm" caption="Chuyến đêm" />
        </div>
      </div>
    </Chapter>
  );
}

// ------------------------------------------------------------ TUYẾN ĐƯỜNG ---
export function ChapterRoute() {
  return (
    <Chapter i={2}>
      <div className="kl-f-split">
        <div>
          <span className="kl-f-eyebrow">Hành trình</span>
          <h2 className="kl-f-h2">
            Đắk Nông <em>⇄</em> Sài Gòn
          </h2>
          <p className="kl-f-sub">
            Dòng sáng bên dưới là đường xe chạy thật: đón khách dọc Đắk Sin – Kiến Đức rồi xuôi về bến Sài Gòn. Chiều
            ngược lại bán vé tại quầy 13.
          </p>
          <ul className="kl-f-nodes">
            {DN.pickup?.map((n, i) => (
              <li key={n}>
                <i />
                {n}
                <span>Điểm đón {String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
            <li>
              <i style={{ background: "var(--f-amber)", boxShadow: "0 0 12px var(--f-amber)" }} />
              Sài Gòn
              <span>{BRAND.ticketDesk}</span>
            </li>
          </ul>
        </div>
        <div className="kl-f-photo-pair">
          <Photo src={GALLERY.fleetRoad} alt="Xe Kim Lý dọc tuyến" caption="Dọc tuyến Đắk R'lấp" />
          <Photo src={GALLERY.fleetNight} alt="Đội xe tại bến" caption="Đội xe tại bến" />
        </div>
      </div>
    </Chapter>
  );
}

// --------------------------------------------------------------- GIỜ CHẠY ---
function Board({ route, mid }: { route: Route; mid: number }) {
  return (
    <div className="kl-f-board-col">
      <div className="kl-f-board-hd">
        <IcBus size={20} />
        {route.label}
        <small>{route.trips.length} chuyến</small>
      </div>
      {route.trips.map((t, i) => (
        <div
          className="kl-f-bar"
          key={t.time}
          style={{ "--i": i, "--mid": mid, "--z": Math.round(-Math.abs(i - mid) * 26) } as CSSProperties}
        >
          <span className="kl-f-bar-time">{t.time}</span>
          <span className="kl-f-bar-meta">
            <b>
              {t.coach ?? VEHICLES[t.vehicle].shortLabel}
              {t.vehicle === "limousine" && <span className="kl-f-chip-lim">Limousine</span>}
            </b>
            <span>{t.plate ?? VEHICLES[t.vehicle].seats}</span>
          </span>
          <a className="kl-f-bar-call" href={telHref(t.phone)}>
            <IcPhone size={14} />
            {t.phone}
          </a>
        </div>
      ))}
    </div>
  );
}

export function ChapterBoard() {
  return (
    <Chapter i={3}>
      <div style={{ width: "min(100%,1340px)", margin: "0 auto 14px" }}>
        <span className="kl-f-eyebrow">Bảng khởi hành</span>
        <h2 className="kl-f-h2">
          13 chuyến <em>mỗi ngày</em>
        </h2>
      </div>
      <div className="kl-f-board">
        <Board route={DN} mid={(DN.trips.length - 1) / 2} />
        <Board route={SG} mid={(SG.trips.length - 1) / 2} />
      </div>
    </Chapter>
  );
}

// ---------------------------------------------------------------- DỊCH VỤ ---
export function ChapterServices() {
  return (
    <Chapter i={4}>
      <div style={{ width: "min(100%,1280px)", margin: "0 auto 18px" }}>
        <span className="kl-f-eyebrow">Dịch vụ</span>
        <h2 className="kl-f-h2">
          Thuê xe <em>chuyến riêng</em> &amp; gửi hàng
        </h2>
        <p className="kl-f-sub" style={{ maxWidth: "58ch" }}>
          Nhà xe nhận hợp đồng đoàn, du lịch và ký gửi hàng dọc tuyến. Báo giá theo lịch trình, đặt chỗ qua điện thoại
          hoặc Zalo — trang này không bán vé trực tuyến.
        </p>
      </div>

      <div className="kl-f-services">
        {RENTALS.map((r) => (
          <article className="kl-f-glass kl-f-service" key={r.id}>
            <h4>{r.title}</h4>
            <ul>
              {r.bullets.slice(0, 2).map((b) => (
                <li key={b}>
                  <IcCheck size={14} /> {b}
                </li>
              ))}
            </ul>
            <p className="kl-f-service-price">
              {r.price ? formatPrice(r.price) : "Liên hệ"} <small>{r.unit}</small>
            </p>
          </article>
        ))}
      </div>

      <p className="kl-f-note">
        <IcInfo size={15} /> Giá hiển thị là số minh hoạ cho bản demo — cập nhật theo bảng giá thật của nhà xe.
      </p>
    </Chapter>
  );
}

// ---------------------------------------------------------------- LIÊN HỆ ---
export function ChapterContact() {
  return (
    <Chapter i={5}>
      <div style={{ width: "min(100%,1240px)", margin: "0 auto 20px" }}>
        <span className="kl-f-eyebrow">Trạm điều phối</span>
        <h2 className="kl-f-h2">
          Gọi cho <em>Kim Lý</em>
        </h2>
        <a className="kl-f-big-call" href={telHref(BRAND.hotline)}>
          <IcPhone size={28} /> {BRAND.hotline}
        </a>
      </div>

      <div className="kl-f-contact">
        <div className="kl-f-glass kl-f-card">
          <h4>Liên hệ</h4>
          <ul>
            <li>
              <b>
                <IcMail size={14} /> {BRAND.email}
              </b>
              <span>Hộp thư góp ý</span>
            </li>
            <li>
              <b>
                <IcFacebook size={14} /> {BRAND.facebook}
              </b>
              <span>Facebook nhà xe</span>
            </li>
            <li>
              <a className="kl-f-bar-call" href={zaloHref()} target="_blank" rel="noreferrer">
                <IcZalo size={14} /> Nhắn Zalo
              </a>
            </li>
          </ul>
        </div>

        {OFFICES.map((o) => (
          <div className="kl-f-glass kl-f-card" key={o.area}>
            <h4>
              <IcPin size={12} /> Văn phòng {o.area}
            </h4>
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

        <div className="kl-f-glass kl-f-card">
          <h4>
            <IcShield size={12} /> Tuyến Bắc Nam
          </h4>
          <ul>
            <li>
              <b>{BN.from}</b>
              <span>⇄ {BN.to}</span>
            </li>
            {BN.phones?.map((p) => (
              <li key={p}>
                <a className="kl-f-bar-call" href={telHref(p)}>
                  <IcPhone size={14} /> {p}
                </a>
              </li>
            ))}
            <li>
              <span>Liên hệ {BN.contact}</span>
            </li>
          </ul>
        </div>
      </div>

      <p className="kl-f-note" style={{ justifyContent: "center" }}>
        {BRAND.demoNote}
      </p>
    </Chapter>
  );
}
