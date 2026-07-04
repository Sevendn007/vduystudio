"use client";

// Quản lý dự án đã thực hiện: thêm / SỬA / xóa. Hiển thị dạng bento trên trang chủ.

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage } from "@/lib/upload";
import { Trash2, ImagePlus, Loader2, Pencil, X } from "lucide-react";

type Project = {
  id: string;
  title: string;
  tag: string | null;
  result: string | null;
  platform: string | null;
  image_url: string | null;
  sort_order: number | null;
  date: string | null;
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [result, setResult] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [sortOrder, setSortOrder] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,tag,result,platform,image_url,sort_order,date")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setItems((data as Project[]) ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null); setTitle(""); setTag(""); setResult(""); setPlatform("tiktok");
    setSortOrder(""); setDate(""); setFile(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id); setTitle(p.title); setTag(p.tag ?? ""); setResult(p.result ?? "");
    setPlatform(p.platform ?? "tiktok"); setSortOrder(p.sort_order?.toString() ?? ""); setDate(p.date ?? ""); setFile(null); setPreview(p.image_url);
    if (fileRef.current) fileRef.current.value = "";
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let image_url: string | null = preview && preview.startsWith("http") ? preview : null;
      if (file) image_url = await uploadImage(file);
      const payload = { title, tag: tag || null, result: result || null, platform, image_url, sort_order: sortOrder ? parseInt(sortOrder) : null, date: date || null };

      if (editingId) {
        const { data, error } = await supabase.from("projects").update(payload).eq("id", editingId).select("id,title,tag,result,platform,image_url,sort_order,date");
        if (error) throw new Error(error.message);
        if (data) setItems(items.map((p) => (p.id === editingId ? (data[0] as Project) : p)).sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999)));
      } else {
        const { data, error } = await supabase.from("projects").insert([payload]).select("id,title,tag,result,platform,image_url,sort_order,date");
        if (error) throw new Error(error.message);
        if (data) setItems([...items, data[0] as Project].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999)));
      }
      resetForm();
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
    if (editingId === id) resetForm();
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Dự án đã thực hiện</h2>
      <p className="text-sm text-gray-500 mb-6">Nên kèm ảnh thật (screenshot kết quả) — hiển thị làm ảnh bìa card trên trang chủ.</p>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-8 grid gap-4 md:grid-cols-2 max-w-3xl scroll-mt-20">
        <div className="md:col-span-2 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{editingId ? "Sửa dự án" : "Thêm dự án mới"}</h3>
          {editingId && <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"><X className="h-4 w-4" />Hủy</button>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Tên dự án *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="@brand.hub — 2.1M follow" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Loại dịch vụ (Nền tảng)</label>
          <input list="platform-list" value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputCls} placeholder="Chọn hoặc nhập tự do..." />
          <datalist id="platform-list">
            {PLATFORMS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
          </datalist>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Nhãn (hiện trên ảnh)</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls} placeholder="TikTok · Tích xanh" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Kết quả</label>
          <input value={result} onChange={(e) => setResult(e.target.value)} className={inputCls} placeholder="Tích xanh sau 18 ngày" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Thứ tự sắp xếp</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} placeholder="1, 2, 3... (nhỏ xếp trước)" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Thời gian (hiển thị trên thẻ)</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} placeholder="2024, 07/2024..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Ảnh dự án (tùy chọn)</label>
          <label className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-blue-400">
            <ImagePlus className="h-4 w-4" />{file ? file.name : "Chọn ảnh…"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          </label>
          {preview && (
            <div className="mt-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-20 rounded-lg object-cover" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="text-xs text-red-600 hover:underline">Bỏ ảnh</button>
            </div>
          )}
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="md:col-span-2">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Lưu thay đổi" : "Thêm dự án"}
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className={`bg-white shadow-sm border rounded-xl overflow-hidden ${editingId === p.id ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"}`}>
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
            <div className="border-t px-4 py-2 flex justify-end gap-4">
              <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"><Pencil className="h-4 w-4" />Sửa</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1"><Trash2 className="h-4 w-4" />Xóa</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">Chưa có dự án nào — thêm ở form phía trên.</p>}
      </div>
    </div>
  );
}
