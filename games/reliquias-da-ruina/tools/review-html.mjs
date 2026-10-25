// A named template entry keeps packaging explicit: fail if new external
// dependencies are added instead of silently producing an incomplete HTML.
export function assembleReviewHtml(template, code, css, notices = '') {
  const entry = /<script\b[^>]*\bid=["']application-entry["'][^>]*>[\s\S]*?<\/script\s*>/gi;
  if ([...template.matchAll(entry)].length !== 1) throw new Error('O HTML deve conter uma única application-entry');
  const remainder = template.replace(entry, '');
  if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel=["'](?:stylesheet|modulepreload)["']/i.test(remainder)) {
    throw new Error('Dependência externa adicional no template de revisão');
  }
  if ((template.match(/<\/head\s*>/gi) ?? []).length !== 1) throw new Error('Cabeçalho HTML inválido');
  const safeCode = code.replace(/<\/script/gi, match => match.replace('/', '\\/'));
  const safeCss = css.replace(/<\/style/gi, match => match.replace('/', '\\/'));
  // Match the original module entry's deferred startup. Running a classic
  // inline script while the document is still loading can race Phaser's boot.
  const bootstrap = `(() => {\nconst start = () => {\n${safeCode}\n};\nif (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });\nelse start();\n})();`;
  const html = template.replace(entry, () => `<script>${bootstrap}</script>`);
  const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; base-uri 'none'; form-action 'none'";
  return html.replace(/<\/head\s*>/i, () => `<meta http-equiv="Content-Security-Policy" content="${policy}" />\n<style>${safeCss}</style>\n<!-- Licenças incluídas no artefato:\n${notices.replaceAll('-->', '-- >')}\n-->\n</head>`);
}
