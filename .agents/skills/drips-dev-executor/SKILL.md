---
name: drips-dev-executor
description: Execute authorized daily Drips development slices with verification before each commit and pacing records.
---

# drips-dev-executor

Read the selected day in tasks.json. Implement each approved slice, run targeted checks and the repository baseline checks against the staged snapshot, and commit only when the required checks pass. Record real commit SHAs, test commands and outcomes against the daily estimate. Keep blocked tasks visible, carry unavoidable shortfalls forward, and require actual live or independent evidence for those milestones. Keep commits local unless publishing is authorized.
