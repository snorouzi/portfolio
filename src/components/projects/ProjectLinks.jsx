const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

const LINK_LABELS = {
  repository: 'Source Code',
  demo: 'View Demo',
  liveProject: 'Visit Live Project',
  documentation: 'Documentation',
};

const LINK_DETAILS = {
  repository: 'Browse the project repository',
  demo: 'Explore an interactive demo',
  liveProject: 'Open the deployed project',
  documentation: 'Read the project documentation',
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
          className="project-link"
          aria-label={`${link.label}: ${link.href} (opens in a new tab)`}
        >
          <span className="project-link-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              {link.key === 'repository' ? (
                <>
                  <path d="M8 5.5 3.5 8l4.5 2.5M16 5.5 20.5 8 16 10.5M14 4l-4 8" />
                  <path d="M5 13.5v3L12 20l7-3.5v-3" />
                </>
              ) : link.key === 'documentation' ? (
                <>
                  <path d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
                  <path d="M14 4v4h4M9 12h6M9 15.5h6" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="8.25" />
                  <path d="M3.9 12h16.2M12 3.75a13 13 0 0 1 0 16.5 13 13 0 0 1 0-16.5Z" />
                </>
              )}
            </svg>
          </span>
          <span className="project-link-copy">
            <span className="project-link-label">{link.label}</span>
            <span className="project-link-detail">{LINK_DETAILS[link.key]}</span>
          </span>
          <svg className="project-link-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6 14 14 6M6.5 6H14v7.5" />
          </svg>
        </a>
      ))}
    </div>
  );
}
