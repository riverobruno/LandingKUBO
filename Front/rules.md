# Frontend Project Rules

These rules are mandatory guidance for frontend contributors. Read this file before implementing frontend functionality in `Front/`.

## Scope

- These rules apply only to the frontend application.
- Apply these rules to this frontend project root and all files below it.
- Apply these rules to React, TypeScript, Vite, Tailwind CSS, routing, auth, API calls, and frontend folder structure.
- Do not apply these rules to backend code, database code, infrastructure, deployment scripts, or server-side architecture.

## Stack

- Use React with TypeScript and Vite.
- Use `react-router-dom` for client-side routing.
- Use Tailwind CSS for styling.
- Use `lucide-react` for icons.
- Follow the approved local-auth contract: memory-only access tokens and backend-managed HttpOnly refresh cookies.
- Do not add OAuth, password recovery, administration, or role-specific authorization without a new approved change.

## Commands

- Start development with `npm run dev`.
- Build with `npm run build`.
- Lint with `npm run lint`.
- Run frontend behavioral tests with `npm run test:run`.
- Preview production build with `npm run preview`.

## Dependency Installation

- Install frontend dependencies through the Docker-aware Makefile helper, not with host `npm install`.
- Use `make frontend-install PKG=<package>` for runtime frontend dependencies.
- Use `make frontend-install PKG="-D <package>"` for frontend development dependencies.
- Keep `package.json` and `package-lock.json` committed after dependency changes.
- Do not commit `node_modules`; it lives in the Docker-managed frontend volume.
- If a branch brings new dependencies, run `make dev` so Docker refreshes the frontend environment.
- If the running frontend container still cannot resolve a newly added package, restart the development environment with `make dev-down` followed by `make dev` instead of deleting files manually.

## TypeScript

- Keep TypeScript strict mode enabled.
- Do not allow unused locals or unused parameters.
- Use React JSX transform with `jsx: react-jsx`.
- Use bundler module resolution.
- Prefer path alias imports with `@/` for files inside `src`.
- Keep the `@` alias mapped to `./src` in both `vite.config.ts` and `tsconfig.app.json`.

## Folder Structure

- Put route-level screens in `src/pages`.
- Split public pages under `src/pages/`.
- Put reusable feature components in `src/components/<FeatureName>`.
- Put shared layout components in `src/layout`.
- Put route guard components in `src/components/Proteger`.
- Put API functions in `src/API`.
- Split API functions by user role under `src/API/Cliente`
- Put global React context providers in `src/context`.
- Put shared utilities in `src/lib`.

## Routing

- Keep route definitions centralized in `src/routes.tsx`.
- Wrap the app router with `BrowserRouter`.
- Use layout routes with `Outlet` for sections that share navigation and page shell.
- Use `ClienteLayout` for public pages.
- Use a fallback route with `path="*"` for unknown URLs.
- Protect authenticated routes with wrapper components instead of checking permissions inside every page.
- Use the shared authenticated route guard for private sections; supported roles currently have equivalent access.
- Treat `cliente` as the primary authenticated ideation surface.
- Redirect unauthorized users with `Navigate` and preserve the current location in `state.from`.

## Authentication

- Keep access tokens in module memory only; never write them to localStorage, sessionStorage, or script-readable cookies.
- Let the backend own the scoped HttpOnly refresh cookie and send `credentials: include` for auth transport.
- Bootstrap browser sessions through refresh before exposing public auth forms or protected content.
- Attach the bearer access token through the shared authenticated fetcher.
- After a protected request returns 401, refresh and retry exactly once; treat failed refresh or a second 401 as unauthenticated.
- Keep auth state in `src/auth/AuthProvider.tsx` and expose it through `src/auth/AuthContext.ts`.
- Do not add role-specific authorization until requirements define different permissions.

## API Layer

