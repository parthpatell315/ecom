/**
 * Media Configuration & Asset Rights Check
 */

export const MEDIA_CONFIG = {
  // Video slot fallback / demonstration video for floating pieces
  DEFAULT_FLOATING_VIDEO: '/video/levitating-lamp-demo.mp4',
  DEFAULT_VIDEO_POSTER: 'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/1_db327666-880c-4ef7-b353-8fa5a7e651eb.webp?v=1791796010',

  // Dev warning pattern for marketplace stock photo filenames (e.g. Etsy il_1588xN)
  STOCK_IMAGE_PATTERN: /^il_\d+x/i,
} as const;

/**
 * Checks an image URL or filename against marketplace stock naming patterns.
 * In development, warns when an asset needs replacement with studio-owned photography.
 */
export function checkImageRights(urlOrPath: string): void {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    const filename = urlOrPath.split('/').pop()?.split('?')[0] || '';
    if (MEDIA_CONFIG.STOCK_IMAGE_PATTERN.test(filename)) {
      console.warn(
        `[MEDIA RIGHTS WARNING] Image "${filename}" matches marketplace naming pattern (/^il_\\d+x/). Replace with proprietary studio-shot photography before scaling ad spend.`
      );
    }
  }
}
