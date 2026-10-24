# Verified Evidence & Test Proofs

This document records the exact test suite execution, mathematical assertions, and behavioral proofs verified across the LiquiVault codebase.

**Test Execution Date:** 2026-10-24  
**Environment:** Soroban SDK 21.7.7, Rust 1.99.1 (host tests on x86_64-pc-windows-gnu; WASM built for `wasm32v1-none`), Node.js v22.20.0 x64, Stellar CLI 28.1.0.  
**Result:** **42 / 42 Automated Tests Passed (0 Failures, 0 Warnings).**

---

## 1. Smart Contract Test Evidence (`liquivault-contracts`)

Executed via:
```bash
cargo test --workspace
```
**Total:** 19 Passed, 0 Failed, 0 Ignored.

### 1.1 Factoring Escrow Contract (`contracts/factoring_escrow`)
**Result:** `test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured`

| Test Case | Concrete Assertion & Proof Verified |
| :--- | :--- |
| `test_end_to_end_factoring_and_settlement` | 100,000 USDC invoice with 73-day maturity factored at Tier B (10% APR + 50 bps fee). Total discount: **2,500 USDC** (Time: 2,000, Origination: 500). Net merchant payout: **97,500 USDC**. Upon debtor settlement, 2,250 USDC LP yield distributed + 250 USDC protocol fee routed to treasury. LP provider successfully redeems **252,250 USDC** principal + yield. |
| `test_calculate_discount_matches_spec` | Verifies pure math calculation: 100,000 USDC face value over 73 days at Tier A (600 bps) yields 1,200 USDC time discount + 500 USDC fee = **98,300 USDC net payout**. |
| `test_factor_rejects_expired_invoice` | Asserts `try_factor_invoice` returns `Err(EscrowError::InvoiceAlreadyExpired)` when `maturity <= now`. |
| `test_factor_rejects_wrong_owner_and_double_factoring` | Verifies unauthorized address cannot factor another merchant's invoice, and a factored invoice cannot be factored a second time (`InvoiceAlreadyFactored`). |
| `test_default_requires_grace_period_and_admin` | Rejects `mark_defaulted` prior to `maturity + grace_period` with `GracePeriodNotElapsed`. Rejects non-admin callers with `Unauthorized`. Successful execution marks escrow `Defaulted`, invoice `Defaulted`, and calls `pool.write_off_default`. |
| `test_set_paused_blocks_factoring_and_settlement` | Asserts `set_paused(true)` prevents `factor_invoice` and `settle_invoice` (`ContractPaused`), and unpausing immediately restores functionality. |
| `test_set_paused_rejects_non_admin` | Confirms non-admin callers receive `Err(EscrowError::Unauthorized)`. |
| `test_update_rate_config_changes_quote_and_validates` | Asserts updating `tier_b_annual_bps` from 1000 to 1200 increases factoring discount on subsequent quotes. Asserts boundary validation rejects rates > 50% with `InvalidRateConfiguration`. |
| `test_transfer_admin` | Verifies dual-signature admin transfer (current and new admin both authorize); old admin is revoked and new admin can pause/unpause. |

### 1.2 Invoice Registry Contract (`contracts/invoice_registry`)
**Result:** `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured`

| Test Case | Concrete Assertion & Proof Verified |
| :--- | :--- |
| `test_mint_and_verify_invoice_lifecycle` | Mints invoice with SHA-256 metadata hash commitment. Transitions status from `Issued` to `Verified` by verifier, to `Factored` by escrow, and `Settled` upon repayment. |
| `test_debtor_and_merchant_cannot_verify_own_invoice` | **Regression proof for Finding F-1:** Asserts neither the merchant nor the designated debtor can call `verify_invoice` to self-approve fictitious invoices. Verifier oracle and admin succeed. |
| `test_reject_invalid_maturity_or_unauthorized_escrow` | Rejects invoices with past maturity dates (`InvalidMaturityTimestamp`). Rejects unauthorized escrows attempting to mark invoices as factored. |

### 1.3 Liquidity Pool Contract (`contracts/liquidity_pool`)
**Result:** `test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured`

