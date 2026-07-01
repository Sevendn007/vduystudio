# vduystudio — Landing Page

Landing page portfolio cho dịch vụ **vduystudio** (tích xanh chính thống, mở khóa tài khoản, booking báo chí cho TikTok / Facebook / Instagram-Threads).

Bản này gồm **3 phong cách giao diện** dựng sẵn, chuyển đổi trực tiếp trên UI bằng thanh switcher ở giữa-dưới màn hình. Lựa chọn được lưu vào `localStorage` nên giữ nguyên khi tải lại trang.

| Option | Phong cách | Ghi chú |
|--------|-----------|---------|
| **A — Editorial** | Cinematic / cao cấp, dark theme, grain, typography khổ lớn | Cảm hứng từ thiswasmajor.com |
| **B — Bento SaaS** | Sạch, chuyên nghiệp, trust-first, light theme | Dễ maintain, an toàn để launch |
| **C — Gradient** | Trẻ trung, gradient, glassmorphism, mobile-first | Sticky CTA Chat Zalo |

## Tech stack

- **Next.js 14** (App Router) — deploy free trên Vercel
- **TypeScript**
- **Tailwind CSS** (dùng cho switcher; các variant dùng CSS scoped riêng)
- **next/font** — Inter + Poppins (self-host, free)

## Chạy local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
```

## Cấu trúc

```
app/
  layout.tsx                 # metadata, fonts
  page.tsx                   # state switcher + render variant đang chọn
  icon.svg                   # favicon (huy hiệu tích xanh)
  globals.css
  dich-vu/[slug]/page.tsx    # trang chi tiết dịch vụ (SSG cho 4 nền tảng)
components/
  VariantSwitcher.tsx        # thanh chuyển A/B/C
  ServiceDetail.tsx          # UI trang chi tiết (hero, giá, quy trình, FAQ...)
  art.tsx                    # ảnh SVG vector: logo, badge, phone, cover, avatar
  variants/
    OptionA.tsx              # Editorial
    OptionB.tsx              # Bento SaaS
    OptionC.tsx              # Gradient
lib/
  services.ts                # dữ liệu dịch vụ tập trung (giá, quy trình, FAQ, dự án)
  site.ts                    # thông tin liên hệ & thương hiệu dùng chung
```

## Trang chi tiết dịch vụ

Mỗi nền tảng có 1 trang riêng, prerender static:

- `/dich-vu/tiktok`
- `/dich-vu/facebook`
- `/dich-vu/instagram-threads`
- `/dich-vu/bao-chi`

Gồm: chi tiết dịch vụ · bảng giá + thời gian + bảo hành · quy trình 4 bước · dự án
liên quan · FAQ (accordion) · link nền tảng khác · CTA. Toàn bộ nội dung nằm trong
[`lib/services.ts`](lib/services.ts) để dễ sửa (và sau này nối trang admin).

## Ảnh thương hiệu

Không dùng ảnh ngoài — tất cả là SVG vector trong [`components/art.tsx`](components/art.tsx):
`VerifiedBadge`, `BrandMark`, `PhoneMock` (hồ sơ đã xác minh), `ProjectCover`
(ảnh bìa case study), `Avatar`. Sắc nét ở mọi kích thước, nhẹ, đúng branding.

## Cần chỉnh trước khi chạy thật

- **Liên hệ**: sửa Zalo / Messenger / phone / email trong [`lib/site.ts`](lib/site.ts).
- **Giá**: hiện để "Liên hệ báo giá" trong [`lib/services.ts`](lib/services.ts) — thay số thật nếu muốn.
- **Feedback / ảnh thật**: có thể thay `ProjectCover`/`Avatar` bằng ảnh chụp thật khi có.

## Deploy Vercel (free)

**Cách 1 — qua GitHub (khuyến nghị, không cần CLI):**

1. Tạo repo trên GitHub rồi push (repo đã `git init` + commit sẵn):
   ```bash
   git remote add origin https://github.com/<user>/vduystudio.git
   git branch -M main
   git push -u origin main
   ```
2. Vào [vercel.com/new](https://vercel.com/new) → Import repo → Vercel tự nhận Next.js → **Deploy** (không cần config).
3. Vào **Settings → Domains**, thêm `vduystudio.com` và trỏ DNS theo hướng dẫn.

**Cách 2 — qua Vercel CLI:**

```bash
npm i -g vercel
vercel        # đăng nhập & deploy preview
vercel --prod # deploy production
```

## Bước tiếp theo (chưa làm)

- Trang **admin** để sửa giá / upload feedback / cập nhật chính sách (đề xuất: Supabase hoặc Sanity).
- Form liên hệ lưu lead + gửi email (Resend).
