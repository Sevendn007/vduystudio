"use client";

import { useState } from "react";
import { useContact } from "@/lib/useContact";

export default function ChatFab() {
  const [open, setOpen] = useState(false);
  const contact = useContact();

  return (
    <div className={`cfab${open ? " open" : ""}`}>
      <a className="cfab-item cfab-zalo" href={contact.zalo} target="_blank" rel="noreferrer" aria-label="Chat Zalo">
        <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden>
          <rect width="48" height="48" rx="12" fill="#fff" />
          <path
            fill="#0068FF"
            d="M24 6C13.5 6 5 13.4 5 22.5c0 5 2.5 9.5 6.6 12.4-.3 2-1.2 4-2.6 5.6-.4.5-.1 1.2.5 1.2 3.3-.1 6.2-1.2 8.4-2.8 2 .5 4 .8 6.1.8 10.5 0 19-7.4 19-16.5S34.5 6 24 6z"
          />
          <text x="24" y="28" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="800" fill="#fff">
            Zalo
          </text>
        </svg>
        <span className="cfab-label">Chat Zalo</span>
      </a>

      <a className="cfab-item cfab-tele" href={contact.telegram} target="_blank" rel="noreferrer" aria-label="Chat Telegram">
        <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden>
          <circle cx="24" cy="24" r="22" fill="#fff" />
          <path
            fill="#229ED9"
            d="M24 3C12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21S35.6 3 24 3z"
          />
          <path
            fill="#fff"
            d="M34.6 15.2 30.7 33c-.3 1.3-1.1 1.6-2.2.99l-6-4.42-2.9 2.8c-.32.32-.59.59-1.2.59l.43-6.1 11.1-10c.48-.43-.1-.67-.75-.24L15.4 24.2l-5.9-1.85c-1.28-.4-1.3-1.28.27-1.9l23.1-8.9c1.06-.4 1.99.24 1.64 1.65z"
          />
        </svg>
        <span className="cfab-label">Chat Telegram</span>
      </a>

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
.cfab{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:9998;display:flex;flex-direction:column;align-items:flex-end;gap:12px;font-family:var(--font-inter),system-ui,sans-serif;}
.cfab-item{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:100px;background:#fff;color:#0f1115;font-size:14px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.25);text-decoration:none;
 opacity:0;transform:translateY(12px) scale(.9);pointer-events:none;transition:.25s cubic-bezier(.2,.8,.2,1);}
.cfab.open .cfab-item{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}
.cfab.open .cfab-tele{transition-delay:.04s;}
.cfab-item svg{border-radius:50%;flex-shrink:0;}
.cfab-label{white-space:nowrap;}
.cfab-main{position:relative;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;
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
