/**
 * Generate a URL-friendly slug from offer name and external ID.
 * Ensures uniqueness by appending the external ID.
 *
 * @param name - Offer name
 * @param externalId - External offer ID
 * @returns Lowercase slug with hyphens (e.g., "my-gym-ios-19524555")
 */
export function generateSlug(name: string, externalId: string): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens

  return `${baseSlug}-${externalId}`;
}
