# Quality-Gate Hardening Specification

## Purpose

Define the bounded CI, container, coverage, and reliability corrections required to restore the evidenced SonarCloud quality results without changing product behavior.

## Requirements

### Requirement: Workflow actions are immutable

The CI workflow MUST reference each currently mutable Docker action and every newly added artifact action by a validated full commit SHA. Existing immutable checkout and Sonar references MUST remain unchanged.

#### Scenario: Workflow passes immutable-reference validation

- GIVEN the CI workflow is inspected before execution
- WHEN all Docker and artifact action references are parsed
- THEN each reference uses a full commit SHA and the six evidenced mutable tags are absent

#### Scenario: Mutable reference is introduced

- GIVEN any covered action uses a tag or partial reference
- WHEN workflow hardening is validated
- THEN validation fails before delivery

### Requirement: Dependency installation and frontend runtime are hardened

The three evidenced Docker `npm ci` operations MUST disable lifecycle scripts. The frontend runtime MUST run as a non-root user, listen on internal port `8080`, preserve the existing external frontend port, and proxy `/api/` requests as before.

#### Scenario: Hardened containers operate normally

- GIVEN the frontend and backend images are built and started
- WHEN their build, test, startup, port, and proxy checks run
- THEN they succeed, the frontend process is non-root, and `/api/` reaches the existing backend route

#### Scenario: Runtime hardening breaks a required contract

- GIVEN an image starts as root, fails on port `8080`, or changes `/api/` routing
- WHEN the container verification runs
- THEN verification fails and the change is not considered complete

### Requirement: Sonar receives real normalized coverage

CI MUST execute the frontend and backend coverage tests, preserve their LCOV reports before disposable test containers are removed, normalize source-file entries to repository-root `Front/src/...` and `backend/src/...` paths, and make those reports available to the Sonar scan. The resulting new-code coverage MUST be at least 80% without exclusions or fabricated reports.

#### Scenario: Coverage reaches Sonar correctly

- GIVEN both package test suites execute successfully with coverage
- WHEN LCOV files are preflighted and the Sonar job runs
- THEN reports exist, contain normalized source paths, are consumed by Sonar, and new-code coverage is at least 80%

#### Scenario: Coverage is absent or package-relative

- GIVEN a report is missing, transferred after container removal, or contains unnormalized `SF:` paths
- WHEN the coverage preflight runs
- THEN it fails before the Sonar scan

### Requirement: Existing API and user feedback remain equivalent

The change MUST preserve existing frontend API request outcomes, `/api/` proxy behavior, and user-facing feedback for successful and rejected demo-generation flows.

#### Scenario: Existing flows retain behavior

- GIVEN a successful request or an existing `NotAllowedError` rejection
- WHEN the hardened application handles it
- THEN the API result and displayed feedback remain behaviorally equivalent to the current tree

### Requirement: The evidenced redundant conditional is removed

The redundant conditional in `DemoSummaryScreen` MUST be simplified or removed without changing the existing `NotAllowedError` feedback or other component behavior.

#### Scenario: Reliability correction is behavior-preserving

- GIVEN the component is exercised through its existing success and rejection paths
- WHEN the corrected component renders and handles the rejection
- THEN the redundant branch is absent and user feedback is unchanged

## Explicit Non-Goals

This change MUST NOT modify `README.md`, `openspec/config.yaml`, unrelated application behavior, legacy smells, React Three Fiber/Three.js findings, or previously reverted broad SAST-hardening work. It MUST NOT suppress or exclude findings to manufacture a rating.
