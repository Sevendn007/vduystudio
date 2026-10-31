"use client";
import { PRICES, ROUTES, VEHICLES, formatPrice, DEMO_PRICING } from "@/lib/sitetemplate/xekhach/data";
import type { RouteId, VehicleId } from "@/lib/sitetemplate/xekhach/data";
import { IcInfo } from "../shared/Icons";

type Props = { onBook: (routeId: RouteId, vehicle: VehicleId) => void };

const COLS: RouteId[] = ["dn-sg", "sg-dn"];

export default function PriceTables({ onBook }: Props) {
  return (
    <section className="kl-c-sec" id="gia-ve">
      <div className="kl-c-wrap">
        <div className="kl-c-head" style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span>Vé xe khách</span>
            <h2>
              Bảng giá <em>Đắk Nông ⇄ Sài Gòn</em>
            </h2>
            <p>Giá đã gồm nước uống, chăn đắp và Wi-Fi. Trẻ em dưới 5 tuổi đi kèm người lớn miễn phí.</p>
          </div>
          {DEMO_PRICING && (
            <span className="kl-c-demo">
              <IcInfo size={13} /> Giá demo — cập nhật theo nhà xe
            </span>
          )}
        </div>

        <div className="kl-c-price-grid">
          {COLS.map((id) => {
            const route = ROUTES.find((r) => r.id === id)!;
            return (
              <div className="kl-c-price-card" key={id}>
                <div className="kl-c-price-hd">{route.label}</div>
                {PRICES[id as "dn-sg" | "sg-dn"].map((p) => (
                  <div className="kl-c-price-row" key={p.vehicle}>
                    <div>
                      <b>{VEHICLES[p.vehicle].label}</b>
                      <span>
                        {VEHICLES[p.vehicle].seats} · {p.duration}
                      </span>
                    </div>
                    <div className="kl-c-price-val" style={{ flex: "none" }}>
                      {formatPrice(p.price)}
                    </div>
                    <button className="kl-c-btn kl-c-btn-red" style={{ flex: "none" }} onClick={() => onBook(id, p.vehicle)}>
                      Đặt vé
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
