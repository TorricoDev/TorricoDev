// Reserved test-only origin; Playwright fulfills it in memory. It is NOT a
// preview URL, a real host, or an address to offer to a user.
export const REVIEW_ORIGIN = 'https://reliquias-review.invalid';
export const REVIEW_DOCUMENT = `${REVIEW_ORIGIN}/reliquias-da-ruina.html`;

export function entryURL(search = '') {
  if (!process.env.GAME_TEST_FILE) return `/${search}`;
  const url = new URL(REVIEW_DOCUMENT);
  url.search = search;
  return url.href;
}
