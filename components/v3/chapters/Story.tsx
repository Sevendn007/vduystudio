"use client";
import { useRef } from "react";
import NextImage from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { getProcess } from "@/lib/services";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { BADGE_PATH, CHECK_PATH } from "@/lib/v3/badgePath";
import { isTermWarranty, stripNo } from "@/lib/v3/format";
import { useV3 } from "../V3Context";
import Icon3 from "../ui/Icon3";

gsap.registerPlugin(ScrollTrigger);

// "LIVE VERIFICATION" — câu chuyện cuộn được ghim: một hồ sơ TikTok đi qua đúng 4 bước
// quy trình thật (Tư vấn → Cam kết → Triển khai → Bàn giao) và kết thúc bằng cú "đóng dấu"
// tích xanh: sóng xung kích, rung máy, pháo giấy hình dấu tích. Mọi chuyển động đều scrub
// theo thanh cuộn (cuộn ngược là tua ngược). Reduced-motion → trạng thái cuối, không ghim.

const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.21;
  const d = 150 + ((i * 37) % 110);
  return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.9 - 30, r: ((i * 53) % 220) - 110, s: 0.6 + ((i * 7) % 6) / 10 };
});

const WIN = [0.5, 2.6, 4.9, 7.1, 10]; // ranh giới 4 bước trên timeline (đơn vị tuỳ ý, tổng 10)

