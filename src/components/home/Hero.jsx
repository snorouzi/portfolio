import { Link } from 'react-router-dom';

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
              Replace the inline SVG placeholder below with your profile photograph without
              changing the page structure. The simplest replacement is:

              <img
                src="/assets/images/profile-placeholder.svg"
                alt="Portrait of Saeed Norouzi"
                className="portrait-image"
              />

              Keep the .portrait wrapper (4:5 aspect ratio, border, background) so the reserved
              space stays stable and the placeholder looks intentional until the real image is in
              place. The asset lives at src/assets/images/profile-placeholder.svg.
            */}
            <figure
              className="portrait"
              aria-label="Portrait placeholder — to be replaced with a profile photograph"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 250"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  width="200"
                  height="250"
                  rx="14"
                  fill="var(--color-surface)"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <circle cx="100" cy="72" r="31" fill="var(--color-text-muted)" />
                <path
                  d="M64 142 Q64 205 100 215 Q136 205 136 142 Z"
                  fill="var(--color-text-muted)"
                />
              </svg>
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
