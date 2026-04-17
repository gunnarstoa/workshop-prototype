import JSZip from 'jszip';

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.resolve(projectRoot, '..', 'template.dotx');

/**
 * Inject the body content of a source .docx (generated from the docx package)
 * into the template's document.xml, preserving the template's cover page and
 * final section properties.
 *
 * Returns a Buffer of the resulting .docx file.
 */
export async function injectIntoTemplate(sourceDocxBuffer, options = {}) {
  const { coverTitle, coverSubtitle } = options;
  const templateBuffer = fs.readFileSync(templatePath);
  const templateZip = await JSZip.loadAsync(templateBuffer);
  const sourceZip = await JSZip.loadAsync(sourceDocxBuffer);

  // 1. Extract source document.xml and pull out the body contents (everything between <w:body> and its final <w:sectPr>)
  const sourceDocXml = await sourceZip.file('word/document.xml').async('string');
  const srcBodyStart = sourceDocXml.indexOf('<w:body>') + '<w:body>'.length;
  const srcSectStart = sourceDocXml.lastIndexOf('<w:sectPr');
  const srcBodyEnd = srcSectStart > 0 ? srcSectStart : sourceDocXml.lastIndexOf('</w:body>');
  const generatedBody = sourceDocXml.slice(srcBodyStart, srcBodyEnd).trim();

  // 2. Extract template document.xml
  let templateDocXml = await templateZip.file('word/document.xml').async('string');

  // 2a. Substitute cover-page placeholders with our title/subtitle if provided
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

  // 3. Find cover page end — cut at the <w:sdt> that wraps the TOC.
  //    Cutting inside the SDT would break paragraph/sdt tag balance.
  const sdtStart = templateDocXml.indexOf('<w:sdt>');
  let coverEndIdx;
  if (sdtStart > 0) {
    coverEndIdx = sdtStart;
  } else {
    // Fall back: cut at the first page break's enclosing paragraph close
    const firstPageBreak = templateDocXml.indexOf('<w:br w:type="page"/>');
    if (firstPageBreak < 0) throw new Error('Template has no cover boundary marker');
    coverEndIdx = templateDocXml.indexOf('</w:p>', firstPageBreak) + '</w:p>'.length;
  }

  // Prepend a page-break paragraph so our content starts on a new page after the cover
  const pageBreakPara = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

  // 4. Find final <w:sectPr at document level (last one before </w:body>)
  const finalSectStart = templateDocXml.lastIndexOf('<w:sectPr');
  if (finalSectStart < coverEndIdx) throw new Error('Template has no final section properties');

  // 5. Build new document.xml = [cover + closing of cover paragraph] + [generated body] + [final sectPr + body close]
  const coverPart = templateDocXml.slice(0, coverEndIdx);
  const closingPart = templateDocXml.slice(finalSectStart); // includes <w:sectPr ...> through </w:document>
  const newDocXml = coverPart + '\n' + pageBreakPara + '\n' + generatedBody + '\n' + closingPart;

  // 6. Replace document.xml in the template zip
  templateZip.file('word/document.xml', newDocXml);

  // 6a. The template is a .dotx so [Content_Types].xml marks document.xml as
  //     wordprocessingml.template.main+xml. We're saving as .docx, so change it
  //     to wordprocessingml.document.main+xml — otherwise Word refuses to open it.
  {
    let ct = await templateZip.file('[Content_Types].xml').async('string');
    ct = ct.replace(
      'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml"',
      'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"'
    );
    templateZip.file('[Content_Types].xml', ct);
  }

  // 7. Merge any images from the source zip (in case future content has images) — skip for now, but preserve template's image1.jpg
  // (template zip already contains its own media; nothing to do)

  // 8. Also copy source's numbering.xml (for our bullet lists) if present
  const srcNumbering = sourceZip.file('word/numbering.xml');
  if (srcNumbering) {
    // Merge numbering definitions into template's numbering.xml if it exists, else add as new file.
    // Simple approach: replace template's numbering with source's (template doesn't define 'bullets' reference anyway).
    const srcNumXml = await srcNumbering.async('string');
    templateZip.file('word/numbering.xml', srcNumXml);
    // Ensure content types registers numbering
    let contentTypes = await templateZip.file('[Content_Types].xml').async('string');
    if (!contentTypes.includes('word/numbering.xml')) {
      contentTypes = contentTypes.replace(
        '</Types>',
        '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>'
      );
      templateZip.file('[Content_Types].xml', contentTypes);
    }
    // Ensure document.xml.rels references numbering
    let docRels = await templateZip.file('word/_rels/document.xml.rels').async('string');
    if (!docRels.includes('numbering.xml')) {
      docRels = docRels.replace(
        '</Relationships>',
        '<Relationship Id="rNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'
      );
      templateZip.file('word/_rels/document.xml.rels', docRels);
    }
  }

  // 8a. Strip all comments (the template contains resolved review comments we don't want to ship).
  await stripComments(templateZip);

  // 9. Generate the final .docx
  return await templateZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

/**
 * Remove all Word comment artifacts from a docx zip:
 *  - comment XML parts (comments.xml + extended/ids/extensible variants)
 *  - comment content-type overrides
 *  - comment relationships from document.xml.rels
 *  - comment range markers and references from document.xml
 */
export async function stripComments(zip) {
  const commentParts = [
    'word/comments.xml',
    'word/commentsExtended.xml',
    'word/commentsIds.xml',
    'word/commentsExtensible.xml'
  ];
  for (const p of commentParts) {
    if (zip.file(p)) zip.remove(p);
  }

  if (zip.file('[Content_Types].xml')) {
    let ct = await zip.file('[Content_Types].xml').async('string');
    ct = ct.replace(
      /<Override[^>]*wordprocessingml\.comments(Extended|Ids|Extensible)?\+xml"[^/]*\/>/g,
      ''
    );
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
