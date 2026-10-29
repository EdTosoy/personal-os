/** Lossless screenshots; real video frames, no generated or composited imagery. */
import { createRequire } from 'node:module';
import { readdir, readFile, stat, mkdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { root, output, exec, receipt } from './capture.mjs';
const req = createRequire(`${root}/apps/main/package.json`);
const sharp = createRequire(req.resolve('next/package.json'))('sharp');
const manifest = [];
const projects = ['flow', 'fats', 'hospital', 'pixshare', 'marcus'];
const selected = process.env.CAPTURE_PROJECTS?.split(',') || projects;
if (selected.some((name) => !projects.includes(name)))
  throw Error('Unknown capture project');
const assetRoot = process.env.CAPTURE_ASSET_ROOT || '/evidence/phase5d';
if (!/^\/evidence\/[a-z0-9-]+$/.test(assetRoot))
  throw Error('Capture assets must use a named evidence directory');
for (const name of selected) {
  const capture = JSON.parse(await readFile(`${output}/${name}.json`, 'utf8'));
  if (
    !capture.results.every((r) => r.status === 'PASS' && r.errors.length === 0)
  )
    throw Error(`${name}: refusing to publish failed capture`);
  const dir = `${root}/apps/main/public${assetRoot}/${name}`;
  await mkdir(dir, { recursive: true });
  for (const file of (await readdir(`${output}/${name}`)).filter(
    (f) => f.endsWith('.png') && !f.startsWith('failure'),
  )) {
    const input = `${output}/${name}/${file}`,
      dest = `${dir}/${file.replace('.png', '.webp')}`;
    await sharp(input).webp({ lossless: true, effort: 6 }).toFile(dest);
    const bytes = await readFile(dest);
    manifest.push({
      source: input.replace(root + '/', ''),
      asset: dest.replace(`${root}/apps/main/public`, ''),
      originalBytes: (await stat(input)).size,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
  const original = `${output}/${name}/original/${name}-desktop.webm`;
  const { stdout } = await exec('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'json',
    original,
  ]);
  const duration = Number(JSON.parse(stdout).format.duration);
  const trimStart =
    (capture.results.find((r) => r.size === 'desktop').recordingOffsetSeconds ||
      0) + 0.4;
  // Trim only the initial blank navigation (0.4s); preserve uninterrupted real interactions.
  await exec('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    String(trimStart),
    '-i',
    original,
    '-an',
    '-vf',
    'fps=24,scale=1440:-2',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '28',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    `${dir}/demo.mp4`,
  ]);
  await exec('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    trimStart > 0.4 ? String(trimStart + 1.5) : name === 'fats' ? '4' : '1.5',
    '-i',
    original,
    '-frames:v',
    '1',
    `${dir}/poster.png`,
  ]);
  await sharp(`${dir}/poster.png`)
    .resize({ width: 960 })
    .webp({ quality: 85, effort: 6 })
    .toFile(`${dir}/poster.webp`);
  await unlink(`${dir}/poster.png`);
  manifest.push({
    source: original.replace(root + '/', ''),
    asset: `${assetRoot}/${name}/demo.mp4`,
    originalBytes: (await stat(original)).size,
    bytes: (await stat(`${dir}/demo.mp4`)).size,
    originalDuration: duration,
    trimStart,
    optimizedDuration: duration - trimStart,
  });
  // Playwright's generated file and saveAs are byte-identical; retain the named original only.
  for (const file of await readdir(`${output}/${name}/original`))
    if (file.startsWith('page@') && file.endsWith('.webm'))
      await unlink(`${output}/${name}/original/${file}`);
}
await receipt('media-manifest', manifest);
console.log(
  JSON.stringify({
    assets: manifest.length,
    originalBytes: manifest.reduce((n, m) => n + m.originalBytes, 0),
    optimizedBytes: manifest.reduce((n, m) => n + m.bytes, 0),
  }),
);
