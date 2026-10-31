"use client";
import LiquidCanvas from "@/components/v3/canvas/LiquidCanvas";
import KimLyLogo from "../shared/KimLyLogo";
import { BRAND, OFFICES, NAV } from "@/lib/sitetemplate/xekhach/data";
import { telHref, zaloHref } from "@/lib/sitetemplate/xekhach/booking";
import { IcFacebook, IcMail, IcPhone, IcZalo } from "../shared/Icons";

export default function Footer() {
  return (
    <footer className="kl-c-footer" id="lien-he">
      <LiquidCanvas className="kl-c-footer-liquid" dim={0.5} seed={11} />
      <div className="kl-c-wrap">
        <div className="kl-c-footer-grid">
          <div>
            <div className="kl-c-footer-brand">
              <KimLyLogo size={48} tone="light" />
              <b>{BRAND.name}</b>
            </div>
            <p className="kl-c-footer-slogan">“{BRAND.slogan}”</p>
            <div className="kl-c-top-soc">
              <a href={zaloHref()} target="_blank" rel="noreferrer" aria-label="Zalo" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>
                <IcZalo size={19} />
              </a>
              <a href={BRAND.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>
                <IcFacebook size={19} />
              </a>
            </div>
          </div>

          {OFFICES.map((o) => (
            <div key={o.area}>
              <h4>Văn phòng {o.area}</h4>
              <ul>
                {o.items.map((it) => (
                  <li key={it.name}>
                    <b>{it.name}</b>
                    {it.address}
                    {it.phone && (
                      <>
                        {" · "}
                        <a href={telHref(it.phone)}>{it.phone}</a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4>Liên hệ</h4>
            <ul>
              <li>
                <b>Hotline đặt vé</b>
                <a href={telHref(BRAND.hotline)}>
                  <IcPhone size={14} /> {BRAND.hotline}
                </a>
              </li>
              <li>
                <b>Email</b>
                <a href={`mailto:${BRAND.email}`}>
                  <IcMail size={14} /> {BRAND.email}
                </a>
              </li>
              <li>
                <b>Facebook</b>
                <a href={BRAND.facebookUrl} target="_blank" rel="noreferrer">
                  {BRAND.facebook}
                </a>
              </li>
              <li>
                <b>Tuyến Bắc Nam</b>
                <a href={telHref("0966033816")}>0966.033.816</a> · <a href={telHref("0908835815")}>0908.835.815</a>
              </li>
            </ul>
            <h4 style={{ marginTop: 20 }}>Liên kết</h4>
            <ul>
              {NAV.slice(1, 4).map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="kl-c-footer-bar">
          <span>© {new Date().getFullYear()} {BRAND.name} · {BRAND.tagline}</span>
          <span>{BRAND.demoNote}</span>
        </div>
      </div>
    </footer>
  );
}
