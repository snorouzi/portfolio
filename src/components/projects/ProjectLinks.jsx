const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

const LINK_LABELS = {
  repository: 'Source Code',
  demo: 'View Demo',
  liveProject: 'Visit Live Project',
  documentation: 'Documentation',
};

/**
 * Validates that a URL is safe to render as a link.
 *
 * @param {string | undefined | null} value
 * @returns {boolean}
 */
function isValidUrl(value) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Renders valid project links. Missing, null, or malformed URLs are omitted.
 *
 * @param {{ links: Record<string, string | null> }} props
 */
export default function ProjectLinks({ links }) {
  if (!links || typeof links !== 'object') return null;

  const valid = Object.entries(links)
    .filter(([key, value]) => key in LINK_LABELS && isValidUrl(value))
    .map(([key, value]) => ({
      key,
      label: LINK_LABELS[key],
      href: (value || '').trim(),
    }));

  if (valid.length === 0) {
    return null;
  }

  return (
    <div className="project-links">
      {valid.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-link hero-link-secondary project-link"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
