/**
 * Blocked Intellectual Property and Trademark Terms.
 * Used by build-time verification script (npm run check:ip) and content validators.
 */

export const BLOCKED_TERMS: readonly string[] = [
  'marvel',
  'iron man',
  'arc reactor',
  'gta',
  'vice city',
  'avengers',
  'disney',
  'pokemon',
  'nintendo',
] as const;

/**
 * Returns true if the given text contains any of the blocked terms (case-insensitive word boundary check).
 */
export function containsBlockedTerm(text: string): { matched: boolean; terms: string[] } {
  if (!text) return { matched: false, terms: [] };
  const lower = text.toLowerCase();
  const matched = BLOCKED_TERMS.filter((term) => {
    // Escape special regex characters in term if any
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match whole words or phrase boundaries
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lower);
  });
  return {
    matched: matched.length > 0,
    terms: matched,
  };
}
