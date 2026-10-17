import { resolveProjectAsset } from '../../lib/assets';

const GALLERY_TYPE_LABELS = {
  screenshot: 'Screenshot',
  architecture: 'Architecture',
  diagram: 'Diagram',
  other: 'Image',
};

/**
 * Resolves a gallery entry's asset URL, skipping entries that duplicate the
 * project's cover or architecture image (already displayed above).
 *
 * @param {{ src?: string }} entry
 * @param {string | undefined} cardImage
 * @param {string | undefined} archImage
 * @returns {string | null}
 */
function resolveGalleryAsset(entry, cardImage, archImage) {
  const src = entry.src;
  if (!src) return null;

  // Skip duplicates of the cover or architecture images already rendered.
  if (src === cardImage || src === archImage) {
    return null;
  }

  return resolveProjectAsset(src);
}

/**
 * Renders the project gallery as a responsive grid.
 *
 * @param {{
 *   gallery: Array<{
 *     type?: string,
 *     src?: string,
 *     alt?: string,
 *     caption?: string
 *   }>,
 *   cardImage?: string,
 *   archImage?: string
 * }} props
 */
export default function Gallery({ gallery, cardImage, archImage, onImageClick, imageRefs }) {
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return null;
  }

  const entries = gallery
    .map((entry) => ({
      ...entry,
      assetUrl: resolveGalleryAsset(entry, cardImage, archImage),
    }))
    .filter((entry) => entry.assetUrl);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="project-gallery">
      {entries.map((entry, index) => {
        const typeLabel = GALLERY_TYPE_LABELS[entry.type] || GALLERY_TYPE_LABELS.other;
        const alt = entry.alt?.trim() || `${typeLabel} ${index + 1}`;
        const key = entry.src || index;

        return (
          <figure key={key} className="project-gallery-item">
            <button
              type="button"
              className="project-gallery-item-button image-lightbox-trigger"
              ref={(el) => {
                if (imageRefs && entry.src) {
                  imageRefs.current[entry.src] = el;
                }
              }}
              onClick={() => {
                if (onImageClick) {
                  onImageClick(entry.src, alt);
                }
              }}
              aria-label="View gallery image in full size"
            >
              <img
                src={entry.assetUrl}
                alt={alt}
                loading="lazy"
                decoding="async"
                width="1200"
                height="800"
              />
            </button>
            <figcaption className="project-gallery-caption">
              <span className="project-gallery-type">{typeLabel}</span>
              {entry.caption && (
                <span className="project-gallery-caption-text">{entry.caption}</span>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
