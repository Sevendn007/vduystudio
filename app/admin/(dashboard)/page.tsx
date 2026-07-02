"use client";

// Tổng quan: đếm nhanh dữ liệu + hướng dẫn thiết lập lần đầu.

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Briefcase, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClient();
  const [counts, setCounts] = useState<{ feedbacks: number; projects: number; pricing: number } | null>(null);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [f, p, g] = await Promise.all([
          supabase.from("feedbacks").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("pricing").select("id", { count: "exact", head: true }),
        ]);
        if (f.error || p.error || g.error) setDbError(true);
        setCounts({ feedbacks: f.count ?? 0, projects: p.count ?? 0, pricing: g.count ?? 0 });
      } catch {
        setDbError(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    { href: "/admin/feedbacks", label: "Feedback khách hàng", count: counts?.feedbacks, icon: MessageSquare },
    { href: "/admin/projects", label: "Dự án đã thực hiện", count: counts?.projects, icon: Briefcase },
    { href: "/admin/pricing", label: "Dòng bảng giá", count: counts?.pricing, icon: DollarSign },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Tổng quan</h2>
      <p className="text-sm text-gray-500 mb-6">Nội dung nhập ở đây hiển thị ngay trên website (không cần deploy lại).</p>

      {dbError && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl p-4 mb-6 text-sm">
          <b>Chưa thiết lập database?</b> Mở Supabase Dashboard → SQL Editor, chạy file{" "}
          <code className="bg-amber-100 px-1 rounded">supabase/schema.sql</code> trong repo (tạo bảng + bucket ảnh), rồi tải lại trang này.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition">
            <c.icon className="h-5 w-5 text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900">{c.count ?? "…"}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mt-6 max-w-3xl text-sm text-gray-600 space-y-2">
        <p className="font-semibold text-gray-900">Cách dùng nhanh:</p>
        <p>1. <b>Feedback</b> — thêm đánh giá khách hàng, đính kèm ảnh minh chứng nếu có.</p>
        <p>2. <b>Dự án</b> — thêm dự án kèm ảnh thật để hiển thị ở mục &quot;Dự án đã thực hiện&quot;.</p>
        <p>3. <b>Bảng giá</b> — nhập giá theo từng nền tảng; chưa nhập thì website dùng giá mặc định.</p>
        <p>4. <b>Cấu hình liên hệ</b> — đổi link Zalo/Telegram cho mọi nút liên hệ.</p>
      </div>
    </div>
  );
}
