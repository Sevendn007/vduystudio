// Chuyển form đặt vé (chỉ UI, không backend) thành hành động liên hệ:
// gọi điện, SMS soạn sẵn, hoặc mở Zalo kèm nội dung đã copy vào clipboard.
import { BRAND, VEHICLES, ROUTES, type RouteId, type VehicleId } from "./data";

export type BookingForm = {
  roundTrip: boolean;
  routeId: RouteId;
  vehicle: VehicleId;
  qty: number;
  depart: string; // yyyy-mm-dd
  ret: string;
  time?: string;
  name?: string;
  phone?: string;
  pickup?: string;
  dropoff?: string;
  note?: string;
};

export const EMPTY_FORM: BookingForm = {
  roundTrip: false,
  routeId: "dn-sg",
  vehicle: "limousine",
  qty: 1,
  depart: "",
  ret: "",
};

function viDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Chuỗi gửi qua SMS / dán vào Zalo. */
export function buildBookingMessage(f: BookingForm): string {
  const route = ROUTES.find((r) => r.id === f.routeId);
  const lines = [
    `Đặt vé ${BRAND.name}`,
    `• Tuyến: ${route?.label ?? f.routeId}${f.roundTrip ? " (khứ hồi)" : " (một chiều)"}`,
    `• Loại xe: ${VEHICLES[f.vehicle].label}`,
    `• Số lượng: ${f.qty} vé`,
  ];
  if (f.depart) lines.push(`• Ngày đi: ${viDate(f.depart)}${f.time ? ` lúc ${f.time}` : ""}`);
  if (f.roundTrip && f.ret) lines.push(`• Ngày về: ${viDate(f.ret)}`);
  if (f.name) lines.push(`• Họ tên: ${f.name}`);
  if (f.phone) lines.push(`• Điện thoại: ${f.phone}`);
  if (f.pickup) lines.push(`• Điểm đón: ${f.pickup}`);
  if (f.dropoff) lines.push(`• Điểm trả: ${f.dropoff}`);
  if (f.note) lines.push(`• Ghi chú: ${f.note}`);
  return lines.join("\n");
}

/** Bỏ dấu chấm/space trong số điện thoại để dùng cho tel:/sms:. */
export function rawPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function telHref(phone: string): string {
  return `tel:${rawPhone(phone)}`;
}

/** iOS dùng &body=, Android dùng ?body= — "?&body=" chạy được trên cả hai. */
export function smsHref(phone: string, body: string): string {
  return `sms:${rawPhone(phone)}?&body=${encodeURIComponent(body)}`;
}

/** Zalo không nhận nội dung soạn sẵn qua URL → mở chat rồi người dùng dán. */
export function zaloHref(phone: string = BRAND.hotline): string {
  return `https://zalo.me/${rawPhone(phone)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallthrough */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
