// Scope toàn bộ holo.css dưới `.holo` để CSS của UI mới không rò sang UI cũ
// (khi điều hướng client-side Next giữ stylesheet đã tải).
// node scripts/scope-holo-css.cjs  (idempotent — chạy lại không prefix 2 lần)
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const file = path.join(__dirname, "../app/styles/holo.css");
const css = fs.readFileSync(file, "utf8");
const SCOPE = ".holo";
const warn = [];

const scoped = (sel) => {
  const s = sel.trim();
  if (/^\.holo(?![\w-])/.test(s) || s.startsWith(":where(.holo)") || s.startsWith("html:has(.holo)")) return s; // đã scope
  if (/^(html\.lenis|\.lenis\.lenis-)/.test(s)) return s; // class do Lenis gắn — chỉ tồn tại khi UI mới chạy Lenis
  if (s === "body") return SCOPE;
  if (s === "html") return "html:has(.holo)";
  if (/^(html|body|:root)\b/.test(s)) { warn.push(s); return s; }
  return `${SCOPE} ${s}`;
};

const root = postcss.parse(css);
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(scoped);
});
fs.writeFileSync(file, root.toString());
console.log("scoped", file, warn.length ? { unscoped: warn } : "");
