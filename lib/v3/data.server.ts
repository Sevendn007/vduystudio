// Lớp data phía SERVER cho v3: đọc Supabase bằng anon key (KHÔNG cookie) để
// HTML prerender có dữ liệu thật (SEO) và supabase-js KHÔNG vào client bundle.
// ISR qua `export const revalidate` ở app/v3/page.tsx + fetch next.revalidate.
// Giữ contract trả `null` khi lỗi/rỗng → nơi gọi fallback như lib/data.ts.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DbProject, DbFeedback, DbPriceRow, DbBlog } from "@/lib/data";

export type { DbProject, DbFeedback, DbPriceRow, DbBlog };

const REVALIDATE = 60;

function hasSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let _client: SupabaseClient | null = null;
function client(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        // Để Next cache GET của Supabase theo ISR (revalidate N giây).
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, next: { revalidate: REVALIDATE } } as RequestInit),
      },
    }
  );
  return _client;
}

async function safe<T>(fn: (c: SupabaseClient) => PromiseLike<{ data: unknown; error: unknown }>): Promise<T | null> {
  if (!hasSupabase()) return null;
  try {
    const { data, error } = await fn(client());
    if (error || !data || (Array.isArray(data) && data.length === 0)) return null;
    return data as T;
  } catch {
    return null;
  }
}

export function fetchProjects() {
  return safe<DbProject[]>((c) =>
    c.from("projects").select("id,title,tag,result,platform,image_url,sort_order,date")
      .order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(6)
  );
}

export function fetchAllProjects() {
  return safe<DbProject[]>((c) =>
    c.from("projects").select("id,title,tag,result,platform,image_url,sort_order,date")
      .order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(100)
  );
}

export function fetchFeedbacks() {
  return safe<DbFeedback[]>((c) =>
    c.from("feedbacks").select("id,name,company,quote,rating,image_url,sort_order,date")
      .order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(9)
  );
}

export function fetchPricing(platformSlug: string) {
  return safe<DbPriceRow[]>((c) =>
    c.from("pricing").select("id,platform_slug,service,duration,warranty,price,sort")
      .eq("platform_slug", platformSlug).order("sort", { ascending: true })
  );
}

export async function fetchAllPricing(slugs: string[]): Promise<Record<string, DbPriceRow[] | null>> {
  const rows = await Promise.all(slugs.map((s) => fetchPricing(s)));
  return Object.fromEntries(slugs.map((s, i) => [s, rows[i]]));
}

export async function fetchSettings(): Promise<Record<string, string> | null> {
  const rows = await safe<{ key: string; value: string }[]>((c) => c.from("settings").select("key,value"));
  return rows ? Object.fromEntries(rows.map((r) => [r.key, r.value])) : null;
}

export function fetchBlogs(category?: string) {
  return safe<DbBlog[]>((c) => {
    let q = c.from("blogs").select("id,title,slug,category,image_url,created_at");
    if (category) q = q.eq("category", category);
    return q.order("created_at", { ascending: false });
  });
}

export function fetchBlogBySlug(slug: string) {
  return safe<DbBlog>((c) => c.from("blogs").select("*").eq("slug", slug).single());
}
