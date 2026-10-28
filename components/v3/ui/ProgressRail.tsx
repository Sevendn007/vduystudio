"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { v3Copy, type StationKey } from "@/lib/v3/copy";

const STATIONS: StationKey[] = ["hero", "services", "trust", "projects", "process", "feedback", "contact"];

export default function ProgressRail() {
  const { lang } = useLang();
  const stations = v3Copy(lang).stations;
  const [active, setActive] = useState<StationKey>("hero");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as StationKey);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    STATIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="v3-rail" aria-label="Mục lục trang">
      <ol>
        {STATIONS.map((id) => (
          <li key={id} className={active === id ? "is-active" : ""}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <i className="v3-rail-dot" aria-hidden />
              <span className="v3-rail-label">{stations[id].no} · {stations[id].nav}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
