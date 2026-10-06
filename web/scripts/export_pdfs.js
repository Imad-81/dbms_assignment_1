/**
 * HAPCMS — Screenshot-per-slide PDF exporter
 * 
 * Strategy:
 *  1. Load each HTML file in a 1920×1080 Puppeteer viewport (16:9, matches the deck)
 *  2. Call updateSlide(i) for every slide, wait for animations, screenshot
 *  3. Embed all screenshots into a PDF using pdf-lib (one image = one page)
 *  4. Merge all presentation PDFs into one combined file
 */

const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'html');
const OUT_DIR = path.join(ROOT, 'submissions', 'presentations');
const MERGED_OUT = path.join(ROOT, 'submissions', 'HAPCMS_Combined_Presentations.pdf');

// 16:9 at 1.5× pixel density for sharp output
const VIEWPORT_W = 1440;
const VIEWPORT_H = 810;

const PRESENTATIONS = [
  { file: 'presentation.html',   out: '01_Executive_Presentation.pdf',  label: 'Executive Presentation (Review 1)' },
  { file: 'schema_keynote.html', out: '02_Schema_ERD_Keynote.pdf',       label: 'Schema & ERD Keynote (Review 1)'  },
  { file: 'review_2.html',       out: '03_Review_2_Presentation.pdf',    label: 'Review 2 Presentation'             },
];

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function screenshotAllSlides(browser, htmlFilePath, label) {
  console.log(`\n  📂 ${label}`);
  const page = await browser.newPage();

  await page.setViewport({ width: VIEWPORT_W, height: VIEWPORT_H, deviceScaleFactor: 1.5 });

  const fileUrl = `file://${htmlFilePath}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 90000 });

  // Wait for the JS deck to initialise
  await delay(1500);

  // Get the total slide count from the page itself
  const totalSlides = await page.evaluate(() => {
    return document.querySelectorAll('.slide').length;
  });
  console.log(`     → ${totalSlides} slides found`);

  const screenshots = [];

  for (let i = 0; i < totalSlides; i++) {
    // Activate slide i using the presentation's own JS function
    await page.evaluate((idx) => {
      // Direct DOM manipulation so it works even if updateSlide isn't global
      document.querySelectorAll('.slide').forEach((s, j) => {
        s.classList.toggle('active', j === idx);
      });

      // Also hide UI chrome that we don't want in the PDF
      const topBar = document.querySelector('.top-bar');
      const bottomBar = document.querySelector('.bottom-bar');
      const drawer = document.querySelector('.speaker-notes-drawer');
      const gridModal = document.querySelector('.grid-modal');
      if (topBar) topBar.style.display = 'none';
      if (bottomBar) bottomBar.style.display = 'none';
      if (drawer) drawer.style.display = 'none';
      if (gridModal) gridModal.style.display = 'none';
    }, i);

    // Short wait for any CSS transitions
    await delay(200);

    // Screenshot just the slide viewport element for clean output
    const slideEl = await page.$('.slide.active');
    let imgBuf;

    if (slideEl) {
      imgBuf = await slideEl.screenshot({ type: 'jpeg', quality: 95 });
    } else {
      // Fallback: full page screenshot
      imgBuf = await page.screenshot({ type: 'jpeg', quality: 95, fullPage: false });
    }

    screenshots.push(imgBuf);
    process.stdout.write(`\r     → Captured slide ${i + 1}/${totalSlides}`);
  }

  console.log('');
  await page.close();
  return screenshots;
}

async function screenshotsToPDF(screenshots, outPath, label) {
  const pdfDoc = await PDFDocument.create();

  for (const imgBuf of screenshots) {
    const jpgImage = await pdfDoc.embedJpg(imgBuf);
    const { width, height } = jpgImage.scale(1);

    // Add a landscape page matching the image dimensions
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(jpgImage, { x: 0, y: 0, width, height });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);
  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`     ✓ Saved: ${path.basename(outPath)} (${kb} KB, ${screenshots.length} pages)`);

  return pdfDoc;
}

async function mergePDFs(pdfPaths, mergedOutPath) {
  console.log(`\n  📎 Merging all PDFs...`);
  const merged = await PDFDocument.create();

  for (const p of pdfPaths) {
    if (!fs.existsSync(p)) { console.warn(`  ⚠  Not found: ${p}`); continue; }
    const bytes = fs.readFileSync(p);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(pg => merged.addPage(pg));
    console.log(`     + ${path.basename(p)} (${doc.getPageCount()} pages)`);
  }

  const mergedBytes = await merged.save();
  fs.writeFileSync(mergedOutPath, mergedBytes);
  const kb = (fs.statSync(mergedOutPath).size / 1024).toFixed(0);
  console.log(`\n  ✅ Combined: submissions/HAPCMS_Combined_Presentations.pdf`);
  console.log(`     ${merged.getPageCount()} total pages, ${kb} KB\n`);
}

(async () => {
  console.log('\n🖨️  HAPCMS — Slide-by-Slide PDF Export\n');
  console.log(`   Viewport: ${VIEWPORT_W}×${VIEWPORT_H} @ 1.5× DPR\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const exportedPDFs = [];

  for (const pres of PRESENTATIONS) {
    const htmlPath = path.join(HTML_DIR, pres.file);
    if (!fs.existsSync(htmlPath)) {
      console.warn(`  ⚠  File not found, skipping: ${pres.file}`);
      continue;
    }

    const outPath = path.join(OUT_DIR, pres.out);
    const screenshots = await screenshotAllSlides(browser, htmlPath, pres.label);
    await screenshotsToPDF(screenshots, outPath, pres.label);
    exportedPDFs.push(outPath);
  }

  await browser.close();

  // Merge: existing problem-approach PDF first, then the three new ones
  const problemApproachPDF = path.join(OUT_DIR, '00_Problem_Approach_Presentation.pdf');
  const allPDFs = [problemApproachPDF, ...exportedPDFs];
  await mergePDFs(allPDFs, MERGED_OUT);

  console.log('✅ All done!\n');
})();
