# Drips Wave Issues

Each item below is opened as a GitHub issue **in the repository named in its section heading**, with the `wave-task` label (template: `.github/ISSUE_TEMPLATE/wave_task.md`). Complexity: Trivial / Medium / High.

## liquivault-contracts
1. **Add `liquidity_pool` edge-case tests** (Medium): zero deposit, over-withdraw, share price after default write-off, multiple LPs pro-rata. *Accept:* `cargo test -p liquidity_pool` covers each case.
2. **Add `invoice_registry` negative tests** (Medium): non-verifier verify, double verify, past maturity mint, zero face value. *Accept:* each returns the expected error.
3. **Add `update_verifier` / `transfer_admin` to `invoice_registry`** (Medium): mirror `factoring_escrow::transfer_admin`, with events and tests.
4. **Property/fuzz tests for `compute_quote`** (High): discount never exceeds face value, monotonic in duration and risk tier.
5. **[COMPLETED] Document contract storage and TTL policy** (Trivial): see [`docs/storage.md`](docs/storage.md).
6. **Guard against drift between `factoring_escrow/src/interfaces.rs` and `invoice_registry` types** (Medium): the escrow keeps wire-compatible copies of `RiskTier`, `InvoiceStatus`, and `InvoiceRecord`. Add a test that round-trips each value through both definitions (or extract a shared no-export `types` crate). *Accept:* changing a field or discriminant in one crate fails `cargo test`.
7. **Add `liquidity_pool` admin transfer** (Medium): dual-signature `transfer_admin` for the pool, matching `factoring_escrow::transfer_admin`, with events and tests.

## liquivault-sdk
8. **Unit tests for admin transaction builders** (Trivial): cover `buildSetEscrowPausedTx`, `buildUpdateRateConfigTx`, and the `transfer_admin` builder (correct contract ID, method name, and argument XDR).
9. **Typed error mapping** (Medium): map contract error codes (`EscrowError`, `RegistryError`, `PoolError`) to named TS errors.
10. **Live testnet example** (Medium): add `examples/testnet_quote.mjs` that reads `preview_factoring_quote` and pool state from the deployed testnet contracts (IDs in `liquivault-contracts/deployments/testnet.json`).

## liquivault-frontend
11. **Quote preview component** (Medium): live discount preview on the merchant page via `preview_factoring_quote`.
12. **Error and loading states for wallet and transactions** (Trivial): toast on rejection, spinner while pending.
13. **Dashboard: show pool utilization and default rate** (High): metrics chart from live contract reads (`get_pool_state`, `get_junior_state`, `get_protocol_metrics`).
14. **Read live tranche balances on the investor page** (Medium): replace mock senior/junior figures with `get_pool_state` / `get_junior_state` from the testnet pool.

## Docs & tooling (CI item goes to liquivault-contracts)
15. **[COMPLETED] `SECURITY.md` and threat model** (Medium): see [`docs/SECURITY.md`](docs/SECURITY.md).
16. **[COMPLETED] Testnet deployment guide** (Medium): see [`docs/deployment.md`](docs/deployment.md) and `liquivault-contracts/scripts/deploy_testnet.sh`.
17. **Run the deploy smoke test in CI against a local Stellar quickstart node** (High): start `stellar/quickstart` in GitHub Actions, run `deploy_testnet.sh` against it (network made configurable), and fail on any error.
