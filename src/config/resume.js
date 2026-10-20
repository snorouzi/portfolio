/**
 * Resume download configuration.
 *
 * The PDF is imported from src/data/resume.pdf so Vite fingerprints the file
 * and copies it into the build output. To publish a new version, replace that
 * file — no other file needs to change.
 */

import resumePdf from '../data/resume.pdf';

export const resume = {
  url: resumePdf,
  fileName: 'Saeed-Norouzi-Resume.pdf',
};

export default resume;
