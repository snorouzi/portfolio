import { useEffect, useMemo, useState } from 'react';
import { env } from '../config/env';
import AboutHero from '../components/about/AboutHero';
import AboutJourney from '../components/about/AboutJourney';
import AboutFocus from '../components/about/AboutFocus';
import ContributionCalendar from '../components/about/ContributionCalendar';
import { education, beyondWork } from '../data/about';
import { resume } from '../config/resume';
import githubData from '../data/github.json';
import gitlabData from '../data/gitlab.json';
import {
  parseGitHubContributions,
  parseCompanyContributions,
  buildCalendarWeeks,
  activeDayCount,
  computeIntensityScale,
} from '../lib/contributions';

export default function AboutPage() {
  useEffect(() => {
    document.title = `About | ${env.appName}`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "I'm Saeed Norouzi, a Senior Backend Developer focused on backend architecture, distributed systems, and high-concurrency workflows."
      );
    }
  }, []);

  const github = parseGitHubContributions(githubData);
  const company = parseCompanyContributions(gitlabData);

  const githubYears = github.totals.map(([year]) => year);
  const companyYears = company.totals.map(([year]) => year);
  const [githubYear, setGithubYear] = useState(githubYears.at(-1) ?? '');
  const [companyYear, setCompanyYear] = useState(companyYears.at(-1) ?? '');

  const githubYearDays = useMemo(
    () => github.days.filter((day) => day.date.startsWith(`${githubYear}-`)),
    [github.days, githubYear]
  );
  const companyYearDays = useMemo(
    () => company.days.filter((day) => day.date.startsWith(`${companyYear}-`)),
    [company.days, companyYear]
  );
  const githubScale = computeIntensityScale(githubYearDays.map((day) => day.count));
  const companyScale = computeIntensityScale(companyYearDays.map((day) => day.count));

  const githubWeeks = buildCalendarWeeks(
    githubYearDays,
    githubYear ? `${githubYear}-01-01` : '',
    githubYear ? `${githubYear}-12-31` : ''
  );
  const companyWeeks = buildCalendarWeeks(
    companyYearDays,
    companyYear ? `${companyYear}-01-01` : '',
    companyYear ? `${companyYear}-12-31` : ''
  );

  const githubActive = activeDayCount(githubYearDays);
  const companyActive = activeDayCount(companyYearDays);

  return (
    <main id="about">
      <AboutHero />

      <AboutJourney />

      <AboutFocus />

      <section className="section about-section">
        <div className="container">
          <header className="section-heading about-section-heading">
            <p className="section-eyebrow">A LITTLE PROOF OF THE HABIT</p>
            <h2 className="section-heading-title">Contributions</h2>
            <p className="section-heading-sub">
              Public projects and private company work, shown separately.
            </p>
          </header>

          <div className="about-contribs-stack">
            <article className="contrib-block">
              <div className="contrib-header">
                <div>
                  <h3>GitHub Contributions</h3>
                  <p className="contrib-desc">Daily contribution activity from the GitHub export.</p>
                </div>
                <div className="contrib-controls">
                  <span className="contrib-tag">Public</span>
                </div>
              </div>
              <div className="contrib-calendar-wrap">
                <ContributionCalendar
                  title=""
                  badge=""
                  description=""
                  caption="GitHub contribution heatmap"
                  weeks={githubWeeks}
                  thresholds={githubScale.thresholds}
                  totals={github.totals}
                  selectedYear={githubYear}
                  onYearSelect={setGithubYear}
                  note={
                    githubActive > 0
                      ? `The calendar shows ${githubYear} from the supplied export.`
                      : `No activity is recorded for ${githubYear} in the supplied export.`
                  }
                />
              </div>
            </article>

            <article className="contrib-block">
              <div className="contrib-header">
                <div>
                  <h3>Company Contributions</h3>
                  <p className="contrib-desc">Combined private GitLab activity at Daric Data Processing.</p>
                </div>
                <div className="contrib-controls">
                  <span className="contrib-tag">Private · Daric</span>
                </div>
              </div>
              <div className="contrib-calendar-wrap">
                <ContributionCalendar
                  title=""
                  badge=""
                  description=""
                  caption="Company contribution heatmap"
                  weeks={companyWeeks}
                  thresholds={companyScale.thresholds}
                  totals={company.totals}
                  selectedYear={companyYear}
                  onYearSelect={setCompanyYear}
                  note={
                    companyActive > 0
                      ? 'Dates not present in the export are treated as no activity for calendar display only.'
                      : 'No activity is recorded for the dates present in the supplied export.'
                  }
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <div className="container">
          <header className="section-heading about-section-heading">
            <p className="section-eyebrow">Away from the terminal</p>
            <h2 className="section-heading-title">Still curious, just offline sometimes</h2>
          </header>
          <div className="about-personal-grid">
            <div>
              {beyondWork.paragraphs.map((paragraph) => (
                <p className="about-personal-text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              <div className="about-interest-list">
                <span className="about-interest">Books</span>
                <span className="about-interest">Anime & movies</span>
                <span className="about-interest">Games</span>
                <span className="about-interest">Learning</span>
                <span className="about-interest">Walking & jogging</span>
              </div>
            </div>
            <aside className="about-education-card">
              <div className="about-education-eyebrow">{education.eyebrow}</div>
              <strong className="about-education-degree">{education.degree}</strong>
              <p className="about-education-meta">
                {education.university} · {education.period}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="resume" className="section about-section">
        <div className="container">
          <div className="about-resume-row">
            <div>
              <p className="section-eyebrow">Want the full details?</p>
              <h2 className="section-heading-title">Let's keep in touch.</h2>
              <p className="section-heading-sub">
                Download the resume for a more detailed overview of my experience.
              </p>
            </div>
            <div className="about-resume-actions">
              <a className="button button-primary" href={resume.url} download={resume.fileName}>
                Download resume PDF
              </a>
              <nav className="hero-profile-links about-resume-social" aria-label="Connect with me">
                <a
                  href="https://github.com/snorouzi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-profile-link"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.7.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/saeednorouzi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-profile-link"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.5v1.5h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8z" />
                  </svg>
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
