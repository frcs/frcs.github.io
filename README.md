# François Pitié — Academic Website & Homepage

Personal and academic homepage of **François Pitié**, Associate Professor in Media Signal Processing at the [Department of Electronic & Electrical Engineering](https://www.tcd.ie/eleceng/), Trinity College Dublin.

- **Live URL**: [https://francois.pitie.net](https://francois.pitie.net) (or [https://frcs.github.io](https://frcs.github.io))

---

## Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generator)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with typography plugin and custom CSS variable design tokens
- **Math & Typography**: [KaTeX](https://katex.org/), `remark-math`, `rehype-katex`
- **Bibliography**: `bibtex-parse-js` with automated DOI/arXiv/URL resolution and BibTeX card generator
- **Hosting & CI/CD**: [GitHub Pages](https://pages.github.com/) automated with [GitHub Actions](https://github.com/features/actions)

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 22.12.0` (LTS recommended)
- **npm**: `>= 10.x`

### Installation & Development

```bash
# Clone the repository
git clone git@github.com:frcs/frcs.github.io.git
cd frcs.github.io

# Install dependencies
npm install

# Start the local development server (with hot-reloading)
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to view the site.

### Building for Production

```bash
# Build production-ready static assets to dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Theme Customisation

The website includes a custom theme manager supporting multiple curated colour palettes (e.g. One, Ayu, Nord, Dracula, Catppuccin, Gruvbox, Tokyo Night, Rosé Pine):

```bash
# List all available themes
npm run theme list

# Switch to a specific theme
npm run theme set one
npm run theme set ayu
npm run theme set nord
```

Both light and dark modes are supported across all themes and toggle seamlessly via the footer button or system preferences.

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions automated build & Pages deployment
├── public/
│   ├── images/               # Static images, logos, diagrams, and banner assets
│   ├── CNAME                 # Custom domain configuration (francois.pitie.net)
│   └── .nojekyll             # Bypasses Jekyll processing on GitHub Pages
├── scripts/
│   ├── theme.py              # CLI theme switcher script
│   └── themes.json           # Palette definitions for light/dark themes
├── src/
│   ├── components/           # Reusable UI components
│   ├── data/
│   │   └── publications.bib  # BibTeX database for all academic publications
│   ├── layouts/
│   │   └── BaseLayout.astro  # Global shell with navigation header, footer & theme toggle
│   ├── pages/
│   │   ├── index.astro       # Homepage with bio, news, and Top 10 selected publications
│   │   ├── publications.astro# Full searchable/filterable publication catalogue
│   │   ├── research/         # Research dossiers & interactive project pages
│   │   ├── teaching/         # Module syllabi & lab overviews (4C16, 5C34, 2E10, 4C8)
│   │   ├── team.astro        # Research group, PhD researchers & alumni
│   │   └── grants-impact.astro# Funded projects, grants, and international collaborations
│   ├── styles/
│   │   └── global.css        # Tailwind directives and CSS theme variables
│   └── utils/
│       └── bibtex.ts         # Parser & DOI/arXiv URL normaliser
├── astro.config.mjs          # Astro & Vite configuration
├── package.json
└── tsconfig.json
```

---

## Managing Content

### Adding / Updating Publications
1. Add new entries to [`src/data/publications.bib`](src/data/publications.bib).
2. The publication catalogue ([`src/pages/publications.astro`](src/pages/publications.astro)) will automatically parse, sort chronologically, format authors (highlighting François Pitié), and render interactive DOI/arXiv links, PDFs, and collapsible BibTeX citations.

### Teaching & Course Notes
Course pages are located under [`src/pages/teaching/`](src/pages/teaching/) with dedicated sections for:
- **EEU44C16 / EE5C16**: Deep Learning (graduate level)
- **EE55C34**: Advanced AI (postgraduate level)
- **EEU22E10**: Engineering Design Project (Robotics Buggy)
- **EEU44C08**: Digital Image & Video Processing

---

## Deployment

The website is continuously deployed:
- Every push to the `master` branch triggers the GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- The workflow installs dependencies, runs `astro build`, and publishes the static output directly to **GitHub Pages** for [`https://francois.pitie.net`](https://francois.pitie.net).

---

## License

- **Source Code**: Released under the [MIT License](LICENSE.md).
- **Content & Media**: Text, lecture notes, photographs, and figures are &copy; François Pitié. All rights reserved.
