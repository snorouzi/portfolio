import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import { ProjectCardImage } from '../components/projects/ProjectCard';
import { env } from '../config/env';

/**
 * Resolve a project by slug from the data file.
 *
 * @param {string} slug
 * @returns {import('../lib/projectTypes').Project | undefined}
 */
function findProjectBySlug(slug) {
  return projectsData.find((project) => project.slug === slug);
}

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const project = useMemo(() => findProjectBySlug(slug ?? ''), [slug]);

  useEffect(() => {
    document.title = project
      ? `${project.title} | ${env.appName}`
      : `Project not found | ${env.appName}`;
  }, [project]);

  if (!project) {
    return (
      <main>
        <section className="section section-heading">
          <div className="container">
            <h1>Project not found</h1>
            <p>The project you are looking for does not exist.</p>
            <p>
              <Link to="/projects">View all projects</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  const description = project.tagline?.trim() || project.description?.trim() || '';
  const techList = Array.isArray(project.technologies) ? project.technologies : [];
  const details = project.details || {};

  return (
    <main>
      <section className="section">
        <div className="container">
          <nav className="project-detail-back" aria-label="Back to projects">
            <Link to="/projects" className="hero-link hero-link-secondary">
              Back to projects
            </Link>
          </nav>

          <header className="project-detail-header">
            <h1 className="project-detail-title">{project.title}</h1>
            {description && <p className="project-detail-tagline">{description}</p>}
          </header>

          <ProjectCardImage project={project} className="project-detail-figure" />

          {techList.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-tech-heading"
            >
              <h2 id="project-detail-tech-heading" className="project-detail-section-title">
                Technologies
              </h2>
              <ul className="project-detail-tech-list">
                {techList.map((tech) => (
                  <li key={tech} className="project-detail-tech-tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {details.overview && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-overview-heading"
            >
              <h2 id="project-detail-overview-heading" className="project-detail-section-title">
                Overview
              </h2>
              <p className="project-detail-text">{details.overview}</p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
