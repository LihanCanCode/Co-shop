/**
 * Deterministic, offline product artwork. Using inline SVG data URIs (instead of an
 * external image CDN) keeps the storefront demo-reliable with zero network dependency.
 */
const PALETTE = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#4338ca",
  "#65a30d",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLabel(label: string, maxCharsPerLine = 14): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function productImage(seed: string, label: string): string {
  const hash = hashString(seed);
  const color = PALETTE[hash % PALETTE.length];
  const colorB = PALETTE[(hash >> 3) % PALETTE.length];
  const gradId = `g${hash % 100000}`;
  const lines = wrapLabel(label);
  const lineHeight = 26;
  const startY = 150 - ((lines.length - 1) * lineHeight) / 2;
  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="150" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" role="img" aria-label="${escapeXml(
    label
  )}"><defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${colorB}"/></linearGradient></defs><rect width="300" height="300" rx="20" fill="url(#${gradId})"/><circle cx="245" cy="55" r="90" fill="white" opacity="0.06"/><circle cx="40" cy="260" r="70" fill="black" opacity="0.08"/><text text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="white">${tspans}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
