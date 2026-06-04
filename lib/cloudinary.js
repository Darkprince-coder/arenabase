/**
 * ARENABASE — Cloudinary Utilities
 * Builds optimised image URLs with on-the-fly transformations.
 * No npm package required on the client — URLs are constructed manually.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE       = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Build a Cloudinary transformation URL.
 *
 * @param {string|null} publicId  - Cloudinary public ID stored in DB
 * @param {object}      options   - Transformation options
 * @returns {string|null}         - Full CDN URL, or null if no publicId
 */
export function getImageUrl(publicId, options = {}) {
  if (!publicId) return null;

  const {
    width,
    height,
    crop     = 'fill',
    gravity  = 'auto',
    quality  = 'auto',
    format   = 'auto',
  } = options;

  const parts = [
    `f_${format}`,
    `q_${quality}`,
    width   ? `w_${width}`   : null,
    height  ? `h_${height}`  : null,
    (width || height) ? `c_${crop}`         : null,
    (width || height) ? `g_${gravity}`      : null,
  ].filter(Boolean);

  return `${BASE}/${parts.join(',')}/${publicId}`;
}

/**
 * NAMED PRESETS
 * One call per use-case — keeps transformation logic centralised.
 * Dimensions match the CSS slot each image fills.
 */
export const img = {
  /** 64×64 team logo in match cards */
  teamLogo:       (id) => getImageUrl(id, { width: 64,   height: 64  }),

  /** 128×128 team logo in tournament detail pages */
  teamLogoLarge:  (id) => getImageUrl(id, { width: 128,  height: 128 }),

  /** 800×320 tournament card thumbnail */
  tournamentCard: (id) => getImageUrl(id, { width: 800,  height: 320 }),

  /** 1200×420 tournament detail hero banner */
  tournamentBanner: (id) => getImageUrl(id, { width: 1200, height: 420 }),

  /** 1200×630 Open Graph / social share image */
  ogImage:        (id) => getImageUrl(id, { width: 1200, height: 630 }),
};
