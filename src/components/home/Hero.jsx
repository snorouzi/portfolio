import { Link } from 'react-router-dom';
import portrait from '../../assets/images/profile-pic.jpg';

export default function Hero() {
  return (
    <section className="hero section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="hero-eyebrow">Senior Backend Developer</p>

            <h1 id="hero-heading">Hi, I'm Saeed Norouzi.</h1>

            <p className="hero-specialization">
              Building scalable, reliable <span className="hero-accent">backend systems</span>.
            </p>

            <p className="hero-intro">
              I'm a Senior Backend Developer with 6+ years of experience building scalable backend
              systems with NestJS and TypeScript. I work across backend architecture, data-intensive
              applications, and distributed systems, with a focus on reliability, maintainability,
              and solving complex engineering problems.
            </p>

            <div className="hero-actions">
              <Link to="/projects" className="hero-button hero-button-primary">
                Explore My Projects
              </Link>
              <Link to="/about" className="hero-link hero-link-secondary">
                View Resume
              </Link>
              <a href="mailto:saeednorouzi98@gmail.com" className="hero-link hero-link-quiet">
                Get in touch
              </a>
            </div>
          </div>

          <div className="hero-portrait">
            {/*
              REPLACEMENT POINT
              To replace this photograph later, swap the file at src/assets/images/profile-pic.jpg
              with an optimized image. Keep it portrait (recommended 4:5 aspect ratio) so the
              reserved .portrait wrapper (border, background, overflow-hidden) keeps the space
              stable without layout shift. The <figure> keeps an accessible label for the image.
            */}
            <figure
              className="portrait"
              aria-label="Portrait of Saeed Norouzi"
            >
              <img
                src={portrait}
                alt="Portrait of Saeed Norouzi"
                width="800"
                height="1000"
                decoding="async"
                loading="eager"
              />
            </figure>
          </div>
        </div>

        <p className="hero-tech">
          NestJS &middot; TypeScript &middot; PostgreSQL &middot; MongoDB &middot; Redis &middot;
          RabbitMQ
        </p>
      </div>
    </section>
  );
}
