import { careerJourney } from '../../data/about';

export default function AboutJourney() {
  return (
    <section
      className="section about-section"
      id="career-journey"
      aria-labelledby="career-journey-heading"
    >
      <div className="container">
        <header className="section-heading about-section-heading">
          <p className="section-eyebrow">THE PATH SO FAR</p>
          <h2 id="career-journey-heading" className="section-heading-title">
            From frontend to the systems behind it
          </h2>
          <p className="section-heading-sub">
            How a curiosity about how software works turned into a backend career.
          </p>
        </header>

        <ol className="about-journey">
          {careerJourney.map((entry) => (
            <li className="about-journey-item" key={entry.id}>
              <p className="about-journey-period">{entry.period}</p>

              <div className="about-journey-body">
                <h3 className="about-journey-title">{entry.title}</h3>

                {entry.role && <p className="about-journey-role">{entry.role}</p>}

                <p className="about-journey-summary">{entry.summary}</p>

                {entry.points && (
                  <ul className="about-journey-points">
                    {entry.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}

                {entry.details?.map((detail) => (
                  <p className="about-journey-detail" key={detail}>
                    {detail}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
