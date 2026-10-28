import { Article } from '../types';

export type AdminViewRoute =
  | 'articles'
  | 'create'
  | 'editor'
  | 'edit'
  | 'courses'
  | 'quizzes'
  | 'analytics';

/**
 * Builds canonical route paths for the main website & integrated blog editor.
 */
export function buildAdminRoute(view: AdminViewRoute, articleId?: string): string {
  switch (view) {
    case 'articles':
      return '/admin/articles';
    case 'create':
      return '/admin/articles/create';
    case 'editor':
      return '/admin/articles/editor';
    case 'edit':
      return articleId
        ? `/admin/articles/edit/${encodeURIComponent(articleId)}`
        : '/admin/articles/create';
    case 'courses':
      return '/admin/courses';
    case 'quizzes':
      return '/admin/quizzes';
    case 'analytics':
      return '/admin/analytics';
    default:
      return '/admin/articles';
  }
}

/**
 * Creates a clean default Article draft object for /admin/articles/create.
 */
export function createDefaultArticleDraft(language: string = 'English', customId?: string): Article {
  const timestamp = Date.now();
  const id = customId || `article-${timestamp}`;
  const today = new Date().toISOString().split('T')[0];

  return {
    id,
    title: 'Untitled Educational Article',
    subtitle: 'Add a brief summary or subtitle for your students...',
    category: 'Theory Notes',
    status: 'Draft',
    contentHtml:
      '<h2>1. Key Topic Overview</h2><p>Start writing your educational article content here. Use the formatting toolbar above to add bold text, bullet points, callout notes, and interactive quizzes.</p><h2>2. Core Concepts &amp; Definitions</h2><p>Explain fundamental principles, constitutional provisions, or mathematical derivations clearly for exam aspirants.</p>',
    contentText:
      '1. Key Topic Overview Start writing your educational article content here. 2. Core Concepts & Definitions Explain fundamental principles clearly for exam aspirants.',
    author: 'Prof. A. K. Sharma',
    language,
    createdAt: today,
    updatedAt: today,
    viewsCount: 0,
    readTimeMinutes: 3,
    lucidThemeId: 'indigo',
    seo: {
      metaTitle: 'Untitled Educational Article | Study Notes',
      metaDescription: 'Comprehensive educational notes and study guide for students.',
      keywords: ['Notes', 'Study Guide', 'Education'],
      canonicalSlug: id,
      targetAudience: 'Students & Competitive Exam Aspirants',
      seoScore: 82,
      tips: ['Add target keywords in H2 headings', 'Include a clear meta description'],
    },
    attachedCourseIds: [],
    versionHistory: [],
  };
}

/**
 * Normalizes an Article payload before sending to /api/articles.
 */
export function prepareArticlePayload(
  article: Article,
  overrideStatus?: 'Draft' | 'Published'
): Article {
  const plainText = (article.contentText || article.contentHtml.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;

  return {
    ...article,
    title: (article.title || 'Untitled Educational Article').trim(),
    status: overrideStatus || article.status || 'Draft',
    contentText: plainText,
    updatedAt: new Date().toISOString().split('T')[0],
    readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
  };
}

export interface ArticleApiResult {
  ok: boolean;
  article: Article;
  message: string;
}

/**
 * Standard fetch handler to Save (POST /api/articles) or Update (PUT /api/articles/:id) an article.
 */
export async function saveOrUpdateArticleApi(
  article: Article,
  options: { isCreateMode?: boolean; publishUpdate?: boolean } = {}
): Promise<ArticleApiResult> {
  const payload = prepareArticlePayload(
    article,
    options.publishUpdate ? 'Published' : undefined
  );

  const endpoint = options.isCreateMode
    ? '/api/articles'
    : `/api/articles/${encodeURIComponent(payload.id)}`;
  const method = options.isCreateMode ? 'POST' : 'PUT';

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error (${response.status}): Failed to ${method} ${endpoint}`);
  }

  const data = await response.json();
  return {
    ok: true,
    article: data.article || payload,
    message:
      data.message ||
      (options.publishUpdate
        ? 'Article updated and published successfully!'
        : 'Article draft saved successfully!'),
  };
}
