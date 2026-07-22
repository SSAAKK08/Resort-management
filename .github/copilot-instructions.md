**Purpose**

This file gives AI coding agents the minimal, high-value context needed to be productive in this React + Vite project.

**Quick Start (commands)**
- **Dev:** `npm run dev` — runs Vite with HMR. Entry is `src/main.jsx`.
- **Build:** `npm run build` — produces a production build via Vite.
- **Preview:** `npm run preview` — serve the built output locally.
- **Lint:** `npm run lint` — runs ESLint across the repo.

**Architecture Overview**
- Small single-page React app bootstrapped with Vite (`vite.config.js`).
- `src/main.jsx` mounts the app in `index.html` via `createRoot`. `App.jsx` composes the page — currently imports `DetailRoom`.
- UI uses Tailwind CSS and `flowbite-react` components; Tailwind is configured via `src/index.css` and Vite plugin `@tailwindcss/vite`.
- Images and static media live under `src/assets/` and are imported directly in components (example: `import photo from "../../assets/DetailRoom/Room.jpg"`).

**Important Files & Directories**
- `package.json` — scripts and deps (`vite`, `@vitejs/plugin-react`, `flowbite-react`, `tailwindcss`).
- `vite.config.js` — React compiler, Tailwind, Flowbite and a Babel preset are enabled.
- `src/` — app source.
  - `src/main.jsx` — app bootstrap.
  - `src/App.jsx` — root component (currently renders `DetailRoom`).
  - `src/components/` — UI components grouped by feature (e.g., `DetailRoom`, `booking`, `home`, `restaurant`).
  - `src/components/data/` — static data modules (arrays/objects exported from JS files) used to populate cards and lists.
  - `src/assets/` — images per feature folder.

**Project-Specific Patterns & Conventions**
- Components are in `src/components/<Feature>/` with PascalCase filenames and `.jsx` extensions.
- CSS is Tailwind-first: JSX contains utility classes; expect design work to live in markup rather than separate CSS files.
- Data is centralized per-feature in `src/components/data/*.js` and imported directly by components.
- Note the non-standard directory name `hearder&footer` (typo) — imports use that exact folder name (example in `DetailRoom.jsx`: `import Navbar from "../hearder&footer/Navbar"`). Do not rename without coordinating repo owners.
- Image imports are static ES imports (not URLs). Use the same pattern when adding images: import then reference in `src`.

**Behavior & Integration Points**
- No backend in this repo — views use local data modules. If integrating an API, add a new `src/services/` folder and keep fetch logic out of presentational components.
- Vite plugins in `vite.config.js` affect compilation (React compiler preset + Babel roll-down plugin). Avoid changing presets unless performance issues are measured.

**Common Tasks — Implementation Notes**
- Add a component: create `src/components/MyFeature/MyFeature.jsx` and optional `MyFeature.css` if needed; export default component and import from `App.jsx` or a route.
- Add static data: create or extend `src/components/data/<name>.js` and export arrays/objects; import in components.
- Add assets: place under `src/assets/<feature>/` and import with relative path.
- Run linting before PR: `npm run lint`.

**Files to Inspect When Working**
- `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/components/DetailRoom/DetailRoom.jsx`, and `src/components/data/` files.

**When to Ask the Human**
- If you need to rename `hearder&footer` to `header-footer` (typo fix), confirm first — many relative imports depend on it.
- If you want to change compilation presets (React compiler / Babel), ask because it affects developer build performance.

If anything here is unclear or you want more detail (routing, adding TypeScript, or CI steps), tell me which area to expand.
