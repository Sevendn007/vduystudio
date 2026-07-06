"use client";

// Nút chat nổi góc dưới phải: chỉ hiện các kênh ĐÃ cấu hình (Zalo / Telegram /
// Messenger). Không kênh nào cấu hình → ẩn hoàn toàn.

import { useState, ReactNode } from "react";
import { useContact } from "@/lib/useContact";

export default function ChatFab() {
  const [open, setOpen] = useState(false);
  const contact = useContact();

  const channels = [
    contact.isSet("zalo") && { key: "zalo", url: contact.zalo, label: "Chat Zalo", cls: "cfab-zalo", icon: <ZaloIcon /> },
    contact.isSet("facebook") && { key: "facebook", url: contact.facebook, label: "Chat Facebook", cls: "cfab-mess", icon: <MessIcon /> },
  ].filter(Boolean) as { key: string; url: string; label: string; cls: string; icon: ReactNode }[];

  if (channels.length === 0) return null;

  return (
    <div className={`cfab${open ? " open" : ""}`}>
      {channels.map((c, i) => (
        <a key={c.key} className={`cfab-item ${c.cls}`} style={{ transitionDelay: `${i * 0.04}s` }} href={c.url} target="_blank" rel="noreferrer" aria-label={c.label}>
          {c.icon}
          <span className="cfab-label">{c.label}</span>
        </a>
      ))}

      <button className="cfab-main" onClick={() => setOpen((v) => !v)} aria-label="Mở kênh chat" aria-expanded={open}>
        <span className="cfab-icon-chat">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
            <path fill="#fff" d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.4-.1 1.2-.6 2.7-1.6 3.9 1.9-.2 3.6-.9 4.9-1.8 1 .3 2 .5 3.1.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
            <circle cx="8.5" cy="11.5" r="1.3" fill="#0068FF" />
            <circle cx="12" cy="11.5" r="1.3" fill="#0068FF" />
            <circle cx="15.5" cy="11.5" r="1.3" fill="#0068FF" />
          </svg>
        </span>
        <span className="cfab-icon-close">✕</span>
        <span className="cfab-ping" />
      </button>

      <style>{`
.cfab{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:9998;display:flex;flex-direction:column;align-items:flex-end;gap:12px;font-family:var(--font-inter),system-ui,sans-serif;pointer-events:none;}
.cfab-item{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:100px;background:#fff;color:#0f1115;font-size:14px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.25);text-decoration:none;
 opacity:0;transform:translateY(12px) scale(.9);pointer-events:none;transition:.25s cubic-bezier(.2,.8,.2,1);}
.cfab.open .cfab-item{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}
.cfab-item svg{border-radius:50%;flex-shrink:0;}
.cfab-label{white-space:nowrap;}
.cfab-main{position:relative;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;pointer-events:auto;
 background:linear-gradient(135deg,#1877f2,#0068FF);box-shadow:0 12px 30px rgba(24,119,242,.45);display:flex;align-items:center;justify-content:center;transition:.25s;}
.cfab-main:hover{transform:scale(1.06);}
.cfab-icon-chat,.cfab-icon-close{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transition:.25s;color:#fff;font-size:22px;font-weight:700;}
.cfab-icon-close{opacity:0;transform:rotate(-90deg);}
.cfab.open .cfab-icon-chat{opacity:0;transform:rotate(90deg);}
.cfab.open .cfab-icon-close{opacity:1;transform:rotate(0);}
.cfab-ping{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(24,119,242,.5);animation:cfabPing 2.2s ease-out infinite;}
.cfab.open .cfab-ping{display:none;}
@keyframes cfabPing{0%{box-shadow:0 0 0 0 rgba(24,119,242,.5)}70%{box-shadow:0 0 0 16px rgba(24,119,242,0)}100%{box-shadow:0 0 0 0 rgba(24,119,242,0)}}
@media(prefers-reduced-motion:reduce){.cfab-ping{animation:none}}
@media(max-width:560px){.cfab{right:16px;bottom:calc(16px + env(safe-area-inset-bottom));}}
      `}</style>
    </div>
  );
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden>
      <rect width="48" height="48" rx="12" fill="#fff" />
      <path fill="#0068FF" d="M24 6C13.5 6 5 13.4 5 22.5c0 5 2.5 9.5 6.6 12.4-.3 2-1.2 4-2.6 5.6-.4.5-.1 1.2.5 1.2 3.3-.1 6.2-1.2 8.4-2.8 2 .5 4 .8 6.1.8 10.5 0 19-7.4 19-16.5S34.5 6 24 6z" />
      <text x="24" y="28" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="800" fill="#fff">Zalo</text>
    </svg>
  );
}

function MessIcon() {
  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden>
      <defs>
        <linearGradient id="cfab-mg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0099FF" />
          <stop offset="0.6" stopColor="#A033FF" />
          <stop offset="1" stopColor="#FF5280" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="24" fill="url(#cfab-mg)" />
      <path fill="#fff" d="M24 9c-8.4 0-15 6.2-15 14.5 0 4.7 2.2 8.9 5.6 11.6V41l5.1-2.8c1.4.4 2.8.6 4.3.6 8.4 0 15-6.2 15-14.5S32.4 9 24 9zm1.5 19.5-3.8-4.1-7.5 4.1 8.2-8.7 3.9 4.1 7.4-4.1-8.2 8.7z" />
    </svg>
  );
}
