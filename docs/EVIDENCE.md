# Verification evidence

This page distinguishes source verification from network execution. It does not claim a formal proof, independent security audit or real-world underwriting validation. The demonstration's separate verifier key is controlled by the deployment operator; it is not a claimed external commercial auditor.

## Current evidence

| Run | Source revision or environment | Verified result | Receipt |
| --- | --- | --- | --- |
| 18 Nov 2026 signed CLI lifecycle | Isolated Stellar Testnet deployment from contracts commit `4955e9566d6e07a2dc05f1d831bda616df384fb5` | 19 confirmed transactions. The invoice settled and deployed capital returned to zero. | [Run report](gates/testnet-terminal-2026-11-18.md) · [Hashes and WASM digests](gates/testnet-terminal-2026-11-18.json) |
| 19 Nov 2026 archival recovery | Instrumented local ledger from base contracts commit `07de1feef62552607b921e52883bef60ab5b2c61` | Separate footprint restoration and rebuilt withdrawal confirmed. The token balance delta matched the expected amount. | [Recovery receipt](gates/archival-recovery-separate-2026-11-19.json) |
| 26 Nov 2026 maintainer wallet session | Hosted LiquiVault demo on Stellar Testnet with Varial (formerly Freighter). Hosted build revision unavailable. | Deposit, invoice issuance, separate verifier approval, factoring and settlement confirmed. The session also captured a rejected wallet signature. | [Wallet receipt](gates/wallet-freighter-2026-11-26.json) · [Screenshots](gates/README.md#screenshots) |
| 28 Nov 2026 external tester return transfer | Stellar Testnet wallet-to-wallet payment | The tester's wallet returned 300 LVTEST to the funding account at ledger 5961439. | [Funding and return payment](#lvtest-wallet-funding-and-return-payment) |

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

This proves signed CLI/chain execution; it does not by itself claim interactive Freighter-extension verification or an independent audit. A separate live session with the Varial (formerly Freighter) extension is recorded in the [wallet record](gates/wallet-freighter-2026-11-26.json).

## LVTEST wallet funding and return payment

| Confirmed (UTC) | Ledger | Operation | Amount | Transaction hash |
| --- | --- | --- | --- | --- |
| 2026-11-28 00:52:19 | 5960699 | Stellar Testnet `payment` | 100 LVTEST | [`9c1c67a0377b7ae945a6979fefb00d5845717fae247506d5aff1dc1536d96784`](https://horizon-testnet.stellar.org/transactions/9c1c67a0377b7ae945a6979fefb00d5845717fae247506d5aff1dc1536d96784) |
| 2026-11-28 01:17:59 | 5961007 | Stellar Testnet `payment` | 1,000 LVTEST | [`ae19d8169ca0424bbebd789b8b9ff0a8dc16613dd72a381fe801c07763693827`](https://horizon-testnet.stellar.org/transactions/ae19d8169ca0424bbebd789b8b9ff0a8dc16613dd72a381fe801c07763693827) |
| 2026-11-28 01:53:59 | 5961439 | Stellar Testnet `payment` (tester return transfer) | 300 LVTEST | [`571df1a51d8c6e3f13d6f916dd7eb415e6f18a101a1e44faa6a08936a42807a6`](https://horizon-testnet.stellar.org/transactions/571df1a51d8c6e3f13d6f916dd7eb415e6f18a101a1e44faa6a08936a42807a6) |

The two funding payments sent a total of `1,100 LVTEST` to the wallet the maintainer identified as the independent tester's. The tester's wallet then sent `300 LVTEST` back to the same funding account. All three payments used LiquiVault's configured LVTEST issuer, `GCW7P2SWHLMTSQM3BGBB4NO7RPC2FJPQIBKGUL373WMYU3GZU4WJB2U7`. Horizon confirms the wallet-to-wallet payment. The tester's feedback and any LiquiVault deposit evidence are pending.

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
