# Draft Drips Wave Issues

Copy each into a GitHub issue (use the `wave_task` template in `.github/ISSUE_TEMPLATE/wave_task.md`). Complexity: Trivial / Medium / High.

## liquivault-contracts
1. **Add `liquidity_pool` edge-case tests** (Medium): zero deposit, over-withdraw, share price after default write-off, multiple LPs pro-rata. *Accept:* `cargo test -p liquidity_pool` covers each case.
2. **Add `invoice_registry` negative tests** (Medium): non-verifier verify, double verify, past maturity mint, zero face value. *Accept:* each returns the expected error.
3. **Add `update_verifier` / `transfer_admin` to `invoice_registry`** (Medium): mirror `factoring_escrow::transfer_admin`, with events and tests.
4. **Property/fuzz tests for `compute_quote`** (High): discount never exceeds face value, monotonic in duration and risk tier.
5. **[COMPLETED] Document contract storage and TTL policy** (Trivial): Documented in [`docs/storage.md`](docs/storage.md) listing every `DataKey`, its storage type, bump constants, and archival recovery procedures.

## liquivault-sdk
6. **SDK wrappers for `set_paused`, `update_rate_config`, `transfer_admin`** (Medium): typed methods and unit tests (depends on the contracts changes already merged).
7. **Typed error mapping** (Medium): map contract error codes (e.g. `EscrowError`) to named TS errors.
8. **Add usage examples** (Trivial): `examples/` for factoring and LP deposit on testnet.

## liquivault-frontend
9. **Quote preview component** (Medium): live discount preview on the merchant page via `preview_factoring_quote`.
10. **Error and loading states for wallet and transactions** (Trivial): toast on rejection, spinner while pending.
11. **Dashboard: show pool utilization and default rate** (High): metrics chart from contract reads.

## Docs
12. **[COMPLETED] `SECURITY.md` and threat model** (Medium): Documented in [`docs/SECURITY.md`](docs/SECURITY.md) covering trust assumptions (verifier, admin default), findings F-1 through F-7, and formal invariant guarantees.
13. **[COMPLETED] Testnet deployment guide** (Medium): Documented in [`docs/deployment.md`](docs/deployment.md) with compilation steps, initialization parameters, and CLI cross-binding scripts.
