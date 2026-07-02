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
-- Bổ sung cột nếu bảng pricing cũ có schema khác (title/price/description/features)
alter table public.pricing add column if not exists platform_slug text;
alter table public.pricing add column if not exists service text;
alter table public.pricing add column if not exists duration text;
alter table public.pricing add column if not exists warranty text;
alter table public.pricing add column if not exists price text;
alter table public.pricing add column if not exists sort int default 0;

-- 4) Cấu hình liên hệ (key-value)
create table if not exists public.settings (
  key text primary key,          -- zalo | telegram | messenger | phone | email
  value text not null default ''
);
-- Tạo sẵn các khóa với giá trị RỖNG — admin điền link thật sau. Kênh rỗng
-- sẽ không hiển thị trên landing (không cấu hình = ẩn).
insert into public.settings (key, value) values
  ('zalo', ''), ('telegram', ''), ('messenger', ''), ('phone', ''), ('email', '')
on conflict (key) do nothing;

-- ============================================================
-- Hòa giải với bảng CŨ (nếu trước đây đã tạo với schema khác):
-- bỏ ràng buộc NOT NULL ở các cột cũ (name/client/description/avatar…) để
-- seed + form admin mới (dùng title/quote…) chạy được; backfill sang cột mới.
-- ============================================================
do $$
declare
  pairs text[][] := array[
    ['projects','name'],['projects','client'],['projects','description'],
    ['feedbacks','avatar'],['feedbacks','description'],
    ['pricing','title'],['pricing','description'],['pricing','features']
  ];
  p text[];
begin
  foreach p slice 1 in array pairs loop
    if exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name=p[1] and column_name=p[2]
    ) then
      execute format('alter table public.%I alter column %I drop not null', p[1], p[2]);
    end if;
  end loop;

  -- backfill dữ liệu cũ sang cột mới (nếu cột cũ còn tồn tại)
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='name') then
    execute 'update public.projects set title = coalesce(title, name) where title is null';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='feedbacks' and column_name='description') then
    execute 'update public.feedbacks set quote = coalesce(quote, description) where quote is null';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='feedbacks' and column_name='avatar') then
    execute 'update public.feedbacks set company = coalesce(company, avatar) where company is null';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='pricing' and column_name='title') then
    execute 'update public.pricing set service = coalesce(service, title) where service is null';
  end if;
end $$;

-- Đảm bảo cột chính không rỗng cho các dòng cũ (tránh landing hiển thị trống)
update public.projects  set title = coalesce(title, 'Dự án')      where title is null or title = '';
update public.feedbacks set quote = coalesce(quote, '(chưa có nội dung)') where quote is null or quote = '';
update public.feedbacks set name  = coalesce(name, 'Khách hàng')  where name is null or name = '';

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

insert into public.pricing (platform_slug, service, duration, warranty, price, sort)
select * from (values
  ('tiktok','Tích xanh chính thống','7–15 ngày','12 tháng','Liên hệ báo giá',0),
  ('tiktok','Mở khóa tài khoản','1–3 ngày','30 ngày','Liên hệ báo giá',1),
  ('tiktok','Mở khóa Livestream','1–2 ngày','30 ngày','Liên hệ báo giá',2),
  ('tiktok','Mở khóa Giỏ hàng (TikTok Shop)','1–3 ngày','30 ngày','Liên hệ báo giá',3),
  ('facebook','Tích xanh cá nhân/Fanpage','5–10 ngày','12 tháng','Liên hệ báo giá',0),
  ('facebook','Mở khóa tài khoản cá nhân','1–3 ngày','30 ngày','Liên hệ báo giá',1),
  ('facebook','Mở khóa Fanpage','1–3 ngày','30 ngày','Liên hệ báo giá',2),
  ('instagram-threads','Tích xanh chính thống','5–10 ngày','12 tháng','Liên hệ báo giá',0),
  ('instagram-threads','Mở khóa tài khoản','1–3 ngày','30 ngày','Liên hệ báo giá',1),
  ('bao-chi','Booking theo đầu báo','2–5 ngày','Giữ bài theo gói','Theo bảng đầu báo',0),
  ('bao-chi','Viết bài PR chuẩn SEO','2–3 ngày','Chỉnh sửa 2 lần','Liên hệ báo giá',1)
) as v(platform_slug,service,duration,warranty,price,sort)
where not exists (select 1 from public.pricing);

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

-- ============================================================
-- Nạp lại schema cache của PostgREST (khắc phục lỗi "Could not find the
-- 'x' column ... in the schema cache" sau khi thêm/sửa cột).
-- ============================================================
notify pgrst, 'reload schema';
