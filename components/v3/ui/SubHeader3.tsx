"use client";

import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";
import { useContact } from "@/lib/useContact";
import Logo3 from "./Logo3";

const TX = {
  vi: {
    home: "Trang chủ",
    services: "Dịch vụ",
    pricing: "Bảng giá",
    projects: "Dự án",
    blog: "Blog",
    cta: "Tư vấn Zalo",
  },
  en: {
    home: "Home",
    services: "Services",
    pricing: "Pricing",
    projects: "Projects",
    blog: "Blog",
    cta: "Chat on Zalo",
  },
};

export default function SubHeader3({ backHref = "/" }: { backHref?: string }) {
  const { lang } = useLang();
  const contact = useContact();
  const t = TX[lang];
  const servicesHref = backHref === "/" ? "/#services" : `${backHref}#services`;
  const pricingHref = backHref === "/" ? "/#pricing" : `${backHref}#pricing`;

  return (
    <header className="v3-sub-nav">
      <div className="v3-sub-nav-inner">
        <Link href={backHref} className="v3-sub-nav-brand" aria-label="VDuyStudio">
          <Logo3 size={32} />
        </Link>

        <nav className="v3-sub-nav-links">
          <Link href={backHref} className="v3-sub-nav-link">{t.home}</Link>
          <Link href={servicesHref} className="v3-sub-nav-link">{t.services}</Link>
          <Link href={pricingHref} className="v3-sub-nav-link">{t.pricing}</Link>
          <Link href="/du-an" className="v3-sub-nav-link">{t.projects}</Link>
          <Link href="/blog" className="v3-sub-nav-link">{t.blog}</Link>
        </nav>

        <div className="v3-sub-nav-right">
          <LangToggle compact />
          <a
            href={contact.zalo}
            target="_blank"
            rel="noreferrer"
            className="v3-sub-nav-cta"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
