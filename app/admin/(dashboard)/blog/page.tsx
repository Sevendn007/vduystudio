"use client";

// Quản lý blog / bài viết.
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage } from "@/lib/upload";
import { Trash2, ImagePlus, Loader2, Pencil, X, ArrowUp, ArrowDown } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  image_url: string | null;
  images: string[] | null;
  content: string | null;
  created_at: string;
};

const CATEGORIES = [
  "Kiến thức",
  "Hướng dẫn",
  "Tin tức",
  "Chính sách",
  "Khác",
];

const inputCls =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none";

type GalleryItem = { url: string; file?: File; id: string };

export default function BlogAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Kiến thức");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      setItems((data as Blog[]) ?? []);
      setLoading(false);
    })();
  }, [supabase]);

  const resetForm = () => {
    setEditingId(null); setTitle(""); setSlug(""); setCategory("Kiến thức");
    setContent(""); setFile(null); setPreview(null); setGallery([]);
    if (fileRef.current) fileRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const startEdit = (p: Blog) => {
    setEditingId(p.id); setTitle(p.title); setSlug(p.slug); setCategory(p.category ?? "Kiến thức");
    setContent(p.content ?? ""); setFile(null); setPreview(p.image_url);
    setGallery((p.images || []).map(url => ({ url, id: Math.random().toString(36) })));
    if (fileRef.current) fileRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const pickGalleryFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: GalleryItem[] = Array.from(files).map(f => ({
      url: URL.createObjectURL(f),
      file: f,
      id: Math.random().toString(36)
    }));
    setGallery(prev => [...prev, ...newItems]);
  };

  const moveGalleryItem = (index: number, dir: -1 | 1) => {
    if (index + dir < 0 || index + dir >= gallery.length) return;
    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[index + dir];
    newGallery[index + dir] = temp;
    setGallery(newGallery);
  };

  const removeGalleryItem = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!editingId) setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let image_url: string | null = preview && preview.startsWith("http") ? preview : null;
      if (file) image_url = await uploadImage(file);

      const uploadedGalleryUrls = await Promise.all(
        gallery.map(async (g) => {
          if (g.file) return await uploadImage(g.file);
          return g.url;
        })
      );

      const payload = { 
        title, 
        slug, 
        category: category || null, 
        content: content || null, 
        image_url,
        images: uploadedGalleryUrls.length > 0 ? uploadedGalleryUrls : null
      };

      if (editingId) {
        const { data, error: err } = await supabase.from("blogs").update(payload).eq("id", editingId).select("*");
        if (err) throw new Error(err.message);
        if (data) setItems(items.map((p) => (p.id === editingId ? (data[0] as Blog) : p)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } else {
        const { data, error: err } = await supabase.from("blogs").insert([payload]).select("*");
        if (err) throw new Error(err.message);
        if (data) setItems([data[0] as Blog, ...items]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bài viết này?")) return;
    await supabase.from("blogs").delete().eq("id", id);
    setItems(items.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  };

  if (loading) return <div className="text-gray-500">Đang tải…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Bài viết (Blog)</h2>
      <p className="text-sm text-gray-500 mb-6">Quản lý bài viết và chuyên mục.</p>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-8 grid gap-4 max-w-4xl scroll-mt-20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{editingId ? "Sửa bài viết" : "Thêm bài viết mới"}</h3>
          {editingId && <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"><X className="h-4 w-4" />Hủy</button>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Tiêu đề *</label>
            <input required value={title} onChange={handleTitleChange} className={inputCls} placeholder="Nhập tiêu đề..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Đường dẫn (Slug) *</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="bai-viet-so-1" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Chuyên mục</label>
            <input list="cat-list" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} placeholder="Chọn hoặc nhập..." />
            <datalist id="cat-list">
              {CATEGORIES.map((t) => (<option key={t} value={t} />))}
            </datalist>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Ảnh bìa (Thumbnail)</label>
            <div className="mt-1 flex items-center gap-4">
              {preview ? (
                <div className="relative w-20 h-20 rounded border bg-gray-50 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => pickFile(null)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1"><X className="w-3 h-3 text-red-600" /></button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                  <ImagePlus className="w-6 h-6 mb-1" />
                </div>
              )}
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => pickFile(e.target.files?.[0] || null)} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Hình ảnh đính kèm (Nhiều hình, tuỳ chỉnh thứ tự)</label>
          <input ref={galleryRef} type="file" multiple accept="image/*" onChange={(e) => pickGalleryFiles(e.target.files)} className="mt-1 block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          
          {gallery.length > 0 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {gallery.map((g, index) => (
                <div key={g.id} className="relative w-24 h-24 rounded border bg-gray-50 overflow-hidden flex-shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt="gallery" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-1">
                      {index > 0 && <button type="button" onClick={() => moveGalleryItem(index, -1)} className="p-1 bg-white rounded shadow text-gray-800 hover:bg-gray-100" title="Di chuyển sang trái"><ArrowUp className="w-3 h-3 -rotate-90" /></button>}
                      {index < gallery.length - 1 && <button type="button" onClick={() => moveGalleryItem(index, 1)} className="p-1 bg-white rounded shadow text-gray-800 hover:bg-gray-100" title="Di chuyển sang phải"><ArrowDown className="w-3 h-3 -rotate-90" /></button>}
                    </div>
                    <button type="button" onClick={() => removeGalleryItem(index)} className="p-1 bg-red-100 text-red-600 rounded shadow hover:bg-red-200 mt-1"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Nội dung bài viết (Hỗ trợ HTML/Markdown cơ bản)</label>
          <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} className={inputCls} placeholder="Nội dung chi tiết..."></textarea>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Cập nhật bài viết" : "Đăng bài viết"}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover border-b" />
            ) : (
              <div className="w-full h-40 bg-gray-100 border-b flex items-center justify-center text-gray-400">Không có ảnh</div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{p.category ?? "Khác"}</span>
              <h4 className="font-bold text-gray-900 mt-2 line-clamp-2">{p.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{new Date(p.created_at).toLocaleDateString("vi-VN")}</p>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => startEdit(p)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-dashed rounded-xl">Chưa có bài viết nào.</div>}
      </div>
    </div>
  );
}
