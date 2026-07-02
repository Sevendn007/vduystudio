"use client";

// Quản lý feedback khách hàng: tên, công ty, nội dung, số sao, ảnh minh chứng.
// Ảnh upload lên Supabase Storage (bucket "uploads") — hiển thị ngay trên landing.

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage } from "@/lib/upload";
import { Trash2, ImagePlus, Loader2 } from "lucide-react";

type Feedback = {
  id: string;
  name: string;
  company: string | null;
  quote: string;
  rating: number | null;
  image_url: string | null;
};

const inputCls =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none";

export default function FeedbacksPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("feedbacks")
        .select("id,name,company,quote,rating,image_url")
        .order("created_at", { ascending: false });
      setItems((data as Feedback[]) ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let image_url: string | null = null;
      if (file) image_url = await uploadImage(file);
      const { data, error } = await supabase
        .from("feedbacks")
        .insert([{ name, company: company || null, quote, rating, image_url }])
        .select("id,name,company,quote,rating,image_url");
      if (error) throw new Error(error.message);
      if (data) setItems([data[0] as Feedback, ...items]);
      setName(""); setCompany(""); setQuote(""); setRating(5); pickFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa feedback này?")) return;
    await supabase.from("feedbacks").delete().eq("id", id);
    setItems(items.filter((f) => f.id !== id));
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Feedback khách hàng</h2>
      <p className="text-sm text-gray-500 mb-6">Hiển thị ở mục &quot;Khách hàng nói gì&quot; trên trang chủ. Ảnh minh chứng (chụp màn hình tin nhắn, kết quả…) là tùy chọn.</p>

      <form onSubmit={handleAdd} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-8 grid gap-4 md:grid-cols-2 max-w-3xl">
        <div>
          <label className="text-sm font-medium text-gray-700">Tên khách hàng *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Minh Anh" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Chức vụ / Công ty</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} placeholder="CEO — LuxHouse Cosmetics" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Nội dung feedback *</label>
          <textarea required rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} className={inputCls} placeholder="Lên tích xanh đúng cam kết…" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Số sao</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={inputCls}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Ảnh minh chứng (tùy chọn)</label>
          <label className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-blue-400">
            <ImagePlus className="h-4 w-4" />
            {file ? file.name : "Chọn ảnh…"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          </label>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />
          )}
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="md:col-span-2">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Thêm feedback
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((f) => (
          <div key={f.id} className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            {f.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image_url} alt={f.name} className="h-36 w-full object-cover" />
            )}
            <div className="p-4 flex-1">
              <div className="text-amber-500 text-sm">{"★".repeat(Math.min(5, Math.max(1, f.rating ?? 5)))}</div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">“{f.quote}”</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{f.name}</p>
              {f.company && <p className="text-xs text-gray-500">{f.company}</p>}
            </div>
            <div className="border-t px-4 py-2 flex justify-end">
              <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1">
                <Trash2 className="h-4 w-4" /> Xóa
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">Chưa có feedback nào — thêm ở form phía trên.</p>}
      </div>
    </div>
  );
}
