## Exploration: sonar-quality-hardening

### Current State
The current repository is on `fix/aprobarSAST` at `ee0723d` and contains the Docker, Compose, GitHub Actions, and SonarCloud changes from the CI lineage. The working tree has one pre-existing modification, `openspec/config.yaml`; it must remain untouched. `openspec/specs/` is empty and no prior artifact exists for this change.

The latest public SonarCloud analysis for project `riverobruno_LandingKUBO` matches revision `ee0723d` and reports a red Quality Gate. The failed conditions are:

- `new_security_rating`: `3` (threshold `1`), caused by 10 open vulnerabilities.
- `new_coverage`: `0.0` (threshold `80`).

The same report passes new-code reliability, maintainability, duplication, and reviewed-hotspot conditions. At project level, reliability is still rated `3.0` because of one open bug, security is `3.0`, maintainability is `1.0`, and there are 48 code smells. The reported findings map to the current tree as follows:

- `.github/workflows/ci.yml` lines 47, 53, 58, 64, 67, and 77 use mutable Docker Action tags (`v6`, `v4`, `v4`, `v7`, and `v7`) instead of full commit SHAs. The existing checkout and Sonar action pins are already immutable and should not be recreated or changed.
- `Front/Dockerfile:8`, `backend/Dockerfile:10`, and `backend/Dockerfile:32` run `npm ci` without `--ignore-scripts`.
- `Front/Dockerfile:16` uses the root-default `nginx:alpine` runtime image.
- `Front/src/components/Demo/DemoSummaryScreen.tsx:36` contains a redundant conditional. It does not fail the latest new-code reliability gate, but it is the single source of the project-level reliability rating below A and was confirmed by the current report.
- `sonar-project.properties` has only project identity settings. There are no source/test scopes, LCOV paths, coverage-producing scripts, frontend test runner, or coverage-producing CI steps. The backend has a Node test runner, but its current test only asserts the design endpoint returns HTTP 200; the frontend has no configured test runner.

The current monorepo layout makes repository-root coverage paths relevant: frontend and backend commands execute from separate package roots, while SonarCloud analyzes the repository root. LCOV generation must therefore be validated for `SF:` paths and normalized to `Front/src/...` and `backend/src/...` if the tools emit package-relative paths. Coverage extraction from disposable test containers is also needed if the existing container-first CI convention is preserved.

### Affected Areas
- `.github/workflows/ci.yml` — pin all six currently mutable Docker Action references and add containerized coverage generation plus artifact transfer; any newly introduced artifact actions must also use full SHAs.
- `Front/Dockerfile` — add `--ignore-scripts` to the build install and replace the root-default Nginx runtime with a validated non-root runtime/configuration.
- `backend/Dockerfile` — add `--ignore-scripts` to both dependency installs.
- `Front/nginx.conf` and `compose.yml` — adjust the internal listener and host mapping only if the selected non-root Nginx runtime requires an unprivileged port; preserve the existing public frontend port and `/api/` proxy behavior.
- `Front/src/components/Demo/DemoSummaryScreen.tsx` — simplify the redundant `NotAllowedError` conditional without changing user-facing feedback behavior.
- `Front/src/API/Cliente/generateDemoDesign.ts` and `Front/src/API/Cliente/generateDemoModel.ts` — provide the changed frontend API behavior that must be represented in the coverage report.
- `Front/package.json`, `Front/package-lock.json`, and targeted frontend test/config files — introduce the smallest frontend test and V8 coverage capability needed to measure those changed API modules.
- `backend/src/main.ts`, `backend/package.json`, `backend/package-lock.json`, and `backend/src/demo/demo.controller.spec.ts` — add backend coverage execution and assertions sufficient to cover the changed backend behavior while retaining the built-in `node:test` runner; treat the bootstrap entrypoint explicitly if it is not exercised by the test harness.
- `sonar-project.properties` — scope application sources/tests, exclude generated/dependency output, and point SonarCloud at the normalized frontend and backend LCOV reports.

### Explicit Non-Goals
- Do not change `README.md`, `openspec/config.yaml`, or unrelated application behavior.
- Do not fix the remaining legacy maintainability findings, including the React Three Fiber/Three.js findings, broad prop-readonly findings, nested ternaries outside the reported redundant conditional, or accessibility findings that do not cause a failed target rating.
- Do not suppress, exclude, or mark vulnerabilities as resolved merely to manufacture an A rating.
- Do not recreate the previously reverted broad SAST-hardening implementation; only the findings still present in the current report and tree are in scope.

### Approaches
1. **Container-first targeted hardening and coverage** — apply the security corrections in the existing Docker/CI paths, run backend and frontend coverage inside disposable build-stage containers, copy LCOV files out before removing those containers, normalize repository-relative paths, then upload/download the reports for the Sonar job.
   - Pros: preserves the current requirement that CI tests run in containers; validates the same dependency installation and build environments used by the workflow; produces real coverage instead of changing the gate configuration.
   - Cons: requires a small coverage tool/test addition in each package, artifact plumbing, and careful cleanup/path handling; dependency lockfiles and tests may exceed one 400-line review slice.
   - Effort: Medium/High

2. **Runner-native targeted hardening and coverage** — install dependencies and run the package test/coverage commands directly on the GitHub runner, leaving Sonar in the same job so LCOV stays in the workspace.
   - Pros: simpler report handling and fewer Docker container lifecycle steps.
   - Cons: diverges from the current containerized test contract, duplicates environment assumptions, and would not verify the Docker install path that contains the reported `npm ci` vulnerabilities.
   - Effort: Medium

### Recommendation
Use the container-first approach. It directly remediates the 10 current security vulnerabilities: pin the six mutable action references to full SHAs, add `--ignore-scripts` to the three affected installs, and make the frontend runtime demonstrably non-root while preserving its external port and API proxy. Add actual targeted coverage for the changed backend/frontend source, emit and normalize LCOV for the repository-root Sonar scan, and transfer those reports from the disposable test containers.

Also simplify the redundant conditional because the current project-level reliability rating is `3.0`; this is a one-line, behavior-preserving correction and is the only non-security issue explicitly evidenced by the current report. Do not broaden that correction into a cleanup of the 48 existing code smells. The implementation should validate the resolved Action SHAs immediately before editing; the currently resolved tag commits are `docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302`, `docker/login-action@dbcb813823bdd20940b903addbd779551569679f`, `docker/setup-buildx-action@37fe631027851001ddb9b187196cc803df7f5f0e`, and `docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a`.

Decision needed before apply: No
Chained PRs recommended: Yes
400-line budget risk: Medium

### Risks
- Running Nginx as a non-root user may require an internal unprivileged listener and writable PID/cache locations; Docker Compose and endpoint checks must prove that the existing host port and `/api/` behavior remain intact.
- `--ignore-scripts` intentionally disables dependency lifecycle scripts; both package builds and tests must confirm that this repository does not rely on one at build or runtime.
- Coverage can remain at zero if LCOV paths are package-relative, reports are not present in the Sonar job, or changed source is excluded accidentally. Validate report files and `SF:` entries before the remote scan.
- Adding frontend coverage tooling and lockfile entries may exceed the review budget; split security/runtime hardening from coverage plumbing if the task forecast becomes high.
- Local verification cannot prove the remote SonarCloud Quality Gate; the final workflow run must be checked against the public project analysis.

### Ready for Proposal
Yes. The proposal should state that the required scope is the two failed latest-gate aspects (new-code security and coverage), include the one evidenced project-level reliability correction, preserve all existing reverted-state and React Three Fiber non-goals, and plan containerized verification before the SonarCloud scan.
