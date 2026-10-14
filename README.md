# Syed Ibrahim Khaliulla — Portfolio

A scroll-driven 3D desk built with React, three.js (react-three-fiber) and Lenis.
Every object on the desk is modelled in code; the only image is `public/photo.jpg`.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

## Deploy

- **Vercel / Netlify**: import the repo. Build command `npm run build`, output folder `dist`.
- **GitHub Pages**: push `dist/` to a `gh-pages` branch. Paths are relative, so it works under `/<repo>/`.

## Edit content

- Text, projects, jobs, skills: `src/data.js`
- Code shown on the monitor: `FILES` in `src/scene/Screens.jsx`
- Camera stops per section: `KEYS` in `src/scene/CameraRig.jsx`
- Photo: replace `public/photo.jpg`. Résumé: replace `public/resume.pdf`.

`?shot=N` in the URL jumps straight to section N (0–5) with no camera easing. Useful for screenshots.
