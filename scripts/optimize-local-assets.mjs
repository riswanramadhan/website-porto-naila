import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const assets = [
  ["naila-hero.png", "naila-hero.webp", 1600, 82],
  ["logo-unhas.png", "logo-unhas.webp", 640, 82],
  ["logo-spss.png", "logo-spss.webp", 640, 82],
  ["logo-r studio.png", "logo-rstudio.webp", 640, 82],
  ["logo-photoshop.png", "logo-photoshop.webp", 640, 82],
  ["logo-ions.png", "logo-ions.webp", 640, 82],
  ["logo-figma.png", "logo-figma.webp", 640, 82],
  ["logo-canva.png", "logo-canva.webp", 640, 82],
  ["logo al abidin.png", "logo-al-abidin.webp", 960, 82],
  ["laptop-growmates.svg", "laptop-growmates.webp", 1600, 82],
];

for (const [input, output, size, quality] of assets) {
  await sharp(path.join(publicDir, input), { density: 180 })
    .rotate()
    .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(path.join(publicDir, output));
}

await sharp(path.join(publicDir, "logo-unhas.png"))
  .rotate()
  .resize({ width: 512, height: 512, fit: "contain", withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(publicDir, "icon.png"));

console.log(`Optimized ${assets.length} local assets and icon.png.`);
