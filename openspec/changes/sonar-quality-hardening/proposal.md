# Proposal: Sonar Quality Hardening

## Intent
Remediate the latest SAST finding by replacing exactly six mutable Docker action tags with full commit SHAs. This change does not promise or establish a remote SonarCloud Quality Gate or rating.

## Scope

### In Scope
- Pin the two `docker/metadata-action`, one `docker/login-action`, one `docker/setup-buildx-action`, and two `docker/build-push-action` references in `.github/workflows/ci.yml` to the selected full SHAs.
- Preserve existing checkout and Sonar action SHAs, workflow steps, and the identity-only `sonar-project.properties` configuration.

### Out of Scope
- No runtime, Dockerfile, Compose/Nginx, application, package, coverage, LCOV, artifact, or Sonar-property changes.
- No `README.md`, `openspec/config.yaml`, or unrelated application changes.
- No remote Quality Gate or A-rating claim, and no previously superseded broad SAST-hardening attribution.

## Capabilities

### New Capabilities
- None — this is a bounded CI configuration correction.

### Modified Capabilities
- None — no observable product capability changes.

## Approach
Validate the six action/ref pairs, make only the six tag-to-SHA substitutions, and inspect the resulting diff. Do not add workflow steps or alter Sonar configuration.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | Modified | Six Docker action references only. |
| `sonar-project.properties` | Unchanged | Original active project identity properties remain in place. |
| Earlier superseded implementation areas | Pre-existing/out of scope | Do not attribute broader working-tree changes to this change. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| A selected SHA does not match its intended action release. | Low | Validate every action/ref pair and require full 40-character SHAs. |
| Broader superseded changes are misattributed. | Med | Keep the six-reference boundary explicit in all artifacts. |

## Rollback Plan
Revert the six reference substitutions in `.github/workflows/ci.yml`; no other implementation rollback is part of this change.

## Dependencies
- The six selected action commit SHAs and local repository diff checks.

## Success Criteria
- [ ] The six listed Docker action occurrences use full 40-character commit SHAs.
- [ ] Existing checkout and Sonar action references and all workflow steps remain unchanged.
- [ ] `sonar-project.properties` retains only its original active project identity properties.
- [ ] `git diff --check` passes and no remote Quality Gate or A rating is claimed.
