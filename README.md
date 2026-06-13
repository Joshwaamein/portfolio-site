# Joshua Mein — Portfolio Site

A static portfolio site for [@Joshwaamein](https://github.com/Joshwaamein) — Cloud Infrastructure & Systems Engineer.

**Live:** _https://joshwaamein.github.io/portfolio-site/_ (after first GH Pages deploy)

Built with vanilla HTML, CSS, and JavaScript — no build step, no framework, no dependencies. Inspired by [edgoran/portfolio-site](https://github.com/edgoran/portfolio-site).

## Features

- Tabbed single-page layout: About / Projects / Experience / Contact
- Dark / light theme toggle, with no-flash inline init and `prefers-color-scheme` fallback
- WCAG-style high-contrast accessibility mode (yellow-on-black / brown-on-white)
- Animated Matrix-rain canvas background (toggleable, respects `prefers-reduced-motion`)
- Project cards with click-to-expand "deep dive" modals
- Experience timeline with current-role pulse indicator
- Fully responsive, keyboard-accessible, tab-deep-linkable via URL hash

## Local development

No tooling required.

```bash
# from inside the site/ directory:
make serve
# or directly:
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://localhost:8000>.

If you want live-reload while editing, install `live-server` on demand via npx:

```bash
npx live-server --port=8000 --no-browser
```

## File layout

```
site/
├── index.html              # markup + inline no-flash theme script
├── styles.css              # CSS variables, themes, layout
├── app.js                  # tabs, toggles, project rendering, modal
├── matrix-rain.js          # canvas background animation
├── data/projects.js        # edit this to add/update projects
├── images/favicon.svg      # SVG favicon
└── .github/workflows/      # GitHub Pages deployment workflow
```

To add a project, edit `data/projects.js`. Featured projects use `featured: true` and span 2 columns on the grid.

## Deployment — GitHub Pages

A workflow at `.github/workflows/pages.yml` auto-deploys this folder to GitHub Pages on every push to `main`.

First-time setup:

1. Push this repo to GitHub.
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push a commit to `main`. The workflow will publish the site.

## Licence

Site code: MIT. Content (CV / project descriptions / images): © Joshua Mein.

## Support

If this project is useful to you, consider supporting it:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/joshmein)
- ₿ BTC: `bc1qt4r02qp2w3gt8qfdepg89cmtfaaf6at33qd44r`
- Ξ ETH: `0xdBE0d9a2737cBB627F55c33Ac06AD66743731E15`
- ✕ XRP: `rPgJhTe2prZnrMFoUZ3pJj9MMKLmyDUy65`
