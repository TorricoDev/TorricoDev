import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { assembleReviewHtml } from '../tools/review-html.mjs';

const template = '<html><head></head><body><script id="application-entry" type="module" src="/src/main.js"></script></body></html>';

test('review HTML embeds script, CSS, licenses and an offline resource policy', () => {
  const html = assembleReviewHtml(template, 'globalThis.ready = true;', 'canvas{image-rendering:pixelated}', 'MIT notice');
  assert.match(html, /globalThis.ready = true;/);
  assert.match(html, /<style>canvas\{image-rendering:pixelated\}<\/style>/);
  assert.match(html, /MIT notice/);
  assert.match(html, /default-src 'none'/);
  assert.doesNotMatch(html, /src="\/src\/main.js"|type="module"/);
});
test('review packaging fails if its explicit entry or head is missing/duplicated', () => {
  for (const html of [template.replace('application-entry', 'other'), template + template, template.replace('</head>', '')]) {
    assert.throws(() => assembleReviewHtml(html, '', ''));
  }
});
test('additional external script/style references cannot be silently omitted', () => {
  for (const tag of ['<script src="extra.js"></script>', '<link rel="stylesheet" href="extra.css">', '<link rel="modulepreload" href="chunk.js">']) {
    assert.throws(() => assembleReviewHtml(template.replace('</head>', `${tag}</head>`), '', ''), /externa/);
  }
});
test('embedded closing tags cannot terminate script/style or a license comment', () => {
  const value = '</ScRiPt><p>text</p>';
  const html = assembleReviewHtml(template, `globalThis.sample = ${JSON.stringify(value)};`, 'p::after{content:"</style>"}', '-->');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context = { document: { readyState: 'complete' } };
  runInNewContext(script, context);
  assert.equal(context.sample, value);
  assert.equal((html.match(/<\/style>/gi) ?? []).length, 1);
  assert.match(html, /-- >/);
});

test('review startup waits for the document before creating the Phaser game', () => {
  const html = assembleReviewHtml(template, 'globalThis.started = true;', '');
  let start;
  const context = { document: { readyState: 'loading', addEventListener(event, callback, options) {
    assert.equal(event, 'DOMContentLoaded');
    assert.equal(options.once, true);
    start = callback;
  } } };
  runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  assert.equal(context.started, undefined);
  start();
  assert.equal(context.started, true);
});
