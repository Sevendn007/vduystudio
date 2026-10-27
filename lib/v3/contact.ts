"use client";
// Liên hệ cho v3: nhận giá trị ban đầu từ SERVER (không fetch Supabase ở
// client → không flash placeholder, không kéo supabase-js vào bundle v3).
// Đọc thêm messenger/phone/email mà useContact gốc không có.
import { site } from "@/lib/site";

export type V3ContactKey =
  | "zalo" | "facebook" | "instagram" | "tiktok" | "threads" | "x" | "youtube"
  | "messenger" | "phone" | "email";

export type V3Settings = Partial<Record<V3ContactKey, string>>;

export type V3Contact = Record<V3ContactKey, string> & { isSet: (k: V3ContactKey) => boolean };

const PLACEHOLDER: Record<string, string> = {
  zalo: site.contact.zalo,            // zalo.me/0000000000
  facebook: site.contact.facebook,
  instagram: site.contact.instagram,
  tiktok: site.contact.tiktok,
  threads: site.contact.threads,
  x: site.contact.x,
  youtube: site.contact.youtube,
};

const KEYS: V3ContactKey[] = [
  "zalo", "facebook", "instagram", "tiktok", "threads", "x", "youtube", "messenger", "phone", "email",
];

export function makeContact(settings: V3Settings | null | undefined): V3Contact {
  const values = {} as Record<V3ContactKey, string>;
  for (const k of KEYS) values[k] = (settings?.[k] ?? PLACEHOLDER[k] ?? "").trim();
  const isSet = (k: V3ContactKey) => {
    const v = values[k];
    return Boolean(v) && v !== (PLACEHOLDER[k] ?? "");
  };
  return { ...values, isSet };
}

/** Link chat Zalo (ưu tiên giá trị thật, fallback placeholder để không vỡ href). */
export function zaloHref(c: V3Contact): string {
  return c.zalo || "#";
}
