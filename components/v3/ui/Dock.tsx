"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";

// Dock CHỈ trên mobile (CSS ẩn ở desktop vì nav đã có "Chat Zalo"): [Zalo][Bảng giá].
// Hiện sau 60% chiều cao màn hình, ẩn khi tới phần Liên hệ (đã có CTA lớn).
export default function Dock() {
  const { lang } = useLang();
  const { contact } = useV3();
  const t = v3Copy(lang).dock;
  const [show, setShow] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("contact");
    const io = el ? new IntersectionObserver((e) => setAtContact(e[0]?.isIntersecting ?? false), { rootMargin: "0px 0px -10% 0px" }) : null;
    if (el && io) io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const on = show && !atContact;
  const toPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`v3-dock${on ? " is-on" : ""}`} aria-hidden={!on}>
      <button className="v3-dock-item" onClick={toPricing} tabIndex={on ? 0 : -1}>
        <PriceGlyph /> <span>{t.pricing}</span>
      </button>
      <a className="v3-dock-item v3-dock-zalo" href={contact.zalo} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>
        <ZaloGlyph /> <span>Chat {t.zalo}</span>
      </a>
    </div>
  );
}

function ZaloGlyph() {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path fill="currentColor" d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.4-.1 1.2-.6 2.7-1.6 3.9 1.9-.2 3.6-.9 4.9-1.8 1 .3 2 .5 3.1.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/></svg>;
}
function PriceGlyph() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
}
