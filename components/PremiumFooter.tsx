"use client";

import { Wordmark } from "@/components/premiumKit";
import { PlatformIcon } from "@/components/brand";
import { useLang } from "@/lib/i18n";
import { useContact } from "@/lib/useContact";
import { site } from "@/lib/site";

export function PremiumFooter() {
  const { lang } = useLang();
  const contact = useContact();
  
  const cta = lang === "en" ? "Ready to scale?" : "Sẵn sàng bứt phá?";
  const btn = lang === "en" ? "Let's Talk" : "Liên hệ ngay";
  const connectText = lang === "en" ? "Connect with us on:" : "Kết nối với chúng tôi qua:";

  return (
    <footer className="pm-footer">
      <div className="pm-container">
        <div className="pm-foot-wm">
          <Wordmark className="foot" />
        </div>
        <h2 className="pm-foot-title">{cta}</h2>
        <a href={contact.zalo} target="_blank" rel="noreferrer" className="pm-btn">
          {btn}
        </a>
        <div className="pm-footbar">
          <span>© 2026 VDuyStudio</span>
          
          {(contact.isSet("facebook") || contact.isSet("instagram") || contact.isSet("tiktok") || contact.isSet("threads") || contact.isSet("x") || contact.isSet("youtube")) && (
            <div className="pm-footbar-social">
              <span className="pm-social-title-inline">{connectText}</span>
              <div className="pm-foot-contact-inline">
                {contact.isSet("facebook") && <a href={contact.facebook} target="_blank" rel="noreferrer"><PlatformIcon kind="facebook" size={24} /></a>}
                {contact.isSet("instagram") && <a href={contact.instagram} target="_blank" rel="noreferrer"><PlatformIcon kind="instagram" size={24} /></a>}
                {contact.isSet("tiktok") && <a href={contact.tiktok} target="_blank" rel="noreferrer"><PlatformIcon kind="tiktok" size={24} /></a>}
                {contact.isSet("threads") && <a href={contact.threads} target="_blank" rel="noreferrer"><PlatformIcon kind="threads" size={24} /></a>}
                {contact.isSet("x") && <a href={contact.x} target="_blank" rel="noreferrer"><PlatformIcon kind="x" size={24} /></a>}
                {contact.isSet("youtube") && <a href={contact.youtube} target="_blank" rel="noreferrer"><PlatformIcon kind="youtube" size={24} /></a>}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .pm-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }
        .pm-footer{padding:clamp(56px,8vw,96px) 0 0;text-align:center;}
        .pm-wordmark.small{font-size:clamp(26px,4vw,42px);margin-bottom:10px;}
        .pm-foot-title{font-family:var(--pm-font-display);font-weight:400;font-size:clamp(34px,6vw,64px);text-transform:uppercase;
         letter-spacing:1px;margin:6px 0 30px;
         background:linear-gradient(180deg,#fff 20%,#9db3c5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
        .pm-btn{display:inline-block;background:var(--cyan, #2dd4bf);color:#03222e;font-weight:800;font-size:17px;text-transform:uppercase;
         letter-spacing:1px;padding:18px 54px;border-radius:100px;transition:.3s;box-shadow:0 0 44px rgba(56,189,248,.4);text-decoration:none;}
        .pm-btn:hover{transform:scale(1.04);box-shadow:0 0 64px rgba(56,189,248,.6);}
        .pm-footbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-top:60px;padding:18px 0;
         border-top:1px solid var(--line, rgba(94,209,214,.16));color:#51697b;font-size:13.5px;}
        .pm-footbar-social{display:flex;align-items:center;gap:12px;}
        .pm-social-title-inline{color:var(--muted, #8fadb5);}
        .pm-foot-contact-inline{display:flex;align-items:center;gap:12px;}
        .pm-foot-contact-inline a{display:flex;color:var(--muted, #8fadb5);transition:.2s;}
        .pm-foot-contact-inline a:hover{color:#fff;transform:translateY(-2px);}
      `}</style>
    </footer>
  );
}
