# Apply Progress: Sonar Quality Hardening

## Work Unit

- Change: `sonar-quality-hardening`
- Slice: Work Unit 2 — LCOV transport and reliability correction
- Delivery: `auto-chain`, `stacked-to-main`
- Review boundary: second stacked PR slice; frontend/backend coverage, LCOV transport, and one behavior-preserving reliability correction
- Mode: Strict TDD

## Completed Tasks

- [x] 1.1 Add frontend Vitest/V8 configuration and scripts.
- [x] 1.2 Add frontend API-client and DemoSummary behavior tests.
- [x] 1.3 Assert both backend demo routes.
- [x] 1.4 Add immutable-action and LCOV preflight checks.
- [x] 1.5 Add workflow checks for non-root frontend execution, internal `8080`, SPA delivery, and unchanged `/api/` proxying.
- [x] 2.1 Pin the six mutable Docker action references to validated full SHAs and add `--ignore-scripts` to all three Docker `npm ci` commands.
- [x] 2.2 Replace root-default frontend Nginx with the validated non-root runtime on internal `8080`, preserving the external port and `/api/` forwarding.
- [x] 2.3 Add frontend V8/backend LCOV scripts, lockfiles, and normalized Sonar paths.
- [x] 2.4 Simplify the redundant DemoSummary conditional without changing feedback.
- [x] 3.1 Run disposable-container coverage, copy and normalize LCOV, transfer the artifact, and preflight Sonar input.
- [x] 3.2 Verify Compose startup, frontend/backend runtime identities, `8080`, SPA delivery, `/api/` proxying, frontend build/lint, and backend tests.

## TDD Cycle Evidence

| Task | Test File / Check | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.5 | Inline Python action scan and runtime shell checks in `.github/workflows/ci.yml` | Integration/runtime | Existing backend test: 1/1 passed | ✅ Baseline action scan failed on six mutable refs; baseline runtime scan failed because Nginx listened on 80 and Compose mapped `8080:80` | ✅ Post-change immutable scan and Compose harness passed | ✅ UID, internal listener, SPA fallback, and `/api/` payload checks passed | ✅ Checks bounded to the affected workflow job |
| 2.1 | Dockerfile/workflow static checks plus Docker builds | Structural/container | Existing backend test: 1/1 passed | ✅ Baseline inspection showed six mutable Docker refs and three `npm ci` commands without `--ignore-scripts` | ✅ All six refs are full SHAs; all three installs ignore scripts; frontend/backend build targets pass | ✅ Counted each affected install and each action occurrence | ➖ Structural-only change; no additional production refactor |
| 2.2 | Compose runtime harness | Integration/runtime | Baseline frontend image inspected as root on port 80 | ✅ Baseline UID/config check failed for non-root and internal 8080 requirements | ✅ Frontend runs as UID 101 on 8080 and serves through Compose | ✅ Direct SPA fallback and proxied backend response both passed | ✅ Runtime image/config changes remain limited to Nginx, port, ownership, and install hardening |
| 3.2 | `npm test`, `npm run build`, `npm run lint`, Docker Compose harness | Integration/runtime | Backend baseline: 1/1 passed | ✅ Baseline runtime checks rejected the required hardened contract | ✅ Focused tests/build/lint and runtime harness passed | ✅ Frontend UID, backend non-root UID, host port, SPA, and `/api/` were independently checked | ➖ Verification task only |
| 1.1 | `Front/vitest.config.ts` and package scripts | Structural | Frontend build/lint baseline passed | ✅ `npm run test:run` was unavailable before the runner script and configuration | ✅ Vitest/V8 configuration ran 3 files and 12 tests | ➖ Structural-only configuration | ✅ Coverage output and alias resolution verified in the container |
| 1.2 | `Front/src/API/Cliente/*.test.ts`, `DemoSummaryScreen.test.tsx` | Unit/integration | Frontend build/lint baseline passed | ✅ Tests were written before Vitest configuration; baseline `npm run test:run` failed because the script was absent | ✅ `npm run test:run` passed: 3 files, 12 tests | ✅ API success/validation/HTTP/malformed cases and share success/denied/abort/clipboard/download paths passed | ✅ Replaced brittle matcher setup with direct user-visible status text assertions |
| 1.3 | `backend/src/demo/demo.controller.spec.ts` | Integration | Backend test baseline: 1/1 passed | ✅ Route assertions were added before coverage tooling and production changes | ✅ `npm test` passed: 2 route tests | ✅ Design and model routes independently asserted status and response payloads | ➖ Existing controller required no production refactor |
| 1.4 | Inline workflow immutable-action and LCOV checks | Integration | Existing immutable action check and backend test baseline passed | ✅ Missing LCOV and unnormalized `SF:` fixtures failed the new preflight checks | ✅ Validated workflow action scan passed for 8 covered references; valid reports passed preflight | ✅ Missing report and bad-prefix cases both fail with explicit diagnostics | ✅ Checks are scoped to Docker/artifact refs and two required LCOV reports |
| 2.3 | `Front/vitest.config.ts`, package scripts, `sonar-project.properties` | Integration/coverage | Frontend/backend build and test baselines passed | ✅ Coverage commands were unavailable before scripts/dependencies were added | ✅ Frontend V8 and backend c8 commands generated LCOV; backend retained `node:test` | ✅ Frontend API files reached 100% and DemoSummary reached 90.24% line coverage; backend reached 96.46% statements | ✅ Coverage reports are generated under ignored package-local `coverage/` directories and Sonar receives root paths |
| 2.4 | `DemoSummaryScreen.test.tsx`, `DemoSummaryScreen.tsx` | Integration/refactoring | Approval tests: 6 feedback paths passed before refactor | ✅ Approval tests captured success, denied, abort, clipboard, unsupported, and download behavior before code change | ✅ Same 6 tests passed after simplifying the conditional | ✅ Distinct abort and non-abort rejection paths plus fallback/download paths remained green | ✅ Only the redundant nested conditional was removed |
| 3.1 | `.github/workflows/ci.yml` coverage transport | Integration/container | Local package coverage baselines passed | ✅ Workflow preflight rejected missing reports and unnormalized source paths | ✅ Exact workflow coverage step ran both disposable containers, copied before cleanup, normalized 32 frontend and 6 backend entries, and passed preflight | ✅ Sonar preflight consumed both transferred normalized reports | ✅ Container names, copy-before-remove order, and artifact boundary are explicit |

