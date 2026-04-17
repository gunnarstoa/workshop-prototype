import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments } from './inject-into-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(__dirname, '..', '..', 'template.dotx');

const buf = fs.readFileSync(templatePath);
const zip = await JSZip.loadAsync(buf);
await stripComments(zip);
const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(templatePath, out);
console.log(`✓ Stripped comments from ${templatePath}`);
