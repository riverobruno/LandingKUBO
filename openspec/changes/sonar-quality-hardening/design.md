# Design: Sonar Quality Hardening

## Technical Approach
Make a configuration-only correction in `.github/workflows/ci.yml`: validate and retain the exact six Docker action commit SHAs, replacing only their mutable tags. No application, runtime, coverage, LCOV, artifact, or Sonar-property behavior is designed here.

## Architecture Decisions

| Decision | Choice | Alternatives rejected | Rationale |
|---|---|---|---|
| Action integrity | Use the four specified full SHAs across six Docker action occurrences; keep checkout and Sonar pins unchanged. | Mutable tags or partial SHAs. | Prevents action drift while preserving workflow behavior. |
| Scope control | Modify no workflow steps or adjacent configuration. | Adding coverage, runtime, LCOV, artifact, or validation plumbing. | Matches the final SAST-only remediation scope. |

## Data Flow
```text
Workflow action references -> full-SHA validation -> unchanged workflow execution
```

## File Changes

| File | Action | Requirement mapping |
|---|---|---|
| `.github/workflows/ci.yml` | Modify | Six Docker action tag-to-full-SHA substitutions. |
| `sonar-project.properties` | Unchanged | Original active identity properties remain; no LCOV settings. |
| Broader implementation areas | Pre-existing/out of scope | Earlier superseded working-tree changes are not part of this design. |

## Interfaces / Contracts
No application interfaces, package scripts, runtime contracts, or Sonar input contracts change. The only implementation contract is the exact six full-SHA action references.

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Structural | Six action references and preserved workflow scope | Parse `uses:` entries, assert exact action/ref pairs, confirm no added runtime/coverage/LCOV/artifact steps, and run `git diff --check`. |
| Remote | SonarCloud Quality Gate | Not executed; no remote rating or Quality Gate result may be claimed in this phase. |

## Threat Matrix
The narrowed change does not add a routing, shell, subprocess, VCS/PR automation, executable classification, or process-integration boundary. The required matrix is therefore not applicable:

| Boundary | Applicability | Safe/failure behavior and planned RED test |
|---|---|---|
| Routing | N/A — no routes or routing behavior change. | No task/test. |
| Shell/subprocess | N/A — no shell or subprocess logic is added or changed. | No task/test. |
| VCS/PR automation | N/A — action references are edited, but no Git operation or PR command is automated. | No task/test. |
| Executable-file classification | N/A — no executable classification or documentation execution changes. | No task/test. |
| Process integration | N/A — no new process boundary is introduced. | No task/test. |

## Migration / Rollout
No migration or feature flag. Revert the six substitutions as one configuration boundary if required. `README.md`, `openspec/config.yaml`, and `sonar-project.properties` remain untouched.

## Open Questions
- None. Remote SonarCloud execution remains a separate verification concern.
