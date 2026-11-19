# LiquiVault ten-day development plan

The scope is one project with three code repositories and one documentation repository. Day numbers are relative to sprint kickoff.

Aim for five meaningful commits per day in each code repository where the milestone supports that many independently verifiable changes. That gives a planning target of 50 per code repository. Batch overview updates as evidence lands. Every commit requires green checks for its staged change. Record actual results and shortfalls in `tasks.json`.

## Dependencies

Contracts recovery evidence informs the SDK manual recovery integration. Frontend typed-error adoption depends on the SDK interface. The live wallet milestone needs a funded Testnet wallet and authorized verifier. The independent walkthrough needs a participant and consent for any published feedback.

## liquivault-contracts

Baseline checks: `cargo test --workspace --locked`

| Day | Milestone | Deliverables |
| --- | --- | --- |
| 1 | Baseline and contributor setup | Run locked host and WASM checks. Document clean-clone prerequisites and capture an isolated execution receipt. |
| 2 | Lifecycle evidence | Make lifecycle receipt inputs explicit. Validate ledger, hash, and contract provenance. |
| 3 | Recovery boundaries | Select a legitimate separate restore path. Capture archived entries and expected recovery footprint. |
| 4 | Separate restore | Build the restore transaction in an isolated fixture. Confirm restoration before rebuilding the original call. |
| 5 | Recovery failures | Cover rejected authorization and failed restoration. Verify rollback and document retry behavior. |
| 6 | Rebuilt withdrawal | Exercise rebuilt withdrawal. Assert exact balance and share deltas. |
| 7 | Accounting regressions | Add junior and senior first-loss boundary cases. Cross-check assets and token balances. |
| 8 | Cross-contract behavior | Cover invalid lifecycle transitions. Check rollback and role enforcement across contract calls. |
| 9 | Reproducibility | Repeat the recovery fixture from clean state. Check Windows and Linux setup and artifact output. |
| 10 | Release evidence | Run full CI and opt-in integration. Reconcile completed and remaining public issue criteria. |

## liquivault-sdk

Baseline checks: `npm run typecheck && npm test && npm run build`

| Day | Milestone | Deliverables |
| --- | --- | --- |
| 1 | Typed errors baseline | Inventory RPC failure stages. Add typed simulation and confirmation error tests. |
| 2 | Simulation and contract errors | Map available contract codes. Preserve underlying error details. |
| 3 | Submission outcomes | Preserve submitted hashes through timeouts. Cover pending and unknown outcomes without automatic submission retries. |
| 4 | Admin XDR | Assert pause and junior-yield operation fields. Cover admin transfer and rate configuration types. |
| 5 | Wallet integrity | Add changed-arguments and changed-source tests. Add changed-fee and destination tests. |
| 6 | Manual restoration preparation | Expose caller-authorized restore preparation. Validate network, affected keys and fees. |
| 7 | Restore confirmation | Implement explicit confirmation and rebuild. Cover rejection and failed recovery. |
| 8 | Integration | Exercise the manual path on a controlled fixture. Validate failure and recovery evidence. |
| 9 | Standalone packaging | Verify packed ESM and CommonJS imports. Check declarations in a clean consumer project. |
| 10 | Release evidence | Run offline and opt-in integration suites. Document migration guidance and reconcile issue criteria. |

## liquivault-frontend

Baseline checks: `npm run lint && npm run typecheck && npm test && npm run test:browser && npm run build`

| Day | Milestone | Deliverables |
| --- | --- | --- |
| 1 | Wallet race baseline | Add deterministic overlapping-refresh tests. Add account-switch and old-write completion tests. |
| 2 | Session correctness | Guard balance and invoice state on account changes. Keep confirmed activity scoped to its originating session. |
| 3 | Reproducible dependency setup | Evaluate a pinned SDK artifact or package strategy. Verify clean install and build from documented prerequisites. |
| 4 | Setup and funding UX | Clarify Testnet wallet and LVTEST issuer requirements. Show actionable funding and verifier blockers. |
| 5 | Redemption display | Cover lock, pause and coverage reasons in browser. Verify boundary refresh and top-up behavior. |
| 6 | Transaction feedback | Consume SDK typed errors when available. Display unknown confirmation outcomes and safe hash lookup. |
| 7 | Hosted provenance | Expose build revision in release evidence. Verify configuration and demo routes against deployed contracts. |
| 8 | Live wallet validation | Run a funded Freighter lifecycle with an operator. Record rejection, account/network changes and redemption display. |
| 9 | Independent walkthrough | Observe newcomer setup with consent. Fix verified usability blockers and retest. |
| 10 | Release verification | Run lint, types, unit, browser and export checks. Record hosted revision and follow-up issues. |

## LiquiVault

Baseline checks: `node scripts/check-docs.mjs && node scripts/check-appeal-gates.mjs && node --test scripts/check-appeal-gates.test.mjs`

| Day | Milestone | Deliverables |
| --- | --- | --- |
| 1 | Reviewer entry point | Link each repo to its standalone setup and CI. Validate public evidence links and pending gates. |
| 2 | Evidence schema | Document signed, simulated and browser evidence formats. Test malformed evidence and missing provenance handling. |
| 3 | Contributor navigation | Clarify the five remaining issue scopes. Link each scope to its owning repository and verification command. |
| 4 | Setup matrix | Document platform and tool prerequisites. Record clean setup results from component repositories. |
| 5 | Evidence validation | Check run receipts against hashes and ledger fields. Test contradictory or missing evidence. |
| 6 | Documentation usability | Walk through developer onboarding from README. Fix broken links and ambiguous wallet funding steps. |
| 7 | Release provenance | Cross-link hosted revision, contracts and SDK versions. Document exact-commit CI references. |
| 8 | Wallet evidence | Record the verified live session if completed. Capture remaining blockers when evidence is incomplete. |
| 9 | Independent evidence | Record consented participant feedback. Link fixes and unresolved observations. |
| 10 | Appeal package | Refresh the appeal narrative and evidence index. Recheck exact-revision CI and dashboard eligibility. |
