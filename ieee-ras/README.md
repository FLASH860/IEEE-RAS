# IEEE RAS site starter

    npm install
    npm run dev

Stack: Vite + React 19 + Tailwind v4 + Motion.

- `src/App.jsx` – the 5 full-screen sections, top to bottom
- `src/components/Hero.jsx` – landing screen (video bg, text bottom-left)
- `src/components/Section.jsx` – blank full-screen section, copy/rename per screen
- `src/index.css` – Tailwind + colour tokens (`bg-void`, `text-pulse`, ...)
- `public/hero.mp4` + `public/hero-poster.jpg` – your Flow video and a still

Scroll snapping is on (see `html` in `index.css`). Delete `scroll-snap-type` and the `snap-start` classes to turn it off.
