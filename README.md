# VDuyStudio — Website chính thức

Landing page + trang chi tiết dịch vụ + trang quản trị cho **VDuyStudio**
(tích xanh chính thống, mở khóa tài khoản, booking báo chí cho TikTok /
Facebook / Instagram-Threads).

Giao diện chính thức: **Galaxy** — nền vũ trụ, hero hệ quỹ đạo (logo ở tâm,
4 nền tảng xoay quanh), từ ngữ chuyên nghiệp, song ngữ **VI/EN** (mặc định VI),
tối ưu mobile từ iPhone 13 trở lên (safe-area, nút bấm full-width).

## Cấu trúc

```
app/
  page.tsx                   # trang chủ (Galaxy)
  dich-vu/[slug]/page.tsx    # chi tiết dịch vụ (giá đọc từ DB, fallback mặc định)
  admin/                     # trang quản trị (Supabase Auth)
components/
  variants/Option2079.tsx    # giao diện Galaxy
  ServiceDetail.tsx          # trang chi tiết
  logo.tsx                   # logo động nguyên bản (badge + wordmark + icon)
  ChatFab.tsx                # nút chat nổi Zalo/Telegram
lib/
  services.ts / site.ts      # nội dung mặc định (song ngữ)
  data.ts                    # đọc feedback/dự án/giá/liên hệ từ Supabase
  i18n.tsx                   # chuyển ngôn ngữ VI/EN
supabase/schema.sql          # schema DB — chạy 1 lần trong Supabase SQL Editor
```

## Font logo

Chữ logo dùng **Druk Wide Super** (font thương mại). Thả file
`public/fonts/DrukWideSuper.woff2` vào là tự nhận; chưa có file thì fallback
**Archivo Expanded 900** (Google Fonts, miễn phí).

## Thiết lập database (1 lần)

1. Tạo project trên [supabase.com](https://supabase.com), lấy URL + anon key
   điền vào `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
2. Supabase Dashboard → **SQL Editor** → dán nội dung `supabase/schema.sql` → Run.
   (Tạo bảng feedbacks / projects / pricing / settings + bucket ảnh `uploads`.)
3. **Authentication → Users** → tạo tài khoản admin (email + mật khẩu).

## Trang quản trị — `/admin`

Đăng nhập bằng tài khoản Supabase. Gồm 5 mục, dữ liệu hiển thị ngay trên web,
không cần deploy lại:

| Mục | Nội dung |
|---|---|
| Tổng quan | Đếm nhanh dữ liệu + hướng dẫn |
| Feedback | Tên, công ty, nội dung, số sao, **ảnh minh chứng (upload)** |
| Dự án | Tên, nền tảng, nhãn, kết quả, **ảnh dự án (upload)** — hiện dạng bento trên trang chủ |
| Bảng giá | Nhập theo từng nền tảng; chưa nhập thì web dùng giá mặc định |
| Liên hệ | Link Zalo / Telegram / Messenger / phone / email cho mọi nút CTA |

Website luôn chạy được kể cả khi **chưa** cấu hình Supabase — mọi mục tự
fallback về nội dung mặc định trong `lib/site.ts` và `lib/services.ts`.

## Chạy local & deploy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Deploy Vercel: import repo → thêm 2 biến môi trường Supabase → Deploy →
gắn domain `vduystudio.com`.
