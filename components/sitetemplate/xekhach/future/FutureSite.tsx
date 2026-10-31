"use client";
// Bản "Kim Lý 2100": một canvas WebGL phủ màn hình + lớp chữ HTML, cuộn trang
// là camera bay qua 6 chương. Máy yếu / giảm chuyển động → bản tĩnh.
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollDriver, { scrollToChapter } from "./ScrollDriver";
import Boot from "./Boot";
import StaticPoster from "./StaticPoster";
import { ChapterBoard, ChapterBus, ChapterContact, ChapterHero, ChapterRoute, ChapterServices } from "./overlay/Chapters";
import KimLyLogo from "../shared/KimLyLogo";
import { IcPhone, IcZalo } from "../shared/Icons";
import { BRAND } from "@/lib/sitetemplate/xekhach/data";
import { telHref, zaloHref } from "@/lib/sitetemplate/xekhach/booking";
import { resolveTier, type Tier } from "@/lib/sitetemplate/xekhach/quality";

const FutureScene = dynamic(() => import("./FutureScene"), { ssr: false });

const NAV_LABELS = ["Mở đầu", "Khoang xe", "Tuyến đường", "Giờ chạy", "Dịch vụ", "Liên hệ"];

export default function FutureSite() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const assemble = useRef(0);
  const intro = useRef(1);
  const [tier, setTier] = useState<Tier | null>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    document.body.classList.add("kl-page", "kl-future-page");
    setTier(resolveTier());
    return () => document.body.classList.remove("kl-page", "kl-future-page");
  }, []);

  const onChapter = useCallback((i: number) => setChapter(i), []);

  // chưa đo xong thiết bị: để nền tối, tránh nháy
  if (tier === null) return <div className="kl-future" style={{ minHeight: "100svh" }} />;

  if (tier === 0) {
    return (
      <div className="kl-future" ref={root}>
        <StaticPoster />
      </div>
    );
  }

  return (
    <div className="kl-future" ref={root}>
      <FutureScene progress={progress} assemble={assemble} intro={intro} tier={tier} onContextLost={() => setTier(0)} />
      <ScrollDriver rootRef={root} progress={progress} onChapter={onChapter} />
      <Boot assemble={assemble} intro={intro} rootRef={root} />

      {/* lớp tối ở rìa: giữ chữ đọc được khi cảnh 3D sáng lên */}
      <div className="kl-f-vignette" aria-hidden />

      {/* HUD */}
      <div className="kl-f-hud kl-f-hud-tl" data-boot="hud">
        <KimLyLogo size={34} tone="light" />
        <b>KIM LÝ</b>
        <span className="kl-f-hud-dot" />
      </div>
      <div className="kl-f-hud kl-f-hud-tr" data-boot="hud">
        Đắk Nông ⇄ Sài Gòn
        <br />
        13 chuyến / ngày
      </div>

      {/* các chương chữ */}
      <div className="kl-f-stage">
        <ChapterHero />
        <ChapterBus />
        <ChapterRoute />
        <ChapterBoard />
        <ChapterServices />
        <ChapterContact />
      </div>

      {/* điều hướng dọc */}
      <nav className="kl-f-nav" aria-label="Chương" data-boot="hud">
        {NAV_LABELS.map((l, i) => (
          <button key={l} aria-current={chapter === i} onClick={() => scrollToChapter(i)}>
            <span>{l}</span>
            <i />
          </button>
        ))}
      </nav>

      <div className="kl-f-dock" data-boot="hud">
        <a className="kl-f-pill kl-f-pill-go" href={telHref(BRAND.hotline)}>
          <IcPhone size={16} /> Gọi đặt vé · {BRAND.hotline}
        </a>
        <a className="kl-f-pill" href={zaloHref()} target="_blank" rel="noreferrer">
          <IcZalo size={16} /> Zalo
        </a>
      </div>

      <div className="kl-f-scrollhint" data-boot="hint" style={{ opacity: `calc(var(--c0, 0) * 0.9)` }}>
        Cuộn để bay
        <i />
      </div>

      {/* đường ray cuộn: chiều cao quyết định độ dài chuyến bay */}
      <div className="kl-f-track" aria-hidden />

    </div>
  );
}
