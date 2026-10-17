import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChallengeList from '../components/projects/ChallengeList';
import FeatureList from '../components/projects/FeatureList';
import Gallery from '../components/projects/Gallery';
import ProjectCardImage, { ProjectTechTags } from '../components/projects/ProjectCard';
import ProjectLinks from '../components/projects/ProjectLinks';
import ProjectMeta from '../components/projects/ProjectMeta';
import ProjectNotFound from '../components/projects/ProjectNotFound';
import ProjectSectionHeading from '../components/projects/ProjectSectionHeading';
import ResponsibilityList from '../components/projects/ResponsibilityList';
import { env } from '../config/env';
import projectsData from '../data/projects.json';

/**
 * Resolve a project by slug from the data file.
 *
 * @param {string} slug
 * @returns {import('../lib/projectTypes').Project | undefined}
 */
function findProjectBySlug(slug) {
  return projectsData.find((project) => project.slug === slug);
}

/**
 * Returns true when one text substantially duplicates another (one is contained
 * within the other after trimming), so we never repeat the same paragraph.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function isDuplicated(a, b) {
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
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
    return <ProjectNotFound />;
  }

  const description = project.description?.trim() || '';
  const overview = project.details?.overview?.trim() || '';
  const techList = Array.isArray(project.technologies) ? project.technologies : [];
  const details = project.details || {};
  const features = Array.isArray(details.features) ? details.features : [];
  const responsibilities = Array.isArray(details.responsibilities) ? details.responsibilities : [];
  const challenges = Array.isArray(details.technicalChallenges) ? details.technicalChallenges : [];
  const gallery = Array.isArray(details.gallery) ? details.gallery : [];
  const architecture = details.architecture || {};
  const archDescription = architecture.description?.trim() || '';
  const archImage = architecture.image;
  const cardImage = project.card?.image;

  // Decide which overview paragraphs to render, avoiding verbatim duplication.
  const showDescription = description && !isDuplicated(description, overview);
  const showOverview = overview && !isDuplicated(overview, description);

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
            <ProjectMeta project={project} />
          </header>

          <ProjectCardImage project={project} showTech={false} className="project-detail-figure" />

          {techList.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-tech-heading"
            >
              <ProjectSectionHeading id="project-detail-tech-heading" title="Technologies" />
              <ProjectTechTags project={project} max={techList.length} />
            </section>
          )}

          {(showDescription || showOverview) && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-overview-heading"
            >
              <ProjectSectionHeading id="project-detail-overview-heading" title="Overview" />
              {showDescription && <p className="project-detail-text">{description}</p>}
              {showOverview && <p className="project-detail-text">{overview}</p>}
            </section>
          )}

          {features.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-features-heading"
            >
              <ProjectSectionHeading id="project-detail-features-heading" title="Key Features" />
              <FeatureList features={features} />
            </section>
          )}

          {responsibilities.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-responsibilities-heading"
            >
              <ProjectSectionHeading
                id="project-detail-responsibilities-heading"
                title="Responsibilities"
              />
              <ResponsibilityList responsibilities={responsibilities} />
            </section>
          )}

          {(archDescription || archImage) && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-architecture-heading"
            >
              <ProjectSectionHeading
                id="project-detail-architecture-heading"
                title="Architecture"
              />
              {archDescription && <p className="project-detail-text">{archDescription}</p>}
              {archImage && (
                <figure className="project-architecture-figure">
                  <ProjectCardImage
                    project={{
                      title: project.title,
                      card: { image: archImage, imageAlt: architecture.imageAlt },
                    }}
                    className="project-architecture-image"
                  />
                  {architecture.imageAlt && (
                    <figcaption className="project-architecture-caption">
                      {architecture.imageAlt}
                    </figcaption>
                  )}
                </figure>
              )}
            </section>
          )}

          {challenges.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-challenges-heading"
            >
              <ProjectSectionHeading
                id="project-detail-challenges-heading"
                title="Technical Challenges"
              />
              <ChallengeList challenges={challenges} />
            </section>
          )}

          {gallery.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-gallery-heading"
            >
              <ProjectSectionHeading id="project-detail-gallery-heading" title="Gallery" />
              <Gallery gallery={gallery} cardImage={cardImage} archImage={archImage} />
            </section>
          )}

          <section
            className="project-detail-section"
            aria-labelledby="project-detail-links-heading"
          >
            <ProjectSectionHeading id="project-detail-links-heading" title="Links" />
            <ProjectLinks links={project.links} />
          </section>
        </div>
      </section>
    </main>
  );
}
