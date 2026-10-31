"use client";
import Image from "next/image";
import { RENTALS, formatPrice, BRAND } from "@/lib/sitetemplate/xekhach/data";
import { zaloHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcCheck, IcInfo } from "../shared/Icons";

export default function RentalCards() {
  return (
    <section className="kl-c-sec kl-c-sec-wash" id="thue-xe">
      <div className="kl-c-wrap">
        <div className="kl-c-head" style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span>Dịch vụ</span>
            <h2>
              Thuê xe <em>chuyến riêng</em>
            </h2>
            <p>Phục vụ 24/7 theo yêu cầu, đón trả tận nơi. Báo giá chính xác theo lịch trình và số khách.</p>
          </div>
          <span className="kl-c-demo">
            <IcInfo size={13} /> Giá demo
          </span>
        </div>

        <div className="kl-c-rent">
          {RENTALS.map((r) => (
            <article className="kl-c-rent-card" key={r.id}>
              <div className="kl-c-rent-pic">
                {r.image && (
                  <Image src={r.image} alt={r.title} width={680} height={425} sizes="(max-width:620px) 100vw, 25vw" />
                )}
              </div>
              <div className="kl-c-rent-body">
                <h3>{r.title}</h3>
                <ul>
                  {r.bullets.map((b) => (
                    <li key={b}>
                      <IcCheck size={15} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="kl-c-rent-price">
                  {r.price ? formatPrice(r.price) : "Liên hệ"}
                  <small>{r.unit}</small>
                </div>
                <a className="kl-c-btn kl-c-btn-orange" href={zaloHref(BRAND.hotline)} target="_blank" rel="noreferrer">
                  Nhận báo giá
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
