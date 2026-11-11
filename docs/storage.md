# Storage and archival

The source of truth is each contract's `src/types.rs` and TTL helper calls. The table describes current keys; a storage change requires an explicit migration review before using the admin upgrade entry point.

| Contract | Instance keys | Persistent keys |
| --- | --- | --- |
| Registry | `Config`, `NextInvoiceId` | `Invoice(u64)`, `MerchantInvoices(Address)` |
| Pool | `State`, `Junior`, `JuniorYieldBps` | `Position(Address)`, `JuniorPosition(Address)` |
| Escrow | `Config`, `TotalFactoredVolume`, `ActiveEscrowCount` | `Escrow(u64)` |

Invoice records include `invoice_id`, merchant/owner/debtor/currency addresses, `i128` face value, `u64` issued/maturity timestamps, metadata bytes, invoice number, risk tier and status. Pool positions include provider, shares, deposited USDC and `last_deposit_timestamp`. Escrow records include the original face value, advance, discount, debtor, risk tier, timestamps and status. `ActiveEscrowCount` is `u64`; `settled_at` is zero before settlement rather than an optional value.

## TTL policy

| Constant | Ledgers | Approximate interval at five seconds per ledger |
| --- | --- | --- |
| Instance threshold | 17,280 | 1 day |
| Instance extension target | 518,400 | 30 days |
| Persistent threshold | 34,560 | 2 days |
| Persistent extension target | 1,036,800 | 60 days |

These are ledger-based targets, not wall-clock guarantees. Mutating entry points extend affected keys where the source calls the helpers. Some getters also call extension helpers; pool position getters do not. **RPC simulation never commits those extensions**, so polling the UI does not pay rent or keep entries alive. Do not assume every read/write extends every relevant key or the contract executable.

A 60-day invoice may outlive its initial persistent TTL once its grace period is included. Operators must monitor instance, executable and active-record lifetimes. No automated keeper is shipped.

## Recovery

If simulation reports archived entries or provides a restoration preamble, inspect the returned footprint, create the required restoration transaction using the matching Stellar SDK/CLI, sign with a funded fee payer and wait for confirmation before rebuilding the original operation. Inspect the network and exact keys; do not restore an unrelated footprint or reuse a stale sequence.

CLI restoration flags depend on installed version: use `stellar contract restore --help` and the official [state archival documentation](https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival). An untested generic serialized-key command is deliberately not supplied. A production-grade keeper and tested restoration runbook remain backlog work.
