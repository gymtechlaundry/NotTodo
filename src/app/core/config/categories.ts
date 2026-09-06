export const DEFAULT_CATEGORIES = [
  'Screen time',
  'Productivity',
  'Food & drink',
  'Spending',
  'Health',
] as const;

export const CATEGORY_MAX_LENGTH = 40;

export function normalizeCategory(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function isDefaultCategory(name: string): boolean {
  const normalized = normalizeCategory(name).toLowerCase();
  return DEFAULT_CATEGORIES.some((category) => category.toLowerCase() === normalized);
}
