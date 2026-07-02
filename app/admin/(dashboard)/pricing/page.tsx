"use client";

// Quản lý bảng giá theo nền tảng — hiển thị ở trang chi tiết dịch vụ (/dich-vu/...).
// Chưa nhập gì cho nền tảng nào thì trang đó dùng bảng giá mặc định.

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

type Row = {
  id: string;
  platform_slug: string;
  service: string;
  duration: string | null;
  warranty: string | null;
  price: string | null;
  sort: number | null;
};

const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram-threads", label: "Instagram / Threads" },
  { value: "bao-chi", label: "Báo chí" },
];

const inputCls =
  "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

export default function PricingPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("tiktok");

  const [service, setService] = useState("");
  const [duration, setDuration] = useState("");
  const [warranty, setWarranty] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("pricing")
        .select("id,platform_slug,service,duration,warranty,price,sort")
        .order("sort", { ascending: true });
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = rows.filter((r) => r.platform_slug === tab);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const sort = current.length;
      const { data, error } = await supabase
        .from("pricing")
        .insert([{ platform_slug: tab, service, duration: duration || null, warranty: warranty || null, price: price || null, sort }])
        .select("id,platform_slug,service,duration,warranty,price,sort");
      if (error) throw new Error(error.message);
      if (data) setRows([...rows, data[0] as Row]);
      setService(""); setDuration(""); setWarranty(""); setPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa dòng giá này?")) return;
    await supabase.from("pricing").delete().eq("id", id);
    setRows(rows.filter((r) => r.id !== id));
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Bảng giá dịch vụ</h2>
      <p className="text-sm text-gray-500 mb-6">Giá hiển thị ở trang chi tiết từng nền tảng. Nền tảng chưa nhập giá sẽ dùng bảng mặc định.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            onClick={() => setTab(p.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              tab === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-6 grid gap-3 md:grid-cols-5 items-end max-w-4xl">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Dịch vụ *</label>
          <input required value={service} onChange={(e) => setService(e.target.value)} className={`${inputCls} mt-1`} placeholder="Tích xanh chính thống" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Thời gian</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className={`${inputCls} mt-1`} placeholder="7–15 ngày" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Bảo hành</label>
          <input value={warranty} onChange={(e) => setWarranty(e.target.value)} className={`${inputCls} mt-1`} placeholder="12 tháng" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Giá</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputCls} mt-1`} placeholder="5.000.000đ" />
        </div>
        {error && <p className="md:col-span-5 text-sm text-red-600">{error}</p>}
        <div className="md:col-span-5">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Thêm dòng giá
          </button>
        </div>
      </form>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto max-w-4xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Dịch vụ", "Thời gian", "Bảo hành", "Giá", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {current.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{r.service}</td>
                <td className="px-5 py-3 text-gray-600">{r.duration ?? "—"}</td>
                <td className="px-5 py-3 text-gray-600">{r.warranty ?? "—"}</td>
                <td className="px-5 py-3 text-gray-900 font-semibold">{r.price ?? "—"}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                  Chưa có giá cho nền tảng này — trang chi tiết đang dùng bảng giá mặc định.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
