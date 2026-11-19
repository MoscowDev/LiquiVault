# Day 1 repository work

| Repository | Implemented or verified | Remaining |
| --- | --- | --- |
| Contracts | Ran 29 locked host tests in a clean local clone, built all three WASM artifacts in the working checkout, and checked the published deployment receipt for 19 transactions and exact token accounting. The clone reused the workspace Cargo target directory. | Record a fresh isolated network run. Separate restore, confirm and rebuild remains open. |
| SDK | Added an exported transaction error with stage, available simulation contract code, submitted hash and unknown-outcome indicator. Added regression coverage for simulation errors and interrupted confirmation. | Admin builder coverage, manual recovery, and clean consumer packaging checks. |
| Frontend | Added out-of-order refresh coverage and verified that confirmed activity from a disconnected session stays out of the reconnected account. Lint, types, 13 unit/component tests, eight fixture-based browser tests, and the production build passed. | Live Freighter and independent walkthrough evidence. |
| Overview | Added direct setup and CI links to the repository entry point and linked the signed Testnet evidence and remaining issue scopes. | Recheck GitHub CI once these changes are published. |

Historical run evidence is available in the [Testnet report](../gates/testnet-terminal-2026-11-18.md). The [session worksheet](../SESSION_WORKSHEET.md) records what to collect during live and independent sessions.
