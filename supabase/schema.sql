-- ============================================================
-- VDuyStudio — schema Supabase
-- Chạy file này trong Supabase Dashboard → SQL Editor → Run.
-- An toàn chạy lại nhiều lần (idempotent).
-- ============================================================

-- 1) Feedback khách hàng (có ảnh minh chứng tùy chọn)
create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  image_url text,
  created_at timestamptz not null default now()
);
-- Bổ sung cột nếu bảng cũ đã tồn tại với schema khác
alter table public.feedbacks add column if not exists company text;
alter table public.feedbacks add column if not exists quote text;
alter table public.feedbacks add column if not exists rating int default 5;
alter table public.feedbacks add column if not exists image_url text;

-- 2) Dự án đã thực hiện
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text,                -- ví dụ: "TikTok · Tích xanh"
  result text,             -- ví dụ: "Tích xanh sau 18 ngày"
  platform text,           -- slug: tiktok | facebook | instagram-threads | bao-chi
  image_url text,
  created_at timestamptz not null default now()
);
alter table public.projects add column if not exists title text;
alter table public.projects add column if not exists tag text;
alter table public.projects add column if not exists result text;
alter table public.projects add column if not exists platform text;
alter table public.projects add column if not exists image_url text;

-- 3) Bảng giá theo nền tảng
create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  platform_slug text not null,  -- tiktok | facebook | instagram-threads | bao-chi
  service text not null,
  duration text,
  warranty text,
  price text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- 4) Cấu hình liên hệ (key-value)
create table if not exists public.settings (
  key text primary key,          -- zalo | telegram | messenger | phone | email
  value text not null default ''
);
insert into public.settings (key, value) values
  ('zalo', 'https://zalo.me/0000000000'),
  ('telegram', 'https://t.me/vduystudio'),
  ('messenger', 'https://m.me/vduystudio'),
  ('phone', '0000 000 000'),
  ('email', 'hello@vduystudio.com')
on conflict (key) do nothing;

-- ============================================================
-- Dữ liệu mẫu (chỉ chèn khi bảng đang trống) — để admin & landing khớp nhau
-- ngay từ đầu. Xóa/sửa thoải mái trong trang admin sau khi chạy.
-- ============================================================
insert into public.feedbacks (name, company, quote, rating)
select * from (values
  ('Minh Anh','CEO — LuxHouse Cosmetics','Lên tích xanh TikTok đúng như cam kết, hỗ trợ nhiệt tình. Doanh thu livestream tăng rõ sau khi có tick.',5),
  ('Quốc Huy','Founder — Huy''s Kitchen (F&B)','Fanpage bị khóa được xử lý chỉ trong 48 giờ, giá minh bạch. Quá chuyên nghiệp.',5),
  ('Thu Trang','Giám đốc Marketing — Bloom Beauty','Team booking báo chí rất chuyên nghiệp, bài viết chất lượng, đúng thông điệp thương hiệu.',5)
) as v(name,company,quote,rating)
where not exists (select 1 from public.feedbacks);

insert into public.projects (title, tag, result, platform)
select * from (values
  ('@brand.hub — 2.1M follow','TikTok · Tích xanh','Tích xanh sau 18 ngày, mở khóa giỏ hàng','tiktok'),
  ('Fanpage F&B miền Bắc','Facebook · Fanpage','Khôi phục fanpage bị khóa trong 48 giờ','facebook'),
  ('Chiến dịch ra mắt mỹ phẩm','Báo chí · PR','Booking 6 đầu báo lớn','bao-chi'),
  ('Studio nhiếp ảnh','Instagram · Tích xanh','Tích xanh Instagram sau 7 ngày','instagram-threads')
) as v(title,tag,result,platform)
where not exists (select 1 from public.projects);

-- ============================================================
-- RLS: ai cũng ĐỌC được (landing page), chỉ user đăng nhập được GHI (admin)
-- ============================================================
alter table public.feedbacks enable row level security;
alter table public.projects  enable row level security;
alter table public.pricing   enable row level security;
alter table public.settings  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['feedbacks','projects','pricing','settings'] loop
    execute format('drop policy if exists "public read"  on public.%I', t);
    execute format('drop policy if exists "auth write"   on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "auth write"  on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ============================================================
-- Storage: bucket "uploads" chứa ảnh feedback / dự án (public read)
-- ============================================================
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads public read"  on storage.objects;
drop policy if exists "uploads auth insert"  on storage.objects;
drop policy if exists "uploads auth delete"  on storage.objects;
create policy "uploads public read" on storage.objects for select using (bucket_id = 'uploads');
create policy "uploads auth insert" on storage.objects for insert to authenticated with check (bucket_id = 'uploads');
create policy "uploads auth delete" on storage.objects for delete to authenticated using (bucket_id = 'uploads');
