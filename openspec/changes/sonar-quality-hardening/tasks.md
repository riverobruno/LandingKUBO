# Tasks: Sonar Quality Hardening

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 450–650 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: security/runtime → PR 2: coverage |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Immutable actions and hardened runtime | PR 1 | `docker build --file Front/Dockerfile Front && docker build --file backend/Dockerfile --target build backend` | `docker compose up -d --build`; verify UID, `8080`, SPA, and `/api/` | Workflow, Dockerfiles, Nginx, and Compose files |
| 2 | LCOV transport and reliability fix | PR 2 | `cd backend && npm test`; `cd Front && npm run test:run && npm run build && npm run lint` | Run coverage workflow; preflight reports before Sonar | Coverage/config files and `DemoSummaryScreen.tsx` |

## Phase 1: Foundation and RED Tests

- [x] 1.1 Add frontend Vitest/V8 configuration and scripts in `Front/package.json`, `Front/package-lock.json`, and `Front/vitest.config.ts`.
- [x] 1.2 **RED:** Create `generateDemoDesign.test.ts`, `generateDemoModel.test.ts`, and `DemoSummaryScreen.test.tsx` for fetch failures and success/`NotAllowedError` feedback; run frontend tests.
- [x] 1.3 **RED:** Extend `backend/src/demo/demo.controller.spec.ts` to assert both demo routes; run `cd backend && npm test`.
- [x] 1.4 **RED:** Add `.github/workflows/ci.yml` checks that fail on mutable actions, missing LCOV, or unnormalized `SF:` paths; reject the baseline.
- [x] 1.5 **RED:** Add workflow checks for non-root frontend execution, internal `8080`, SPA delivery, and unchanged `/api/` proxying; detect baseline failures.

## Phase 2: Security, Coverage, and Reliability GREEN

- [x] 2.1 Pin Docker/artifact actions to validated full SHAs and add `--ignore-scripts` to the three installs in `.github/workflows/ci.yml`, `Front/Dockerfile`, and `backend/Dockerfile`.
- [x] 2.2 Replace the frontend runtime with validated non-root Nginx on `8080`; update `Front/nginx.conf` and `compose.yml` while preserving external port and `/api/` forwarding.
- [x] 2.3 Add frontend V8 and backend LCOV scripts with lockfile updates; keep `node:test`, and normalize Sonar paths in `sonar-project.properties` without exclusions.
- [x] 2.4 Simplify only the conditional in `DemoSummaryScreen.tsx`, preserving abort, denied, clipboard, download, and success feedback.

## Phase 3: CI Integration and Verification

- [x] 3.1 In `.github/workflows/ci.yml`, run coverage in disposable containers, copy LCOV before removal, normalize `SF:`, transfer artifacts, and preflight before Sonar.
- [x] 3.2 Verify Compose startup, frontend UID, `8080`, SPA, and `/api/`; run frontend build/lint and backend tests.
- [x] 3.3 Verify LCOV prefixes, Sonar consumption, ≥80% new-code coverage, and publish gating.
- [x] 3.4 Review the diff for the five requirements; confirm no suppression, fabricated report, unrelated refactor, or forbidden-file change.
