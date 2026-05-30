/**
 * Authoring helper ONLY — generates a *suggested* slug when adding a new
 * content entry. Slugs are stored explicitly on every item (the WordPress
 * model) and read at render time; they are NEVER derived from titles in the UI.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’.]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
