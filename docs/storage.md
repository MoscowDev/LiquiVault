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

Do not infer maturity/grace coverage from the extension constants alone: network minimum TTLs can exceed those targets and can change. Inspect actual entry lifetimes and current network parameters. Operators must monitor instance, executable and active-record lifetimes. No rent keeper is shipped.

## Recovery

On Protocol 23 and later, simulation normally supplies a restore list for archived entries. The prepared `InvokeHostFunction` can restore them automatically when executed; signing also authorizes the associated fees. A read simulation itself commits no restoration or TTL extension. The SDK relies on the official Stellar preparation behavior for this path.

Separate `RestoreFootprintOp` transactions remain useful in cases such as oversized automatic-restoration footprints or an operator sponsoring restoration separately. If the RPC calls for that path, inspect the footprint, prepare/sign the restoration with a funded fee payer, confirm it and rebuild the original call. Do not use an unrelated footprint or stale sequence. A caller-visible restoration planner and tested keeper/recovery harness remain backlog work; automatic restoration is not universally absent.

CLI restoration flags depend on installed version: use `stellar contract restore --help` and the official [state archival documentation](https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival). An untested generic serialized-key command is deliberately not supplied. A production-grade keeper and tested restoration runbook remain backlog work.
