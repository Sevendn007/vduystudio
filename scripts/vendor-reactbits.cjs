// Vendor React Bits (TS-CSS) components into components/rb/<Name>/
const fs = require("fs");
const path = require("path");
const names = process.argv.slice(2);
const root = path.join(process.cwd(), "components/rb");
(async () => {
  for (const n of names) {
    const r = await fetch(`https://reactbits.dev/r/${n}-TS-CSS.json`);
    const j = await r.json();
    const dir = path.join(root, n);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of j.files) {
      const file = path.join(dir, path.basename(f.path));
      fs.writeFileSync(file, f.content);
      console.log(n, "->", path.relative(process.cwd(), file));
    }
  }
})();
