/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ảnh admin upload (Supabase Storage) đi qua next/image optimizer.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
    return [
      {
        // Ảnh tĩnh cache 1 năm — khi thay ảnh phải đổi tên file (hoặc chạy
        // lại scripts/generate-assets.mjs với tên mới).
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
