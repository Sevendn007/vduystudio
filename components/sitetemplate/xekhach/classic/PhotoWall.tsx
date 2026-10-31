"use client";
// Dải ảnh nhà xe kéo ngang — ảnh lấy từ website hiện tại của chính nhà xe.
import Image from "next/image";
import { useRef, useState } from "react";
import { PHOTO_WALL } from "@/lib/sitetemplate/xekhach/data";
import { IcArrowLeft, IcArrowRight, IcClose } from "../shared/Icons";

export default function PhotoWall() {
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section className="kl-c-sec kl-c-sec-wash" id="hinh-anh">
      <div className="kl-c-wrap">
        <div className="kl-c-head kl-c-head-row">
          <div>
            <span>Hình ảnh</span>
            <h2>
              Khoang xe <em>Kim Lý</em>
            </h2>
            <p>Cabin đôi, giường nằm tầng dưới, chuyến đêm và văn phòng nhà xe. Bấm vào ảnh để xem lớn.</p>
          </div>
          <div className="kl-c-arrows kl-c-arrows-static">
            <button onClick={() => nudge(-1)} aria-label="Ảnh trước">
              <IcArrowLeft size={19} />
            </button>
            <button onClick={() => nudge(1)} aria-label="Ảnh sau">
              <IcArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>

      <div className="kl-c-wall" ref={track}>
        {PHOTO_WALL.map((p, i) => (
          <button className="kl-c-wall-item" key={p.src} onClick={() => setOpen(i)} aria-label={`Xem ${p.caption}`}>
            <Image
              src={p.src}
              alt={p.caption}
              width={900}
              height={563}
              sizes="(max-width:700px) 78vw, 30vw"
              placeholder="blur"
              blurDataURL={p.lq}
            />
            <span>{p.caption}</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="kl-c-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button className="kl-c-lightbox-x" aria-label="Đóng">
            <IcClose size={24} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <Image
              src={PHOTO_WALL[open].src}
              alt={PHOTO_WALL[open].caption}
              width={1600}
              height={1000}
              sizes="92vw"
              placeholder="blur"
              blurDataURL={PHOTO_WALL[open].lq}
            />
            <figcaption>{PHOTO_WALL[open].caption}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
