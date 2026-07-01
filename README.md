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
  layout.tsx              # metadata, fonts
  page.tsx                # state switcher + render variant đang chọn
  globals.css
components/
  VariantSwitcher.tsx     # thanh chuyển A/B/C
  variants/
    OptionA.tsx           # Editorial
    OptionB.tsx           # Bento SaaS
    OptionC.tsx           # Gradient
```

## Deploy Vercel

1. Push repo lên GitHub.
2. Import vào Vercel → framework tự nhận Next.js → Deploy (không cần config).
3. Gắn domain `vduystudio.com` trong phần Domains.

## Bước tiếp theo (chưa làm)

- Trang chi tiết từng dịch vụ (`/dich-vu/[platform]`) với quy trình + bảng giá + FAQ + dự án liên quan.
- Trang admin để sửa giá / upload feedback / cập nhật chính sách (đề xuất: Supabase hoặc Sanity).
- Nội dung + hình ảnh thật (hiện đang dùng placeholder).
