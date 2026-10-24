/** Print the editable local résumé source with the existing verification browser. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(resolve(process.env.PLAYWRIGHT_PROJECT || "../flow", "package.json"));
const { chromium } = require("@playwright/test");
const source = resolve("resume/Edberto_Tosoy_Resume.html");
const output = resolve("public/Edberto_Tosoy_Resume.pdf");
const sourceBytes = await readFile(source);
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/etc/profiles/per-user/edtosoy/bin/chromium",
  chromiumSandbox: true,
});
try {
  const page = await browser.newPage();
  const remoteRequests = [];
  page.on("request", (request) => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
  });
  await page.goto(pathToFileURL(source).href);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(remoteRequests, [], "Résumé rendering must not fetch remote assets");
  const pdf = await page.pdf({ path: output, format: "Letter", preferCSSPageSize: true, printBackground: true, tagged: true });
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  await writeFile("resume/build-manifest.json", JSON.stringify({
    source: "resume/Edberto_Tosoy_Resume.html",
    sourceSha256: hash(sourceBytes),
    pdf: "public/Edberto_Tosoy_Resume.pdf",
    pdfSha256: hash(pdf),
    renderer: `Playwright ${require("@playwright/test/package.json").version} / ${browser.version()}`,
  }, null, 2) + "\n");
  console.log(`Generated ${output} from ${source}`);
} finally {
  await browser.close();
}