- Keep network calls out of page JSX when they can be isolated in `src/API` functions.
- Use native `fetch` for HTTP requests.
- Do not use Axios unless the project explicitly changes this rule.
- Split API modules by role: `src/API/Cliente`
- Put shared auth or generic API helpers in `src/API/shared` only when they are reused by more than one role.
- Export one function per backend operation, for example `getServicios`, `createServicio`, `updateServicio`, and `deleteServicio`.
- Send auth headers through the shared authenticated fetcher for protected endpoints.
- Send JSON bodies with `Content-Type: application/json`.
- Throw explicit errors when the server response is not OK.
- Keep backend endpoint paths in API files, not scattered through components.
- Do not hardcode the local backend port in source files.
- In development, frontend source API functions MUST call relative backend paths (for example `/furniture/...`) and let the Vite dev proxy reach the backend.
- Configure the Vite dev proxy from the `DEV_BACKEND_PORT` environment variable; do not introduce source-level API base URL variables for local development.

## Components

- Use function components.
- Keep page components responsible for screen composition and flow state.
- Keep reusable UI pieces in `src/components`.
- Keep reusable presentational components free of business logic when possible.
- Type component props with local interfaces when the props are specific to that component.
- Use named exports for shared utilities and route guard components.
- Default exports are acceptable for pages and feature components, matching the current project style.
- Avoid adding new abstraction layers unless there is repeated logic or a clear reuse point.

## State And Effects

- Use `useState` for local UI selections and form state.
- Use `useEffect` for fetching data triggered by page/component lifecycle or selected values.
- Guard API calls until required IDs or selected values exist.
- Keep transient cross-reload UI feedback in `sessionStorage` only when the flow needs to survive a reload.
- Clean up one-time `sessionStorage` flags after reading them.

## UI And Styling

- Use Tailwind utility classes directly in JSX for layout and visual styling.
- Use small helper functions only when conditional class composition becomes hard to read.
- Keep theme tokens as CSS variables in `src/index.css`.
- Keep Tailwind theme extensions in `tailwind.config.js`.
- Use dark-mode support through the `class` strategy.
- Build UI directly with Tailwind CSS classes instead of installing a component library.
- Extract repeated Tailwind markup into local React components only after the pattern appears more than once.

## Naming

- Use PascalCase for React components.
- Use camelCase for variables, functions, and state setters.
- Use Spanish domain names when they match the product language, for example `cliente`, `proveedor`, `fabricante`, `producto`, `pedido`, and `reserva`.
- Keep route guard names explicit about the allowed role, for example `ClienteRoute`, `ProveedorRoute`, and `FabricanteRoute`.
- Keep API function names action-oriented: `get...`, `create...`, `update...`, `delete...`, `reservar...`.

## Imports

- Prefer `@/` imports for cross-folder imports inside `src`.
- Relative imports are acceptable for very close files, but avoid long `../../..` chains in new code.
- Import shared utilities from `@/lib/...`.
- Import API functions from `@/API/...`.

## Linting And Quality

- Keep ESLint configured with `@eslint/js`, `typescript-eslint`, `react-hooks`, and `react-refresh`.
- Do not introduce unused imports, unused variables, or unused parameters.
- Prefer small, focused changes over broad rewrites.

## Security Notes

- Access JWTs are memory-only and disappear on reload.
- Refresh tokens are opaque and backend-set with `HttpOnly`, `SameSite=Lax`, the auth path, and `Secure` in production.
- Do not expose secrets in frontend code.
- Do not hardcode API URLs or backend ports in source files.

## New Feature Checklist

- Add route-level pages under `src/pages/<Area>`.
- Add reusable feature components under `src/components/<Feature>`.
- Add backend calls under the correct role folder: `src/API/Cliente`
- Build the interface with Tailwind CSS utilities.
- Protect private routes with the shared authenticated route guard.
- Run `npm run lint`.
- Run `npm run typecheck:test` when adding or modifying frontend tests.
- Run `npm run test:run` for frontend behavior changes.
- Run `npm run build`.
