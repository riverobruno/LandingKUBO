# Quality-Gate Hardening Specification

## Purpose
Define the single immutable-action-reference correction required by the latest SAST report.

## Requirements

### Requirement: The six Docker action references are immutable

The CI workflow MUST replace exactly these six Docker action tag references with full 40-character commit SHAs: `docker/metadata-action` at lines 47 and 53 using `dc802804100637a589fabce1cb79ff13a1411302`; `docker/login-action` at line 58 using `dbcb813823bdd20940b903addbd779551569679f`; `docker/setup-buildx-action` at line 64 using `37fe631027851001ddb9b187196cc803df7f5f0e`; and `docker/build-push-action` at lines 67 and 77 using `53b7df96c91f9c12dcc8a07bcb9ccacbed38856a`. Existing checkout and Sonar action SHA references MUST remain unchanged, and the change MUST NOT add runtime, coverage, LCOV, artifact, or validation steps.

#### Scenario: The six substitutions pass validation

- GIVEN `.github/workflows/ci.yml` is inspected
- WHEN the six listed Docker action occurrences are parsed
- THEN each uses the specified full SHA and no extra workflow step is introduced

#### Scenario: An out-of-scope or mutable reference is introduced

- GIVEN any covered action uses a tag, partial SHA, wrong SHA, or an added coverage/runtime/artifact step appears
- WHEN the narrowed scope is validated
- THEN validation fails before delivery

## Explicit Non-Goals

This change MUST NOT modify application/source files, Dockerfiles, Compose/Nginx behavior, package files, `README.md`, `openspec/config.yaml`, or `sonar-project.properties`. It MUST NOT add coverage or LCOV transport, claim a remote SonarCloud Quality Gate or A rating, or attribute broader pre-existing/superseded working-tree implementation changes to this SHA-only change.
