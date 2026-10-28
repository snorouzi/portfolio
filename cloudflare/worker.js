/**
 * Standalone coming soon page for deployment as a Cloudflare Worker.
 * All markup, styles, and decorative graphics are embedded in this response.
 */

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#111019" />
    <meta name="description" content="Saeed Norouzi's portfolio is getting a thoughtful refresh. Senior Backend Developer building reliable, scalable systems." />
    <title>Coming soon — Saeed Norouzi</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        --text: #f5f2fb;
        --muted: #a6a0b4;
        --accent: #c0a5ff;
      }

      * { box-sizing: border-box; }
      body {
        min-width: 320px;
        min-height: 100svh;
        margin: 0;
        color: var(--text);
        background: #111019;
      }
      body::before {
        position: fixed;
        z-index: 0;
        inset: 0;
        background-image: linear-gradient(rgba(190, 164, 255, .035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(190, 164, 255, .035) 1px, transparent 1px);
        background-size: 64px 64px;
        mask-image: linear-gradient(to bottom, black, transparent 88%);
        content: "";
        pointer-events: none;
      }
      .glow {
        position: fixed;
        z-index: 0;
        top: -34rem;
        left: 50%;
        width: 68rem;
        height: 68rem;
        transform: translateX(-50%);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(104, 66, 165, .24), rgba(104, 66, 165, 0) 68%);
        pointer-events: none;
      }
      main {
        position: relative;
        z-index: 1;
        display: flex;
        min-height: 100svh;
        flex-direction: column;
        width: min(100% - 3rem, 1120px);
        margin-inline: auto;
      }
      header, footer { display: flex; align-items: center; justify-content: space-between; }
      header { min-height: 92px; }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: .75rem;
        color: var(--text);
        font-size: .92rem;
        font-weight: 650;
        letter-spacing: -.02em;
        text-decoration: none;
      }
      .brand-mark {
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border: 1px solid rgba(192, 165, 255, .34);
        border-radius: 11px;
        color: var(--accent);
        background: rgba(192, 165, 255, .08);
        font-size: .84rem;
        font-weight: 750;
      }
      .availability { display: inline-flex; align-items: center; gap: .55rem; color: var(--muted); font-size: .78rem; }
      .availability::before {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #8ad6aa;
        box-shadow: 0 0 12px rgba(138, 214, 170, .55);
        content: "";
      }
      .content {
        display: grid;
        flex: 1;
        grid-template-columns: minmax(0, 1fr) minmax(250px, .72fr);
        align-items: center;
        gap: clamp(3rem, 9vw, 8rem);
        padding-block: 4rem 5rem;
      }
      .copy { max-width: 650px; }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: .65rem;
        margin: 0 0 1.5rem;
        color: var(--accent);
        font-size: .72rem;
        font-weight: 700;
        letter-spacing: .17em;
        text-transform: uppercase;
      }
      .eyebrow::before { width: 24px; height: 1px; background: currentColor; content: ""; }
      h1 {
        max-width: 11ch;
        margin: 0;
        font-size: clamp(3.6rem, 8.6vw, 7.2rem);
        font-weight: 650;
        letter-spacing: -.075em;
        line-height: .98;
      }
      h1 span {
        display: block;
        color: transparent;
        background: linear-gradient(100deg, #c9b4ff 8%, #8c6bd0 90%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      .intro { max-width: 46ch; margin: 1.8rem 0 0; color: var(--muted); font-size: clamp(1rem, 1.6vw, 1.13rem); line-height: 1.8; }
      .intro strong { color: #e5dff0; font-weight: 550; }
      .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; margin-top: 2.15rem; }
      .button {
        display: inline-flex;
        min-height: 48px;
        align-items: center;
        justify-content: center;
        gap: .65rem;
        padding: 0 1.15rem;
        border: 1px solid rgba(192, 165, 255, .34);
        border-radius: 10px;
        color: #17121f;
        background: var(--accent);
        font-size: .88rem;
        font-weight: 700;
        text-decoration: none;
        transition: transform 160ms ease, background 160ms ease;
      }
      .button:hover { transform: translateY(-2px); background: #d2c1ff; }
      .button:focus-visible, .social a:focus-visible, .brand:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
      .button svg { width: 16px; height: 16px; }
      .social { display: flex; flex-wrap: wrap; gap: 1.1rem; }
      .social a { color: #c6c0d2; font-size: .86rem; text-decoration-color: rgba(198, 192, 210, .36); text-underline-offset: 4px; }
      .social a:hover { color: var(--text); }
      .art {
        position: relative;
        display: grid;
        min-height: 340px;
        place-items: center;
      }
      .orbital {
        position: absolute;
        width: min(32vw, 350px);
        aspect-ratio: 1;
        border: 1px solid rgba(192, 165, 255, .15);
        border-radius: 50%;
        transform: rotate(-24deg) scaleY(.55);
      }
      .orbital::before, .orbital::after { position: absolute; border-radius: 50%; content: ""; }
      .orbital::before { inset: 12%; border: 1px solid rgba(192, 165, 255, .2); }
      .orbital::after { inset: 26%; border: 1px solid rgba(192, 165, 255, .24); }
      .core {
        position: relative;
        display: grid;
        width: 142px;
        aspect-ratio: 1;
        place-items: center;
        border: 1px solid rgba(192, 165, 255, .32);
        border-radius: 38px;
        color: #e5d9ff;
        background: linear-gradient(145deg, rgba(192, 165, 255, .19), rgba(33, 27, 46, .8));
        box-shadow: 0 0 90px rgba(136, 93, 214, .2), inset 0 1px rgba(255,255,255,.1);
        transform: rotate(-8deg);
      }
      .core svg { width: 62px; height: 62px; transform: rotate(8deg); }
      .spark { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #d5c3ff; box-shadow: 0 0 18px #b99aff; }
      .spark.one { top: 15%; right: 17%; }
      .spark.two { bottom: 18%; left: 13%; width: 5px; height: 5px; }
      footer { min-height: 75px; border-top: 1px solid rgba(255,255,255,.08); color: #827c90; font-size: .76rem; }
      footer a { color: inherit; text-decoration: none; }
      footer a:hover { color: var(--text); }
      @media (max-width: 760px) {
        main { width: min(100% - 2.25rem, 560px); }
        header { min-height: 76px; }
        .content { grid-template-columns: 1fr; gap: 1rem; padding-block: 4.5rem 3rem; }
        h1 { font-size: clamp(3.75rem, 15vw, 6rem); }
        .art { min-height: 230px; }
        .orbital { width: min(68vw, 270px); }
        .core { width: 112px; border-radius: 30px; }
        footer { gap: 1rem; }
      }
      @media (max-width: 420px) {
        .availability { font-size: .7rem; }
        .content { padding-top: 3.5rem; }
        .actions { align-items: flex-start; flex-direction: column; }
        footer { align-items: flex-start; flex-direction: column; justify-content: center; padding-block: 1rem; }
      }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }
    </style>
  </head>
  <body>
    <div class="glow" aria-hidden="true"></div>
    <main>
      <header>
        <a class="brand" href="mailto:saeednorouzi98@gmail.com" aria-label="Contact Saeed Norouzi">
          <span class="brand-mark" aria-hidden="true">SN</span>
          <span>Saeed Norouzi</span>
        </a>
        <span class="availability">Building something new</span>
      </header>
      <section class="content" aria-labelledby="title">
        <div class="copy">
          <p class="eyebrow">Portfolio refresh</p>
          <h1 id="title">A new site is <span>on its way.</span></h1>
          <p class="intro">I’m putting the finishing touches on a new home for my work. In the meantime, I’m <strong>still building reliable backend systems</strong> and would be happy to hear from you.</p>
          <div class="actions">
            <a class="button" href="mailto:saeednorouzi98@gmail.com">
              Get in touch
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <nav class="social" aria-label="Social profiles">
              <a href="https://github.com/snorouzi" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/saeednorouzi" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
          </div>
        </div>
        <div class="art" aria-hidden="true">
          <div class="orbital"></div><span class="spark one"></span><span class="spark two"></span>
          <div class="core">
            <svg viewBox="0 0 64 64" fill="none"><path d="m24 21-11 11 11 11M40 21l11 11-11 11M36 15l-8 34" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
      </section>
      <footer>
        <span>© <span id="year">2026</span> Saeed Norouzi</span>
        <a href="mailto:saeednorouzi98@gmail.com">saeednorouzi98@gmail.com</a>
      </footer>
    </main>
    <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  </body>
</html>`;

export default {
  async fetch() {
    return new Response(page, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      },
    });
  },
};
