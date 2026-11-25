# Stellar Wave appeal preparation

Draft updated 25 November 2026. The repositories were rejected on 4 November 2026; the first appeal became possible on 18 November. Confirm remaining appeal attempts for each repository in the Drips dashboard.

## Substantive changes since rejection

- Session generations and serialized wallet operations guard delayed reads, disconnects and post-write refreshes.
- Integer redemption eligibility explains locks, pause, idle liquidity and junior coverage.
- Eight Chromium scenarios exercise a test-only wallet bridge and real XDR. They do not establish live-extension signing.
- Quote assurance covers 4,096 generated configurations, rounding, conservation, monotonicity and boundary failures. Wire tests cover risk/status combinations; pool checks cover junior and senior losses.
- A read-only SDK planner exposes source/network/sequence, fees and restoration requirements.
- The SDK exposes typed transaction failures with the stage, available hash, contract code and an unknown-outcome flag. The frontend now uses them: failures show the stage and contract code, and an interrupted write shows its hash with a testnet explorer link instead of a success message. Admin XDR and wallet-body checks cover operation encoding and changes to the source, fee, contract, or arguments.
- A clean frontend checkout now installs the pinned public SDK revision through npm. Lint, type checking, 15 unit/component tests, eight browser fixture scenarios, and the static build pass.
- A separate footprint restore confirmed on instrumented localhost before the SDK rebuilt and signed a withdrawal. Both transactions have distinct hashes and ledgers, and the withdrawal balance delta matched. [Separate restoration receipt](gates/archival-recovery-separate-2026-11-19.json)
- Three instrumented-localhost archival runs demonstrate natural expiry, rejected signing without restoration, automatic restoration and withdrawal with exact balance deltas. Fixture timing overrides are recorded; production timing and manual fallback are not proven.

- A fresh isolated Stellar Testnet deployment confirmed 19 transactions, including deposits in both tranches and invoice issuance, authorized verification, factoring and settlement. Deployed capital returned to zero. Read-only Testnet simulations returned `WithdrawalLocked` for both tranches. Nine mocked frontend tests passed. [Run report and signed transaction receipt](https://github.com/MoscowDev/LiquiVault/blob/1026335/docs/gates/testnet-terminal-2026-11-18.md)

See [release evidence](RELEASE_CANDIDATE.md), [recovery receipts](gates/README.md) and [known limitations](KNOWN_LIMITATIONS.md).

## Project and Stellar value

LiquiVault is an experimental, pre-audit invoice-factoring prototype on Stellar Soroban. Its registry records commitments and verifier approvals, escrow coordinates advances, repayment and default, and a senior/junior pool accounts for yield and losses. Its TypeScript SDK prepares Stellar transactions and its Next.js interface uses Freighter. The project uses issuer-controlled LVTEST on Testnet, with operator-assisted token funding and verifier approval.

## Published commits verified on 25 November 2026

| Repository | Commit | CI |
| --- | --- | --- |
| Contracts | `deeb65d3a53cefa0a13634ccf42c00d69420dfd4` | [Passed](https://github.com/MoscowDev/liquivault-contracts/actions/runs/44532678284) |
| SDK | `57a46c64df4a4e72867c9bd0a5d50e118981eeaf` | [Passed](https://github.com/MoscowDev/liquivault-sdk/actions/runs/45673025824) |
| Frontend | `7688e1c82d35de55a88985a8a45ceed875a372da` | [Passed](https://github.com/MoscowDev/liquivault-frontend/actions/runs/45673651300) |
| Overview | `ee64d9a3efaa923b8cf2ae64fc4d01c7cbb151e3` | [Passed](https://github.com/MoscowDev/LiquiVault/actions/runs/45673083013) |

The frontend pins SDK `5070f9343d24ca912f4d96cfd727346581b75446`; the later SDK commit changes only package keywords. The [19 November follow-up](REPOSITORY_FOLLOW_UP.md) records the restoration and standalone-install verification. The hosted frontend has its own deployment provenance.

## Contributor backlog

On 25 November 2026 eight of the nine original issues were closed against the commits that implemented them. SDK #1 remains open for its missing scope, named per-contract error codes. Seven new issues describe verified gaps: contract event assertions, specific escrow error variants, Windows/macOS CI, a packed-SDK consumer check, typed event decoders, missing-trustline guidance and build provenance in the app. Three are marked `good first issue`. The [backlog index](wave/README.md) links each one.

## Maintainer availability

Review hours and response times will be confirmed before contributor assignments begin.

## Remaining steps

1. State real review hours and response times under Maintainer availability.
2. Complete the [real Freighter walkthrough](wallet-demo.md), recording confirmed hashes and actual rejection behavior. `node scripts/prepare-wallet-trustline.mjs <public key>` prepares the LVTEST trustline.
3. Obtain consented [independent feedback](VALIDATION_PLAN.md), record attempted steps and blockers, and link fixes or explain unresolved feedback.
4. Appeal from the Drips Orgs and Repos dashboard, contracts and SDK first. A declined appeal starts a one-month cooldown, and each repository has at most three appeals.

LiquiVault tracks the wallet and feedback checks as internal readiness gates. Run `node scripts/check-appeal-gates.mjs --require-complete` once the live wallet receipt and independent feedback have been recorded.

The [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/) requires substantive changes for appeals. Selection remains discretionary under the [terms](https://docs.drips.network/wave/terms-and-rules/).
