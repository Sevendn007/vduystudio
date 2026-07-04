"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mark3D, Wordmark } from "@/components/premiumKit";
import { useLang, LangToggle } from "@/lib/i18n";
import { fetchBlogBySlug, DbBlog } from "@/lib/data";
import { useContact } from "@/lib/useContact";

const TX = {
  vi: { back: "← Bài viết", cta: "Liên hệ tư vấn", error: "Không tìm thấy bài viết." },
  en: { back: "← Articles", cta: "Get in touch", error: "Article not found." },
};

export default function BlogDetailPage() {
  const { lang } = useLang();
  const t = TX[lang];
  const contact = useContact();
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<DbBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (slug) {
      fetchBlogBySlug(slug).then((d) => {
        if (mounted) {
          setBlog(d);
          setLoading(false);
        }
      });
    }
    return () => { mounted = false; };
  }, [slug]);

  if (loading) return <div className="blog-loader">Đang tải...</div>;

  if (!blog) {
    return (
      <div className="blog-error">
        <h2>{t.error}</h2>
        <Link href="/blog" className="pj-btn">{t.back}</Link>
        <style>{`
          .blog-error{text-align:center;padding:100px 20px;min-height:100vh;background:#02090c;color:#fff;}
          .blog-error h2{margin-bottom:30px;}
          .pj-btn{display:inline-block;background:#2dd4bf;color:#03222e;font-weight:800;font-size:15px;text-transform:uppercase;letter-spacing:1px;padding:15px 44px;border-radius:100px;text-decoration:none;}
        `}</style>
      </div>
    );
  }

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
          <Link href="/blog" className="pj-back">{t.back}</Link>
          <LangToggle compact />
        </div>
      </nav>

      <article className="blog-detail">
        <header className="blog-head">
          <span className="pj-tag">{blog.category ?? "Khác"}</span>
          <h1>{blog.title}</h1>
          <time dateTime={blog.created_at}>{new Date(blog.created_at).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </header>

        {blog.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.image_url} alt={blog.title} className="blog-cover" />
        )}

        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, "<br/>") || "" }}
        />
      </article>

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
.pj-tag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}
.pj-foot{text-align:center;padding:60px 20px 40px;}
.pj-btn{display:inline-block;background:var(--cyan);color:#03222e;font-weight:800;font-size:15px;text-transform:uppercase;
 letter-spacing:1px;padding:15px 44px;border-radius:100px;transition:.3s;box-shadow:0 0 38px rgba(45,212,191,.35);}
.pj-btn:hover{transform:scale(1.04);}

.blog-detail{max-width:800px;margin:0 auto;padding:60px 20px 0;}
.blog-head{text-align:center;margin-bottom:40px;}
.blog-head h1{font-family:var(--pm-font-heading);font-weight:700;font-size:clamp(32px,5vw,56px);margin:16px 0;line-height:1.2;color:#fff;}
.blog-head time{display:block;color:var(--muted);font-size:14px;}
.blog-cover{width:100%;height:auto;border-radius:24px;border:1px solid var(--line);margin-bottom:50px;box-shadow:0 24px 60px rgba(0,0,0,.3);}
.blog-content{font-size:17px;line-height:1.8;color:#c6d7e0;}
.blog-content h2, .blog-content h3{font-family:var(--pm-font-heading);color:#fff;margin:2em 0 1em;line-height:1.3;}
.blog-content h2{font-size:28px;}
.blog-content p{margin-bottom:1.5em;}
.blog-content a{color:var(--cyan);text-decoration:underline;text-underline-offset:4px;}
.blog-content img{max-width:100%;border-radius:12px;}

@media(max-width:560px){.pj-back{display:none;}}
      `}</style>
    </div>
  );
}