export default function Story() {
  const { lang } = useLang();
  const en = lang === "en";
  const t = homeCopy(lang).process;
  const steps = getProcess(lang);
  const { projects, pricing } = useV3();
  const root = useRef<HTMLElement>(null);

  const tiles = (projects && projects.length ? projects : DEFAULT_PROJECTS).slice(0, 6);
  const tick = (pricing["tiktok"] ?? []).find((r) => /t[ií]ch xanh|verif|badge/i.test(r.service));
  const duration = tick?.duration || (en ? "7–15 days" : "7–15 ngày");
  const warranty = tick && isTermWarranty(tick.warranty) ? tick.warranty! : en ? "12 months" : "12 tháng";

  const L = en
    ? { handle: "@your.brand", name: "Your Brand", following: "Following", followers: "Followers", likes: "Likes", follow: "Follow", msg: "Message", bio: "Official account · Booking via DM", scan: "Auditing account", checks: ["Clean content", "Valid identity", "Stable activity"], contract: "Service commitment", time: "Timeline", warr: "Warranty", sign: "Signed", run: "In progress", runSub: "Following platform policy", done: "Verified", words: ["VERI", "FIED"], live: "Live verification" }
    : { handle: "@thuonghieu.cuaban", name: "Thương hiệu của bạn", following: "Đang follow", followers: "Follower", likes: "Thích", follow: "Follow", msg: "Nhắn tin", bio: "Tài khoản chính thức · Booking qua tin nhắn", scan: "Đang khảo sát tài khoản", checks: ["Nội dung sạch", "Định danh hợp lệ", "Hoạt động ổn định"], contract: "Cam kết dịch vụ", time: "Thời gian", warr: "Bảo hành", sign: "Đã ký", run: "Đang triển khai", runSub: "Đúng chính sách nền tảng", done: "Đã xác minh", words: ["XÁC", "MINH"], live: "Xác minh trực tiếp" };

  useGSAP(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.classList.add("is-static");
      el.dataset.step = "4";
      return () => el.classList.remove("is-static");
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const pct = q(".v3-ph-pct")[0];
      const bars = q(".v3-story-list li");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".v3-story-track")[0],
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (st) => {
            const x = st.progress * 10;
            const step = x < WIN[1] ? 1 : x < WIN[2] ? 2 : x < WIN[3] ? 3 : 4;
            if (el.dataset.step !== String(step)) el.dataset.step = String(step);
            bars.forEach((b, i) => {
              const f = gsap.utils.clamp(0, 1, (x - WIN[i]) / (WIN[i + 1] - WIN[i]));
              (b as HTMLElement).style.setProperty("--f", f.toFixed(3));
            });
            if (pct) pct.textContent = `${Math.round(gsap.utils.clamp(0, 1, (x - 5.2) / 1.6) * 100)}%`;
          },
        },
      });

      // vào cảnh
      tl.fromTo(".v3-phone3d", { rotateY: -28, rotateX: 8, y: 80 }, { rotateY: -10, rotateX: 4, y: 0, duration: 0.6, ease: "power2.out" }, 0)
        .fromTo(".v3-sticker", { scale: 0, rotate: (i) => (i % 2 ? 40 : -40) }, { scale: 1, rotate: (i) => [-12, 9, -6, 14][i % 4], duration: 0.5, stagger: 0.06, ease: "back.out(2)" }, 0.1)
        .to(".v3-phone3d", { rotateY: 10, rotateX: 2, duration: 9.4 }, 0.6)
        .to(".v3-sticker", { y: (i) => [40, 50, -30, 40][i % 4], duration: 9.4 }, 0.6)
        .to(".v3-story-word", { xPercent: (i) => (i ? 6 : -6), duration: 10 }, 0)

      // 1 — khảo sát
        .fromTo(".v3-ph-scan", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6)
        .fromTo(".v3-ph-scanline", { top: "2%" }, { top: "92%", duration: 0.9, repeat: 1, yoyo: true, ease: "sine.inOut" }, 0.7)
        .fromTo(".v3-ph-check", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.35 }, 1.0)
        .to(".v3-ph-scan", { autoAlpha: 0, duration: 0.3 }, 2.45)

      // 2 — cam kết
        .fromTo(".v3-ph-sheet-a", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, 2.6)
        .fromTo(".v3-ph-sign path", { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.9 }, 3.2)
        .fromTo(".v3-ph-signed", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, 4.15)
        .to(".v3-ph-sheet-a", { yPercent: 110, duration: 0.4, ease: "power2.in" }, 4.6)

      // 3 — triển khai
        .fromTo(".v3-ph-sheet-b", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, 4.9)
        .fromTo(".v3-ph-bar i", { scaleX: 0 }, { scaleX: 1, duration: 1.6 }, 5.2)
        .to(".v3-ph-sheet-b", { yPercent: 110, duration: 0.35, ease: "power2.in" }, 6.85)

      // 4 — ĐÓNG DẤU
        .fromTo(".v3-stamp", { autoAlpha: 0, scale: 3.4, rotate: -38 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "power4.in" }, 7.15)
        .fromTo(".v3-shock", { autoAlpha: 0.9, scale: 0.3 }, { autoAlpha: 0, scale: 2.8, duration: 0.8, ease: "power2.out" }, 7.65)
        .fromTo(".v3-shock-2", { autoAlpha: 0.6, scale: 0.3 }, { autoAlpha: 0, scale: 3.6, duration: 1.0, ease: "power2.out" }, 7.7)
        .to(".v3-phone-shake", { keyframes: { x: [0, -12, 10, -7, 4, 0], rotate: [0, -1.5, 1.2, -0.6, 0.3, 0] }, duration: 0.45 }, 7.65)
        .fromTo(".v3-confetti i",
          { x: 0, y: 0, scale: 0, rotate: 0, autoAlpha: 1 },
          { x: (i) => CONFETTI[i].x, y: (i) => CONFETTI[i].y, rotate: (i) => CONFETTI[i].r, scale: (i) => CONFETTI[i].s, duration: 0.9, ease: "power3.out" }, 7.65)
        .to(".v3-confetti i", { autoAlpha: 0, y: "+=60", duration: 0.5 }, 8.5)
        .to(".v3-story-word", { color: "#2140f0", duration: 0.3 }, 7.65)
        .to(".v3-stamp", { scale: 0.42, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 8.7)
        .fromTo(".v3-ph-tick", { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(3)" }, 9.0)
        .fromTo(".v3-ph-verified", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 9.1)
        .fromTo(".v3-story-caption", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 8.6)
        .to({}, { duration: 0.4 }, 9.6);

      return () => { delete el.dataset.step; };
    });

    // ảnh trong máy tải xong → đo lại
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => { window.clearTimeout(id); mm.revert(); };
  }, { scope: root });

  return (
    <section id="process" ref={root} className="v3-story v3-station" data-step="1" aria-labelledby="v3-story-h">
      <div className="v3-story-track">
        <div className="v3-story-stage">
          <header className="v3-story-head v3-container">
            <p className="v3-eyebrow"><span className="v3-live" aria-hidden />{stripNo(t.eyebrow)} · {L.live}</p>
            <h2 id="v3-story-h" className="v3-story-h2">{t.h2a} <em className="v3-serif">{t.h2b}</em></h2>
          </header>

          <div className="v3-story-words" aria-hidden>
            <span className="v3-story-word">{L.words[0]}</span>
            <span className="v3-story-word">{L.words[1]}</span>
          </div>

          <div className="v3-story-center">
            <div className="v3-phone-wrap">
              <div className="v3-phone-shake">
                <div className="v3-phone3d">
                  <div className="v3-ph" aria-hidden>
                    <div className="v3-ph-notch" />
                    <div className="v3-ph-status"><b>9:41</b><span>●●● ▮</span></div>
                    <div className="v3-ph-top"><span>‹</span><b>{L.handle}</b><span>⋯</span></div>
                    <div className="v3-ph-profile">
                      <div className="v3-ph-avatar"><span>{L.name.charAt(0)}</span></div>
                      <div className="v3-ph-name">
                        <b>{L.handle}</b>
                        <svg className="v3-ph-tick" viewBox="0 0 100 100"><path d={BADGE_PATH} /><path d={CHECK_PATH} className="v3-ck" /></svg>
                      </div>
                      <span className="v3-ph-verified">{L.done}</span>
                      <div className="v3-ph-stats">
                        <span><b>128</b>{L.following}</span>
                        <span><b>{en ? "1.2M" : "1,2Tr"}</b>{L.followers}</span>
                        <span><b>{en ? "48.6M" : "48,6Tr"}</b>{L.likes}</span>
                      </div>
                      <div className="v3-ph-btns"><span className="is-main">{L.follow}</span><span>{L.msg}</span></div>
                      <p className="v3-ph-bio">{L.bio}</p>
                    </div>
                    <div className="v3-ph-grid">
                      {tiles.map((p, i) => (
                        <div className="v3-ph-tile" key={p.id || i}>
                          <NextImage src={p.image_url || `/images/d${(i % 4) + 1}.webp`} alt="" fill sizes="110px" style={{ objectFit: "cover" }} />
                        </div>
                      ))}
                    </div>

                    {/* overlay bước 1 */}
                    <div className="v3-ph-scan">
                      <i className="v3-ph-scanline" />
                      <div className="v3-ph-card">
                        <b>{L.scan}…</b>
                        {L.checks.map((c) => <span className="v3-ph-check" key={c}><Icon3 name="shield" size={14} /> {c}</span>)}
                      </div>
                    </div>
                    {/* bước 2 */}
                    <div className="v3-ph-sheet v3-ph-sheet-a">
                      <b>{L.contract}</b>
                      <dl>
                        <div><dt>{L.time}</dt><dd>{duration}</dd></div>
                        <div><dt>{L.warr}</dt><dd>{warranty}</dd></div>
                      </dl>
                      <svg className="v3-ph-sign" viewBox="0 0 200 50"><path d="M6 36c18-24 30-30 34-18s-10 20-2 18 20-30 28-24-6 22 4 20 18-22 30-20 2 16 12 14 30-14 40-16 26 0 40-4" /></svg>
                      <span className="v3-ph-signed">✓ {L.sign}</span>
                    </div>
                    {/* bước 3 */}
                    <div className="v3-ph-sheet v3-ph-sheet-b">
                      <b>{L.run}</b>
                      <span className="v3-ph-sub">{L.runSub}</span>
                      <div className="v3-ph-bar"><i /></div>
                      <span className="v3-ph-pct">0%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* bước 4 — con dấu */}
              <i className="v3-shock" aria-hidden />
              <i className="v3-shock v3-shock-2" aria-hidden />
              <div className="v3-confetti" aria-hidden>
                {CONFETTI.map((_, i) => (
                  <i key={i}><svg viewBox="0 0 100 100"><path d={BADGE_PATH} /><path d={CHECK_PATH} className="v3-ck" /></svg></i>
                ))}
              </div>
              <svg className="v3-stamp" viewBox="0 0 100 100" aria-hidden><path d={BADGE_PATH} /><path d={CHECK_PATH} className="v3-ck" /></svg>

              <span className="v3-sticker v3-sticker-1" aria-hidden><Icon3 name="tiktok" size={18} /> TikTok</span>
              <span className="v3-sticker v3-sticker-2" aria-hidden><Icon3 name="facebook" size={18} /> Facebook</span>
              <span className="v3-sticker v3-sticker-3" aria-hidden><Icon3 name="instagram" size={18} /> Instagram</span>
              <span className="v3-sticker v3-sticker-4" aria-hidden><Icon3 name="threads" size={18} /> Threads</span>
            </div>
          </div>

          <div className="v3-story-steps v3-container">
            <div className="v3-story-now">
              {steps.map((s, i) => (
                <div className="v3-story-txt" key={i} data-i={i + 1}>
                  <span className="v3-story-no">0{i + 1}<small>/0{steps.length}</small></span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
            <ol className="v3-story-list">
              {steps.map((s, i) => (
                <li key={i} data-i={i + 1}><span>0{i + 1}</span>{s.title}<i aria-hidden /></li>
              ))}
            </ol>
          </div>

          <p className="v3-story-caption" aria-hidden>
            <span>{en ? "starts with a" : "bắt đầu từ"}</span> <em className="v3-serif">{homeCopy(lang).hero.accent}</em>
          </p>
        </div>
      </div>
    </section>
  );
}
