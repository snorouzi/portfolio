import { Link } from 'react-router-dom';
import { resolveProjectAsset } from '../../lib/assets';

const MAX_TECHNOLOGIES = 4;

/**
 * Renders the technology tag list for a project.
 *
 * @param {{ project: import('../../lib/projectTypes').Project }} props
 */
export function ProjectTechTags({ project }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const visible = technologies.slice(0, MAX_TECHNOLOGIES);
  const remaining = technologies.length - visible.length;

  return (
    <ul className="project-tech-list" aria-label="Technologies">
      {visible.map((tech) => (
        <li key={tech} className="project-tech-tag">
          {tech}
        </li>
      ))}
      {remaining > 0 && (
        <li className="project-tech-tag project-tech-tag-more" aria-label={`${remaining} more`}>
          +{remaining}
        </li>
      )}
    </ul>
  );
}

/**
 * Renders the project card image with a graceful fallback when the asset is
 * missing or fails to load.
 *
 * @param {{ project: import('../../lib/projectTypes').Project, className?: string }} props
 */
export function ProjectCardImage({ project, className }) {
  const assetUrl = resolveProjectAsset(project.card?.image);
  const alt = project.card?.imageAlt?.trim() || `${project.title} cover`;
  const containerClassName = ['project-card-image', className].filter(Boolean).join(' ');

  if (!assetUrl) {
    return (
      <div
        className={[containerClassName, 'project-card-image-fallback'].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      >
        <span className="visually-hidden">{alt}</span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img src={assetUrl} alt={alt} loading="lazy" decoding="async" width="800" height="450" />
    </div>
  );
}

/**
 * A single, reusable project card. Renders the image, title, short description,
 * and technology tags, and links to the project detail page.
 *
 * @param {{ project: import('../../lib/projectTypes').Project }} props
 */
export default function ProjectCard({ project }) {
  const description = project.tagline?.trim() || project.description?.trim() || '';

  return (
    <article className="project-card">
      <ProjectCardImage project={project} />

      <div className="project-card-body">
        <h3 className="project-card-title">
          <Link to={`/projects/${project.slug}`} className="project-card-link">
            {project.title}
          </Link>
        </h3>

        {description && <p className="project-card-tagline">{description}</p>}

        <ProjectTechTags project={project} />
      </div>
    </article>
  );
}
