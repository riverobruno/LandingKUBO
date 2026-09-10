```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:e8fb99462b7960ddf756bb81c57ae9cd02991b64d78808b580bfcf0a6a85ab88
verdict: fail
blockers: 0
critical_findings: 0
requirements: 4/5
scenarios: 7/8
test_command: npm --prefix backend test && npm --prefix Front run test:run
test_exit_code: 0
test_output_hash: sha256:6ef85a3008cf95231de1afa4bc2fce256b96ef48abaab66ab4f2017f8d7f0be2
build_command: npm --prefix Front run build && npm --prefix backend run build
build_exit_code: 0
build_output_hash: sha256:0d7ccb03c0c523d7c7ad76c2552f7dccc3c6fee15bd9ac05ffdd8203fbb93418
```

## Verification Report

**Change**: `sonar-quality-hardening`  
**Version**: N/A  
**Mode**: Strict TDD

### Executive Summary

The 13 implementation tasks are complete, and independent local verification passed for immutable workflow references, hardened Docker installs/runtime, frontend/backend tests, coverage generation, LCOV normalization, Compose proxy behavior, and publish ordering. The verdict is **FAIL** only because no remote SonarCloud workflow result or resulting Quality Gate was available; local evidence proves the transport and gives 100% coverage for the only changed production line, but cannot prove the remote new-code rating required by the specification.

### Completeness

| Metric | Value |
|---|---:|
| Tasks total | 13 |
| Tasks complete | 13 |
| Tasks incomplete | 0 |
| Proposal/spec/design/tasks/apply artifacts | Present and read |
| Verification report before this run | Missing, as expected |

### Build, Tests, and Runtime Evidence

