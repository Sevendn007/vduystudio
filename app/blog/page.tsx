"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mark3D, Wordmark } from "@/components/premiumKit";
import { useLang, LangToggle } from "@/lib/i18n";
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
    <div className="pj-root">
      <nav className="pj-nav">
        <Link href="/" className="pj-brand">
          <span className="pj-brand-spin">
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
          </span>
          <Wordmark className="nav" />
        </Link>
        <div className="pj-nav-right">
          <Link href="/" className="pj-back">{t.back}</Link>
          <LangToggle compact />
        </div>
      </nav>

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

      <footer className="pj-foot">
        <a href={contact.zalo} target="_blank" rel="noreferrer" className="pj-btn">{t.cta}</a>
      </footer>

      <style>{`
.pj-root{--bg:#02090c;--muted:#8fadb5;--cyan:#2dd4bf;--line:rgba(94,209,214,.16);--card:#05141a;
 font-family:var(--pm-font-body);background:var(--bg);color:#e6f0f2;min-height:100vh;
 padding-bottom:calc(24px + env(safe-area-inset-bottom));}
.pj-root *{box-sizing:border-box;}
.pj-root a{text-decoration:none;color:inherit;}
.pj-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:14px;
 padding:12px clamp(16px,4vw,36px);background:rgba(2,9,12,.8);backdrop-filter:blur(16px);border-bottom:1px solid var(--line);}
.pj-brand{display:flex;align-items:center;gap:11px;}
.pj-brand-spin{display:block;width:46px;height:38px;perspective:420px;flex-shrink:0;}
.pj-nav-right{display:flex;align-items:center;gap:16px;}
.pj-back{font-size:13.5px;font-weight:600;color:var(--muted);transition:.2s;}
.pj-back:hover{color:#fff;}
.pj-head{text-align:center;padding:clamp(40px,7vw,72px) 20px 8px;}
.pj-head h1{font-family:var(--pm-font-heading);font-weight:700;font-size:clamp(30px,5vw,52px);letter-spacing:1px;
 text-transform:uppercase;margin:0 0 10px;
 background:linear-gradient(180deg,#fff 20%,#9db3c5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.pj-head p{margin:0;color:var(--muted);font-size:15px;}
.pj-grid{max-width:1200px;margin:0 auto;padding:clamp(28px,4vw,44px) clamp(16px,4vw,28px) 0;
 display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.pj-card{display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 16px 22px;
 background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.25s;
 animation:pjIn .5s ease both;}
@keyframes pjIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pj-card:hover{border-color:rgba(45,212,191,.5);transform:translateY(-4px);box-shadow:0 20px 44px rgba(0,0,0,.45);}
.pj-info{text-align:center;}
.pj-info h3{font-family:var(--pm-font-heading);font-weight:700;font-size:17px;margin:10px 0 5px;line-height:1.4;}
.pj-tag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}
.pj-foot{text-align:center;padding:44px 20px 24px;}
.pj-btn{display:inline-block;background:var(--cyan);color:#03222e;font-weight:800;font-size:15px;text-transform:uppercase;
 letter-spacing:1px;padding:15px 44px;border-radius:100px;transition:.3s;box-shadow:0 0 38px rgba(45,212,191,.35);}
.pj-btn:hover{transform:scale(1.04);}

.blog-cats{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:20px;padding:0 20px;}
.blog-cat{padding:8px 18px;border-radius:100px;border:1px solid var(--line);font-size:13.5px;color:var(--muted);transition:.2s;}
.blog-cat:hover{color:#fff;border-color:rgba(45,212,191,.3);}
.blog-cat.active{color:#03222e;background:var(--cyan);border-color:var(--cyan);font-weight:600;}

.blog-grid{grid-template-columns:repeat(3, 1fr);}
.blog-card{padding:0;overflow:hidden;align-items:stretch;}
.blog-img, .blog-img-ph{width:100%;height:220px;object-fit:cover;}
.blog-img-ph{background:var(--line);display:flex;align-items:center;justify-content:center;color:var(--muted);font-weight:700;letter-spacing:2px;opacity:0.3;}
.blog-info{padding:20px;text-align:left;}
.blog-date{margin:10px 0 0;font-size:12px;color:var(--muted);}
.blog-empty{grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);border:1px dashed var(--line);border-radius:20px;}

@media(max-width:980px){.blog-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.blog-grid{grid-template-columns:1fr;}.pj-back{display:none;}}
      `}</style>
    </div>
  );
}
