export function integerScale(availableWidth, availableHeight, width = 320, height = 180) {
  // Below 1× retain original pixels; the viewport scrolls instead of shrinking.
  return Math.max(1, Math.floor(Math.min(availableWidth / width, availableHeight / height)));
}
