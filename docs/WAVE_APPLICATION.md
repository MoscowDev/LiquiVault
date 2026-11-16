# Stellar Wave appeal preparation

Status, 16 November 2026: draft only; not submitted. All four repositories were previously rejected according to the maintainer notification. Confirm the rejection date and appeal eligibility in the dashboard. Real Freighter lifecycle evidence and independent feedback remain pending.

## Project and Stellar value

LiquiVault is an experimental, pre-audit invoice-factoring prototype on Stellar Soroban. Its registry records commitments and verifier approvals; escrow coordinates advances, repayment and default; a senior/junior pool accounts for yield and losses. Its TypeScript SDK prepares Stellar transactions and its Next.js interface uses Freighter.

Reusable work includes checked integer quotes, atomic cross-contract accounting, wire compatibility tests, transaction preparation/restoration planning and a reproducible archival harness. These are inspectable examples for Stellar developers, not evidence of external adoption.

The project uses issuer-controlled LVTEST on testnet, not Circle USDC. Legal assignment, collection, production underwriting, KYB/SEP-10 and SEP-24 are not implemented. Token funding and verifier approval are operator-assisted.

## Substantive changes since rejection

- Session generations and serialized wallet operations guard delayed reads, disconnects and post-write refreshes.
- Integer redemption eligibility explains locks, pause, idle liquidity and junior coverage.
- Eight Chromium scenarios exercise a test-only wallet bridge and real XDR. They do not establish live-extension signing.
- Quote assurance covers 4,096 generated configurations, rounding, conservation, monotonicity and boundary failures. Wire tests cover risk/status combinations; pool checks cover junior and senior losses.
- A read-only SDK planner exposes source/network/sequence, fees and restoration requirements.
- Three instrumented-localhost archival runs demonstrate natural expiry, rejected signing without restoration, automatic restoration and withdrawal with exact balance deltas. Fixture timing overrides are recorded; production timing and manual fallback are not proven.

See [release evidence](RELEASE_CANDIDATE.md), [recovery receipts](gates/README.md) and [known limitations](KNOWN_LIMITATIONS.md).

## Published commits verified on 16 November 2026

GitHub push CI passed for all four clean local revisions before this documentation update:

| Repository | Commit | CI |
| --- | --- | --- |
| Contracts | `07de1feef62552607b921e52883bef60ab5b2c61` | [Passed](https://github.com/MoscowDev/liquivault-contracts/actions/runs/43432674742) |
| SDK | `6d603afd5d2df04146928a9e2c150c6252d2e6b6` | [Passed](https://github.com/MoscowDev/liquivault-sdk/actions/runs/43432660450) |
| Frontend | `5d03961f65665904497c8be9eb56afbe23f1d6af` | [Passed](https://github.com/MoscowDev/liquivault-frontend/actions/runs/43432685954) |
| Overview | `f68e656655b7f2ecfc95e2a38d1257992321b6da` | [Passed](https://github.com/MoscowDev/LiquiVault/actions/runs/43432695908) |

Recheck the final overview revision after publishing these edits. CI does not prove the hosted demo runs the latest frontend revision.

## Actual contributor work

The [nine published issues](wave/README.md) are historical records, not nine untouched tasks. Four are implemented: quote assurance, wire compatibility, browser wallet coverage and redemption eligibility. Do not reassign their completed criteria.

Five retain unfinished scope: separate archival recovery in contracts; typed SDK errors; manual SDK recovery; admin-builder and changed-body boundary coverage; and overlapping-refresh/account-switch stress coverage. Restoration and session handling are partial. Agree on remaining criteria before assignment. No issue is claimed as Wave reward eligible.

## Remaining steps

1. Complete the [real Freighter walkthrough](wallet-demo.md), recording confirmed hashes and actual rejection behavior.
2. Obtain consented [independent feedback](VALIDATION_PLAN.md), record attempted steps and blockers, and link fixes or explain unresolved feedback.
3. Reconcile public issue descriptions with current implementation and verify CI for final published revisions.
4. State actual maintainer availability to review applications and PRs; no schedule is promised here.
5. Confirm cooldown and remaining appeal attempts in the Drips dashboard. Submit there only after the package is ready.

The wallet and feedback checks are LiquiVault's own gates, not published mandatory Drips criteria. Run `node scripts/check-appeal-gates.mjs --require-complete`. Fixtures, AI review and maintainer sessions cannot establish independent-person validation.

The [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/) requires substantive changes for appeals. Selection remains discretionary under the [terms](https://docs.drips.network/wave/terms-and-rules/).
