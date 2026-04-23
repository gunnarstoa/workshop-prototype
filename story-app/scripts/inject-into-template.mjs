import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.resolve(projectRoot, '..', 'template.dotx');

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Inject the body content of a source .docx (generated from the docx package)
 * into the template's document.xml, preserving the template's cover page and
 * final section properties.
 *
 * Also merges media files (images), numbering definitions, and relationships
 * from the source into the template zip so embedded images appear correctly.
 *
 * Returns a Buffer of the resulting .docx file.
 */
export async function injectIntoTemplate(sourceDocxBuffer, options = {}) {
  const { coverTitle, coverSubtitle } = options;
  const templateBuffer = fs.readFileSync(templatePath);
  const templateZip = await JSZip.loadAsync(templateBuffer);
  const sourceZip   = await JSZip.loadAsync(sourceDocxBuffer);

  // ── 1. Extract source body XML ──────────────────────────────────────────
  const sourceDocXml = await sourceZip.file('word/document.xml').async('string');
  const srcBodyStart = sourceDocXml.indexOf('<w:body>') + '<w:body>'.length;
  const srcSectStart = sourceDocXml.lastIndexOf('<w:sectPr');
  const srcBodyEnd   = srcSectStart > 0 ? srcSectStart : sourceDocXml.lastIndexOf('</w:body>');
  let generatedBody  = sourceDocXml.slice(srcBodyStart, srcBodyEnd).trim();

  // ── 2. Merge media files + remap relationship IDs ──────────────────────
  //    Must happen BEFORE building newDocXml so rId references are correct.
  {
    let docRels = await templateZip.file('word/_rels/document.xml.rels').async('string');

    // Find the highest existing rId number in the template rels
    let maxId = 0;
    for (const [, n] of docRels.matchAll(/Id="rId(\d+)"/g)) {
      const num = parseInt(n, 10);
      if (num > maxId) maxId = num;
    }

    // Parse image relationships from source
    const srcDocRels = await sourceZip.file('word/_rels/document.xml.rels').async('string');
    const srcImageRels = [
      ...srcDocRels.matchAll(
        /<Relationship\s+Id="(rId\d+)"[^>]*Type="[^"]*\/image"[^>]*Target="(media\/[^"]+)"/g
      )
    ];

    const mimeMap = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
      gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
    };

    for (const [, srcId, srcTarget] of srcImageRels) {
      const srcFile = sourceZip.file(`word/${srcTarget}`);
      if (!srcFile) continue;
      const data = await srcFile.async('nodebuffer');
      const ext  = srcTarget.split('.').pop().toLowerCase();

      // Assign a new non-colliding rId
      maxId += 1;
      const newId     = `rId${maxId}`;
      const newTarget = `media/img${maxId}.${ext}`;

      // Copy the image into the template zip
      templateZip.file(`word/${newTarget}`, data);

      // Add the relationship
      docRels = docRels.replace(
        '</Relationships>',
        `<Relationship Id="${newId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${newTarget}"/></Relationships>`
      );

      // Register the content type if not already present
      let ct = await templateZip.file('[Content_Types].xml').async('string');
      const mime = mimeMap[ext] ?? `image/${ext}`;
      if (!ct.includes(`Extension="${ext}"`)) {
        ct = ct.replace('</Types>', `<Default Extension="${ext}" ContentType="${mime}"/></Types>`);
        templateZip.file('[Content_Types].xml', ct);
      }

      // Remap rId references in the body XML
      generatedBody = generatedBody
        .replaceAll(`r:embed="${srcId}"`, `r:embed="${newId}"`)
        .replaceAll(`r:id="${srcId}"`,    `r:id="${newId}"`);
    }

    templateZip.file('word/_rels/document.xml.rels', docRels);
  }

  // ── 3. Merge numbering.xml (bullet lists) ──────────────────────────────
  const srcNumbering = sourceZip.file('word/numbering.xml');
  if (srcNumbering) {
    const srcNumXml = await srcNumbering.async('string');
    templateZip.file('word/numbering.xml', srcNumXml);

    let ct = await templateZip.file('[Content_Types].xml').async('string');
    if (!ct.includes('word/numbering.xml')) {
      ct = ct.replace(
        '</Types>',
        '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>'
      );
      templateZip.file('[Content_Types].xml', ct);
    }

    let docRels = await templateZip.file('word/_rels/document.xml.rels').async('string');
    if (!docRels.includes('numbering.xml')) {
      docRels = docRels.replace(
        '</Relationships>',
        '<Relationship Id="rNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'
      );
      templateZip.file('word/_rels/document.xml.rels', docRels);
    }
  }

  // ── 4. Patch template document.xml cover placeholders ──────────────────
  let templateDocXml = await templateZip.file('word/document.xml').async('string');
  if (coverTitle) {
    templateDocXml = templateDocXml.replace(
      /<w:t xml:space="preserve">Anaplan <\/w:t>/,
      `<w:t xml:space="preserve">${escapeXml(coverTitle)}</w:t><w:t xml:space="preserve"> </w:t>`
    );
    templateDocXml = templateDocXml.replace(
      /<w:t>Title<\/w:t>/,
      `<w:t>${escapeXml(coverSubtitle || '')}</w:t>`
    );
  }

  // ── 5. Find cover page end ──────────────────────────────────────────────
  const sdtStart = templateDocXml.indexOf('<w:sdt>');
  let coverEndIdx;
  if (sdtStart > 0) {
    coverEndIdx = sdtStart;
  } else {
    const firstPageBreak = templateDocXml.indexOf('<w:br w:type="page"/>');
    if (firstPageBreak < 0) throw new Error('Template has no cover boundary marker');
    coverEndIdx = templateDocXml.indexOf('</w:p>', firstPageBreak) + '</w:p>'.length;
  }

  // ── 6. Find final section properties ───────────────────────────────────
  const finalSectStart = templateDocXml.lastIndexOf('<w:sectPr');
  if (finalSectStart < coverEndIdx) throw new Error('Template has no final section properties');

  // ── 7. Assemble new document.xml ───────────────────────────────────────
  const coverPart    = templateDocXml.slice(0, coverEndIdx);
  const closingPart  = templateDocXml.slice(finalSectStart);
  const pageBreakPara = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  const newDocXml    = coverPart + '\n' + pageBreakPara + '\n' + generatedBody + '\n' + closingPart;
  templateZip.file('word/document.xml', newDocXml);

  // ── 8. Fix content type: .dotx → .docx ─────────────────────────────────
  {
    let ct = await templateZip.file('[Content_Types].xml').async('string');
    ct = ct.replace(
      'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml"',
      'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"'
    );
    templateZip.file('[Content_Types].xml', ct);
  }

  // ── 9. Strip template review comments ──────────────────────────────────
  await stripComments(templateZip);

  // ── 10. Generate output ─────────────────────────────────────────────────
  return await templateZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

/**
 * Remove all Word comment artifacts from a docx zip.
 */
export async function stripComments(zip) {
  const commentParts = [
    'word/comments.xml', 'word/commentsExtended.xml',
    'word/commentsIds.xml', 'word/commentsExtensible.xml'
  ];
  for (const p of commentParts) { if (zip.file(p)) zip.remove(p); }

  if (zip.file('[Content_Types].xml')) {
    let ct = await zip.file('[Content_Types].xml').async('string');
    ct = ct.replace(/<Override[^>]*wordprocessingml\.comments(Extended|Ids|Extensible)?\+xml"[^/]*\/>/g, '');
    zip.file('[Content_Types].xml', ct);
  }
  if (zip.file('word/_rels/document.xml.rels')) {
    let rels = await zip.file('word/_rels/document.xml.rels').async('string');
    rels = rels.replace(/<Relationship[^>]*\/relationships\/comments[^"]*"[^/]*\/>/g, '');
    zip.file('word/_rels/document.xml.rels', rels);
  }
  if (zip.file('word/document.xml')) {
    let doc = await zip.file('word/document.xml').async('string');
    doc = doc
      .replace(/<w:commentRangeStart[^/]*\/>/g, '')
      .replace(/<w:commentRangeEnd[^/]*\/>/g, '')
      .replace(/<w:r>\s*<w:rPr>[^<]*<w:rStyle w:val="CommentReference"[^/]*\/>[\s\S]*?<w:commentReference[^/]*\/>\s*<\/w:r>/g, '')
      .replace(/<w:commentReference[^/]*\/>/g, '');
    zip.file('word/document.xml', doc);
  }
}
