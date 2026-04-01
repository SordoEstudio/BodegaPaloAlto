/**
 * Genera src/app/favicon.ico a partir de public/logos/iso-c-m.png
 * (varias resoluciones embebidas para pestaña / escritorio / Windows).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const inputPng = path.join(root, "public", "logos", "iso-c-m.png");
const outIco = path.join(root, "src", "app", "favicon.ico");

const sizes = [16, 32, 48, 64, 128, 256];

async function main() {
  if (!fs.existsSync(inputPng)) {
    console.error("No existe:", inputPng);
    process.exit(1);
  }

  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(inputPng)
        .resize(size, size, { fit: "cover", position: "centre" })
        .png()
        .toBuffer()
    )
  );

  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(outIco, icoBuffer);
  console.log("Escrito:", outIco, `(${icoBuffer.length} bytes, ${sizes.join(",")}px)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
