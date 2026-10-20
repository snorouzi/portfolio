import { Link } from 'react-router-dom';

export default function ErrorPage({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <main className="error-page-main">
      <section className="section error-page-section" aria-labelledby="error-page-title">
        <div className="container">
          <div className="error-page-content">
            <p className="error-page-code" aria-label="Error 404">
              404
            </p>
            <h1 id="error-page-title">{title}</h1>
            <p className="error-page-description">{description}</p>
            <nav className="error-page-actions" aria-label="Suggested pages">
              <Link className="button button-primary" to={primaryTo}>
                {primaryLabel}
              </Link>
              <Link className="button" to={secondaryTo}>
                {secondaryLabel}
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
