"use client";
// Thanh đặt vé nổi đè lên mép dưới hero — giữ đúng các trường của site cũ
// (khứ hồi/một chiều, tuyến, loại xe, số lượng, ngày đi/về).
import { VEHICLES } from "@/lib/sitetemplate/xekhach/data";
import type { BookingForm } from "@/lib/sitetemplate/xekhach/booking";
import type { Route, RouteId, VehicleId } from "@/lib/sitetemplate/xekhach/data";
import { IcArrowRight, IcInfo } from "../shared/Icons";
import { todayISO } from "../shared/useBooking";

type Props = {
  form: BookingForm;
  routes: Route[];
  set: <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void;
  onSubmit: () => void;
};

export default function BookingBar({ form, routes, set, onSubmit }: Props) {
  const today = todayISO();
  return (
    <div className="kl-c-booking">
      <div className="kl-c-wrap">
        <form
          className="kl-c-booking-card"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="kl-c-booking-top">
            <h3>Đặt vé xe khách</h3>
            <div className="kl-c-radio" role="group" aria-label="Loại hành trình">
              <button type="button" aria-pressed={!form.roundTrip} onClick={() => set("roundTrip", false)}>
                Một chiều
              </button>
              <button type="button" aria-pressed={form.roundTrip} onClick={() => set("roundTrip", true)}>
                Khứ hồi
              </button>
            </div>
          </div>

          <div className="kl-c-fields">
            <div className="kl-c-field">
              <label htmlFor="kl-route">Tuyến đường</label>
              <select id="kl-route" value={form.routeId} onChange={(e) => set("routeId", e.target.value as RouteId)}>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="kl-c-field">
              <label htmlFor="kl-vehicle">Loại xe</label>
              <select id="kl-vehicle" value={form.vehicle} onChange={(e) => set("vehicle", e.target.value as VehicleId)}>
                {(Object.keys(VEHICLES) as VehicleId[]).map((v) => (
                  <option key={v} value={v}>
                    {VEHICLES[v].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="kl-c-field">
              <label htmlFor="kl-qty">Số lượng</label>
              <select id="kl-qty" value={form.qty} onChange={(e) => set("qty", Number(e.target.value))}>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} vé
                  </option>
                ))}
              </select>
            </div>

            <div className="kl-c-field">
              <label htmlFor="kl-depart">Ngày đi</label>
              <input id="kl-depart" type="date" min={today} value={form.depart} onChange={(e) => set("depart", e.target.value)} required />
            </div>

            <div className="kl-c-field">
              <label htmlFor="kl-return">Ngày về</label>
              <input
                id="kl-return"
                type="date"
                min={form.depart || today}
                value={form.ret}
                disabled={!form.roundTrip}
                onChange={(e) => set("ret", e.target.value)}
              />
            </div>

            <button className="kl-c-btn kl-c-btn-red" type="submit">
              Đặt chỗ <IcArrowRight size={17} />
            </button>
          </div>

          <p className="kl-c-booking-note">
            <IcInfo size={15} />
            Bản demo: bấm “Đặt chỗ” sẽ mở bảng thông tin rồi chuyển sang gọi điện, SMS hoặc Zalo cho nhà xe.
          </p>
        </form>
      </div>
    </div>
  );
}
