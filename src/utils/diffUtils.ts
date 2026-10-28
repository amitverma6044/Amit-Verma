export interface DiffToken {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

/**
 * Clean HTML markup to plain text for comparison
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes word-by-word diff between old text and new text
 */
export function computeWordDiff(oldHtml: string, newHtml: string): DiffToken[] {
  const oldText = stripHtml(oldHtml);
  const newText = stripHtml(newHtml);

  const oldWords = oldText ? oldText.split(' ') : [];
  const newWords = newText ? newText.split(' ') : [];

  const matrix: number[][] = Array(oldWords.length + 1)
    .fill(0)
    .map(() => Array(newWords.length + 1).fill(0));

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const result: DiffToken[] = [];
  let i = oldWords.length;
  let j = newWords.length;

  const stack: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      stack.push({ type: 'unchanged', value: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      stack.push({ type: 'added', value: newWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      stack.push({ type: 'removed', value: oldWords[i - 1] });
      i--;
    }
  }

  stack.reverse();

  // Group tokens for smoother display
  const grouped: DiffToken[] = [];
  for (const token of stack) {
    if (grouped.length > 0 && grouped[grouped.length - 1].type === token.type) {
      grouped[grouped.length - 1].value += ' ' + token.value;
    } else {
      grouped.push({ ...token });
    }
  }

  return grouped;
}
