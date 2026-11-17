import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load projects data to generate dynamic routes
const projectsData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'src/data/projects.json'), 'utf-8')
);
const publicProjects = projectsData.filter((p) => p.visibility === 'public');

const staticDir = path.join(__dirname, 'dist');

// Read the built index.html
const baseHtml = fs.readFileSync(path.join(staticDir, 'index.html'), 'utf-8');

// Extract the body content (everything between <body> and </body>)
// Vite's built body contains the single React mount point and bundled entry script.
// Keep it intact for each generated route; rebuilding only the mount point drops the app.
const bodyMatch = baseHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) throw new Error('Could not find body in dist/index.html');
const bodyContent = bodyMatch[1];

// Base metadata that's common to all pages
const baseMetadata = {
  siteName: 'Saeed Norouzi',
  baseUrl: 'https://snorouzi.ir',
  ogImage: 'https://snorouzi.ir/og-image.png',
  themeColor: '#1a1622',
  locale: 'en_US',
};

// Route-specific metadata
function getRouteMetadata(route) {
  if (route === '/') {
    return {
      title: 'Saeed Norouzi — Senior Backend Developer',
      description:
        'Senior Backend Developer specializing in NestJS, TypeScript, distributed systems, and scalable backend architecture. Explore my projects and experience.',
      canonical: 'https://snorouzi.ir/',
      ogType: 'website',
      ogTitle: 'Saeed Norouzi — Senior Backend Developer',
      ogDescription:
        'Senior Backend Developer specializing in NestJS, TypeScript, distributed systems, and scalable backend architecture. Explore my projects and experience.',
      ogUrl: 'https://snorouzi.ir/',
    };
  }
  if (route === '/projects') {
    return {
      title: 'Projects | Saeed Norouzi — Portfolio',
      description:
        "A collection of backend systems and applications I've worked on, from scalable APIs to distributed services.",
      canonical: 'https://snorouzi.ir/projects',
      ogType: 'website',
      ogTitle: 'Projects | Saeed Norouzi — Portfolio',
      ogDescription:
        "A collection of backend systems and applications I've worked on, from scalable APIs to distributed services.",
      ogUrl: 'https://snorouzi.ir/projects',
    };
  }
  if (route === '/about') {
    return {
      title: 'About | Saeed Norouzi — Portfolio',
      description:
        "I'm Saeed Norouzi, a Senior Backend Developer focused on backend architecture, distributed systems, and high-concurrency workflows.",
      canonical: 'https://snorouzi.ir/about',
      ogType: 'website',
      ogTitle: 'About | Saeed Norouzi — Portfolio',
      ogDescription:
        "I'm Saeed Norouzi, a Senior Backend Developer focused on backend architecture, distributed systems, and high-concurrency workflows.",
      ogUrl: 'https://snorouzi.ir/about',
    };
  }
  // Project detail pages
  const project = publicProjects.find((p) => `/projects/${p.slug}` === route);
  if (project) {
    const canonical = `https://snorouzi.ir/projects/${project.slug}`;
    const ogTitle = `${project.title} | Saeed Norouzi — Portfolio`;
    const ogDescription = project.tagline || project.description;
    return {
      title: ogTitle,
      description: ogDescription,
      canonical,
      ogType: 'website',
      ogTitle,
      ogDescription,
      ogUrl: canonical,
    };
  }
  // Fallback
  return {
    title: 'Saeed Norouzi — Senior Backend Developer',
    description:
      'Senior Backend Developer specializing in NestJS, TypeScript, distributed systems, and scalable backend architecture.',
    canonical: 'https://snorouzi.ir/',
    ogType: 'website',
    ogTitle: 'Saeed Norouzi — Senior Backend Developer',
    ogDescription:
      'Senior Backend Developer specializing in NestJS, TypeScript, distributed systems, and scalable backend architecture.',
    ogUrl: 'https://snorouzi.ir/',
  };
}

function generateHtml(route) {
  const meta = getRouteMetadata(route);
  const ogImage = baseMetadata.ogImage;
  const themeColor = baseMetadata.themeColor;
  const siteName = baseMetadata.siteName;
  const locale = baseMetadata.locale;

  const head = `<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="${themeColor}" />
    <meta name="description" content="${meta.description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${meta.canonical}" />
    <meta property="og:type" content="${meta.ogType}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${meta.ogTitle}" />
    <meta property="og:description" content="${meta.ogDescription}" />
    <meta property="og:url" content="${meta.ogUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="${meta.ogTitle}" />
    <meta property="og:locale" content="${locale}" />
    <title>${meta.title}</title>
    <!-- Theme is initialized before React mounts to avoid a flash of the wrong theme -->
    <script type="module">
      const THEME_STORAGE_KEY = 'portfolio-theme';

      const getInitialTheme = () => {
        try {
          const saved = localStorage.getItem(THEME_STORAGE_KEY);
          if (saved === 'light' || saved === 'dark') {
            return saved;
          }
        } catch {
          // localStorage unavailable; fall through to system preference
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      };

      const theme = getInitialTheme();
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
    </script>
  </head>`;

  return `<!doctype html>
<html lang="en">
${head}
  <body>
    ${bodyContent.trim()}
  </body>
</html>`;
}

// Generate static routes
const staticRoutes = ['/', '/projects', '/about'];
const projectRoutes = publicProjects.map((p) => `/projects/${p.slug}`);
const allRoutes = [...staticRoutes, ...projectRoutes];

console.log('[generate-static] Generating static HTML for routes:', allRoutes.join(', '));

for (const route of allRoutes) {
  const html = generateHtml(route);
  const outputDir = path.join(staticDir, route === '/' ? '' : route.slice(1));
  const outputPath = path.join(outputDir, 'index.html');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`[generate-static] Generated: ${outputPath}`);
}

// Generate sitemap.xml
function generateSitemap() {
  const urls = [
    { loc: 'https://snorouzi.ir/', changefreq: 'weekly', priority: 1.0 },
    { loc: 'https://snorouzi.ir/projects', changefreq: 'weekly', priority: 0.8 },
    { loc: 'https://snorouzi.ir/about', changefreq: 'monthly', priority: 0.6 },
    ...publicProjects.map((p) => ({
      loc: `https://snorouzi.ir/projects/${p.slug}`,
      changefreq: 'monthly',
      priority: p.featured ? 0.7 : 0.5,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(staticDir, 'sitemap.xml'), sitemap);
  console.log('[generate-static] Generated: sitemap.xml');
}

generateSitemap();

// Also copy the 404.html for SPA fallback
fs.copyFileSync(path.join(staticDir, 'index.html'), path.join(staticDir, '404.html'));
console.log('[generate-static] Copied 404.html');

console.log('[generate-static] Done!');
