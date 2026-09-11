## Exploration: sonar-quality-hardening

### Current State
The authoritative remediation scope is limited to the latest SAST finding: Docker action references in `.github/workflows/ci.yml` must use full commit SHAs. No runtime, dependency-install, coverage, LCOV, artifact, application, or Sonar-property remediation is required.

The exact six in-scope substitutions are:

- Lines 47 and 53: `docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302`.
- Line 58: `docker/login-action@dbcb813823bdd20940b903addbd779551569679f`.
- Line 64: `docker/setup-buildx-action@37fe631027851001ddb9b187196cc803df7f5f0e`.
- Lines 67 and 77: `docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a`.

Existing checkout and Sonar action references are already full SHAs and remain unchanged. The current workflow contains no added runtime, coverage, LCOV, artifact-transfer, or validation steps. `sonar-project.properties` retains only its original active `sonar.projectKey` and `sonar.organization` properties. `git diff --check` passes.

### Affected Areas
- `.github/workflows/ci.yml` — six Docker action tag-to-full-SHA substitutions only.
- `sonar-project.properties` — unchanged identity-only configuration; included as a scope guard, not an implementation target.
- OpenSpec artifacts — reconcile requirements, design, tasks, and evidence to the narrowed scope.

### Explicit Non-Goals
- Do not modify application/source files, Dockerfiles, Compose/Nginx runtime behavior, package manifests or lockfiles, `README.md`, `openspec/config.yaml`, or `sonar-project.properties`.
- Do not add coverage, LCOV, Sonar source/test properties, artifact transfer, runtime checks, or workflow validation steps.
- Do not claim a remote SonarCloud Quality Gate, an A rating, or any remote analysis result.
- Broader implementation changes from the earlier superseded SDD attempt remain pre-existing/outside this reconciliation and must not be attributed to this SHA-only change.

### Recommendation
Treat this as a small configuration-only change. Validate the six full SHA references and preserve every other workflow step and action reference. The next phase must regenerate verification evidence without inferring remote SonarCloud results.

Decision needed before apply: No
Chained PRs recommended: No
400-line budget risk: Low

### Risks
- A valid-looking SHA may not match the intended action release; validate each action/ref pair before delivery.
- Local checks can establish reference integrity and scope, but cannot prove a remote SonarCloud Quality Gate or rating.
- Superseded working-tree implementation changes can contaminate attribution unless explicitly kept outside this change.

### Ready for Proposal
Yes. The proposal must describe only the six immutable Docker action references and explicitly exclude the superseded broader implementation.
