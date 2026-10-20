import { resume } from '../../config/resume';
import { profile } from '../../data/about';

export default function AboutHero() {
  return (
    <section className="section about-hero" id="top" aria-labelledby="about-hero-heading">
      <div className="container about-hero-grid">
        <div className="about-hero-text">
          <p className="hero-eyebrow">{profile.eyebrow}</p>

          <h1 id="about-hero-heading" className="about-hero-title">
            {profile.title[0]}
            <br />
            {profile.title[1]}
          </h1>

          {profile.paragraphs.map((paragraph) => (
            <p className="about-hero-lede" key={paragraph}>
              {paragraph}
            </p>
          ))}

          <div className="about-hero-actions">
            <a className="button button-primary" href={resume.url} download={resume.fileName}>
              {profile.resume.label}
            </a>
            <a className="button" href={`mailto:${profile.contactLink.email}`}>
              {profile.contactLink.label}
            </a>
          </div>
        </div>

        <aside className="about-hero-note">
          <div className="about-hero-note-spark">✳</div>
          <strong>Always learning</strong>
          <p>There's usually something new to discover—even in something I already know.</p>
        </aside>
      </div>
    </section>
  );
}
