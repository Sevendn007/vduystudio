// Scope toàn bộ một file CSS dưới một selector (vd ".v3") để CSS của UI mới
// không rò sang UI cũ (khi điều hướng client-side Next giữ stylesheet đã tải).
//   node scripts/scope-css.cjs app/styles/v3.css .v3
// Idempotent — chạy lại không prefix 2 lần. Tổng quát hoá scripts/scope-holo-css.cjs.
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const file = process.argv[2];
const SCOPE = process.argv[3];
if (!file || !SCOPE) {
  console.error("usage: node scripts/scope-css.cjs <file.css> <.scope>");
  process.exit(1);
}
const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
const css = fs.readFileSync(abs, "utf8");
const warn = [];
const esc = SCOPE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const already = new RegExp(`^\\${SCOPE}(?![\\w-])`);

const scoped = (sel) => {
  const s = sel.trim();
  if (already.test(s) || s.startsWith(`:where(${SCOPE})`) || s.startsWith(`html:has(${SCOPE})`)) return s;
  if (/^(html\.lenis|\.lenis\.lenis-)/.test(s)) return s; // class do Lenis gắn runtime
  if (s === "body") return SCOPE;
  if (s === "html") return `html:has(${SCOPE})`;
  if (/^(html|body|:root)\b/.test(s)) { warn.push(s); return s; }
  return `${SCOPE} ${s}`;
};

const root = postcss.parse(css);
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(scoped);
});
fs.writeFileSync(abs, root.toString());
console.log("scoped", abs, "under", SCOPE, warn.length ? { unscoped: warn } : "");
void esc;
