import katex from 'katex';

/**
 * Renders raw text or HTML containing LaTeX formulas ($...$ or $$...$$) into HTML with KaTeX formulas rendered.
 */
export function renderMathInText(inputText: string): string {
  if (!inputText) return '';

  // 1. Process block math formulas: $$ formula $$
  let processed = inputText.replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, (match, formula) => {
    try {
      return `<div class="katex-block-formula my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center overflow-x-auto selection:bg-indigo-100" contenteditable="false">${katex.renderToString(
        formula.trim(),
        { displayMode: true, throwOnError: false }
      )}</div>`;
    } catch (e) {
      console.error('KaTeX block error:', e);
      return `<code class="text-rose-600 bg-rose-50 px-2 py-1 rounded font-mono text-xs">${formula}</code>`;
    }
  });

  // 2. Process inline math formulas: $ formula $
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    try {
      return `<span class="katex-inline-formula inline-block px-1 py-0.5 bg-indigo-50/60 rounded text-slate-900" contenteditable="false">${katex.renderToString(
        formula.trim(),
        { displayMode: false, throwOnError: false }
      )}</span>`;
    } catch (e) {
      console.error('KaTeX inline error:', e);
      return `<code class="text-indigo-600 font-mono text-xs">${formula}</code>`;
    }
  });

  return processed;
}

/**
 * Render a single LaTeX string safely to HTML using KaTeX
 */
export function renderSingleFormula(formula: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch (e) {
    return formula;
  }
}

/**
 * Popular Math & Science Formula Templates for Quick Insertion
 */
export const MATH_FORMULA_TEMPLATES = [
  {
    name: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Roots of quadratic equation ax² + bx + c = 0',
  },
  {
    name: 'Einstein Mass-Energy',
    category: 'Physics',
    latex: 'E = mc^2',
    description: 'Mass-energy equivalence principle',
  },
  {
    name: 'Pythagorean Theorem',
    category: 'Geometry',
    latex: 'a^2 + b^2 = c^2',
    description: 'Right-angled triangle side relationship',
  },
  {
    name: 'Definite Integral',
    category: 'Calculus',
    latex: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)',
    description: 'Fundamental Theorem of Calculus',
  },
  {
    name: 'Limit Definition',
    category: 'Calculus',
    latex: '\\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0} = f\'(x_0)',
    description: 'Derivative limit definition',
  },
  {
    name: 'Euler\'s Identity',
    category: 'Analysis',
    latex: 'e^{i\\pi} + 1 = 0',
    description: 'Relationship between e, pi, and imaginary unit i',
  },
  {
    name: 'Normal Gaussian Distribution',
    category: 'Statistics',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}',
    description: 'Probability density function of normal distribution',
  },
  {
    name: 'Chemical Reaction Balance',
    category: 'Chemistry',
    latex: '2\\text{H}_2 + \\text{O}_2 \\xrightarrow{\\Delta} 2\\text{H}_2\\text{O}',
    description: 'Hydrogen combustion to water',
  },
  {
    name: 'Summation Series',
    category: 'Algebra',
    latex: '\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}',
    description: 'Sum of first n natural numbers',
  },
  {
    name: 'Matrix Multiplication',
    category: 'Linear Algebra',
    latex: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\det(A) = ad - bc',
    description: '2x2 Matrix Determinant',
  },
];
