"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SubHeader3 from "@/components/v3/ui/SubHeader3";
import SubFooter3 from "@/components/v3/ui/SubFooter3";
import "@/app/styles/v3-sub.css";
import { useLang } from "@/lib/i18n";
import { fetchBlogs, DbBlog } from "@/lib/data";
import { useContact } from "@/lib/useContact";

const TX = {
  vi: { back: "← Trang chủ", title: "Blog & Kiến thức", sub: "Cập nhật thông tin mới nhất từ VDuyStudio.", cta: "Liên hệ tư vấn", all: "Tất cả" },
  en: { back: "← Home", title: "Blog & Insights", sub: "Latest updates from VDuyStudio.", cta: "Get in touch", all: "All" },
};

const CATEGORIES = ["Kiến thức", "Hướng dẫn", "Tin tức", "Chính sách", "Khác"];

export default function BlogListPage() {
  return (
    <Suspense fallback={<div className="pj-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="blog-loader">Đang tải...</div></div>}>
      <BlogListContent />
    </Suspense>
  );
}

function BlogListContent() {
  const { lang } = useLang();
  const t = TX[lang];
  const contact = useContact();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") || "";
  const [blogs, setBlogs] = useState<DbBlog[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchBlogs(cat || undefined).then((d) => mounted && setBlogs(d));
    return () => { mounted = false; };
  }, [cat]);

  return (
    <div className="v3-sub-page pj-root">
      <SubHeader3 />

      <header className="pj-head">
        <h1>{t.title}</h1>
        <p>{t.sub}</p>
      </header>

      <div className="blog-cats">
        <Link href="/blog" className={`blog-cat ${!cat ? "active" : ""}`}>{t.all}</Link>
        {CATEGORIES.map(c => (
          <Link key={c} href={`/blog?cat=${encodeURIComponent(c)}`} className={`blog-cat ${cat === c ? "active" : ""}`}>{c}</Link>
        ))}
      </div>

      <main className="pj-grid blog-grid">
        {blogs?.map((b, i) => (
          <Link href={`/blog/${b.slug}`} className="pj-card blog-card" key={b.id} style={{ animationDelay: `${(i % 8) * 0.06}s` }}>
            {b.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.image_url} alt={b.title} className="blog-img" />
            ) : (
              <div className="blog-img-ph">VDuyStudio</div>
            )}
            <div className="pj-info blog-info">
              <span className="pj-tag">{b.category ?? "Khác"}</span>
              <h3>{b.title}</h3>
              <p className="blog-date">{new Date(b.created_at).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")}</p>
            </div>
          </Link>
        ))}
        {blogs && blogs.length === 0 && (
          <div className="blog-empty">Không có bài viết nào trong chuyên mục này.</div>
        )}
      </main>

      <SubFooter3 />

      <style>{`
.pj-root{--bg:#0c0d14;--muted:#94a3b8;--cyan:#2140f0;--line:rgba(255,255,255,.08);--card:#12131c;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:#f1f5f9;min-height:100vh;}
.pj-root *{box-sizing:border-box;}
.pj-root a{text-decoration:none;color:inherit;}
.pj-head{text-align:center;padding:clamp(40px,7vw,72px) 20px 8px;}
.pj-head h1{font-weight:900;font-size:clamp(30px,5vw,52px);letter-spacing:-0.02em;margin:0 0 10px;color:#fff;}
.pj-head p{margin:0;color:var(--muted);font-size:16px;}
.pj-grid{max-width:1200px;margin:0 auto;padding:clamp(28px,4vw,44px) clamp(16px,4vw,28px) 60px;
 display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.pj-card{display:flex;flex-direction:column;align-items:stretch;padding:0;overflow:hidden;
 background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.25s;
 animation:pjIn .5s ease both;}
@keyframes pjIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pj-card:hover{border-color:rgba(33,64,240,.6);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.6);}
.pj-info{padding:20px;text-align:left;}
.pj-info h3{font-weight:700;font-size:17px;margin:10px 0 5px;line-height:1.4;color:#fff;}
.pj-tag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#2547f4,#1732c5);
 padding:4px 12px;border-radius:100px;}

.blog-cats{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:20px;padding:0 20px;}
.blog-cat{padding:8px 18px;border-radius:100px;border:1px solid var(--line);font-size:13.5px;color:var(--muted);transition:.2s;}
.blog-cat:hover{color:#fff;border-color:rgba(33,64,240,.5);}
.blog-cat.active{color:#fff;background:#2140f0;border-color:#2140f0;font-weight:700;box-shadow:0 4px 16px rgba(33,64,240,.4);}

.blog-card{padding:0;overflow:hidden;}
.blog-img, .blog-img-ph{width:100%;height:220px;object-fit:cover;}
.blog-img-ph{background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;color:var(--muted);font-weight:700;letter-spacing:2px;opacity:0.4;}
.blog-date{margin:10px 0 0;font-size:12px;color:var(--muted);}
.blog-empty{grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);border:1px dashed var(--line);border-radius:20px;}

@media(max-width:980px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.pj-grid{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
