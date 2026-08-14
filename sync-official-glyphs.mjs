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
const characters = ["日", "月", "山", "水", "人", "木", "火", "雨", "馬", "魚", "車", "家", "明", "東"];
const stages = ["oracle", "bronze", "seal"];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

fs.mkdirSync(output, { recursive: true });

for (const character of characters) {
  for (const stage of stages) {
    const filename = `${character}-${stage}.svg`;
    const outputName = `${character}-${stage}.png`;
    const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=250`;
    const response = await fetch(url, {
      headers: { "User-Agent": "ChineseCharacterFilm/1.0 (offline educational artwork)" },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
    const image = Buffer.from(await response.arrayBuffer());
    if (image[0] !== 0x89 || image[1] !== 0x50) throw new Error(`${filename}: response is not PNG`);
    fs.writeFileSync(path.join(output, outputName), image);
    console.log("synced", outputName);
    await sleep(900);
  }
}
