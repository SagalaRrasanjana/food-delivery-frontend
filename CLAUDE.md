# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint over the project
- `npm run preview` — preview the production build locally

There is no test runner configured in this project.

## Architecture

This is a plain Vite + React 19 SPA (JavaScript, not TypeScript) that is the frontend for a microservices-based food delivery system. There is no state management library (no Redux/Zustand/Context) — each page component manages its own local state with `useState`/`useEffect`.

**Backend integration**: The app talks to a Spring Boot backend (implied by comments referencing an "API Gateway" and per-domain services — auth, restaurant, menu, order) through a single Axios instance at `src/api/axiosInstance.js`. That instance:
- Points at `http://localhost:8000` (the API gateway) as `baseURL`.
- Injects `Authorization: Bearer <token>` on every request via a request interceptor, reading the JWT from `localStorage` under the key `jwt_token`.

Any new API call should go through this `api` instance rather than raw `axios`/`fetch`, so auth headers stay consistent.

**Auth and role routing**: There is no dedicated auth context/provider or `ProtectedRoute` component yet — routing by role is handled ad hoc in `Login.jsx`. On login, the JWT returned by `/api/auth/login` is stored in `localStorage`, then manually base64-decoded (`atob` on the payload segment) to read a `role`/`authorities` claim and `navigate()` to the matching dashboard:
- `ADMIN` / `ROLE_ADMIN` → `/admin` (`AdminDashboard.jsx`)
- `RESTAURANT_OWNER` / `ROLE_RESTAURANT_OWNER` → `/dashboard` (`OwnerDashboard.jsx`)
- anything else (customer) → `/history` (`OrderHistory.jsx`)

Routes are declared in `src/App.jsx` using `react-router-dom` v7 (`BrowserRouter`/`Routes`/`Route`). Logout (in the dashboard components) just does `localStorage.removeItem('jwt_token')` and navigates to `/`.

**Page components are self-contained**: `Login.jsx`, `Register.jsx`, `OrderHistory.jsx`, `AdminDashboard.jsx`, `OwnerDashboard.jsx`, `RestaurantMenu.jsx` each own their layout, inline styles (via JS style objects, not CSS modules/Tailwind), data fetching, and local UI state. There's no shared component library — styling is duplicated per-page rather than factored into reusable components. When editing one page's look, don't assume shared styles will propagate elsewhere.

**Role-specific dashboards hit different endpoints**:
- `OwnerDashboard.jsx` is a Kitchen Display System: polls `GET /api/orders/restaurant/{restaurantId}` every 10s, advances orders through `PUT /api/orders/{orderId}/status` (`PENDING` → `PREPARING` → `READY`), and adds menu items via `POST /api/menu-items`. The restaurant ID is currently hardcoded to `1` (`RESTAURANT_ID` constant) — there's no owner→restaurant lookup yet.
- `AdminDashboard.jsx` is currently built on mock/local state only (hardcoded stats, pending restaurants, activity log) — the real `GET /api/admin/dashboard-stats` call is stubbed out (commented) in a `useEffect`. Treat its data as non-live until that's wired up.
- `RestaurantMenu.jsx` fetches `GET /api/restaurants/{id}` and `GET /api/menu-items/restaurant/{id}`, keeps an in-memory cart, and checks out via `POST /api/orders`. **Note:** this component is not currently registered in `App.jsx`'s route table — it exists but has no route path yet.
- `OrderHistory.jsx` fetches `GET /api/orders/history` and renders a status tracker (`PENDING` → `PREPARING` → `READY`) per order.

## Conventions

- Component files are named `PascalCase.jsx` and live flat in `src/` (no `components/`, `pages/`, or feature folders yet — `src/api/` is the only subfolder).
- ESLint config (`eslint.config.js`) uses the flat config format with `js.configs.recommended`, `eslint-plugin-react-hooks` (flat recommended), and `eslint-plugin-react-refresh` (vite preset). No TypeScript, no Prettier config present.
