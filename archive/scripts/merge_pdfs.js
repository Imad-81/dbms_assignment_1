/**
 * Merge individual presentation PDFs + existing PDF into one combined file.
 * Uses pdf-lib.
 */

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRES_DIR = path.join(ROOT, 'submissions', 'presentations');
const MERGED_OUT = path.join(ROOT, 'submissions', 'HAPCMS_Combined_Presentations.pdf');

// Order: existing PDF first, then the three new ones
const PDF_FILES = [
  path.join(ROOT, 'HAPCMS_Problem_Approach_Presentation.pdf'),
  path.join(PRES_DIR, '01_Executive_Presentation.pdf'),
  path.join(PRES_DIR, '02_Schema_ERD_Keynote.pdf'),
  path.join(PRES_DIR, '03_Review_2_Presentation.pdf'),
];

(async () => {
  console.log('\n📎 HAPCMS — Merging PDFs\n');

  const merged = await PDFDocument.create();

  for (const filePath of PDF_FILES) {
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠️  Not found, skipping: ${path.basename(filePath)}`);
      continue;
    }

    const bytes = fs.readFileSync(filePath);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));

    console.log(`  ✓ Added ${pages.length} pages from: ${path.basename(filePath)}`);
  }

  const mergedBytes = await merged.save();
  fs.writeFileSync(MERGED_OUT, mergedBytes);

  const size = (fs.statSync(MERGED_OUT).size / 1024).toFixed(1);
  console.log(`\n✅ Merged PDF saved: submissions/HAPCMS_Combined_Presentations.pdf (${size} KB)`);
  console.log(`   Total pages: ${merged.getPageCount()}\n`);
})();
