# Stellar Wave appeal preparation

Draft updated 18 November 2026. Confirm the rejection date and appeal eligibility for each repository in the Drips dashboard.

## Substantive changes since rejection

- Session generations and serialized wallet operations guard delayed reads, disconnects and post-write refreshes.
- Integer redemption eligibility explains locks, pause, idle liquidity and junior coverage.
- Eight Chromium scenarios exercise a test-only wallet bridge and real XDR. They do not establish live-extension signing.
- Quote assurance covers 4,096 generated configurations, rounding, conservation, monotonicity and boundary failures. Wire tests cover risk/status combinations; pool checks cover junior and senior losses.
- A read-only SDK planner exposes source/network/sequence, fees and restoration requirements.
- The SDK exposes typed transaction failures with the available hash and an unknown-outcome flag. Admin XDR and wallet-body checks cover operation encoding and changes to the source, fee, contract, or arguments.
- A clean frontend checkout now installs the pinned public SDK revision through npm. Lint, type checking, 13 unit/component tests, eight browser fixture scenarios, and the static build passed from that checkout.
- A separate footprint restore confirmed on instrumented localhost before the SDK rebuilt and signed a withdrawal. Both transactions have distinct hashes and ledgers, and the withdrawal balance delta matched. [Separate restoration receipt](gates/archival-recovery-separate-2026-11-19.json)
- Three instrumented-localhost archival runs demonstrate natural expiry, rejected signing without restoration, automatic restoration and withdrawal with exact balance deltas. Fixture timing overrides are recorded; production timing and manual fallback are not proven.

- A fresh isolated Stellar Testnet deployment confirmed 19 transactions, including deposits in both tranches and invoice issuance, authorized verification, factoring and settlement. Deployed capital returned to zero. Read-only Testnet simulations returned `WithdrawalLocked` for both tranches. Nine mocked frontend tests passed. [Run report and signed transaction receipt](https://github.com/MoscowDev/LiquiVault/blob/1026335/docs/gates/testnet-terminal-2026-11-18.md)

See [release evidence](RELEASE_CANDIDATE.md), [recovery receipts](gates/README.md) and [known limitations](KNOWN_LIMITATIONS.md).

## Project and Stellar value

LiquiVault is an experimental, pre-audit invoice-factoring prototype on Stellar Soroban. Its registry records commitments and verifier approvals, escrow coordinates advances, repayment and default, and a senior/junior pool accounts for yield and losses. Its TypeScript SDK prepares Stellar transactions and its Next.js interface uses Freighter. The project uses issuer-controlled LVTEST on Testnet, with operator-assisted token funding and verifier approval.

## Published commits verified on 18 November 2026

GitHub push CI passed for all four published revisions checked on 18 November 2026.

| Repository | Commit | CI |
| --- | --- | --- |
| Contracts | `07de1feef62552607b921e52883bef60ab5b2c61` | [Passed](https://github.com/MoscowDev/liquivault-contracts/actions/runs/43432674742) |
| SDK | `6d603afd5d2df04146928a9e2c150c6252d2e6b6` | [Passed](https://github.com/MoscowDev/liquivault-sdk/actions/runs/43432660450) |
| Frontend | `5d03961f65665904497c8be9eb56afbe23f1d6af` | [Passed](https://github.com/MoscowDev/liquivault-frontend/actions/runs/43432685954) |
| Overview | `10263353de7a73ff0639feb9792e8a6fe44dfb93` | [Passed](https://github.com/MoscowDev/LiquiVault/actions/runs/44303511026) |

The [19 November follow-up](drips/REPOSITORY_FOLLOW_UP.md) records later verification and the updated SDK and frontend CI revisions. Recheck push CI for the final overview revision. The hosted frontend has its own deployment provenance.

## Actual contributor work

The nine public issue bodies were checked on 18 November 2026. All nine were open. Four mark their acceptance criteria complete for quote assurance, wire compatibility, browser wallet coverage and redemption eligibility. The [backlog index](wave/README.md) links each issue and records its implementation status.

The 18 November issue review identified five unfinished scopes. Subsequent changes cover separate restore/confirm/rebuild, typed SDK errors, admin XDR, changed-body boundaries, and deterministic refresh and reconnect regressions. The separate path used the instrumented local network, and the SDK's manual-preamble and failure coverage used fixtures. Review the updated evidence against each public issue before offering work to contributors.

## Maintainer availability

Review hours and response times will be confirmed before contributor assignments begin.

## Remaining steps

1. Complete the [real Freighter walkthrough](wallet-demo.md), recording confirmed hashes and actual rejection behavior.
2. Obtain consented [independent feedback](VALIDATION_PLAN.md), record attempted steps and blockers, and link fixes or explain unresolved feedback.
3. Recheck push CI for this documentation revision after publication.
4. Confirm cooldown and remaining appeal attempts in the Drips dashboard. Submit there only after the package is ready.

LiquiVault tracks the wallet and feedback checks as internal readiness gates. Run `node scripts/check-appeal-gates.mjs --require-complete` once the live wallet receipt and independent feedback have been recorded.

The [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/) requires substantive changes for appeals. Selection remains discretionary under the [terms](https://docs.drips.network/wave/terms-and-rules/).
