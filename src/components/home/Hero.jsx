import { Link } from 'react-router-dom';
import portrait from '../../assets/images/profile-pic.jpg';
import { resume } from '../../config/resume';

export default function Hero() {
  return (
    <section className="hero section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="hero-eyebrow">Backend Developer</p>

            <h1 id="hero-heading">Hi, I'm Saeed Norouzi.</h1>

            <p className="hero-intro">A software developer driven by curiosity and code.</p>

            <div className="hero-actions">
              <Link to="/projects" className="hero-button hero-button-primary">
                Explore My Projects
              </Link>
              <a
                href={resume.url}
                download={resume.fileName}
                className="hero-button hero-button-secondary"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Resume
              </a>
            </div>

            <div className="hero-profile-links">
              <a
                href="https://github.com/snorouzi"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-profile-link"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.7.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/saeednorouzi"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-profile-link"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.5v1.5h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8z" />
                </svg>
                LinkedIn
              </a>
              <Link to="/about" className="hero-profile-link">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Know me
              </Link>
              <a href="mailto:saeednorouzi98@gmail.com" className="hero-profile-link">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Get in touch
              </a>
            </div>

            <p className="hero-tech hero-tech-margin">
              NestJS &middot; TypeScript &middot; PostgreSQL &middot; MongoDB &middot; Redis
              &middot; RabbitMQ
            </p>
          </div>

          <div className="hero-portrait">
            {/*
              REPLACEMENT POINT
              To replace this photograph later, swap the file at src/assets/images/profile-pic.jpg
              with an optimized image. Keep it portrait (recommended 4:5 aspect ratio) so the
              reserved .portrait wrapper (border, background, overflow-hidden) keeps the space
              stable without layout shift. The <figure> keeps an accessible label for the image.
            */}
            <figure className="portrait" aria-label="Portrait of Saeed Norouzi">
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
      </div>
    </section>
  );
}
