export const DISCOUNT_CODES: Record<string, number> = {
  WEBMCP10: 0.1,
  AGENT15: 0.15,
};

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

export function discountPercentFor(code: string | undefined): number {
  if (!code) return 0;
  return DISCOUNT_CODES[normalizeDiscountCode(code)] ?? 0;
}