## Work Unit Evidence

| Evidence | Exact result |
|---|---|
| Focused test command and exact result | `docker build --file Front/Dockerfile --tag landingkubo-front-wu1 Front` — passed; `docker build --file backend/Dockerfile --target build --tag landingkubo-backend-wu1 backend` — passed; `cd backend && npm test` — 1 test passed; `cd Front && npm run build` — passed; `cd Front && npm run lint` — passed. |
| Runtime harness command/scenario and exact result | `docker compose up -d --build`; verified frontend UID `101`, backend UID non-root (`1000` locally), frontend internal listener `8080`, host `http://localhost:8080/demo` SPA fallback, and `http://localhost:8080/api/demo/design?prompt=desk` returning `name: Placard`; cleanup with `docker compose down --volumes` passed. |
| Rollback boundary | Revert only the Work Unit 1 changes in `.github/workflows/ci.yml`, `Front/Dockerfile`, `backend/Dockerfile`, `Front/nginx.conf`, and `compose.yml`; this restores the prior action/runtime behavior without touching coverage, reliability, README, or `openspec/config.yaml`. |

## Work Unit 2 Evidence

| Evidence | Exact result |
|---|---|
| Focused test command and exact result | `cd Front && npm run test:run` — 3 files and 12 tests passed; `cd Front && npm run test:coverage` — LCOV generated, API modules 100% line coverage and DemoSummary 92.1% lines; `cd backend && npm test` — 2 tests passed; `cd backend && npm run test:coverage` — 2 tests passed and 96.46% statements. `cd Front && npm run build && npm run lint` — passed. |
| Runtime harness command/scenario and exact result | Exact workflow `Run and collect container coverage` block executed locally with Docker build targets: disposable frontend and backend coverage containers passed, `docker cp` completed before cleanup, 32 `Front/src/` and 6 `backend/src/` entries were normalized, and both normalized and Sonar preflight blocks passed. |
| Rollback boundary | Revert only Work Unit 2 changes in `.github/workflows/ci.yml`, `Front/package.json`, `Front/package-lock.json`, `Front/vitest.config.ts`, frontend tests, `backend/package.json`, `backend/package-lock.json`, `backend/src/demo/demo.controller.spec.ts`, `sonar-project.properties`, coverage ignore/lint support, and the single DemoSummary conditional; Work Unit 1 security/runtime files remain intact. |

## Validation Notes

