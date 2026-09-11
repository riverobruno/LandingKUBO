# Tasks: Sonar Quality Hardening

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 6 workflow lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single configuration change |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Validate and substitute six Docker action references | Single PR | `git diff --check` plus exact `uses:` scan | N/A — configuration-only SHA substitutions | Six reference lines in `.github/workflows/ci.yml` |

## Phase 1: SHA Validation and Substitution

- [x] 1.1 Enumerate the six Docker action occurrences and their intended full commit SHAs in `.github/workflows/ci.yml`.
- [x] 1.2 Validate the four selected SHA values as full 40-character references for the two metadata, login, setup-buildx, and two build-push uses.
- [x] 1.3 Substitute only the six mutable tags; preserve existing checkout/Sonar references and every other workflow step.

## Phase 2: Local Scope Verification

- [x] 2.1 Confirm the six exact full-SHA references, absence of added runtime/coverage/LCOV/artifact steps, and unchanged action/workflow scope.
- [x] 2.2 Run `git diff --check`; confirm `sonar-project.properties` remains identity-only and record that no remote SonarCloud verification occurred.
