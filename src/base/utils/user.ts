/**
 * Generates user initials from a full name (e.g. "Tan Loc" -> "TL", "Nguyen Van A" -> "NA", "Loc" -> "LO").
 */
export function getUserInitials(name?: string | null): string {
  if (!name) return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