- The four selected Docker action SHAs were revalidated immediately before editing against their `v6`, `v4`, and `v7` tags.
- The selected `nginxinc/nginx-unprivileged` image was revalidated immediately before editing; its amd64 manifest is pinned by digest and runs as UID 101 with a default 8080 listener.
- Existing immutable checkout and Sonar action SHAs remain unchanged.
- `actionlint` was unavailable locally; workflow YAML parsing, immutable-reference checks, Compose validation, Docker builds, and the real Compose runtime harness passed.
- Upload/download artifact SHAs were validated against GitHub tags `v4.6.2` and `v4.3.0`; workflow YAML and all eight shell blocks parse successfully.
- Frontend V8 and backend c8 reports are real container outputs; package-relative `SF:src/...` entries are normalized to `Front/src/...` and `backend/src/...` before artifact upload.

## Remaining Tasks

- [x] 1.1 Frontend Vitest/V8 configuration and scripts.
- [x] 1.2 Frontend RED tests.
- [x] 1.3 Backend RED route coverage test.
- [x] 1.4 Coverage/LCOV workflow RED checks.
- [x] 2.3 Frontend/backend coverage tooling and Sonar paths.
- [x] 2.4 `DemoSummaryScreen` reliability correction.
- [x] 3.1 Coverage container transport and artifact preflight.
- [x] 3.3 LCOV/Sonar coverage verification.
- [x] 3.4 Final five-requirement review.

## Final Precheck Work Unit

- Delivery: `auto-chain`, `stacked-to-main`
- Review boundary: verification-only final precheck for tasks 3.3 and 3.4; no source or implementation configuration changes made.
- Mode: Strict TDD (verification-only tasks; no production code was written, so no RED/GREEN production cycle was applicable).

### TDD Cycle Evidence

| Task | Test File / Check | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 3.3 | Exact disposable-container LCOV workflow block, Sonar property/workflow inspection, and changed-line LCOV calculation | Integration/verification | ✅ Prior focused suites and current reruns passed | ➖ N/A — verification-only task | ✅ Container reports and all preflights passed | ✅ Local new production-line approximation: 1/1 = 100% | ➖ No implementation change |
| 3.4 | Complete current diff/status review and five-requirement/non-goal checks | Structural/verification | ✅ `git diff --check` passed | ➖ N/A — verification-only task | ✅ Required review assertions passed | ✅ Requirements 1–5 and explicit non-goals reviewed | ➖ No implementation change |

### Work Unit Evidence

| Evidence | Exact result |
|---|---|
| Focused test command and exact result | `Front: npm run test:run` — 3 files, 12 tests passed; `Front: npm run test:coverage` — 3 files, 12 tests passed; `backend: npm test` — 2 tests passed; `backend: npm run test:coverage` — 2 tests passed, 96.46% statements; `Front: npm run build` and `Front: npm run lint` — passed; `npm ci --ignore-scripts --dry-run` in both packages — up to date. |
| Runtime harness command/scenario and exact result | Exact CI disposable coverage flow — frontend/backend coverage containers passed, `docker cp` occurred before cleanup, 32 `Front/src/` and 6 `backend/src/` entries normalized, and both normalized and Sonar preflights passed. Compose runtime rerun also passed with frontend UID 101, backend non-root, internal 8080, SPA fallback, and `/api/` response `Placard`. |
| Rollback boundary | No implementation rollback required for this verification-only batch. Revert only the two checklist/evidence updates in `openspec/changes/sonar-quality-hardening/tasks.md` and `apply-progress.md` to return the planning artifacts to their prior state; leave all implementation slices untouched. |

### Verification Results

- LCOV reports were generated by the real frontend V8 and backend c8 commands in disposable Docker containers, copied before container removal, normalized to `Front/src/...` and `backend/src/...`, and preflighted successfully.
- `sonar-project.properties` points to `coverage/frontend/lcov.info,coverage/backend/lcov.info`; the workflow uploads/downloads that artifact and preflights it immediately before the Sonar scan.
- The only added production source line in the Sonar source scope (`Front/src/components/Demo/DemoSummaryScreen.tsx:36`) was covered: 1/1 = 100%, exceeding the 80% new-code threshold approximation. No remote SonarCloud analysis was executed or claimed because no remote workflow run was available.
- Publish remains after `needs: sonarqube`, and `-Dsonar.qualitygate.wait=true` keeps publication gated by the Sonar quality gate on main pushes.
- The complete current diff was reviewed against all five requirements. No suppression/exclusion, fabricated report, unrelated refactor, README change, or implementation change to `openspec/config.yaml` was introduced by this change. The existing `openspec/config.yaml` working-tree modification is pre-existing SDD bootstrap state and was left untouched.
- No tracked LCOV report exists; local generated reports were disposable verification outputs and are not part of the change.

## Remaining Tasks

- [x] 3.3 LCOV/Sonar coverage verification.
- [x] 3.4 Final five-requirement review.