| Check | Command or harness | Exit | Output hash |
|---|---|---:|---|
| Backend tests | `npm --prefix backend test` | 0 | `sha256:f1b503f980eb130d43a2589299c20efe3d8f960239adc5d228223a79c6474f4e` |
| Frontend tests | `npm --prefix Front run test:run` | 0 | `sha256:6c7ef6f6139106f34964c7b3c01e4ed294645931efbf6d8fb15ef9d46d2095b5` |
| Combined test command in envelope | `npm --prefix backend test && npm --prefix Front run test:run` | 0 | `sha256:6ef85a3008cf95231de1afa4bc2fce256b96ef48abaab66ab4f2017f8d7f0be2` |
| Frontend coverage | `npm --prefix Front run test:coverage` | 0 | `sha256:e183de58b32acf5c484dc808063e36844f0f9c01966761677ee52d45896a342c` |
| Backend coverage | `npm --prefix backend run test:coverage` | 0 | `sha256:4f53dc87bd6d8e31da5ee70b874f50cdf4549291b68341b7ba674ad06e03f7b8` |
| Combined build command in envelope | `npm --prefix Front run build && npm --prefix backend run build` | 0 | `sha256:0d7ccb03c0c523d7c7ad76c2552f7dccc3c6fee15bd9ac05ffdd8203fbb93418` |
| Frontend lint | `npm --prefix Front run lint` | 0 | `sha256:bcb58e8664410962f59d63ad933862fa4169fcdd6c40e7430eeaafbfa4bb6307` |
| Docker builds | Frontend build target and backend build target | 0 | Front `sha256:a60db01a5bee373e36b603c11946238cb30e2ccc8aff8eb37522a07d330043af`; backend `sha256:b0dac02e30c9eea1dd1a7d5c6fe8f862b0086a3a4a8f6f750a63fa2c8cb30bee` |
| Compose configuration | `docker compose config` | 0 | `sha256:4db9bccbc5d8384b6554f5cedf104ffa7c4f1fcad5be1c5dbc4011c50c64942b` |
| Compose runtime harness | `docker compose up -d --build`, UID/port/SPA/proxy checks, cleanup | 0 | `sha256:68edceae95f2685dd0851c596daf47422938f956084a39812885bb722f29c439` |
| Container coverage transport | Disposable containers, `docker cp` before removal, normalization, both preflights | 0 | `sha256:c336141dfffcf44d8ccf75c5bbcf0c4e0ca51e1b9b36e8b16fa25c66d7cf7578` |
| Workflow YAML parse | PyYAML parse of `.github/workflows/ci.yml` | 0 | `sha256:b88d091978302f3978b2850678e974d93d5d7419ab2738842f3c4be8b4a2476a` |
| Diff whitespace check | `git diff --check` | 0 | `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

Test execution produced 12 passing frontend tests in 3 files and 2 passing backend route tests. The full local frontend line coverage is 12.28% (11.57% statements), because the configured include scope contains the broader untested application; changed production-line coverage is 1/1 (100%). Backend coverage is 96.46% statements/lines and 86.66% branches. The changed `DemoSummaryScreen.tsx` file is 92.1% covered by lines, with the changed line 36 covered.

### Security and CI Findings

- The six formerly mutable Docker action occurrences are now full 40-character SHAs; the two newly added artifact action references are also full SHAs. Independent `git ls-remote` validation matched all six selected action SHAs to their declared tags. Existing checkout and Sonar pins remain unchanged.
- The three Docker `npm ci` operations are hardened: one in `Front/Dockerfile` and two in `backend/Dockerfile`, all with `--ignore-scripts`; both package-level `npm ci --ignore-scripts --dry-run` checks passed.
- The frontend runtime image is `nginxinc/nginx-unprivileged` pinned by digest, defaults to UID 101, exposes/listens on 8080, and serves the Compose mapping `8080:8080`.
- The backend runtime image defaults to the non-root `node` user (observed UID 1000 in the local image).
- Compose runtime checks passed for SPA fallback at `/demo`, frontend UID 101, internal listener 8080, and `/api/demo/design?prompt=desk` returning `name: Placard` through Nginx proxying.

### Coverage and LCOV Transport

The exact disposable-container flow passed. Frontend coverage generated 32 source entries and backend coverage generated 6; `docker cp` occurred before cleanup. Normalization produced only `Front/src/...` and `backend/src/...` `SF:` paths. The normalized-report preflight and the Sonar-input preflight both passed. Independent negative fixtures confirmed rejection of a mutable action, a missing LCOV report, and an unnormalized LCOV path.

`sonar-project.properties` points Sonar at `Front/src,backend/src`, identifies the test patterns, and consumes `coverage/frontend/lcov.info,coverage/backend/lcov.info` without coverage exclusions. The workflow downloads the artifact and runs the Sonar LCOV preflight before the scan.

The local changed-line approximation is 100% (1/1) and exceeds the 80% new-code target. No remote SonarCloud execution was available, so the actual Sonar new-code coverage metric and Quality Gate remain unverified rather than claimed.

### Publish Gating

Static workflow checks passed: `publish` has `needs: sonarqube`, the Sonar scan uses `-Dsonar.qualitygate.wait=true`, the publish job is restricted to pushes to `main`, and Sonar coverage download/preflight precedes the scan. No image was pushed during verification.

### Spec Compliance Matrix

| Requirement | Scenario | Runtime evidence | Result |
|---|---|---|---|
| R1 Workflow actions are immutable | Workflow passes immutable-reference validation | `workflow-static`, remote tag/SHA validation, workflow YAML parse | ✅ COMPLIANT |
| R1 Workflow actions are immutable | Mutable reference is introduced | `negative-preflight-fixtures` rejected a mutable fixture | ✅ COMPLIANT |
| R2 Dependency installation and frontend runtime are hardened | Hardened containers operate normally | Docker builds, `npm ci --ignore-scripts --dry-run`, Compose runtime harness | ✅ COMPLIANT |
| R2 Dependency installation and frontend runtime are hardened | Runtime hardening breaks a required contract | Runtime harness asserts UID 101, 8080, SPA, and proxied payload | ✅ COMPLIANT |
| R3 Sonar receives real normalized coverage | Coverage reaches Sonar correctly | Disposable coverage flow, 32/6 normalized entries, Sonar preflight, changed-line calculation | ⚠️ PARTIAL — no remote Sonar run or measured Quality Gate |
| R3 Sonar receives real normalized coverage | Coverage is absent or package-relative | Normalized preflight plus missing/unnormalized negative fixtures | ✅ COMPLIANT |
| R4 Existing API and user feedback remain equivalent | Existing flows retain behavior | 6 API-client tests, 6 DemoSummary interaction tests, and Compose proxy response | ✅ COMPLIANT |
| R5 Evidenced redundant conditional is removed | Reliability correction is behavior-preserving | 6 success/rejection/fallback/download tests and changed source inspection | ✅ COMPLIANT |

**Compliance summary**: 7/8 scenarios fully compliant; 1/8 partial due to unavailable remote evidence.

### Correctness (Static Evidence)

| Requirement | Status | Notes |
|---|---|---|
| R1 Immutable workflow actions | ✅ Implemented | Six former mutable Docker references and two artifact references use validated full SHAs. |
| R2 Hardened installation and frontend runtime | ✅ Implemented | All three installs ignore lifecycle scripts; non-root Nginx, port 8080, external mapping, and proxy behavior passed. |
| R3 Real normalized coverage to Sonar | ⚠️ Partially evidenced | Real LCOV is generated, copied before cleanup, normalized, preflighted, and configured for Sonar; remote coverage/Gate was not run. |
| R4 API and user feedback equivalence | ✅ Implemented | Existing relative API routes, proxy route, and feedback paths passed their behavioral tests. |
| R5 Redundant conditional removal | ✅ Implemented | Only the nested redundant branch was simplified; abort and non-abort feedback remain distinct. |

### Coherence (Design)

| Decision | Followed? | Notes |
|---|---|---|
| Action integrity | ✅ Yes | Full SHA pins were retained/validated; no mutable Docker or artifact action remains. |
| Dependency lifecycle | ✅ Yes | Exactly the three Docker installs use `--ignore-scripts`. |
| Frontend runtime | ✅ Yes | Digest-pinned unprivileged Nginx, internal 8080, external 8080, and unchanged `/api/` forwarding passed. |
| Coverage transport | ✅ Yes, locally | Disposable-container copy-before-remove and root-path normalization passed; remote Sonar consumption is not independently observed. |
| Reliability fix | ✅ Yes | The redundant ternary was reduced without refactoring adjacent share/download behavior. |

### Strict TDD Compliance

| Check | Result | Details |
|---|---|---|
| TDD evidence reported | ✅ | `apply-progress.md` contains evidence tables for all 13 task rows, including two verification-only rows. |
| All applicable tasks have tests/checks | ✅ | 11 implementation rows have named test/check evidence; tasks 3.3 and 3.4 are verification-only. |
| RED confirmed | ✅ | 11/11 applicable implementation rows report and have existing test/check files; verification-only rows are N/A. |
| GREEN confirmed | ✅ | Applicable test/check files pass in the independent reruns; verification-only coverage and diff checks pass. |
| Triangulation adequate | ✅ | API validation/error cases, route cases, share rejection variants, runtime checks, and coverage failure fixtures exercise distinct outcomes. |
| Safety net | ✅ | Apply evidence reports frontend/backend baseline safety checks for modified implementation areas; current reruns pass. |

**TDD Compliance**: ✅ All applicable checks passed; verification-only tasks were correctly marked N/A for a production RED/GREEN cycle.

### Test Layer Distribution

| Layer | Tests | Files | Tools |
|---|---:|---:|---|
| Unit | 6 | 2 | Vitest with mocked `fetch` |
| Integration | 8 | 2 | Vitest + Testing Library; Nest Testing + Supertest |
| E2E | 0 | 0 | Not configured |
| **Total** | **14** | **4** | |

The integration/runtime harness also exercised Docker Compose and Nginx/backend interaction; no browser E2E tool is configured.

### Changed File Coverage

| File | Line % | Branch % | Uncovered lines | Rating |
|---|---:|---:|---|---|
| `Front/src/components/Demo/DemoSummaryScreen.tsx` | 92.10% | 68.75% | 73, 87–89 | ✅ Acceptable |
| `Front/src/API/Cliente/generateDemoDesign.ts` | 100% | 100% | — | ✅ Excellent |
| `Front/src/API/Cliente/generateDemoModel.ts` | 100% | 100% | — | ✅ Excellent |
| `backend/src/demo/demo.controller.spec.ts` | 91.11% | 77.77% | 30–31, 41–42 | ✅ Acceptable |

The API production modules were not modified but are covered by the newly added tests; the backend controller file is a modified test file. The only modified production line is 100% covered.

### Assertion Quality

✅ All 14 assertions/test cases exercise production code and verify returned values, request paths, user-visible feedback, or observable runtime behavior. No tautologies, ghost loops, smoke-only tests, or meaningless type-only assertions were found.

### Quality Metrics

**Linter**: ✅ No errors or warnings reported by `npm --prefix Front run lint`.  
**Type checker/build**: ✅ Frontend and backend builds passed.  
**Workflow linter**: ⚠️ `actionlint` is not installed; PyYAML parsing and runtime/static workflow checks passed.

### Explicit Non-Goals Review

No `README.md` change, suppression, coverage exclusion, fabricated report, legacy-smell remediation, React Three Fiber/Three.js finding change, broad refactor, or broad reverted SAST-hardening change was observed in the change-scoped implementation. The only application production source change is the in-scope `DemoSummaryScreen.tsx` conditional; the backend source change is its in-scope controller test. The current working tree also contains a pre-existing `openspec/config.yaml` modification from SDD bootstrap; it was not touched by this verification and is not attributed to this change.

### Issues Found

**CRITICAL**: None.

**WARNING**:

1. No remote SonarCloud workflow result was available. Actual Sonar new-code coverage, the remote Quality Gate, and the promised A ratings cannot be independently asserted; local transport and changed-line evidence pass.
2. `actionlint` was unavailable locally, so workflow validation used YAML parsing, exact static checks, SHA/tag verification, and executed container/runtime harnesses instead.
3. Whole-frontend aggregate coverage is 12.28% lines because the configured include scope covers untested existing application areas; the changed production line is 100% covered and `DemoSummaryScreen.tsx` is 92.10% line-covered.
4. `openspec/config.yaml` remains modified in the working tree despite being an explicit non-goal; status/apply evidence identifies that edit as pre-existing SDD bootstrap state, and verification did not modify it.

**SUGGESTION**:

1. Run the real main-branch SonarCloud workflow and retain its result before claiming the remote Quality Gate or A ratings.
2. Consider splitting or lazy-loading the frontend chunks above 500 kB; this is an existing build warning and outside this bounded change.

### Verdict

**FAIL**

All locally verifiable requirements, runtime scenarios, tests, builds, security checks, and transport gates passed. Remote SonarCloud execution and its Quality Gate remain the only material verification limitation.
