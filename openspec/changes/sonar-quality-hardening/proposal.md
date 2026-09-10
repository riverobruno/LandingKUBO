# Proposal: Sonar Quality Hardening

## Intent

Restore the latest SonarCloud Quality Gate by fixing only its evidenced new-code security and 0% coverage failures, plus the reported redundant conditional keeping reliability below A. Preserve the current tree and reverted post-SAST state.

## Scope

### In Scope
- Pin six mutable Docker Action references in `.github/workflows/ci.yml` to validated full SHAs; pin new artifact actions likewise.
- Add `--ignore-scripts` to three Dockerfile `npm ci` commands and replace root-default frontend Nginx with a validated non-root runtime, preserving port `8080` and `/api/` proxying.
- Add minimal frontend/backend coverage, generate normalized repository-root LCOV in disposable containers, transfer it to Sonar, and remove the conditional without changing feedback.

### Out of Scope
- No `README.md`, `openspec/config.yaml`, or unrelated application changes.
- No legacy smells, React Three Fiber/Three.js findings, broad refactor, or rating-manufacturing suppression/exclusion.
- No previously reverted broad SAST-hardening work.

## Capabilities

### New Capabilities
- None — bounded security, CI, runtime, and verification hardening only.

### Modified Capabilities
- None — `openspec/specs/` is empty; no observable product requirements change.

## Approach

Use the container-first recommendation: validate Action SHAs before editing; harden images; retain backend `node:test`; add minimal frontend V8 coverage; copy reports before container removal; normalize `SF:` entries to `Front/src/...` and `backend/src/...`; and preflight reports before Sonar. Chain security/runtime and coverage slices if needed for the 400-line budget.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | Modified | Pins, container coverage, report transfer. |
| `Front/Dockerfile`, `backend/Dockerfile` | Modified | Install/runtime hardening. |
| `Front/nginx.conf`, `compose.yml` | Modified | Required unprivileged-port changes only. |
| `DemoSummaryScreen.tsx`, `Front/`, `backend/` | Modified | Conditional, tests, coverage tooling. |
| `sonar-project.properties` | Modified | Scopes and LCOV paths. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Non-root Nginx breaks writes, ports, or proxying. | Med | Check startup, `8080`, and `/api/`. |
| LCOV is absent, relative, or excluded. | Med | Assert files and `SF:` paths pre-scan. |
| Ignored lifecycle scripts are required. | Low | Run hardened container builds/tests. |

## Rollback Plan

Revert each implementation slice independently, restoring Dockerfiles, workflow, runtime config, tests, and conditional. Leave `openspec/config.yaml` untouched.

## Dependencies

- Validated Action SHAs, Docker, and SonarCloud report upload access.

## Success Criteria

- [ ] Sonar reports `new_security_rating = 1` without suppression.
- [ ] New-code coverage is at least `80%` with normalized LCOV paths.
- [ ] Project reliability reaches A after the conditional fix.
- [ ] Container tests/builds, frontend build/lint, runtime/proxy checks, and LCOV preflight pass; unrelated files remain unchanged.
