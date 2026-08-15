/**
 * Historical glyph paths.
 * Authentic paths: Wikimedia Commons Ancient Chinese Characters project.
 * Handmade paths follow 说文 / 甲骨文编 / 金文编 where commons files were missing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const refs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "refs", "paths.clean.json"), "utf8")
);

function paths(file) {
  return refs[file] || [];
}

function inkPaths(ds, viewBox = "0 0 300 300", transform = null) {
  const inner = ds.map((d) => `<path fill="#e6dfd0" d="${d}"/>`).join("");
  const body = transform ? `<g transform="${transform}">${inner}</g>` : inner;
  return { viewBox, body };
}

function charGlyph(ch) {
  return {
    viewBox: "0 0 300 300",
    body: `<text x="150" y="215" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="180" font-weight="500" fill="#e6dfd0">${ch}</text>`,
  };
}

function xingkaiGlyph(ch) {
  return {
    viewBox: "0 0 300 300",
    body: `<text data-style="xingkai" x="150" y="218" text-anchor="middle" font-family="MasaGyousho, STXingkai, 华文行楷, Xingkai SC, KaiTi, 楷体, serif" font-size="190" fill="#e6dfd0">${ch}</text>`,
  };
}

function fromRefs(file, transform = null, viewBox = "0 0 300 300") {
  const ds = paths(file);
  if (!ds.length) return null;
  return inkPaths(ds, viewBox, transform);
}

function fromOfficial(character, stage) {
  const file = `${character}-${stage}.svg`;
  const raw = fs.readFileSync(path.join(__dirname, "refs", file), "utf8");
  const root = raw.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!root) throw new Error(`Invalid historical SVG: ${file}`);
  const viewBox = root[1].match(/viewBox\s*=\s*["']([^"']+)["']/i)?.[1] || "0 0 300 300";
  const body = root[2]
    .replace(/<metadata\b[\s\S]*?<\/metadata>/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\b(fill|stroke)\s*=\s*["'](?!none\b|url\()[^"']+["']/gi, '$1="#e6dfd0"')
    .replace(/(fill|stroke)\s*:\s*(?!none\b|url\()[^;"']+/gi, "$1:#e6dfd0");
  return { viewBox, body, source: `Wikimedia ACC / CUHK / Academia Sinica · ${file}` };
}

function officialRaster(character, stage) {
  const webp = path.join(__dirname, "refs", `${character}-${stage}.webp`);
  const png = path.join(__dirname, "refs", `${character}-${stage}.png`);
  const assetPath = fs.existsSync(webp) ? webp : fs.existsSync(png) ? png : null;
  if (!assetPath) throw new Error(`Missing checked historical asset: ${character}-${stage}`);
  const mime = path.extname(assetPath).toLowerCase() === ".webp" ? "image/webp" : "image/png";
  // These images are sampled with getImageData(). Relative file URLs taint the
  // canvas when index.html is opened via file://, so keep the generated browser
  // bundle self-contained and origin-clean.
  const asset = `data:${mime};base64,${fs.readFileSync(assetPath).toString("base64")}`;
  return {
    asset,
    source: `Wikimedia Ancient Chinese Characters · ${character}-${stage}.svg · CUHK / Academia Sinica cross-check`,
  };
}

const HAND = {};

HAND["日-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" fill-rule="evenodd" d="M105 48 C85 48 72 70 72 95 L72 205 C72 230 85 252 105 252 L195 252 C215 252 228 230 228 205 L228 95 C228 70 215 48 195 48 Z M95 78 L205 78 L205 222 L95 222 Z"/>
    <path fill="#e6dfd0" d="M95 145 L205 145 L205 165 L95 165 Z"/>
  `,
};

HAND["月-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M192 42 C118 58 72 125 84 198 C96 260 158 290 210 268 C158 278 112 230 118 162 C124 100 156 58 192 42 Z"/>
    <path fill="#e6dfd0" d="M142 120 L178 138 L174 148 L138 130 Z"/>
    <path fill="#e6dfd0" d="M136 172 L172 190 L168 200 L132 182 Z"/>
  `,
};

HAND["月-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M198 38 C110 50 68 130 82 205 C94 270 165 298 218 275 C155 288 105 235 112 165 C118 100 155 50 198 38 Z"/>
    <path fill="#e6dfd0" d="M140 118 L182 140 L176 152 L134 130 Z"/>
    <path fill="#e6dfd0" d="M134 175 L176 198 L170 210 L128 187 Z"/>
  `,
};

HAND["水-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 45 V245"/>
      <path d="M100 95 C135 125 135 160 100 195"/>
      <path d="M200 95 C165 125 165 160 200 195"/>
      <path d="M115 220 C150 255 185 220"/>
    </g>
  `,
};

HAND["人-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <circle cx="150" cy="72" r="28" fill="#e6dfd0"/>
    <path fill="#e6dfd0" d="M140 100 L160 100 L168 175 L132 175 Z"/>
    <path fill="#e6dfd0" d="M132 120 L85 155 L95 168 L145 138 Z"/>
    <path fill="#e6dfd0" d="M168 120 L215 155 L205 168 L155 138 Z"/>
    <path fill="#e6dfd0" d="M132 170 L95 265 L115 270 L150 185 Z"/>
    <path fill="#e6dfd0" d="M168 170 L205 265 L185 270 L150 185 Z"/>
  `,
};

HAND["人-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <circle cx="150" cy="70" r="32" fill="#e6dfd0"/>
    <path fill="#e6dfd0" d="M136 100 L164 100 L172 180 L128 180 Z"/>
    <path fill="#e6dfd0" d="M128 118 L78 158 L92 172 L148 138 Z"/>
    <path fill="#e6dfd0" d="M172 118 L222 158 L208 172 L152 138 Z"/>
    <path fill="#e6dfd0" d="M128 175 L88 270 L112 275 L150 190 Z"/>
    <path fill="#e6dfd0" d="M172 175 L212 270 L188 275 L150 190 Z"/>
  `,
};

HAND["人-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 55 C115 90 95 160 78 275"/>
      <path d="M150 55 C185 90 205 160 222 275"/>
    </g>
  `,
};

HAND["木-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 50 V245"/>
      <path d="M85 125 L150 85 L215 125"/>
      <path d="M95 270 L150 210 L205 270"/>
    </g>
  `,
};

HAND["木-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 48 V250"/>
      <path d="M78 130 L150 88 L222 130"/>
      <path d="M88 275 L150 208 L212 275"/>
    </g>
  `,
};

HAND["木-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 42 V248"/>
      <path d="M72 148 H228"/>
      <path d="M100 268 L150 205 L200 268"/>
    </g>
  `,
};

HAND["火-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M150 45 C130 100 100 140 110 200 C118 245 150 275 150 275 C150 275 182 245 190 200 C200 140 170 100 150 45 Z"/>
    <circle cx="105" cy="155" r="10" fill="#e6dfd0"/>
    <circle cx="195" cy="155" r="10" fill="#e6dfd0"/>
  `,
};

HAND["火-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M150 42 C125 95 95 145 108 205 C118 250 150 280 150 280 C150 280 182 250 192 205 C205 145 175 95 150 42 Z"/>
    <path fill="#e6dfd0" d="M88 140 C95 175 100 195 95 210 C80 185 82 155 88 140 Z"/>
    <path fill="#e6dfd0" d="M212 140 C205 175 200 195 205 210 C220 185 218 155 212 140 Z"/>
  `,
};

HAND["雨-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M70 95 C70 70 100 55 140 55 C155 40 190 40 210 55 C250 55 270 75 270 100 C270 125 250 140 70 140 Z"/>
    <path fill="#e6dfd0" d="M100 160 L112 160 L108 250 L96 250 Z"/>
    <path fill="#e6dfd0" d="M140 155 L152 155 L148 255 L136 255 Z"/>
    <path fill="#e6dfd0" d="M180 160 L192 160 L188 250 L176 250 Z"/>
    <path fill="#e6dfd0" d="M220 165 L232 165 L228 245 L216 245 Z"/>
  `,
};

HAND["雨-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <path fill="#e6dfd0" d="M65 90 C65 65 105 50 150 50 C170 35 210 40 230 55 C265 55 280 80 278 105 C275 130 250 145 65 142 Z"/>
    <path fill="#e6dfd0" d="M105 160 L118 160 L114 255 L101 255 Z"/>
    <path fill="#e6dfd0" d="M145 155 L158 155 L154 260 L141 260 Z"/>
    <path fill="#e6dfd0" d="M185 160 L198 160 L194 255 L181 255 Z"/>
  `,
};

HAND["雨-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g fill="none" stroke="#e6dfd0" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 75 H240"/>
      <path d="M88 75 V150 H212 V75"/>
      <path d="M115 175 V255"/>
      <path d="M150 168 V262"/>
      <path d="M185 175 V255"/>
    </g>
  `,
};

const S = `fill="none" stroke="#e6dfd0" stroke-linecap="round" stroke-linejoin="round"`;

HAND["马-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <path d="M86 108 C78 88 98 72 118 86 L148 96"/>
      <path d="M148 96 C190 88 228 108 232 138 C236 162 214 176 188 172"/>
      <path d="M148 96 C142 128 148 168 156 188"/>
      <path d="M168 70 L156 98 M182 66 L170 100 M198 72 L184 102"/>
      <path d="M150 188 L128 248 M168 190 L162 252 M188 186 L198 248 M206 182 L228 246"/>
      <path d="M228 140 C248 148 258 172 252 198"/>
      <circle cx="108" cy="92" r="4" fill="#e6dfd0" stroke="none"/>
    </g>
  `,
};

HAND["马-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="13">
      <path d="M90 112 C84 90 108 74 128 90 L156 100"/>
      <path d="M156 100 C200 90 236 112 238 144 C240 170 214 184 186 178"/>
      <path d="M156 100 C152 134 158 172 166 194"/>
      <path d="M170 68 L160 102 M188 64 L176 104 M206 70 L190 106"/>
      <path d="M154 194 L134 250 M174 196 L170 254 M196 192 L208 250 M214 188 L236 248"/>
      <path d="M236 146 C256 156 264 180 256 204"/>
    </g>
  `,
};

HAND["马-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M150 48 C118 52 102 78 108 118 C112 148 138 168 150 168 C162 168 188 148 192 118 C198 78 182 52 150 48 Z"/>
      <path d="M128 92 H172 M128 118 H172"/>
      <path d="M150 168 V210"/>
      <path d="M108 210 H192"/>
      <path d="M118 210 V262 M140 210 V258 M160 210 V258 M182 210 V262"/>
    </g>
  `,
};

HAND["鱼-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <path d="M70 150 C88 92 150 70 210 118 C232 132 232 168 210 182 C150 230 88 208 70 150 Z"/>
      <path d="M210 118 L262 92 M210 182 L262 208 M236 150 H270"/>
      <path d="M118 128 L168 128 M118 150 L176 150 M118 172 L168 172"/>
      <path d="M92 132 L78 112 M92 168 L78 188"/>
      <circle cx="96" cy="142" r="5" fill="#e6dfd0" stroke="none"/>
    </g>
  `,
};

HAND["鱼-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M68 150 C90 88 152 66 214 114 C238 130 238 170 214 186 C152 234 90 212 68 150 Z"/>
      <path d="M214 114 L268 86 M214 186 L268 214 M242 150 H278"/>
      <path d="M116 126 L172 126 M116 150 L180 150 M116 174 L172 174"/>
      <path d="M90 128 L76 108 M90 172 L76 192"/>
      <circle cx="94" cy="140" r="5" fill="#e6dfd0" stroke="none"/>
    </g>
  `,
};

HAND["鱼-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M150 46 C118 52 96 86 96 128 V188 C96 228 122 252 150 258 C178 252 204 228 204 188 V128 C204 86 182 52 150 46 Z"/>
      <path d="M118 108 H182 M118 138 H182 M118 168 H182"/>
      <path d="M96 198 L72 228 M204 198 L228 228"/>
      <path d="M118 248 L150 272 L182 248"/>
      <circle cx="150" cy="78" r="6" fill="#e6dfd0" stroke="none"/>
    </g>
  `,
};

HAND["车-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <circle cx="78" cy="150" r="46"/>
      <circle cx="222" cy="150" r="46"/>
      <circle cx="78" cy="150" r="10"/>
      <circle cx="222" cy="150" r="10"/>
      <path d="M78 150 H222"/>
      <path d="M124 108 H176 V192 H124 Z"/>
      <path d="M150 78 V108 M150 192 V222"/>
      <path d="M78 104 L78 196 M222 104 L222 196"/>
    </g>
  `,
};

HAND["车-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <circle cx="76" cy="150" r="48"/>
      <circle cx="224" cy="150" r="48"/>
      <circle cx="76" cy="150" r="12"/>
      <circle cx="224" cy="150" r="12"/>
      <path d="M76 150 H224"/>
      <path d="M118 100 H182 V200 H118 Z"/>
      <path d="M150 70 V100 M150 200 V230"/>
      <path d="M76 102 L76 198 M224 102 L224 198"/>
    </g>
  `,
};

HAND["车-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M86 78 H214"/>
      <path d="M150 78 V230"/>
      <path d="M86 150 H214"/>
      <path d="M110 108 H190 V192 H110 Z"/>
      <path d="M86 230 H214"/>
      <path d="M110 230 V258 M150 230 V262 M190 230 V258"/>
    </g>
  `,
};

HAND["家-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <path d="M48 118 L150 52 L252 118"/>
      <path d="M72 118 V142 H228 V118"/>
      <path d="M128 168 C118 148 138 138 154 154 C176 138 198 156 186 178 C204 188 198 214 176 220 C168 246 132 248 122 220 C96 216 96 184 118 176 C112 168 118 160 128 168 Z"/>
      <path d="M186 178 L228 162"/>
      <path d="M132 220 L118 258 M154 222 L154 262 M176 220 L190 258"/>
    </g>
  `,
};

HAND["家-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M46 112 L150 46 L254 112"/>
      <path d="M70 112 V138 H230 V112"/>
      <path d="M126 164 C116 144 138 134 154 150 C178 134 202 154 188 176 C208 186 202 214 178 222 C170 250 132 252 122 222 C96 216 94 182 118 174 C110 166 118 158 126 164 Z"/>
      <path d="M188 176 L232 158"/>
      <path d="M130 222 L116 260 M154 224 L154 264 M176 222 L192 260"/>
    </g>
  `,
};

HAND["家-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M48 108 L150 42 L252 108"/>
      <path d="M78 108 V132 H222 V108"/>
      <path d="M150 148 C128 148 114 168 118 196 C122 228 138 252 150 258 C162 252 178 228 182 196 C186 168 172 148 150 148 Z"/>
      <path d="M132 178 H168 M128 206 H172"/>
      <path d="M182 188 L226 168"/>
      <path d="M128 248 L112 278 M150 258 V282 M172 248 L188 278"/>
    </g>
  `,
};

HAND["明-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <path d="M52 78 H148 V222 H52 Z"/>
      <path d="M52 150 H148 M100 78 V222"/>
      <path d="M188 70 C148 92 138 150 158 198 C172 230 208 248 236 228 C198 236 170 200 176 154 C182 108 198 82 188 70 Z"/>
      <path d="M186 128 L214 142 M184 168 L210 182"/>
    </g>
  `,
};

HAND["明-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <circle cx="104" cy="150" r="78"/>
      <path d="M70 150 H138"/>
      <path d="M196 66 C154 90 146 150 166 200 C180 234 216 252 244 228 C204 238 176 200 182 152 C188 104 206 78 196 66 Z"/>
      <path d="M192 126 L220 140 M190 168 L216 182"/>
    </g>
  `,
};

HAND["明-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M58 70 H142 V230 H58 Z"/>
      <path d="M72 144 H128"/>
      <path d="M186 62 C150 86 142 150 162 204 C176 238 214 256 242 230 C204 240 178 200 184 148 C190 98 204 74 186 62 Z"/>
      <path d="M184 122 L214 136 M182 166 L210 180"/>
    </g>
  `,
};

HAND["东-oracle"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="11">
      <path d="M150 58 C108 72 86 118 92 150 C86 182 108 228 150 242 C192 228 214 182 208 150 C214 118 192 72 150 58 Z"/>
      <path d="M118 92 L182 208 M182 92 L118 208"/>
      <path d="M150 42 V58 M150 242 V258"/>
      <path d="M128 42 H172 M128 258 H172"/>
    </g>
  `,
};

HAND["东-bronze"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M150 52 C104 68 80 116 88 150 C80 184 104 232 150 248 C196 232 220 184 212 150 C220 116 196 68 150 52 Z"/>
      <path d="M114 88 L186 212 M186 88 L114 212"/>
      <path d="M150 36 V52 M150 248 V264"/>
      <path d="M124 36 H176 M124 264 H176"/>
    </g>
  `,
};

HAND["东-seal"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${S} stroke-width="12">
      <path d="M150 42 V258"/>
      <path d="M72 148 H228"/>
      <path d="M96 258 L150 198 L204 258"/>
      <path d="M108 78 H192 V132 H108 Z"/>
      <path d="M122 100 H178"/>
    </g>
  `,
};

const L = `fill="none" stroke="#e6dfd0" stroke-linecap="round" stroke-linejoin="round"`;
const LWRAP = `transform="translate(0,18) scale(1.14,0.78) translate(-18,42)"`;

HAND["日-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="16" ${LWRAP}>
      <path d="M58 88 Q150 72 242 88"/>
      <path d="M70 92 V208"/>
      <path d="M230 92 V208"/>
      <path d="M70 148 Q150 136 230 148"/>
      <path d="M58 212 Q150 228 242 212"/>
    </g>
  `,
};

HAND["月-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="16" ${LWRAP}>
      <path d="M92 70 Q78 150 98 240"/>
      <path d="M92 70 Q168 78 186 118 Q196 168 168 236 Q150 252 118 246"/>
      <path d="M108 128 Q148 136 160 148"/>
      <path d="M108 176 Q148 184 158 196"/>
    </g>
  `,
};

HAND["山-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="16" ${LWRAP}>
      <path d="M78 92 V214"/>
      <path d="M150 58 V214"/>
      <path d="M222 92 V214"/>
      <path d="M52 220 Q150 232 248 220"/>
    </g>
  `,
};

HAND["水-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="15" ${LWRAP}>
      <path d="M150 52 V214"/>
      <path d="M78 108 Q128 138 82 178"/>
      <path d="M222 108 Q172 138 218 178"/>
      <path d="M96 214 Q150 246 204 214"/>
    </g>
  `,
};

HAND["人-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="17" ${LWRAP}>
      <path d="M168 62 Q120 128 58 236"/>
      <path d="M128 118 Q186 150 248 238"/>
    </g>
  `,
};

HAND["木-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="16" ${LWRAP}>
      <path d="M150 48 V220"/>
      <path d="M52 138 Q150 124 248 138"/>
      <path d="M96 220 Q150 176 204 220"/>
    </g>
  `,
};

HAND["火-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="15" ${LWRAP}>
      <path d="M78 118 Q118 150 108 186"/>
      <path d="M222 118 Q182 150 192 186"/>
      <path d="M150 62 Q118 150 92 236"/>
      <path d="M150 62 Q198 158 230 238"/>
    </g>
  `,
};

HAND["雨-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M48 78 Q150 64 252 78"/>
      <path d="M86 86 V138 H214 V86"/>
      <path d="M118 162 V238"/>
      <path d="M150 154 V246"/>
      <path d="M182 162 V238"/>
      <path d="M108 186 H128 M140 178 H160 M172 186 H192"/>
    </g>
  `,
};

HAND["马-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M118 52 Q96 78 108 118 Q120 148 150 158 Q186 148 196 112 Q204 74 176 54 Q148 46 118 52 Z"/>
      <path d="M128 88 H176 M128 118 H176"/>
      <path d="M150 158 V188"/>
      <path d="M72 196 Q150 184 228 196"/>
      <path d="M96 196 Q90 236 78 258"/>
      <path d="M128 196 Q128 236 122 258"/>
      <path d="M172 196 Q176 236 182 258"/>
      <path d="M204 196 Q214 236 226 258"/>
    </g>
  `,
};

HAND["鱼-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M150 46 Q108 58 100 118 V188 Q108 236 150 252 Q192 236 200 188 V118 Q192 58 150 46 Z"/>
      <path d="M118 102 H182 M118 136 H182 M118 170 H182"/>
      <path d="M100 198 Q78 228 70 246"/>
      <path d="M200 198 Q222 228 230 246"/>
      <path d="M118 246 Q150 272 182 246"/>
      <path d="M132 250 Q150 262 168 250"/>
      <path d="M118 258 Q150 278 182 258"/>
    </g>
  `,
};

HAND["车-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M58 78 Q150 64 242 78"/>
      <path d="M150 78 V226"/>
      <path d="M72 148 Q150 136 228 148"/>
      <path d="M108 108 H192 V188 H108 Z"/>
      <path d="M58 226 Q150 240 242 226"/>
      <path d="M108 226 V258 M150 226 V262 M192 226 V258"/>
    </g>
  `,
};

HAND["家-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M48 108 L150 46 L252 108"/>
      <path d="M78 108 V136 H222 V108"/>
      <path d="M150 152 Q118 156 114 198 Q118 236 150 250 Q182 236 186 198 Q182 156 150 152 Z"/>
      <path d="M128 186 H172 M124 214 H176"/>
      <path d="M186 188 L232 168"/>
      <path d="M124 246 L108 276 M150 250 V278 M176 246 L192 276"/>
    </g>
  `,
};

HAND["明-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M48 82 Q92 70 132 82"/>
      <path d="M56 86 V214"/>
      <path d="M124 86 V214"/>
      <path d="M56 148 Q92 138 124 148"/>
      <path d="M48 218 Q92 230 132 218"/>
      <path d="M176 70 Q158 150 178 238"/>
      <path d="M176 70 Q232 84 242 128 Q248 176 222 232 Q204 250 184 244"/>
      <path d="M188 128 Q224 138 232 150"/>
      <path d="M188 176 Q220 186 228 198"/>
    </g>
  `,
};

HAND["东-clerical"] = {
  viewBox: "0 0 300 300",
  body: `
    <g ${L} stroke-width="14" ${LWRAP}>
      <path d="M150 46 V226"/>
      <path d="M58 148 Q150 134 242 148"/>
      <path d="M96 226 Q150 178 204 226"/>
      <path d="M96 72 H204 V128 H96 Z"/>
      <path d="M110 96 H190"/>
    </g>
  `,
};

const STORIES = [
  {
    id: "ri",
    glyph: "日",
    meaning: "太阳",
    motion: "sun",
    texts: [
      "甲骨上的日，外框偏方——刀刻难圆。框内一横，是太阳的精光。",
      "金文把日写成真正的圆。外环为轮，中点为实，更近太阳之形。",
      "说文小篆：圆让位于长方。中横贯通左右，成为可以统一的法度。",
      "隶变破圆为方。日字扁平，像一扇承光的窗。",
      "简体「日」。方寸之中，仍装着太阳。",
    ],
    forms: [
      fromRefs("日-oracle.svg"),
      fromRefs("日-bronze.svg"),
      HAND["日-seal"],
      HAND["日-clerical"],
      xingkaiGlyph("日"),
    ],
  },
  {
    id: "yue",
    glyph: "月",
    meaning: "月亮",
    motion: "moon",
    texts: [
      "甲骨文象缺月。弯中两画，像月中阴影——月与日相对：日实月缺。",
      "金文月牙更厚，仍保留中画。夜的光，开始有了礼器的分量。",
      "小篆月形修长圆转，内含横画。说文：阙也，太阴之精。",
      "隶书拉直弧势。月字骨架已定，像半开的夜门。",
      "简体「月」。用缺，记完整的时间。",
    ],
    forms: [
      HAND["月-oracle"],
      HAND["月-bronze"],
      fromRefs(
        "月-seal.svg",
        "matrix(0.10830933,0,0,-0.10830933,3.8558803,217.858)",
        "0 0 225 225"
      ),
      HAND["月-clerical"],
      xingkaiGlyph("月"),
    ],
  },
  {
    id: "shan",
    glyph: "山",
    meaning: "山岳",
    motion: "mountain",
    texts: [
      "甲骨文三峰耸峙，中峰最高。山不是抽象符号，是天边的轮廓。",
      "金文峰峦圆转厚重。铸在青铜上的山，仍可辨认峰谷。",
      "小篆三峰匀称，线条圆转。说文：宣也，宣气散生万物。",
      "隶书改峰为竖。三柱立于一横之上，山学会了站。",
      "简体「山」。用眼睛就能攀上去。",
    ],
    forms: [
      fromRefs("山-oracle.svg"),
      fromRefs("山-bronze.svg"),
      fromRefs("山-seal.svg"),
      HAND["山-clerical"],
      xingkaiGlyph("山"),
    ],
  },
  {
    id: "shui",
    glyph: "水",
    meaning: "流水",
    motion: "water",
    texts: [
      "甲骨文中画为主流，左右为旁流。水坚持与自己并肩流淌。",
      "金文波纹更流畅。许多条水流，开始成为同一个字。",
      "小篆水有中轴：中竖为川，旁曲为波。象形趋于符号。",
      "隶变之后，波折变点画。水的骨架接近今天。",
      "简体「水」。静里仍有流动。",
    ],
    forms: [
      fromRefs("水-oracle.svg"),
      fromRefs("水-bronze.svg"),
      HAND["水-seal"],
      HAND["水-clerical"],
      xingkaiGlyph("水"),
    ],
  },
  {
    id: "ren",
    glyph: "人",
    meaning: "人",
    motion: "walk",
    texts: [
      "甲骨文象侧面站立的人：有头、身、臂、腿。最早的自画像。",
      "金文人形更壮。仍是人，已开始成为可重复的符号。",
      "小篆省去头形，只留侧立的身姿。说文：天地之性最贵者也。",
      "隶书变作撇捺。人，是迈出去的两笔。",
      "简体「人」。两笔，无穷的性命。",
    ],
    forms: [
      HAND["人-oracle"],
      HAND["人-bronze"],
      HAND["人-seal"],
      HAND["人-clerical"],
      xingkaiGlyph("人"),
    ],
  },
  {
    id: "mu",
    glyph: "木",
    meaning: "树木",
    motion: "tree",
    texts: [
      "甲骨文象树木：上为枝，下为根，中为干。生长的方向被画了下来。",
      "金文枝根更开张。活着的树，铸成了礼器上的纹。",
      "小篆干、枝、根对称。说文：冒也，冒地而生。",
      "隶书横直化。木也成了可以度量的材。",
      "简体「木」。既是森林，也是栋梁。",
    ],
    forms: [
      HAND["木-oracle"],
      HAND["木-bronze"],
      HAND["木-seal"],
      HAND["木-clerical"],
      xingkaiGlyph("木"),
    ],
  },
  {
    id: "huo",
    glyph: "火",
    meaning: "火焰",
    motion: "fire",
    texts: [
      "甲骨文象火焰上腾，旁有火星。火是会吃夜色的光。",
      "金文焰形更定。暖，也是祭。",
      "小篆火如向上之焰，两旁垂画象火星。说文：燬也。",
      "隶变之后，火字撇捺定型，接近今日写法。",
      "简体「火」。暖，也是窑。",
    ],
    forms: [
      HAND["火-oracle"],
      HAND["火-bronze"],
      fromRefs("火-seal.svg"),
      HAND["火-clerical"],
      xingkaiGlyph("火"),
    ],
  },
  {
    id: "yu",
    glyph: "雨",
    meaning: "雨水",
    motion: "rain",
    texts: [
      "甲骨文上象云层覆盖，下象雨滴落下。天气被写了两遍。",
      "金文云盖更完整，雨点成列。像一道无声的令。",
      "小篆雨：一象天，冂象云，中象滴。秩序进入天空。",
      "隶书雨字方正。横云竖泪，骨架已成。",
      "简体「雨」。听——这个字，仍未停。",
    ],
    forms: [
      HAND["雨-oracle"],
      HAND["雨-bronze"],
      HAND["雨-seal"],
      HAND["雨-clerical"],
      xingkaiGlyph("雨"),
    ],
  },
  {
    id: "ma",
    glyph: "马",
    meaning: "马",
    motion: "gallop",
    texts: [
      "甲骨文象侧立之马：鬃、身、四足、尾。奔走被画成一个字。",
      "金文马形更壮，鬃毛仍在背上飞。",
      "小篆马首居上，鬃、目、身与足被收进纵向结构。说文：怒也，武也。",
      "隶书写成「馬」。四点定格，仍是四条腿。",
      "简体「马」。三画，仍能听见蹄声。",
    ],
    forms: [
      HAND["马-oracle"],
      HAND["马-bronze"],
      HAND["马-seal"],
      HAND["马-clerical"],
      xingkaiGlyph("马"),
    ],
  },
  {
    id: "yu-fish",
    glyph: "鱼",
    meaning: "鱼",
    motion: "swim",
    texts: [
      "甲骨文象整条鱼：头、鳞、鳍、尾。水中的生命被侧着画下来。",
      "金文鱼身更圆，鳞片成排。仍可辨头尾。",
      "小篆鱼直立起来。说文：水虫也。",
      "隶书写成「魚」。四点是尾，也是水。",
      "简体「鱼」。一尾穿过三千年。",
    ],
    forms: [
      HAND["鱼-oracle"],
      HAND["鱼-bronze"],
      HAND["鱼-seal"],
      HAND["鱼-clerical"],
      xingkaiGlyph("鱼"),
    ],
  },
  {
    id: "che",
    glyph: "车",
    meaning: "车",
    motion: "cart",
    texts: [
      "甲骨文从上俯视：两轮、一轴、车厢。战争与出行的机器。",
      "金文轮辐更圆。青铜上的车，仍能看见轮子在转。",
      "小篆车形收束为中轴。说文：舆轮之总名。",
      "隶书写成「車」。田字框里，藏着车厢。",
      "简体「车」。轮盘简化为一横，路还在。",
    ],
    forms: [
      HAND["车-oracle"],
      HAND["车-bronze"],
      HAND["车-seal"],
      HAND["车-clerical"],
      xingkaiGlyph("车"),
    ],
  },
  {
    id: "jia",
    glyph: "家",
    meaning: "家",
    motion: "home",
    texts: [
      "甲骨文：屋宇之下，有豕。屋因畜而暖，家因养而立。",
      "金文屋顶更张，豕形仍可辨口吻与足。",
      "小篆宀覆盖豕。说文：居也。",
      "隶书「家」字定型。屋还在，豕藏进笔画。",
      "简体「家」。屋顶之下，仍是一个世界。",
    ],
    forms: [
      HAND["家-oracle"],
      HAND["家-bronze"],
      HAND["家-seal"],
      HAND["家-clerical"],
      xingkaiGlyph("家"),
    ],
  },
  {
    id: "ming",
    glyph: "明",
    meaning: "明",
    motion: "glow",
    texts: [
      "甲骨文或从囧从月：窗棂迎着月光。明，是夜里仍能看见。",
      "金文左边渐成日轮，右边仍是缺月。日月同辉。",
      "小篆从日从月。说文：照也。",
      "隶书「明」左右分立。昼与夜，被写成一个字。",
      "简体「明」。两块光，拼成一个意思。",
    ],
    forms: [
      HAND["明-oracle"],
      HAND["明-bronze"],
      HAND["明-seal"],
      HAND["明-clerical"],
      xingkaiGlyph("明"),
    ],
  },
  {
    id: "dong",
    glyph: "东",
    meaning: "东",
    motion: "dawn",
    texts: [
      "甲骨文象两端束紧的囊橐。日出之处，被叫作这个形状。",
      "金文囊形仍在，束结上下相对。",
      "小篆被说成日在木中。东方，是树上的太阳。",
      "隶书写成「東」。木中藏日，方向成了结构。",
      "简体「东」。日出仍在这一笔里。",
    ],
    forms: [
      HAND["东-oracle"],
      HAND["东-bronze"],
      HAND["东-seal"],
      HAND["东-clerical"],
      xingkaiGlyph("东"),
    ],
  },
  {
    id: "long",
    glyph: "龙",
    meaning: "龙",
    motion: "dragon",
    hook: "龙最初不是神话，而是一条被刻进骨头的巨兽。",
    payoff: "鳞爪被笔画收走，腾跃的力量留了下来。",
    texts: [
      "甲骨文的龙弓身卷尾，头上有角，巨口向前。先民把敬畏刻成一只有形的兽。",
      "金文让龙身更加盘曲，角、爪与鳞甲纠缠在青铜光泽里，它开始靠近神灵。",
      "小篆把飞动的躯体收进纵向结构，曲线仍像云中翻转的脊梁。",
      "隶书写成「龍」，龙首、龙身和尾部被压进密集笔画，野性开始服从书写。",
      "今天的「龙」只剩五画。形体被极度压缩，昂首腾空的方向没有改变。",
    ],
    forms: [charGlyph("龍"), charGlyph("龍"), charGlyph("龍"), charGlyph("龍"), xingkaiGlyph("龙")],
  },
  {
    id: "niao",
    glyph: "鸟",
    meaning: "飞鸟",
    motion: "fly",
    hook: "这个字里，曾完整地藏着一只回头的鸟。",
    payoff: "羽毛一笔笔消失，飞翔没有。",
    texts: [
      "甲骨文画出鸟喙、眼睛、翅膀、足与长尾，像一只刚刚落上树枝的鸟。",
      "金文的羽翼更加丰满，尾羽向后舒展，青铜把轻盈变成了重量。",
      "小篆让鸟直立起来，头、身和尾被组织成一条适合书写的轴线。",
      "隶书写成「鳥」，底下四点像收拢的爪，也像振翅时落下的羽毛。",
      "今天的「鸟」只有五画。尾羽变成一横，它仍随最后一点飞出纸面。",
    ],
    forms: [charGlyph("鳥"), charGlyph("鳥"), charGlyph("鳥"), charGlyph("鳥"), xingkaiGlyph("鸟")],
  },
  {
    id: "gui",
    glyph: "龟",
    meaning: "龟",
    motion: "crawl",
    hook: "甲骨文的甲骨，竟把自己的主人也画了进去。",
    payoff: "龟甲保存文字，文字也保存了龟。",
    texts: [
      "甲骨文从侧面画龟：头颈伸出，背甲隆起，四足和短尾贴近地面。",
      "金文把龟甲刻得更厚，甲纹与肢体仍然清楚，缓慢因此有了分量。",
      "小篆把头、甲、足、尾折进修长结构，真实的龟开始蜕变为复杂符号。",
      "隶书写成「龜」，密集折画像层层甲片，古老生命被封存在字的内部。",
      "今天的「龟」轻了许多。外壳被简化，缓慢而坚定的脚步仍在向前。",
    ],
    forms: [charGlyph("龜"), charGlyph("龜"), charGlyph("龜"), charGlyph("龜"), xingkaiGlyph("龟")],
  },
  {
    id: "zhou",
    glyph: "舟",
    meaning: "舟船",
    motion: "sail",
    hook: "第一只舟，是一段被掏空的树干。",
    payoff: "船形变成六画，人类继续越过水面。",
    texts: [
      "甲骨文像俯视一只独木舟：两端上翘，中间空出船舱，水路由此被打开。",
      "金文加深船舷与舱格，舟不只是工具，也载着贡物、军队与远方。",
      "小篆将船身竖起，弧形船舷被拉成长轴，水上的横物变成纸上的竖字。",
      "隶书舒展横画，舟体渐平方正，摇晃的船开始服从稳定的笔势。",
      "今天的「舟」仍像一叶船。六画之间，留着可以容纳远方的空处。",
    ],
    forms: [charGlyph("舟"), charGlyph("舟"), charGlyph("舟"), charGlyph("舟"), xingkaiGlyph("舟")],
  },
  {
    id: "hu-tiger",
    glyph: "虎",
    meaning: "猛虎",
    motion: "prowl",
    hook: "虎的斑纹，曾经就是这个字的一部分。",
    payoff: "皮毛被抽象成笔画，扑出的力量仍伏在其中。",
    texts: [
      "甲骨文画出张口的虎头、长身、利爪和卷尾，斑纹沿着背部起伏。",
      "金文让虎身更厚重，爪牙与尾巴仍在，威严被铸进祭器。",
      "小篆把虎头收成「虍」，身体蜷在下方，猛兽第一次进入字形的笼子。",
      "隶书拉开撇横，虎的躯干被拆成笔画，仍保持向前压低的姿态。",
      "今天的「虎」有八画。最后一弯像尾巴扫过，字面仍藏着一次扑击。",
    ],
    forms: [charGlyph("虎"), charGlyph("虎"), charGlyph("虎"), charGlyph("虎"), xingkaiGlyph("虎")],
  },
  {
    id: "xiang",
    glyph: "象",
    meaning: "大象",
    motion: "elephant",
    hook: "中原曾有象群，所以先民能画下真正的大象。",
    payoff: "象离开了北方，却留在想象与万象之中。",
    texts: [
      "甲骨文画出长鼻、大耳、粗身与四足，一头真实的大象站在三千年前。",
      "金文让象身更加圆厚，长鼻向下弯曲，它既是猛兽，也是王权的奇观。",
      "小篆把头、鼻、身、足纵向叠合，庞然巨物被收进一枚修长的字。",
      "隶书把弧线变成撇捺，象的四足藏入下部，长鼻仍从上方向前伸出。",
      "今天的「象」有十一画。我们用它表示形象、现象，因为看见从它开始。",
    ],
    forms: [charGlyph("象"), charGlyph("象"), charGlyph("象"), charGlyph("象"), xingkaiGlyph("象")],
  },
];

const HISTORICAL_HEAD = {
  ri: "日", yue: "月", shan: "山", shui: "水", ren: "人", mu: "木", huo: "火", yu: "雨",
  ma: "馬", "yu-fish": "魚", che: "車", jia: "家", ming: "明", dong: "東",
  long: "龍", niao: "鳥", gui: "龜", zhou: "舟", "hu-tiger": "虎", xiang: "象",
};

for (const story of STORIES) {
  const head = HISTORICAL_HEAD[story.id];
  story.forms[0] = officialRaster(head, "oracle");
  story.forms[1] = officialRaster(head, "bronze");
  story.forms[2] = officialRaster(head, "seal");
}

const STORY_DIRECTION = {
  ri: {
    hook: "太阳第一次被写下，竟然不是圆的。",
    payoff: "三千年后，我们仍从这一格光开始。",
    texts: [
      "夜色里，刻字的人抬头看太阳。刀刻不出圆，他索性用方框困住了光。",
      "到了青铜时代，太阳重新变圆。正中的一点，像一颗不肯熄灭的火种。",
      "王朝需要统一。圆被拉成长框，野生的太阳第一次服从秩序。",
      "毛笔落下，圆彻底变方。光不再高悬天上，而是进入每个人的书页。",
      "今天的「日」只有四画。可日历、日期、每日——我们的时间，仍由它点亮。",
    ],
  },
  yue: {
    hook: "古人写月亮时，为什么故意留下缺口？",
    payoff: "因为月亮最动人的，从来不是圆满。",
    texts: [
      "三千年前的夜里，有人画下一弯缺月。两道短痕，是月面，也是未说完的心事。",
      "月亮被铸进青铜，弧线变得厚重。它开始照见祭祀，也照见等待归来的人。",
      "小篆把月拉得修长。古人说月是“太阴之精”——它靠残缺，标记完整时间。",
      "隶书把弯月拉直，像一扇半开的门。门外是夜，门内是人的思念。",
      "今天的「月」仍没有圆满。可正因为阴晴圆缺，我们才学会等待。",
    ],
  },
  shan: {
    hook: "三座真正的山峰，最后只剩三根竖线。",
    payoff: "山被写小了，人的仰望没有。",
    texts: [
      "地平线上，三座峰突然升起。中峰最高——甲骨文的山，就是一次真实的远眺。",
      "山被铸入青铜，峰谷变得浑厚。人们把不可撼动的力量，带进庙堂。",
      "小篆开始修整群峰。自然的锋芒，被收进对称与秩序。",
      "隶变像一场削山工程：曲线断开，三座峰变成三根挺立的竖线。",
      "今天的「山」只有三竖一折。字很小，却仍让每个看见它的人抬头。",
    ],
  },
  shui: {
    hook: "水没有固定形状，却最早拥有了自己的字。",
    payoff: "它改变了形状，从未停止流动。",
    texts: [
      "一条主流向前，两边的支流追赶。甲骨文的水，不是图案，是正在发生的流动。",
      "青铜让水流变得厚重，可每一道弯曲仍在寻找出口。",
      "小篆竖起中轴，让四道水波围绕它转身。自由第一次遇见规则。",
      "隶书把波浪切成点画。看似安静，笔势却仍向四面溅开。",
      "今天的「水」静静写在纸上。只要落笔，它就会再次流起来。",
    ],
  },
  ren: {
    hook: "“人”的第一张照片，只有一个孤独的侧影。",
    payoff: "两笔撑住的，是无数种人生。",
    texts: [
      "他侧身站在三千年前：有头、有手、有脚。甲骨文留下了人类最早的自画像。",
      "青铜时代，他站得更稳。人不再只是肉身，也成为宗族与责任。",
      "小篆慢慢省去头脸，只留下弯腰前行的姿态——人，开始成为所有人。",
      "隶书挥出一撇一捺。两条腿分开，像下一秒就要走出画面。",
      "今天的「人」只有两笔。一笔独立，一笔支撑：没有谁真正只靠自己站立。",
    ],
  },
  mu: {
    hook: "一棵树，怎样长成整座文明？",
    payoff: "树被写进字里，也写进了我们的生活。",
    texts: [
      "枝向天空，根扎土地，中间是一条脊梁。甲骨文画下的，是一棵活着的树。",
      "到了青铜时代，枝根向外张开。它既是生命，也是房屋、舟车和火。",
      "小篆让枝、干、根彼此对称。野树被修成文明可以理解的形状。",
      "隶书横平竖直，木开始像一件可以丈量、切割、建造的材料。",
      "今天的「木」只有四画。加一棵成林，加屋顶成宋——文明仍在它的枝头生长。",
    ],
  },
  huo: {
    hook: "人类驯服火之前，先把它画了下来。",
    payoff: "火照亮了夜，也改变了人。",
    texts: [
      "黑夜中央，火焰突然站起。两旁的火星飞散——这是先民最危险也最迷人的伙伴。",
      "火被铸进青铜，焰形稳定下来。它能煮熟食物，也能把祈愿送向天空。",
      "小篆让火焰向上聚拢。狂野的燃烧，开始拥有可以传承的轮廓。",
      "隶变猛地劈开撇捺，四点飞向两侧。火最剧烈的一瞬，被定格成字。",
      "今天的「火」依然张开四肢。每次写下它，纸面都像突然亮了一度。",
    ],
  },
  yu: {
    hook: "三千年前的一场雨，为什么至今还没停？",
    payoff: "因为人类第一次，把天气写成了记忆。",
    texts: [
      "云压下来，雨滴成排坠落。甲骨上的这一场雨，曾决定收成与生死。",
      "青铜把云盖铸得更厚，雨点落得更整齐。天空像在发布一道命令。",
      "小篆给雨造了一间屋：上面是天，里面是云，四点是奔向土地的水。",
      "隶书把风暴收进方框。越是整齐，越能听见框内密集的雨声。",
      "今天的「雨」几乎没有改变。三千年前落下的那一场，仍在这个字里回响。",
    ],
  },
  ma: {
    hook: "这个字里，曾经真的有四条腿。",
    payoff: "笔画越来越少，蹄声从未远去。",
    texts: [
      "鬃毛扬起，四蹄腾空，尾巴甩向身后。甲骨文把一匹马按在了奔跑的瞬间。",
      "青铜时代，马变得更强壮。它带来速度，也改变战争与疆域。",
      "小篆让马站直，鬃、目、身与足被收进纵向结构。奔跑第一次被压进秩序。",
      "隶书写成「馬」。四点仍在字底，像落地前一秒悬空的蹄。",
      "今天的「马」只剩三画。可当最后一横甩出，三千年的风仍从耳边掠过。",
    ],
  },
  "yu-fish": {
    hook: "一条鱼游了三千年，最后游进了八画里。",
    payoff: "形状会被时间带走，生命感不会。",
    texts: [
      "鱼头、鱼鳞、鱼鳍、鱼尾，一样不少。甲骨文把水里的生命完整捞上岸。",
      "青铜上的鱼更圆、更重，鳞片排成队。它是食物，也是丰收的愿望。",
      "小篆让鱼突然直立。它离开真实姿态，开始学习成为一个符号。",
      "隶书写成「魚」，底下四点既像尾鳍，也像刚刚甩落的水珠。",
      "今天的「鱼」游进八画之中。身体被简化，摆尾的方向却从未改变。",
    ],
  },
  che: {
    hook: "第一辆车，竟然是从天空俯拍的。",
    payoff: "轮子被简化了，人仍在向前。",
    texts: [
      "两只车轮、一根长轴、中间是车厢。甲骨文像从天空拍下第一辆战车。",
      "青铜上的轮辐更加清楚。车让距离缩短，也让战争突然加速。",
      "小篆把圆轮收进中轴。真实机器，被折叠成一套精密结构。",
      "隶书写成「車」，方框像车厢，长横像道路，车轮藏进了笔画。",
      "今天的「车」只剩四画。轮子消失了，向前的力量却留了下来。",
    ],
  },
  jia: {
    hook: "为什么“家”的屋顶下，住着一头猪？",
    payoff: "家不是房子，是被照料的生命。",
    texts: [
      "屋顶下面，一头猪安静卧着。对先民来说，有房、有畜、有食物，才敢称为家。",
      "青铜时代，屋檐张得更开。被遮蔽的不只是牲畜，也是一个家族的未来。",
      "小篆把屋顶写成「宀」，把猪藏进笔画。生活现场开始变成抽象概念。",
      "隶书让「家」彻底定型。那头猪看不见了，可“养”的含义没有消失。",
      "今天我们写下「家」，想到的早已不是牲畜。可家的本质仍是：有人等你回来。",
    ],
  },
  ming: {
    hook: "太阳和月亮，真的组成了“明”吗？",
    payoff: "光不是一个答案，而是两个世界相遇。",
    texts: [
      "最早的「明」，可能是一扇窗迎着月光。黑夜没有退场，人先打开了一道缝。",
      "到了青铜时代，左边渐成太阳，右边仍是缺月。昼与夜第一次站在一起。",
      "小篆正式写成日月并列。两种完全相反的光，共同解释“看见”。",
      "隶书把日月拉开，像两个人各自站稳，却把光投向同一个地方。",
      "今天的「明」仍由日月组成。真正的明亮，也许从来不是只有一种声音。",
    ],
  },
  dong: {
    hook: "“东”最初可能根本不是太阳升起。",
    payoff: "一个误读，也能长成整个方向。",
    texts: [
      "甲骨文画的是一只两端扎紧的口袋。它和日出无关，却被时间推向东方。",
      "青铜时代，绳结与囊身仍清晰可见。这个字还没决定自己未来的意义。",
      "小篆出现了浪漫的新解释：太阳卡在树中，东方于是成为光升起的地方。",
      "隶书写成「東」。树与太阳牢牢嵌合，后来的故事覆盖了最初的真相。",
      "今天的「东」只剩五画。文字最迷人的地方是：误读，也可能活成新的真实。",
    ],
  },
};

for (const story of STORIES) {
  Object.assign(story, STORY_DIRECTION[story.id] || {});
}

const ERAS = ["甲骨", "金文", "小篆", "隶书", "现代行楷"];

fs.writeFileSync(
  path.join(__dirname, "glyphs.json"),
  JSON.stringify({ ERAS, STORIES })
);

// Keep a browser-loadable fallback for opening index.html directly via file://.
// fetch() is blocked for local files in several browsers, while a plain script
// tag remains available offline.
fs.writeFileSync(
  path.join(__dirname, "glyphs.js"),
  `window.GLYPHS = ${JSON.stringify({ ERAS, STORIES })};\n`
);

console.log(
  "ok",
  STORIES.map((s) => [s.glyph, s.forms.every(Boolean)])
);
