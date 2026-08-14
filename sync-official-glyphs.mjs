/**
 * Download the canonical oracle, bronze and Shuowen seal SVGs used by the film.
 *
 * The Commons Ancient Chinese Characters files are public-domain/CC0 vector
 * transcriptions whose file pages cite Academia Sinica, CHANT and CUHK's
 * Multi-function Chinese Character Database. Run this only when refreshing
 * the checked-in reference set; the finished film remains fully offline.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "refs");
const characters = [
  "日", "月", "山", "水", "人", "木", "火", "雨", "馬", "魚", "車", "家", "明", "東",
  "龍", "鳥", "龜", "舟", "虎", "象",
];
const stages = ["oracle", "bronze", "seal"];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const force = process.argv.includes("--force");

async function download(url, filename) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": "ChineseCharacterFilm/1.0 (offline educational artwork)" },
      redirect: "follow",
    });
    if (response.ok) return response;
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`${filename}: HTTP ${response.status}`);
    }
    await sleep(3500 * (attempt + 1));
  }
  throw new Error(`${filename}: download retry limit reached`);
}

fs.mkdirSync(output, { recursive: true });

for (const character of characters) {
  for (const stage of stages) {
    const filename = `${character}-${stage}.svg`;
    const outputName = `${character}-${stage}.png`;
    const outputPath = path.join(output, outputName);
    const webpPath = path.join(output, `${character}-${stage}.webp`);
    if (!force && (fs.existsSync(outputPath) || fs.existsSync(webpPath))) {
      console.log("kept", outputName);
      continue;
    }
    const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=250`;
    const response = await download(url, filename);
    const image = Buffer.from(await response.arrayBuffer());
    if (image[0] !== 0x89 || image[1] !== 0x50) throw new Error(`${filename}: response is not PNG`);
    fs.writeFileSync(outputPath, image);
    console.log("synced", outputName);
    await sleep(900);
  }
}
