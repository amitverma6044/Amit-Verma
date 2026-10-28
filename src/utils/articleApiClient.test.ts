import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAdminRoute,
  createDefaultArticleDraft,
  prepareArticlePayload,
} from './articleApiClient';

test('buildAdminRoute generates canonical routes for articles dashboard and editor', () => {
  assert.equal(buildAdminRoute('articles'), '/admin/articles');
  assert.equal(buildAdminRoute('create'), '/admin/articles/create');
  assert.equal(buildAdminRoute('editor'), '/admin/articles/editor');
  assert.equal(buildAdminRoute('edit', 'art-101'), '/admin/articles/edit/art-101');
  assert.equal(buildAdminRoute('edit'), '/admin/articles/create');
  assert.equal(buildAdminRoute('courses'), '/admin/courses');
  assert.equal(buildAdminRoute('quizzes'), '/admin/quizzes');
  assert.equal(buildAdminRoute('analytics'), '/admin/analytics');
});

test('createDefaultArticleDraft creates a valid draft article with default sections and SEO', () => {
  const draft = createDefaultArticleDraft('English', 'article-test-99');
  assert.equal(draft.id, 'article-test-99');
  assert.equal(draft.status, 'Draft');
  assert.equal(draft.language, 'English');
  assert.ok(draft.contentHtml.includes('<h2>1. Key Topic Overview</h2>'));
  assert.equal(draft.seo.canonicalSlug, 'article-test-99');
});

test('prepareArticlePayload normalizes text, readTimeMinutes, and status override', () => {
  const draft = createDefaultArticleDraft('English', 'article-test-100');
  const updated = prepareArticlePayload(
    {
      ...draft,
      title: '  Constitutional Remedies Article 32  ',
      contentHtml: '<h2>Intro</h2><p>Five writs explained in detail for students.</p>',
      contentText: '',
    },
    'Published'
  );

  assert.equal(updated.title, 'Constitutional Remedies Article 32');
  assert.equal(updated.status, 'Published');
  assert.ok(updated.contentText.includes('Five writs explained in detail'));
  assert.equal(updated.readTimeMinutes, 1);
});
