"use client";
// State của form đặt vé — dùng chung cho cả bản classic và future (chỉ UI, không
// backend: submit sẽ mở bảng liên hệ gọi/SMS/Zalo).
import { useCallback, useMemo, useState } from "react";
import { BOOKABLE_ROUTES, ROUTES } from "@/lib/sitetemplate/xekhach/data";
import { EMPTY_FORM, type BookingForm } from "@/lib/sitetemplate/xekhach/booking";

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useBooking(initial?: Partial<BookingForm>) {
  const [form, setForm] = useState<BookingForm>({ ...EMPTY_FORM, depart: todayISO(), ...initial });
  const [open, setOpen] = useState(false);

  const set = useCallback(<K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // ngày về không được trước ngày đi
      if (key === "depart" && next.ret && next.ret < String(value)) next.ret = String(value);
      if (key === "roundTrip" && !value) next.ret = "";
      return next;
    });
  }, []);

  const route = useMemo(() => ROUTES.find((r) => r.id === form.routeId), [form.routeId]);

  /** Các khung giờ của tuyến đang chọn (để gợi ý giờ đi). */
  const times = useMemo(() => route?.trips.map((t) => t.time) ?? [], [route]);

  const openSheet = useCallback(() => setOpen(true), []);
  const closeSheet = useCallback(() => setOpen(false), []);

  return { form, set, setForm, route, times, routes: BOOKABLE_ROUTES, open, openSheet, closeSheet };
}
