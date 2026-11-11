# Verification evidence

This page distinguishes source verification from network execution. It does not claim a formal proof, independent security audit or real-world underwriting validation. The demonstration's separate verifier key is controlled by the deployment operator; it is not a claimed external commercial auditor.

## Source verification baseline

The November 2026 repair pass verified:

| Component | Result | Scope |
| --- | --- | --- |
| Contracts | 25 host tests passed; formatting/clippy passed | Lifecycle, authorization, pause policy, tranche losses/yield, wipeout and withdrawal lock |
| SDK | 17 unit tests passed; typecheck and ESM/CJS builds passed | Real XDR types, preparation before signing, confirmation and failure behavior |
| Frontend | 6 tests, lint and production build passed | Disconnected wallet, missing extension, rejected/confirmed writes, quote display and token units |
| Live SDK | Opt-in test passed separately | Deployed pool/invoice reads and unsigned mint preparation with real resource/auth data |

These counts describe that dated baseline. New dependency upgrades and subsequent verification are recorded in [readiness results](READINESS.md); CI is authoritative for each pushed commit. A read or unsigned simulation changes no on-chain state.

## Current CI

- [Contracts](https://github.com/MoscowDev/liquivault-contracts/actions/workflows/ci.yml)
- [SDK](https://github.com/MoscowDev/liquivault-sdk/actions/workflows/ci.yml)
- [Frontend](https://github.com/MoscowDev/liquivault-frontend/actions/workflows/ci.yml)
- [Documentation](https://github.com/MoscowDev/LiquiVault/actions/workflows/ci.yml)

Contract CI requests cdylib artifacts explicitly. SDK CI builds during installation and checks types/tests. Frontend CI prepares the sibling SDK before installation and runs lint/tests/build. A green badge is not a dependency or contract security audit.

## Repaired signed deployment

A new signed proof completed at 2026-11-11T12:46:02.708Z from contract-source commit `5b6e97425522ee73f825820b196a633c89a8fa15`. The [public record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json) contains 19 confirmed transaction hashes/ledgers, per-file source hashes and three WASM hashes. Assertions verify the independent verifier, invoice lifecycle, merchant advance, treasury balance, capital-capped tranche yield and zero deployed capital after settlement.

- usdcToken: `CC43CHMG22M22GZXMOP37252ZJGXMBDGV575X3SO5EQKVSB5WNP2N3MC`
- invoiceRegistry: `CBDSCLBEEYQ67BWY4SPTGGMS7GTGYAXKG5E2C6XLQZVA44LLOF72IZWU`
- liquidityPool: `CBWGPRRK7O2G4WTEWQEJMMB5L2CZC3DOXA4VPLKDPQZZNMTU4HGDE4PD`
- factoringEscrow: `CCV7TQNE64J55MUZ5BOP5ZNM54WN5L6WPGQXSUUU2P4CT4S4YSQQFAQB`

This proves signed CLI/chain execution; it does not claim interactive Freighter-extension verification or an independent audit.

## Historical signed testnet evidence

The [archived October record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet-2026-10-24.json) recorded the following October 2026 smoke test, before the capital cap and other repairs:

| Item | Exact test-token amount |
| --- | --- |
| Face value | 10,000 |
| Time discount | 164.3820712 |
| Origination fee | 50 |
| Total discount | 214.3820712 |
| Net advance | 9,785.6179288 |
| Treasury cut | 21.4382071 |
| LP yield | 192.9438641 |
| Historical junior yield (flat 30%) | 57.8831592 |
| Historical senior yield | 135.0607049 |

This table describes the historical allocation, not the repaired capital-capped rule. A later deployment replaces the current record; retain its predecessor as a dated historical artifact. See [deployment reproduction](deployment.md).

## Reproduce

Use each repository's contribution guide for exact install and verification commands. The SDK network test uses `LIQUIVAULT_TESTNET=1 npm test -- tests/testnet.test.ts`; in PowerShell set `$env:LIQUIVAULT_TESTNET='1'` first. Network tests can fail after a testnet reset or archival; failures must remain visible.

Host tests mock authorization where documented. They do not reproduce wallet-extension interaction or off-chain verification. Signed CLI/SDK smoke tests validate chain execution, but do not validate an interactive Freighter session. No production usage, legal assignment, independent audit or Drips acceptance is asserted.
