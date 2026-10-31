"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SubHeader3 from "@/components/v3/ui/SubHeader3";
import SubFooter3 from "@/components/v3/ui/SubFooter3";
import "@/app/styles/v3-sub.css";
import { useLang } from "@/lib/i18n";
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
          .blog-error{text-align:center;padding:100px 20px;min-height:100vh;background:#0c0d14;color:#fff;}
          .blog-error h2{margin-bottom:30px;}
          .pj-btn{display:inline-block;background:linear-gradient(135deg,#2547f4 0%,#1732c5 100%);color:#fff;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:1px;padding:15px 44px;border-radius:100px;text-decoration:none;box-shadow:0 4px 20px rgba(37,71,244,.4);}
        `}</style>
      </div>
    );
  }

  let renderedContent = blog.content?.replace(/\n/g, "<br/>") || "";
  let unusedImages = [...(blog.images || [])];

  if (blog.images && blog.images.length > 0) {
    renderedContent = renderedContent.replace(/\[IMG:(\d+)\]/gi, (match, p1) => {
      const idx = parseInt(p1, 10) - 1;
      if (idx >= 0 && idx < blog.images!.length) {
        unusedImages[idx] = "";
        return `<img src="${blog.images![idx]}" alt="Image ${idx + 1}" loading="lazy" class="blog-inline-img" />`;
      }
      return match;
    });
  }
  unusedImages = unusedImages.filter(img => img !== "");

  return (
    <div className="v3-sub-page pj-root">
      <SubHeader3 backHref="/blog" />

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
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        {unusedImages.length > 0 && (
          <div className="blog-gallery">
            {unusedImages.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt={`${blog.title} - hình bổ sung ${i + 1}`} loading="lazy" />
            ))}
          </div>
        )}
      </article>

      <SubFooter3 backHref="/blog" />

      <style>{`
.pj-root{--bg:#0c0d14;--muted:#94a3b8;--cyan:#60a5fa;--line:rgba(255,255,255,.08);--card:#12131c;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:#f1f5f9;min-height:100vh;}
.pj-root *{box-sizing:border-box;}
.pj-root a{text-decoration:none;color:inherit;}
.pj-tag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#2547f4,#1732c5);
 padding:4px 12px;border-radius:100px;}

.blog-detail{max-width:800px;margin:0 auto;padding:60px 20px 80px;}
.blog-head{text-align:center;margin-bottom:40px;}
.blog-head h1{font-weight:900;font-size:clamp(30px,5vw,52px);margin:16px 0;line-height:1.2;color:#fff;letter-spacing:-0.02em;}
.blog-head time{display:block;color:var(--muted);font-size:14px;}
.blog-cover{width:100%;height:auto;border-radius:24px;border:1px solid var(--line);margin-bottom:50px;box-shadow:0 24px 60px rgba(0,0,0,.5);}
.blog-content{font-size:17px;line-height:1.8;color:#cbd5e1;}
.blog-content h2, .blog-content h3{color:#fff;margin:2em 0 1em;line-height:1.3;font-weight:800;}
.blog-content h2{font-size:28px;}
.blog-content p{margin-bottom:1.5em;}
.blog-content a{color:var(--cyan);text-decoration:underline;text-underline-offset:4px;}
.blog-content img{max-width:100%;border-radius:12px;margin: 16px 0;}

.blog-gallery{margin-top:40px;display:flex;flex-direction:column;gap:20px;}
.blog-gallery img{width:100%;border-radius:16px;border:1px solid var(--line);}
      `}</style>
    </div>
  );
}
