// Upload ảnh lên Supabase Storage (bucket "uploads", public) → trả về URL công khai.

import { createClient } from "@/utils/supabase/client";

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Upload thất bại: ${error.message}`);
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}
