# Design: Sonar Quality Hardening

## Technical Approach

Implement two reviewable slices: CI/container security and coverage/reliability. Preserve the container-first workflow, backend `node:test`, relative `/api` calls, public port `8080`, and Compose topology. Exclude product API, README, config bootstrap, broad SAST, and React Three Fiber changes.

## Architecture Decisions

| Decision | Choice | Alternatives rejected | Rationale |
|---|---|---|---|
| Action integrity | Replace six mutable Docker tags with validated 40-character SHAs; keep checkout/Sonar pins; pin artifact actions likewise. | Tags or partial SHAs. | Prevents action drift. Revalidate the known Docker SHAs before editing. |
| Dependency lifecycle | Add `--ignore-scripts` to the three Docker `npm ci` commands. | Runner-native installs or broad dependency changes. | Hardens the reported install boundary while builds/tests prove scripts are unnecessary. |
| Frontend runtime | Use a validated unprivileged Nginx image on internal `8080`; retain `proxy_pass http://backend:3000/`; map Compose `8080:8080`. | Root-default Nginx or changing the public port. | Non-root binding preserves external access and `/api/` semantics. |
| Coverage transport | Run coverage in disposable build containers, `docker cp` LCOV before removal, normalize root `SF:` paths, transfer reports, and preflight before Sonar. | Runner-native tests or exclusions/fabricated reports. | Preserves the CI contract and supplies `Front/src/...` and `backend/src/...`. |
| Reliability fix | Simplify the redundant ternary to the equivalent abort-versus-denied decision. | Refactor surrounding share/download logic. | Removes only the evidenced smell; all non-abort failures retain denied feedback. |

## Data Flow

```text
Docker build stages -> disposable test containers -> docker cp LCOV
       -> normalize SF paths -> upload artifact -> Sonar download/preflight
       -> Sonar quality gate -> publish images only on success
```

## File Changes

| File | Action | Requirement mapping |
|---|---|---|
| `.github/workflows/ci.yml` | Modify | R1 immutable refs; R2 container builds; R3 coverage transfer, normalization, artifact actions, preflight. |
| `Front/Dockerfile`, `backend/Dockerfile` | Modify | R2 install hardening; preserve test build targets. |
| `Front/nginx.conf`, `compose.yml` | Modify | R2 internal port, public port, and `/api/` proxy. |
| `Front/package.json`, `Front/package-lock.json`, `Front/vitest.config.ts` | Modify/create | R3 Vitest/V8 coverage using the Vite alias and existing `test:run` convention. |
| `Front/src/API/Cliente/generateDemoDesign.test.ts`, `generateDemoModel.test.ts`, `Front/src/components/Demo/DemoSummaryScreen.test.tsx` | Create | R3 API coverage; R4 feedback equivalence; R5 error branches. |
| `backend/package.json`, `backend/package-lock.json`, `backend/src/demo/demo.controller.spec.ts` | Modify | R3 retain `node:test`, add LCOV, assert both routes. |
| `sonar-project.properties` | Modify | R3 root scopes and LCOV paths; no coverage exclusions. |
| `Front/src/components/Demo/DemoSummaryScreen.tsx` | Modify | R4/R5 behavior-preserving simplification. |

## Interfaces / Contracts

No application interface changes. Package scripts produce `coverage/lcov.info`; CI publishes `coverage/frontend/lcov.info` and `coverage/backend/lcov.info`. Sonar consumes both. Frontend paths and Nginx `/api/` forwarding remain unchanged.

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | Frontend validators/fetch failures and feedback | Vitest/V8 mocks `fetch` and `navigator.share`; backend `node:test`/Supertest covers both routes. |
| Integration | Install hardening, builds, LCOV, normalization | Build both Docker targets, run coverage in disposable containers, copy before removal, assert reports and `SF:` prefixes before Sonar. |
| Runtime | Non-root Nginx, port, proxy | Compose checks identity, host `8080`, SPA, and `/api/`. Mutable action, missing report, bad prefix, root process, or broken proxy are RED cases. |

## Threat Matrix

The CI changes use shell/container process integration, so the required matrix was inspected. Every VCS/PR-oriented row is explicitly out of scope:

| Boundary | Applicability | Safe/failure behavior and planned RED test |
|---|---|---|
| Documentation-like paths | N/A — no executable-file classification or documentation execution is changed. | No task/test. |
| Git repository selection | N/A — workflow uses the checked-out repository root; no `git -C` or selector is added. | No task/test. |
| Commit state | N/A — no staging, commit, or index operation is automated. | No task/test. |
| Push state | N/A — publish pushes container images, not Git refs. | No task/test. |
| PR commands | N/A — no PR command or composed GitHub CLI command is added. | No task/test. |

## Migration / Rollout

No migration or flag. Apply security/runtime first, then coverage/reliability if the 400-line forecast requires chaining. Sonar remains before `publish`; rollback reverts either slice independently. `README.md` and `openspec/config.yaml` remain untouched.

## Open Questions

- None blocking. Validate artifact-action SHAs and the selected unprivileged Nginx image immediately before implementation.