| Test Case | Concrete Assertion & Proof Verified |
| :--- | :--- |
| `test_deposit_allocate_repay_and_yield_distribution` | Two LPs deposit 60k and 40k USDC. 48k allocated to merchant. Repayment of 48k principal + 2,000 USDC gross yield. 200 USDC reserve cut routed to treasury. LPs redeem pro-rata: LP1 receives **61,080 USDC**, LP2 receives **40,720 USDC**. |
| `test_junior_receives_share_of_yield` | Pool with 60k senior + 20k junior USDC. 2,000 USDC gross yield splits 200 to treasury, 540 USDC (30%) to junior tranche, and 1,260 USDC (70%) to senior tranche. |
| `test_junior_absorbs_losses_before_senior` | A 15k default write-off reduces junior assets from 20k to 5k; senior capital remains intact at 60k. A subsequent 10k default exhausts junior to 0 and takes only the remaining 5k from senior. |
| `test_junior_withdrawal_requires_coverage_of_deployed_capital` | With 50k USDC active advances, junior withdrawal leaving < 5k (10% coverage) is rejected with `JuniorCoverageTooLow`. Partial withdrawal leaving >= 10k succeeds. Full withdrawal allowed only after capital repayment. |
| `test_wiped_out_junior_rejects_new_deposits_and_senior_gets_all_yield` | When junior is wiped to 0 by defaults, new deposits are rejected (`TrancheWipedOut`) to prevent share dilution. 100% of subsequent LP yield redirects to senior. |
| `test_set_junior_yield_bps_admin_only_and_capped` | Rejects non-admin with `Unauthorized` and rates > 80% with `InvalidJuniorYieldBps`. Updates yield allocation dynamically. |
| `test_set_paused_blocks_deposit_and_withdraw_and_requires_admin` | Pausing blocks both senior deposit and withdraw with `PoolPaused`. |

---

## 2. TypeScript SDK Test Evidence (`liquivault-sdk`)

Executed via:
```bash
npm test
```
**Result:** `tests/sdk.test.ts (11 tests passed in 25ms)`

1. `computes deterministic 64-char SHA-256 metadata hashes`: RFC-6902 sorted key hash equality verified.
2. `calculates algorithmic factoring discount accurately matching Soroban i128 math`: 73 days @ Tier B yields exact 2,500 USDC discount and 97,500 USDC payout.
3. `calculates LP share conversions and real-time APY accurately`: Share index conversion and 7.92% net APY matching reserve factor verified.
4. `executes end-to-end mocked RPC contract calls for minting, factoring, and LP deposit`.
5. `splits yield like the contract (10% cut, 30% of LP yield to junior)`: 2,000 gross -> 200 fee, 540 junior, 1,260 senior.
6. `gives senior all LP yield when junior is empty`: 1,000 gross -> 100 fee, 0 junior, 900 senior.
7. `applies losses to junior first`: 15k loss absorbed 100% by junior; 25k loss splits 20k junior and 5k senior.
8. `previews junior withdrawals against the 10% coverage rule`: Coverage validation verified.
9. `builds deposit/withdraw junior transactions targeting the pool contract`: Verified correct method and envelope encoding.
10. `counts junior assets as idle liquidity for senior withdrawals`: Verifies idle liquidity pooled across tranches.
11. `generates authentic native Soroban InvokeHostFunction operation XDR using @stellar/stellar-sdk`: Verifies `InvokeHostFunction` operation XDR construction.

---

## 3. Frontend Web Test Evidence (`liquivault-frontend`)

Executed via:
```bash
npm test
```
**Result:** `__tests__/frontend.test.tsx (12 tests passed)`

1. `formats USDC amounts and stroops accurately`.
2. `formats basis points into percentages`.
3. `truncates Stellar public keys cleanly`.
4. `calculates time-weighted factoring discount quotes matching Soroban pool math`.
5. `generates a 64-character hex SHA-256 metadata commitment`.
6. `renders Protocol Analytics Dashboard with TVL, APY, and ledger transactions`.
7. `renders Merchant Factoring view with invoice tokenization form and factoring quote modal`.
8. `renders Investor Liquidity Vault with lvUSDC share index and deposit/withdraw tabs`.
9. `splits LP yield to junior only while it holds capital`.
10. `applies losses to junior before senior`.
11. `blocks junior withdrawals that break the 10% coverage rule`.
12. `renders the junior tranche card on the investor page` (`JuniorTrancheCard`).

---

## 4. On-Chain Testnet Evidence

The contracts are deployed on Stellar Testnet (protocol 29) and an end-to-end smoke test was run with [`scripts/deploy_testnet.sh`](https://github.com/MoscowDev/liquivault-contracts/blob/main/scripts/deploy_testnet.sh). Raw output: [`deployments/testnet.json`](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json).

| Check | Result |
| :--- | :--- |
| Senior / junior deposits | 50,000 / 20,000 test USDC accepted |
| Mint + verify | Invoice #1 (10,000 USDC, 60 days, Tier B) minted by merchant, verified by oracle |
| Factor | Quote 1,643.8207 time discount + 500.0000 fee; merchant balance 9,785.6179 USDC |
| Settle | 214.3821 USDC (10% reserve) to treasury; 1,929.4386 USDC LP yield |
| Tranche split | Junior assets 20,000 → 20,578.8316 (30%); senior 50,000 → 51,350.6070 (70%) |
| Final state | Invoice status `Settled`; pool `deployed_capital` back to 0 |

Contract IDs are listed in the [Deployment Guide](deployment.md#0-live-testnet-deployment).
