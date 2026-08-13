const fs = require("fs");
const path = require("path");
const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => f.endsWith(".svg"));
const result = {};
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const paths = [...raw.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(m => m[1]);
  // also d before other attrs
  const paths2 = [...raw.matchAll(/\bd="([^"]+)"[^>]*\/?>/g)].map(m => m[1]);
  const all = [...new Set([...paths, ...paths2])].filter(d => /[MLCQZmlcqz]/.test(d) && d.length > 20);
  result[f] = all;
}
console.log(JSON.stringify(result, null, 2));
