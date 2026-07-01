"use client";

export type Variant = "A" | "B" | "C" | "D";

const OPTIONS: { key: Variant; label: string; hint: string }[] = [
  { key: "A", label: "Editorial", hint: "Dark / cinematic" },
  { key: "B", label: "Bento", hint: "Sạch / chuyên nghiệp" },
  { key: "C", label: "Gradient", hint: "Trẻ trung / mobile" },
  { key: "D", label: "Paper", hint: "thiswasmajor style" },
];

export default function VariantSwitcher({
  value,
  onChange,
}: {
  value: Variant;
  onChange: (v: Variant) => void;
}) {
  return (
    <div className="vsw-root" role="tablist" aria-label="Chọn phong cách giao diện">
      <span className="vsw-title">Giao diện</span>
      <div className="vsw-track">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            role="tab"
            aria-selected={value === opt.key}
            className={`vsw-btn${value === opt.key ? " active" : ""}`}
            onClick={() => onChange(opt.key)}
            title={opt.hint}
          >
            <span className="vsw-key">{opt.key}</span>
            <span className="vsw-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .vsw-root{
          position:fixed;left:50%;bottom:20px;transform:translateX(-50%);
          z-index:9999;display:flex;align-items:center;gap:12px;
          padding:8px 8px 8px 16px;border-radius:100px;
          background:rgba(15,17,21,.82);backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.12);
          box-shadow:0 12px 40px rgba(0,0,0,.35);
          font-family:var(--font-inter),system-ui,sans-serif;
          max-width:calc(100vw - 24px);
        }
        .vsw-title{color:#9aa0aa;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;}
        .vsw-track{display:flex;gap:4px;background:rgba(255,255,255,.06);border-radius:100px;padding:4px;}
        .vsw-btn{
          display:flex;align-items:center;gap:8px;border:none;cursor:pointer;
          background:transparent;color:#cfd2d8;padding:8px 14px;border-radius:100px;
          font-size:13px;font-weight:600;transition:.2s;font-family:inherit;
        }
        .vsw-btn:hover{color:#fff;}
        .vsw-btn.active{background:#fff;color:#0f1115;box-shadow:0 2px 10px rgba(0,0,0,.25);}
        .vsw-key{
          display:inline-flex;align-items:center;justify-content:center;
          width:18px;height:18px;border-radius:50%;font-size:11px;font-weight:800;
          background:rgba(255,255,255,.14);color:inherit;
        }
        .vsw-btn.active .vsw-key{background:#0f1115;color:#fff;}
        @media(max-width:560px){
          .vsw-title{display:none;}
          .vsw-label{display:none;}
          .vsw-btn{padding:8px 12px;}
        }
      `}</style>
    </div>
  );
}
