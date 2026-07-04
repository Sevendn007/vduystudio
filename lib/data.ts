// Lớp dữ liệu: đọc nội dung động (feedback, dự án, bảng giá, liên hệ) từ
// Supabase. Mọi hàm đều an toàn: DB lỗi / chưa cấu hình / trống → trả null
// để nơi gọi fallback về nội dung mặc định trong lib/site.ts & lib/services.ts.

import { createClient } from "@/utils/supabase/client";

export type DbFeedback = {
  id: string;
  name: string;
  company: string | null;
  quote: string;
  rating: number | null;
  image_url: string | null;
  sort_order: number | null;
  date: string | null;
};

export type DbProject = {
  id: string;
  title: string;
  tag: string | null;
  result: string | null;
  platform: string | null;
  image_url: string | null;
  sort_order: number | null;
  date: string | null;
};

export type DbBlog = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  image_url: string | null;
  content: string | null;
  created_at: string;
};

export type DbPriceRow = {
  id: string;
  platform_slug: string;
  service: string;
  duration: string | null;
  warranty: string | null;
  price: string | null;
  sort: number | null;
};

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function fetchFeedbacks(): Promise<DbFeedback[] | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient()
      .from("feedbacks")
      .select("id,name,company,quote,rating,image_url,sort_order,date")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(9);
    if (error || !data || data.length === 0) return null;
    return data as DbFeedback[];
  } catch {
    return null;
  }
}

export async function fetchProjects(): Promise<DbProject[] | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient()
      .from("projects")
      .select("id,title,tag,result,platform,image_url,sort_order,date")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6);
    if (error || !data || data.length === 0) return null;
    return data as DbProject[];
  } catch {
    return null;
  }
}

// Toàn bộ dự án (trang /du-an) — mới nhất trước.
export async function fetchAllProjects(): Promise<DbProject[] | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient()
      .from("projects")
      .select("id,title,tag,result,platform,image_url,sort_order,date")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !data || data.length === 0) return null;
    return data as DbProject[];
  } catch {
    return null;
  }
}

export async function fetchPricing(platformSlug: string): Promise<DbPriceRow[] | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient()
      .from("pricing")
      .select("id,platform_slug,service,duration,warranty,price,sort")
      .eq("platform_slug", platformSlug)
      .order("sort", { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data as DbPriceRow[];
  } catch {
    return null;
  }
}

// Cấu hình liên hệ dạng key-value (bảng settings).
export async function fetchSettings(): Promise<Record<string, string> | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient().from("settings").select("key,value");
    if (error || !data || data.length === 0) return null;
    return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
  } catch {
    return null;
  }
}

export async function fetchBlogs(category?: string): Promise<DbBlog[] | null> {
  if (!hasSupabase()) return null;
  try {
    let query = createClient().from("blogs").select("id,title,slug,category,image_url,created_at");
    if (category) {
      query = query.eq("category", category);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data as DbBlog[];
  } catch {
    return null;
  }
}

export async function fetchBlogBySlug(slug: string): Promise<DbBlog | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await createClient().from("blogs").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return data as DbBlog;
  } catch {
    return null;
  }
}
