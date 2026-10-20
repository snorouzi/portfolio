/**
 * About page content.
 *
 * The biography, career journey, focus areas and personal notes live here so
 * the page components stay presentational and the copy can be edited in one
 * place. Dates are only included where they are confirmed.
 */

export const profile = {
  name: 'Saeed Norouzi',
  role: 'Senior Backend Developer',
  currentCompany: 'Daric Data Processing',
  eyebrow: 'A little about me',
  title: ['Curious by nature.', 'Backend developer by choice.'],
  paragraphs: [
    "I'm Saeed Norouzi, a Senior Backend Developer who enjoys solving problems, exploring how systems work, and building software that scales.",
    'My work focuses on backend architecture, distributed systems, and high-concurrency workflows. I am particularly interested in the logic and design behind software: how different components work together, how systems handle complexity, and how to make them reliable and maintainable.',
  ],
  resume: {
    label: 'Download Resume',
    hint: 'PDF',
  },
  journeyLink: {
    label: 'My career journey',
  },
};

export const careerJourney = [
  {
    id: 'frontend',
    period: 'Early career',
    title: 'Web development, and a change of direction',
    summary:
      'I started out in web development, working with frontend technologies. Frontend turned out not to be my best fit — I did not get the same satisfaction from it that I wanted from my work.',
    details: [
      'What did hold my attention was problem-solving and the logic behind software: how applications work internally, how systems are architected and designed, how data flows through an application, and how a complex problem can be broken down and solved.',
      'Those interests, along with a few other things, led me toward backend development. It was less a criticism of frontend work than a personal discovery about the kind of work I enjoy.',
    ],
  },
  {
    id: 'php-laravel',
    period: 'Next step',
    title: 'PHP and Laravel',
    summary:
      'I began my backend development journey with PHP and Laravel, then joined a company where I continued working on backend development and gained practical experience building software for real projects.',
  },
  {
    id: 'webline-studio',
    period: 'May 2020 – February 2024',
    title: 'Webline Studio',
    role: 'Backend Developer, later Backend Team Lead',
    summary:
      'More than four years at Webline Studio, progressing from backend development into backend team leadership.',
    points: [
      'Backend development for different types of software projects',
      'Fintech and cryptocurrency-related platforms',
      'Renewable energy, telemedicine, and service automation projects',
      'Backend architecture and technical decisions',
      'Collaboration with other developers and teams',
    ],
    details: [
      'For part of my time there I led a backend team of five. That meant architecture, code reviews, onboarding, documentation, and coordinating with other teams.',
    ],
  },
  {
    id: 'military-service',
    period: 'After Webline Studio',
    title: 'Military service, and time to catch up',
    summary:
      'After leaving Webline Studio I completed a shortened period of military service — around five to six months.',
    details: [
      'Afterwards I spent some time back in software development, refreshing my knowledge and catching up with the technologies and developments that had moved on while I was away.',
    ],
  },
  {
    id: 'daric',
    period: 'Current role',
    title: 'Daric Data Processing',
    role: 'Senior Backend Developer',
    summary:
      'I am part of a small senior backend development team, and we work together toward shared goals and achievements.',
    details: [
      'My work involves backend systems, scalable architecture, and complex workflows. I enjoy the collaboration as much as the technical problems — and I am always looking for something new to learn.',
    ],
  },
];

export const focusIntro =
  'These are the kinds of problems I enjoy working on most. Not an exclusive list, but where my experience and my curiosity overlap.';

export const focusAreas = [
  {
    id: 'architecture',
    index: '01',
    title: 'Backend Architecture & Scalable Systems',
    description:
      'Designing backend services that can handle complexity and grow with their requirements.',
  },
  {
    id: 'distributed-systems',
    index: '02',
    title: 'Distributed Systems & Asynchronous Processing',
    description:
      'Exploring how services communicate, coordinate, and process work reliably.',
  },
  {
    id: 'financial-workflows',
    index: '03',
    title: 'Financial & High-Concurrency Workflows',
    description:
      'Building systems where consistency, reliability, and concurrent operations matter.',
  },
];

export const education = {
  eyebrow: 'Education',
  degree: 'B.Sc. in Software Engineering',
  university: 'Payame Noor University',
  period: '2018–2024',
};

export const beyondWork = {
  eyebrow: 'Away from the terminal',
  title: 'Still curious, just offline sometimes',
  paragraphs: [
    "Outside of work, I'm usually reading a book, watching an anime or movie, or playing a game. I'm also a bit of an otaku, and I enjoy walking and jogging when I want to get away from a screen.",
    "I'm naturally curious and enjoy learning new things, especially anything related to programming and technology. Even when I'm learning something familiar, I like the idea that there might still be one small thing I haven't discovered yet.",
  ],
};
