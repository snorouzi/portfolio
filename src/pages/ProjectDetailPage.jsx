import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChallengeList from '../components/projects/ChallengeList';
import FeatureList from '../components/projects/FeatureList';
import Gallery from '../components/projects/Gallery';
import ImageLightbox from '../components/projects/ImageLightbox';
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

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const project = useMemo(() => findProjectBySlug(slug ?? ''), [slug]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: null, alt: '' });
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const architectureImageRef = useRef(null);
  const galleryImageRefs = useRef({});

  useEffect(() => {
    document.title = project
      ? `${project.title} | ${env.appName}`
      : `Project not found | ${env.appName}`;
  }, [project]);

  const [triggerElement, setTriggerElement] = useState(null);

  if (!project) {
    return <ProjectNotFound />;
  }

  const handleOpenImage = (src, alt, element, index = -1) => {
    if (!src) return;
    setSelectedImage({ src, alt: alt || '' });
    setLightboxIndex(index);
    setTriggerElement(element || document.activeElement);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setTriggerElement(null);
  };
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

  const galleryEntries = gallery
    .map((entry) => {
      const src = entry.src;
      if (!src) return null;
      if (src === cardImage || src === archImage) return null;
      return { src, alt: entry.alt?.trim() || '' };
    })
    .filter(Boolean);

  return (
    <main>
      <section className="section">
        <div className="container">
          <nav className="project-detail-back" aria-label="Back to projects">
            <Link to="/projects" className="hero-link hero-link-secondary back-to-projects">
              Back to projects
            </Link>
          </nav>

          <header className="project-detail-header">
            <h1 className="project-detail-title">{project.title}</h1>
            <ProjectMeta project={project} />
          </header>

          <ProjectCardImage
            project={project}
            showTitle={false}
            showTech={false}
            className="project-detail-figure"
          />

          {techList.length > 0 && (
            <section
              className="project-detail-section"
              aria-labelledby="project-detail-tech-heading"
            >
              <ProjectSectionHeading id="project-detail-tech-heading" title="Technologies" />
              <ProjectTechTags project={project} max={techList.length} />
            </section>
          )}

          <section
            className="project-detail-section"
            aria-labelledby="project-detail-overview-heading"
          >
            <ProjectSectionHeading id="project-detail-overview-heading" title="Overview" />
            <p className="project-detail-text">{overview}</p>
          </section>

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
                  <button
                    type="button"
                    className="project-architecture-image image-lightbox-trigger"
                    ref={architectureImageRef}
                    onClick={() =>
                      handleOpenImage(
                        archImage,
                        architecture.imageAlt || `${project.title} architecture`,
                        architectureImageRef.current
                      )
                    }
                    aria-label="View architecture image in full size"
                  >
                    <ProjectCardImage
                      project={{
                        title: project.title,
                        card: { image: archImage, imageAlt: architecture.imageAlt },
                      }}
                      className=""
                    />
                  </button>
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
              <Gallery
                gallery={gallery}
                cardImage={cardImage}
                archImage={archImage}
                onImageClick={(src, alt, element, index) => handleOpenImage(src, alt, element, index)}
                imageRefs={galleryImageRefs}
              />
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
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        src={selectedImage.src}
        alt={selectedImage.alt}
        triggerElement={triggerElement}
        images={galleryEntries}
        currentIndex={lightboxIndex}
        onNavigate={(index) => {
          const img = galleryEntries[index];
          if (!img) return;
          setSelectedImage({ src: img.src, alt: img.alt });
          setLightboxIndex(index);
        }}
      />
    </main>
  );
}
