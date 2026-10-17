/**
 * @typedef {Object} ProjectPeriod
 * @property {string} start
 * @property {string} end
 */

/**
 * @typedef {Object} ProjectCard
 * @property {string} image
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} tagline
 * @property {string} description
 * @property {boolean} featured
 * @property {string} visibility
 * @property {string} role
 * @property {string} organization
 * @property {ProjectPeriod} period
 * @property {string[]} technologies
 * @property {ProjectCard} card
 * @property {Object} details
 * @property {Object} links
 */

/**
 * Returns the featured projects from the data file, preserving their declared
 * order, capped at three.
 *
 * @param {Project[]} projects
 * @returns {Project[]}
 */
export function getFeaturedProjects(projects) {
  return projects.filter((project) => project.featured === true).slice(0, 3);
}
