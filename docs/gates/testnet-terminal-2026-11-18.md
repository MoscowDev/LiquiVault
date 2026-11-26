# Testnet terminal verification, 18 November 2026

The signed CLI lifecycle passed on a fresh, isolated Stellar Testnet deployment (`terminal-20261118-retry`). The [deployment evidence](testnet-terminal-2026-11-18.json) contains 19 confirmed transaction hashes and ledgers, public account and contract addresses, build provenance, WASM hashes, and accounting assertions. The test used a separate LVTEST issuer and wrote its receipt to the run directory. The hosted demo deployment record was preserved.

## Signed lifecycle

| Step | Confirmed ledger |
| --- | ---: |
| Senior deposit | 5795592 |
| Junior deposit | 5795594 |
| Mint invoice `1` | 5795596 |
| Verify with the authorized verifier | 5795599 |
| Factor invoice | 5795601 |
| Repay and settle invoice | 5795603 |

The invoice progressed through Issued, Verified, Factored and Settled. The merchant received 9,785.6185313 LVTEST on a 10,000 LVTEST invoice. After repayment, deployed capital was zero. The receipt records 192.9433219 LVTEST in LP yield and 21.4381468 LVTEST in protocol fees.

The runner built all three contracts and initially stopped at admin account funding with a connection error. The network-enabled retry used a fresh run ID and completed. The runner was copied locally with only its output destination changed to preserve the tracked deployment record. Generated signing configuration stayed in ignored `.stellar/` storage.

## Redemption lock and frontend tests

| Check | Method | Observed result |
| --- | --- | --- |
| Senior redemption during lock | Testnet simulation of `withdraw` with `--send no` | `HostError: Error(Contract, #16)` (`WithdrawalLocked`) |
| Junior redemption during lock | Testnet simulation of `withdraw_junior` with `--send no` | `HostError: Error(Contract, #16)` (`WithdrawalLocked`) |
| Frontend wallet behavior | `npm.cmd test -- __tests__/frontend.test.tsx` at frontend commit `5d03961f65665904497c8be9eb56afbe23f1d6af` | 9 passed, including wrong-network rejection and excluding rejected writes from activity |

The simulations used the liquidity provider and pool from the receipt and attempted to burn `10000000` share units in each tranche. Neither simulation submitted a transaction. Before the successful checks, the sandboxed RPC calls hit a connection error and the first network-enabled invocation omitted the provider because it looked up the wrong receipt field. The final invocation used `accounts.liquidityProvider`.

## Wallet preparation and outstanding checks

On 17 November, the original wallet's LVTEST trustline transaction was prepared as unsigned Testnet XDR. The local summary recorded zero signatures, status `unsigned-not-submitted`, and expiry `2026-11-18T15:08:41Z`. The isolated CLI run used its own accounts and issuer.

Update, 26 November 2026: a live Varial (formerly Freighter) lifecycle and signature rejection were recorded in the [wallet record](wallet-freighter-2026-11-26.json); account switching and the hosted lock display remain unrecorded. The original note follows.

The frontend tests used a mocked wallet. Live Freighter evidence is pending for the hosted lifecycle, signature rejection, account and network switching, and the hosted redemption-lock display. Use the [wallet walkthrough](../wallet-demo.md) and [session worksheet](../SESSION_WORKSHEET.md) to record actual behavior, confirmed hashes and before/after balances. Independent participant validation is also pending.
