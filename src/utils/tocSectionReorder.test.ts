import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseHeadingsFromHtml,
  parseTocDocument,
  reorderTocSections,
} from './tocSectionReorder';

const SAMPLE_ARTICLE_HTML = `
  <p>Lead intro paragraph before any headings.</p>
  <h2>Introduction to Distributed System Architecture</h2>
  <p>Building high-throughput, low-latency web services requires robust load distribution.</p>
  <div class="callout-box">
    <h4>Key Principle</h4>
    <p>Consistent Hashing minimizes key remapping.</p>
  </div>
  <!-- Educator Card -->
  <div class="colorful-educator-card">
    <h3>Prof. Aman Sharma</h3>
    <p>Head of Computer Science Curriculum</p>
  </div>
  <h3>Core Components of Scalable Systems</h3>
  <ol>
    <li>Consistent Hash Ring</li>
    <li>API Gateway</li>
  </ol>
  <div class="colorful-section">
    <h3>Recommended Educational Articles</h3>
    <p>Explore curated study guides.</p>
  </div>
`;

test('parseHeadingsFromHtml extracts all H2 and H3 headings in document order', () => {
  const items = parseHeadingsFromHtml(SAMPLE_ARTICLE_HTML);
  assert.equal(items.length, 4);
  assert.deepEqual(
    items.map((i) => ({ text: i.text, level: i.level, sectionIndex: i.sectionIndex })),
    [
      { text: 'Introduction to Distributed System Architecture', level: 'h2', sectionIndex: 0 },
      { text: 'Prof. Aman Sharma', level: 'h3', sectionIndex: 1 },
      { text: 'Core Components of Scalable Systems', level: 'h3', sectionIndex: 2 },
      { text: 'Recommended Educational Articles', level: 'h3', sectionIndex: 3 },
    ]
  );
});

test('parseTocDocument preserves preamble and attaches section body elements to their heading', () => {
  const doc = parseTocDocument(SAMPLE_ARTICLE_HTML);
  assert.match(doc.preambleHtml, /Lead intro paragraph before any headings/);
  assert.equal(doc.sections.length, 4);
  // Section 0 includes both the H2, the paragraph, and the callout box
  assert.match(doc.sections[0].html, /Introduction to Distributed System Architecture/);
  assert.match(doc.sections[0].html, /Consistent Hashing minimizes key remapping/);
  // Section 2 includes both the H3 and the ordered list
  assert.match(doc.sections[2].html, /Core Components of Scalable Systems/);
  assert.match(doc.sections[2].html, /Consistent Hash Ring/);
});

test('reorderTocSections moves a section and its content to the target position', () => {
  // Move index 2 ("Core Components of Scalable Systems") to index 0 (top section)
  const result = reorderTocSections(SAMPLE_ARTICLE_HTML, 2, 0);
  const newHeadings = parseHeadingsFromHtml(result.contentHtml);

  assert.deepEqual(
    newHeadings.map((h) => h.text),
    [
      'Core Components of Scalable Systems',
      'Introduction to Distributed System Architecture',
      'Prof. Aman Sharma',
      'Recommended Educational Articles',
    ]
  );

  // Preamble remains at the very beginning of the document
  assert.ok(
    result.contentHtml.indexOf('Lead intro paragraph') <
      result.contentHtml.indexOf('Core Components of Scalable Systems')
  );

  // The <ol> belonging to "Core Components of Scalable Systems" moved along with its heading
  assert.ok(
    result.contentHtml.indexOf('Consistent Hash Ring') <
      result.contentHtml.indexOf('Introduction to Distributed System Architecture')
  );
});

test('reorderTocSections handles out-of-bounds or no-op indices safely', () => {
  const same = reorderTocSections(SAMPLE_ARTICLE_HTML, 1, 1);
  assert.equal(same.contentHtml, SAMPLE_ARTICLE_HTML);

  const invalid = reorderTocSections(SAMPLE_ARTICLE_HTML, -1, 5);
  assert.equal(invalid.contentHtml, SAMPLE_ARTICLE_HTML);
});
