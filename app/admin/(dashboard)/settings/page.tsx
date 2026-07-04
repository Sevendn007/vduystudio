"use client";

// Cấu hình liên hệ (key-value trong bảng settings) — dùng cho nút Zalo/Telegram,
// chat nổi và mọi CTA trên landing.

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

const FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "zalo", label: "Link Zalo", placeholder: "https://zalo.me/0912345678" },
  { key: "facebook", label: "Link Facebook", placeholder: "https://facebook.com/vduystudio" },
  { key: "instagram", label: "Link Instagram", placeholder: "https://instagram.com/vduystudio" },
  { key: "tiktok", label: "Link Tiktok", placeholder: "https://tiktok.com/@vduystudio" },
  { key: "threads", label: "Link Threads", placeholder: "https://threads.net/@vduystudio" },
  { key: "x", label: "Link X (Twitter)", placeholder: "https://x.com/vduystudio" },
  { key: "youtube", label: "Link Youtube", placeholder: "https://youtube.com/@vduystudio" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("key,value");
      if (data) {
        setValues(Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setMessage(error ? `Lỗi: ${error.message}` : "Đã lưu ✓");
    setSaving(false);
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Cấu hình liên hệ</h2>
      <p className="text-sm text-gray-500 mb-6">Áp dụng cho mọi nút liên hệ / chat trên website.</p>

      <form onSubmit={handleSave} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 space-y-4 max-w-xl">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-gray-700">{f.label}</label>
            <input
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Lưu cấu hình
          </button>
          {message && <span className={`text-sm ${message.startsWith("Lỗi") ? "text-red-600" : "text-green-600"}`}>{message}</span>}
        </div>
      </form>
    </div>
  );
}
