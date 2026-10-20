import { focusAreas, focusIntro } from '../../data/about';

export default function AboutFocus() {
  return (
    <section className="section about-section" id="focus" aria-labelledby="focus-heading">
      <div className="container">
        <header className="section-heading about-section-heading">
          <p className="section-eyebrow">WHAT KEEPS ME INTERESTED</p>
          <h2 id="focus-heading" className="section-heading-title">
            My areas of focus
          </h2>
          <p className="section-heading-sub">{focusIntro}</p>
        </header>

        <div className="about-focus-grid">
          {focusAreas.map((area) => (
            <article className="about-focus-item" key={area.id}>
              <p className="about-focus-index">{area.index}</p>
              <h3 className="about-focus-title">{area.title}</h3>
              <p className="about-focus-description">{area.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
