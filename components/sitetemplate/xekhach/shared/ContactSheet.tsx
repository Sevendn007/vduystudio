"use client";
// Bảng "Thông tin đặt chỗ": tóm tắt lựa chọn + vài ô liên hệ, rồi chuyển sang
// kênh thật của nhà xe. Không gửi dữ liệu đi đâu — demo không có backend.
import { useEffect, useMemo, useState } from "react";
import { BRAND, ROUTES, VEHICLES, PRICES, formatPrice } from "@/lib/sitetemplate/xekhach/data";
import {
  buildBookingMessage,
  copyToClipboard,
  smsHref,
  telHref,
  zaloHref,
  type BookingForm,
} from "@/lib/sitetemplate/xekhach/booking";
import { IcClose, IcCopy, IcInfo, IcPhone, IcSms, IcZalo } from "./Icons";

type Props = {
  form: BookingForm;
  onChange: <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void;
  onClose: () => void;
  skin?: "light" | "glass";
};

function viDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function ContactSheet({ form, onChange, onClose, skin = "light" }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const message = useMemo(() => buildBookingMessage(form), [form]);
  const route = ROUTES.find((r) => r.id === form.routeId);
  const price = form.routeId === "bac-nam" ? null : PRICES[form.routeId]?.find((p) => p.vehicle === form.vehicle);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openZalo = async () => {
    const ok = await copyToClipboard(message);
    setToast(ok ? "Đã sao chép nội dung — dán vào khung chat Zalo" : "Hãy chụp màn hình và gửi qua Zalo");
    window.open(zaloHref(), "_blank", "noopener");
  };

  return (
    <div className="kl-sheet-backdrop" role="dialog" aria-modal="true" aria-label="Thông tin đặt chỗ" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`kl-sheet${skin === "glass" ? " kl-sheet-glass" : ""}`}>
        <div className="kl-sheet-hd">
          <div style={{ flex: 1 }}>
            <h3>Thông tin đặt chỗ</h3>
            <p>Điền thêm vài thông tin rồi gọi hoặc nhắn cho nhà xe — demo không gửi dữ liệu đi đâu.</p>
          </div>
          <button className="kl-sheet-x" onClick={onClose} aria-label="Đóng">
            <IcClose />
          </button>
        </div>

        <div className="kl-sheet-body">
          <div className="kl-sheet-sum">
            <div>
              <span>Tuyến</span>
              <b>
                {route?.label ?? "—"} · {form.roundTrip ? "khứ hồi" : "một chiều"}
              </b>
            </div>
            <div>
              <span>Loại xe</span>
              <b>{VEHICLES[form.vehicle].label}</b>
            </div>
            <div>
              <span>Ngày đi</span>
              <b>
                {viDate(form.depart)}
                {form.time ? ` · ${form.time}` : ""}
              </b>
            </div>
            {form.roundTrip && (
              <div>
                <span>Ngày về</span>
                <b>{viDate(form.ret)}</b>
              </div>
            )}
            <div>
              <span>Số lượng</span>
              <b>{form.qty} vé</b>
            </div>
            {price && (
              <div>
                <span>Tạm tính</span>
                <b>
                  {formatPrice(price.price * form.qty * (form.roundTrip ? 2 : 1))}
                  {price.demo ? " (giá demo)" : ""}
                </b>
              </div>
            )}
          </div>

          <div className="kl-sheet-grid">
            <div>
              <label htmlFor="kl-name">Họ và tên</label>
              <input id="kl-name" value={form.name ?? ""} onChange={(e) => onChange("name", e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label htmlFor="kl-phone">Số điện thoại</label>
              <input id="kl-phone" inputMode="tel" value={form.phone ?? ""} onChange={(e) => onChange("phone", e.target.value)} placeholder="09xx xxx xxx" />
            </div>
            <div>
              <label htmlFor="kl-pickup">Điểm đón</label>
              <input id="kl-pickup" value={form.pickup ?? ""} onChange={(e) => onChange("pickup", e.target.value)} placeholder={route?.pickup?.[0] ?? "Văn phòng nhà xe"} />
            </div>
            <div>
              <label htmlFor="kl-drop">Điểm trả</label>
              <input id="kl-drop" value={form.dropoff ?? ""} onChange={(e) => onChange("dropoff", e.target.value)} placeholder="Bến xe Miền Đông" />
            </div>
            <div className="kl-sheet-full">
              <label htmlFor="kl-note">Yêu cầu thêm</label>
              <textarea id="kl-note" rows={2} value={form.note ?? ""} onChange={(e) => onChange("note", e.target.value)} placeholder="Giường tầng dưới, đón tại nhà…" />
            </div>
          </div>

          <div className="kl-sheet-acts">
            <a className="kl-sheet-act kl-sheet-call" href={telHref(BRAND.hotline)}>
              <IcPhone size={19} /> Gọi {BRAND.hotline}
            </a>
            <a className="kl-sheet-act kl-sheet-sms" href={smsHref(BRAND.hotline, message)}>
              <IcSms size={19} /> Nhắn tin SMS
            </a>
            <button className="kl-sheet-act kl-sheet-zalo" onClick={openZalo}>
              <IcZalo size={19} /> Gửi qua Zalo
            </button>
          </div>

          <p className="kl-sheet-hint">
            <IcInfo size={16} />
            <span>
              Nút SMS và Zalo đều mang theo đúng nội dung ở trên. Zalo không nhận sẵn chữ qua đường dẫn nên nội dung được
              sao chép vào bộ nhớ tạm để bạn dán vào.
            </span>
          </p>
          <button
            className="kl-sheet-hint"
            style={{ marginTop: 10, textDecoration: "underline" }}
            onClick={async () => setToast((await copyToClipboard(message)) ? "Đã sao chép nội dung đặt vé" : "Không sao chép được")}
          >
            <IcCopy size={16} /> <span>Sao chép nội dung đặt vé</span>
          </button>
        </div>
      </div>
      {toast && <div className="kl-toast">{toast}</div>}
    </div>
  );
}
