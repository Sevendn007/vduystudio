"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { useContact } from "@/lib/useContact";
import Logo3, { Mark3 } from "./Logo3";
import Icon3 from "./Icon3";

const SOCIAL = ["tiktok", "facebook", "instagram", "threads", "youtube", "x"] as const;

const TX = {
  vi: {
    kicker: "LIÊN HỆ & TƯ VẤN",
    title: "Sẵn sàng xây dựng uy tín số?",
    sub: "Đồng hành cùng 3.800+ thương hiệu & nhà sáng tạo nội dung. Tư vấn minh bạch, bảo mật tuyệt đối.",
    zalo: "Nhắn tin qua Zalo",
    messenger: "Chat Messenger",
    links: "Điều hướng",
    home: "Trang chủ",
    services: "Dịch vụ",
    pricing: "Bảng giá",
    projects: "Dự án",
    blog: "Blog",
    rights: "Bảo lưu mọi quyền.",
    tagline: "Live Verification × Liquid Cobalt",
  },
  en: {
    kicker: "CONTACT & CONSULTATION",
    title: "Ready to build digital trust?",
    sub: "Partnered with 3,800+ brands and creators. Transparent process, absolute confidentiality.",
    zalo: "Chat on Zalo",
    messenger: "Chat Messenger",
    links: "Navigation",
    home: "Home",
    services: "Services",
    pricing: "Pricing",
    projects: "Projects",
    blog: "Blog",
    rights: "All rights reserved.",
    tagline: "Live Verification × Liquid Cobalt",
  },
};

export default function SubFooter3({ backHref = "/" }: { backHref?: string }) {
  const { lang } = useLang();
  const contact = useContact();
  const t = TX[lang];
  const social = SOCIAL.filter((k) => contact.isSet(k));
  const servicesHref = backHref === "/" ? "/#services" : `${backHref}#services`;
  const pricingHref = backHref === "/" ? "/#pricing" : `${backHref}#pricing`;

  return (
    <footer className="v3-sub-foot">
      <div className="v3-sub-foot-cta-box">
        <span className="v3-sub-foot-kicker">{t.kicker}</span>
        <h2 className="v3-sub-foot-h">{t.title}</h2>
        <p className="v3-sub-foot-sub">{t.sub}</p>
        <div className="v3-sub-foot-btns">
          <a
            href={contact.zalo}
            target="_blank"
            rel="noreferrer"
            className="v3-sub-foot-btn-zalo"
          >
            {t.zalo} →
          </a>
          {contact.isSet("facebook") && (
            <a
              href={contact.facebook}
              target="_blank"
              rel="noreferrer"
              className="v3-sub-foot-btn-glass"
            >
              {t.messenger}
            </a>
          )}
        </div>
      </div>

      <div className="v3-sub-foot-base">
        <div className="v3-sub-foot-grid">
          <div className="v3-sub-foot-brand">
            <Link href={backHref} className="v3-sub-foot-logo">
              <Logo3 size={28} />
            </Link>
            <p className="v3-sub-foot-desc">{t.tagline}</p>
          </div>

          <div className="v3-sub-foot-col">
            <h4>{t.links}</h4>
            <Link href={backHref}>{t.home}</Link>
            <Link href={servicesHref}>{t.services}</Link>
            <Link href={pricingHref}>{t.pricing}</Link>
            <Link href="/du-an">{t.projects}</Link>
            <Link href="/blog">{t.blog}</Link>
          </div>

          <div className="v3-sub-foot-col">
            <h4>Mạng xã hội</h4>
            {social.length > 0 && (
              <div className="v3-sub-foot-social">
                {social.map((k) => (
                  <a
                    key={k}
                    href={contact[k]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={k}
                  >
                    <Icon3 name={k} size={18} />
                  </a>
                ))}
              </div>
            )}
            <a href={contact.zalo} target="_blank" rel="noreferrer">Zalo Official</a>
            {contact.isSet("facebook") && (
              <a href={contact.facebook} target="_blank" rel="noreferrer">Facebook Fanpage</a>
            )}
          </div>
        </div>

        <div className="v3-sub-foot-wm" aria-hidden>
          VDUYSTUDIO
        </div>

        <div className="v3-sub-foot-bar">
          <span>© 2026 VDuyStudio. {t.rights}</span>
          <span>{t.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
