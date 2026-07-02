"use client";

// Hook liên hệ: lấy Zalo/Telegram/Messenger/phone/email từ bảng settings
// (Supabase). Kênh nào để trống / còn giá trị placeholder mặc định coi như
// CHƯA cấu hình (isSet = false) → landing sẽ ẩn.

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { fetchSettings } from "@/lib/data";

export type ContactKey = "zalo" | "telegram" | "messenger" | "phone" | "email";

export type Contact = Record<ContactKey, string> & {
  isSet: (k: ContactKey) => boolean;
};

const KEYS: ContactKey[] = ["zalo", "telegram", "messenger", "phone", "email"];

export function useContact(): Contact {
  const [values, setValues] = useState<Record<ContactKey, string>>({ ...site.contact });

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((s) => {
      if (!mounted || !s) return;
      setValues((prev) => {
        const next = { ...prev };
        for (const k of KEYS) if (s[k] !== undefined) next[k] = s[k];
        return next;
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isSet = (k: ContactKey) => {
    const v = values[k]?.trim();
    return Boolean(v) && v !== site.contact[k];
  };

  return { ...values, isSet };
}
