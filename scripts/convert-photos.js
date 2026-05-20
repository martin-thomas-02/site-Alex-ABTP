// Convertit les JPEG sources (photos/) en WebP responsive + AVIF
// vers assets/photos/. Originaux préservés.
// Usage : npm run photos

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'photos');
const DST_DIR = path.join(__dirname, '..', 'assets', 'photos');

const RENAMES = {
  'photo entête.jpg':         'hero-chantier',
  'chemin avant.jpg':         'chemin-avant',
  'chemin après.jpg':         'chemin-apres',
  'terrasse avant.jpg':       'terrasse-avant',
  'terrasse après.jpg':       'terrasse-apres',
  'devant maison avant.jpg':  'facade-avant',
  'devant maison après.jpg':  'facade-apres',
};

const WEBP_VARIANTS = [
  { width:  640, quality: 78 },
  { width: 1024, quality: 80 },
  { width: 1600, quality: 82 },
];
const AVIF_VARIANT = { width: 1024, quality: 55, effort: 6 };

if (!fs.existsSync(DST_DIR)) fs.mkdirSync(DST_DIR, { recursive: true });

async function convertOne(srcFile, slug) {
  const srcPath = path.join(SRC_DIR, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.warn(`SKIP  ${srcFile} (introuvable)`);
    return;
  }
  const meta = await sharp(srcPath).metadata();
  console.log(`---  ${srcFile}  (${meta.width}x${meta.height})  ->  ${slug}`);

  for (const v of WEBP_VARIANTS) {
    const out = path.join(DST_DIR, `${slug}-${v.width}.webp`);
    await sharp(srcPath)
      .resize(v.width, null, { withoutEnlargement: true })
      .webp({ quality: v.quality })
      .toFile(out);
    const size = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`  webp ${v.width}w  q${v.quality}  ${size} ko`);
  }

  const outAvif = path.join(DST_DIR, `${slug}.avif`);
  await sharp(srcPath)
    .resize(AVIF_VARIANT.width, null, { withoutEnlargement: true })
    .avif({ quality: AVIF_VARIANT.quality, effort: AVIF_VARIANT.effort })
    .toFile(outAvif);
  const sizeA = (fs.statSync(outAvif).size / 1024).toFixed(1);
  console.log(`  avif ${AVIF_VARIANT.width}w  q${AVIF_VARIANT.quality}  ${sizeA} ko`);
}

(async () => {
  const t0 = Date.now();
  for (const [src, slug] of Object.entries(RENAMES)) {
    await convertOne(src, slug);
  }
  console.log(`\nOK  ${Object.keys(RENAMES).length} photos converties en ${((Date.now()-t0)/1000).toFixed(1)} s`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
