"use client";
import { ROUTES } from "@/lib/sitetemplate/xekhach/data";
import { telHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcArrowRight, IcPhone } from "../shared/Icons";

const route = ROUTES.find((r) => r.id === "bac-nam")!;
const WEST = route.from.split(" · ");
const EAST = route.to.split(" · ");

export default function NorthSouth() {
  return (
    <section className="kl-c-sec kl-c-bacnam" id="bac-nam">
      <div className="kl-c-wrap">
        <div className="kl-c-head">
          <span>Tuyến đường dài</span>
          <h2>Xe chất lượng cao tuyến Bắc Nam</h2>
          <p>{route.note}</p>
        </div>

        <div className="kl-c-line">
          {WEST.map((s) => (
            <span className="kl-c-stop" key={s}>
              <i /> {s}
            </span>
          ))}
          <IcArrowRight size={24} className="kl-c-line-arrow" />
          {EAST.map((s) => (
            <span className="kl-c-stop" key={s}>
              <i /> {s}
            </span>
          ))}
        </div>

        <div className="kl-c-bacnam-call">
          <span>Đặt chỗ tuyến Bắc Nam — {route.contact}:</span>
          {route.phones?.map((p) => (
            <a className="kl-c-btn" key={p} href={telHref(p)} style={{ background: "#fff", color: "#15338c" }}>
              <IcPhone size={17} /> {p}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
