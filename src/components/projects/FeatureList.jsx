/**
 * @typedef {{ title: string, description: string }} ProjectFeature
 */

/**
 * Renders the project's key features as a restrained two-column grid.
 *
 * @param {{ features: ProjectFeature[] }} props
 */
export default function FeatureList({ features }) {
  if (!Array.isArray(features) || features.length === 0) {
    return null;
  }

  return (
    <div className="project-feature-grid">
      {features.map((feature, index) => (
        <article key={feature.title || index} className="project-feature-item">
          <h3 className="project-feature-title">{feature.title}</h3>
          {feature.description && (
            <p className="project-feature-description">{feature.description}</p>
          )}
        </article>
      ))}
    </div>
  );
}
