/**
 * Resolves project asset paths declared in src/data/projects.json to
 * actual Vite-processed asset URLs.
 *
 * The JSON declares paths such as "/images/projects/reservation-system/cover.png",
 * while the source assets live under src/assets/projects/. This module maps the
 * declared path to the real file via a build-time glob so that:
 *  - The JSON remains the single source of truth (paths are not duplicated or
 *    hardcoded in components).
 *  - Missing assets resolve to null and are handled gracefully by the UI.
 *  - No asset path is invented or silently substituted.
 */

const assetManifest = import.meta.glob('/src/assets/projects/**/*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  as: 'url',
});

/**
 * Map a JSON-declared asset path to its manifest key.
 * Tries the path as-is first, then converts a leading "/images/" prefix to
 * "/src/assets/" to match the real asset location.
 *
 * @param {string | undefined | null} jsonPath
 * @returns {string | null}
 */
function toManifestKey(jsonPath) {
  if (!jsonPath) return null;
  if (assetManifest[jsonPath]) return jsonPath;
  const converted = jsonPath.replace(/^\/images\//, '/src/assets/');
  if (assetManifest[converted]) return converted;
  return null;
}

/**
 * Resolve a JSON-declared asset path to a Vite asset URL, or null when the
 * referenced file does not exist.
 *
 * @param {string | undefined | null} jsonPath
 * @returns {string | null}
 */
export function resolveProjectAsset(jsonPath) {
  const key = toManifestKey(jsonPath);
  return key ? assetManifest[key] : null;
}
