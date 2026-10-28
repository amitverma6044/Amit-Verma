export interface TocItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
  sectionIndex: number;
}

export interface TocSection {
  id: string;
  headingText: string;
  level: 'h2' | 'h3';
  html: string;
}

export interface ParsedTocDocument {
  preambleHtml: string;
  sections: TocSection[];
}

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * Strips HTML tags and normalizes whitespace to plain text.
 */
export function stripHtmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits an HTML fragment into top-level blocks (preserving preceding HTML comments with the element that follows).
 */
export function splitTopLevelHtmlBlocks(html: string): string[] {
  if (!html || !html.trim()) return [];

  const blocks: string[] = [];
  const len = html.length;
  let i = 0;
  let depth = 0;
  let blockStart = -1;

  while (i < len) {
    // Skip leading whitespace when between top-level blocks
    if (depth === 0 && blockStart === -1) {
      while (i < len && /\s/.test(html[i])) {
        i++;
      }
      if (i >= len) break;
      blockStart = i;
    }

    if (html.startsWith('<!--', i)) {
      const commentEnd = html.indexOf('-->', i + 4);
      if (commentEnd === -1) {
        i = len;
      } else {
        i = commentEnd + 3;
      }
      // Keep comment attached to the upcoming top-level element when at depth 0
      continue;
    }

    if (html[i] === '<') {
      const tagEnd = html.indexOf('>', i + 1);
      if (tagEnd === -1) {
        i = len;
        break;
      }

      const rawTag = html.slice(i + 1, tagEnd).trim();
      const isClosing = rawTag.startsWith('/');
      const isSelfClosing = rawTag.endsWith('/') || rawTag.startsWith('!');
      const tagNameMatch = rawTag.replace(/^\//, '').match(/^([a-zA-Z0-9-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';

      if (tagName && !rawTag.startsWith('!')) {
        if (isClosing) {
          depth = Math.max(0, depth - 1);
        } else if (!isSelfClosing && !VOID_TAGS.has(tagName)) {
          depth++;
        }
      }

      i = tagEnd + 1;

      if (depth === 0 && blockStart !== -1) {
        const chunk = html.slice(blockStart, i).trim();
        // Only push if the chunk contains an actual element (not just a comment)
        const withoutComments = chunk.replace(/<!--[\s\S]*?-->/g, '').trim();
        if (withoutComments.length > 0) {
          blocks.push(chunk);
          blockStart = -1;
        }
      }
    } else {
      i++;
      // Handle bare top-level text nodes if they precedes a tag at depth 0
      if (depth === 0 && i < len && html[i] === '<' && !html.startsWith('<!--', i)) {
        const chunk = html.slice(blockStart, i).trim();
        const withoutComments = chunk.replace(/<!--[\s\S]*?-->/g, '').trim();
        if (withoutComments.length > 0) {
          blocks.push(chunk);
          blockStart = -1;
        }
      }
    }
  }

  if (blockStart !== -1 && blockStart < len) {
    const trailing = html.slice(blockStart).trim();
    if (trailing) {
      if (blocks.length > 0 && /^<!--[\s\S]*-->$/.test(trailing)) {
        blocks[blocks.length - 1] += '\n' + trailing;
      } else {
        blocks.push(trailing);
      }
    }
  }

  return blocks;
}

/**
 * Extracts the first H2 or H3 heading info from a top-level HTML block, if present.
 */
function extractHeadingFromBlock(blockHtml: string): { level: 'h2' | 'h3'; text: string } | null {
  const match = blockHtml.match(/<(h[23])\b[^>]*>([\s\S]*?)<\/\1>/i);
  if (!match) return null;
  const level = match[1].toLowerCase() as 'h2' | 'h3';
  const text = stripHtmlToText(match[2]);
  if (!text) return null;
  return { level, text };
}

/**
 * Parses an article HTML string into a preamble (content before the first H2/H3)
 * and an ordered array of sections (each starting with an H2/H3 block and including
 * all subsequent non-heading blocks until the next H2/H3 block).
 */
export function parseTocDocument(contentHtml: string): ParsedTocDocument {
  const topBlocks = splitTopLevelHtmlBlocks(contentHtml);
  const preambleBlocks: string[] = [];
  const sections: TocSection[] = [];

  for (const block of topBlocks) {
    const heading = extractHeadingFromBlock(block);
    if (heading) {
      sections.push({
        id: `toc-heading-${sections.length}`,
        headingText: heading.text,
        level: heading.level,
        html: block,
      });
    } else {
      if (sections.length === 0) {
        preambleBlocks.push(block);
      } else {
        sections[sections.length - 1].html += '\n\n' + block;
      }
    }
  }

  return {
    preambleHtml: preambleBlocks.join('\n\n'),
    sections,
  };
}

/**
 * Returns the list of TocItems for rendering in the Table of Contents sidebar.
 */
export function parseHeadingsFromHtml(contentHtml: string): TocItem[] {
  const { sections } = parseTocDocument(contentHtml);
  return sections.map((sec, idx) => ({
    id: `toc-heading-${idx}`,
    text: sec.headingText,
    level: sec.level,
    sectionIndex: idx,
  }));
}

/**
 * Reorders a section from `fromIndex` to `toIndex` and reconstructs both the updated
 * HTML string and plain text representation of the document.
 */
export function reorderTocSections(
  contentHtml: string,
  fromIndex: number,
  toIndex: number
): { contentHtml: string; contentText: string; sections: TocSection[] } {
  const parsed = parseTocDocument(contentHtml);
  const total = parsed.sections.length;

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= total ||
    toIndex >= total ||
    fromIndex === toIndex
  ) {
    return {
      contentHtml,
      contentText: stripHtmlToText(contentHtml),
      sections: parsed.sections,
    };
  }

  const reordered = [...parsed.sections];
  const [movedSection] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedSection);

  // Re-index section IDs after reordering
  const normalizedSections = reordered.map((sec, idx) => ({
    ...sec,
    id: `toc-heading-${idx}`,
  }));

  const parts: string[] = [];
  if (parsed.preambleHtml.trim()) {
    parts.push(parsed.preambleHtml.trim());
  }
  for (const sec of normalizedSections) {
    parts.push(sec.html.trim());
  }

  const updatedHtml = parts.join('\n\n');
  const updatedText = stripHtmlToText(updatedHtml);

  return {
    contentHtml: updatedHtml,
    contentText: updatedText,
    sections: normalizedSections,
  };
}
