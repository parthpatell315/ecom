/**
 * Social media links configuration.
 * Render an icon ONLY if a real URL is set (non-empty string).
 */

export const SOCIALS = {
  instagram: 'https://www.instagram.com/flirtabywhitelayer',
  facebook: '',
  youtube: '',
  whatsapp: 'https://wa.me/917600409399',
} as const;

export type SocialKey = keyof typeof SOCIALS;
