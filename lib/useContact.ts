"use client";

// Hook liên hệ: lấy Zalo/Telegram/Messenger/phone/email từ bảng settings
// trên Supabase; chưa cấu hình DB thì dùng giá trị mặc định trong lib/site.ts.

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { fetchSettings } from "@/lib/data";

export type Contact = {
  zalo: string;
  telegram: string;
  messenger: string;
  phone: string;
  email: string;
};

export function useContact(): Contact {
  const [contact, setContact] = useState<Contact>({ ...site.contact });

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((s) => {
      if (!mounted || !s) return;
      setContact((prev) => ({
        zalo: s.zalo || prev.zalo,
        telegram: s.telegram || prev.telegram,
        messenger: s.messenger || prev.messenger,
        phone: s.phone || prev.phone,
        email: s.email || prev.email,
      }));
    });
    return () => {
      mounted = false;
    };
  }, []);

  return contact;
}
