"use client";

// Quản lý dự án đã thực hiện — hiển thị ở mục "Dự án" (dạng bento) trên trang chủ.

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage } from "@/lib/upload";
import { Trash2, ImagePlus, Loader2 } from "lucide-react";

type Project = {
  id: string;
  title: string;
  tag: string | null;
  result: string | null;
  platform: string | null;
  image_url: string | null;
};

const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram-threads", label: "Instagram / Threads" },
  { value: "bao-chi", label: "Báo chí" },
];

const inputCls =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none";

export default function ProjectsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [result, setResult] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,tag,result,platform,image_url")
        .order("created_at", { ascending: false });
      setItems((data as Project[]) ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let image_url: string | null = null;
      if (file) image_url = await uploadImage(file);
      const { data, error } = await supabase
        .from("projects")
        .insert([{ title, tag: tag || null, result: result || null, platform, image_url }])
        .select("id,title,tag,result,platform,image_url");
      if (error) throw new Error(error.message);
      if (data) setItems([data[0] as Project, ...items]);
      setTitle(""); setTag(""); setResult(""); setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa dự án này?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setItems(items.filter((p) => p.id !== id));
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Dự án đã thực hiện</h2>
      <p className="text-sm text-gray-500 mb-6">Nên kèm ảnh thật (screenshot kết quả) — sẽ hiển thị làm ảnh bìa card trên trang chủ.</p>

      <form onSubmit={handleAdd} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-8 grid gap-4 md:grid-cols-2 max-w-3xl">
        <div>
          <label className="text-sm font-medium text-gray-700">Tên dự án *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="@brand.hub — 2.1M follow" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Nền tảng</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputCls}>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Nhãn (hiện trên ảnh)</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls} placeholder="TikTok · Tích xanh" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Kết quả</label>
          <input value={result} onChange={(e) => setResult(e.target.value)} className={inputCls} placeholder="Tích xanh sau 18 ngày" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Ảnh dự án (tùy chọn)</label>
          <label className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-blue-400">
            <ImagePlus className="h-4 w-4" />
            {file ? file.name : "Chọn ảnh…"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="md:col-span-2">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Thêm dự án
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.title} className="h-36 w-full object-cover" />
            ) : (
              <div className="h-36 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Chưa có ảnh</div>
            )}
            <div className="p-4">
              {p.tag && <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">{p.tag}</span>}
              <p className="text-sm font-semibold text-gray-900 mt-1">{p.title}</p>
              {p.result && <p className="text-xs text-gray-500 mt-1">{p.result}</p>}
            </div>
            <div className="border-t px-4 py-2 flex justify-end">
              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1">
                <Trash2 className="h-4 w-4" /> Xóa
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">Chưa có dự án nào — thêm ở form phía trên.</p>}
      </div>
    </div>
  );
}
