# LiquiVault Contract Storage & State TTL Lifecycle Policy

This specification details the Soroban storage architecture, state layout, key serialization, Time-to-Live (TTL) bump policies, and archival restoration procedures implemented across all LiquiVault smart contracts.

---

## 1. Storage Tiers & Cost Optimization

Stellar Soroban partitions ledger storage into two primary on-chain tiers:

1. **Instance Storage**:
   - Shares the lifecycle of the smart contract executable instance.
   - Used for singleton protocol configurations, global counters, administrative authority addresses, and cumulative telemetry metrics.
   - Compact in size and cheap to extend because the contract's instance footprint is bumped atomically.
2. **Persistent Storage**:
   - Independent storage entries with their own keys and individual TTL lifecycles.
   - Used for dynamic, unbounded entity sets: tokenized invoices, merchant index lists, factoring escrows, and investor LP position records.
   - Insulated against unbounded contract state growth. If a single invoice is archived after its lifecycle finishes, it does not impact other active protocol operations.

---

## 2. Exhaustive DataKey Registry

### 2.1 `invoice_registry` Contract

| DataKey Variant | Storage Tier | Value Type | Description & Purpose |
| :--- | :--- | :--- | :--- |
| `Config` | **Instance** | `RegistryConfig` | Global registry configuration: admin address, verifier oracle address, factoring escrow contract address, and emergency paused status (`bool`). |
| `NextInvoiceId` | **Instance** | `u64` | Monotonically increasing sequential identifier assigned to freshly minted trade receivables. |
| `Invoice(u64)` | **Persistent** | `InvoiceRecord` | Canonical invoice record storing: `invoice_id`, `merchant` address, `debtor` address, `face_value` (i128 in USDC stroops), `currency` token address, `maturity` timestamp, `risk_tier` (`RiskTier`), `status` (`InvoiceStatus`), `metadata_hash` (`BytesN<32>`), `invoice_ref` (`String`), and `issued_at` timestamp. |
| `MerchantInvoices(Address)` | **Persistent** | `Vec<u64>` | Index of invoice IDs minted by a specific merchant account, enabling efficient off-chain enumeration without full ledger scans. |

### 2.2 `liquidity_pool` Contract

| DataKey Variant | Storage Tier | Value Type | Description & Purpose |
| :--- | :--- | :--- | :--- |
| `State` | **Instance** | `PoolState` | Core senior pool state: admin address, factoring escrow address, USDC token contract address, senior `total_shares` (i128), senior `total_assets` (i128), `deployed_capital` (i128), `reserve_factor_bps` (u32, default 1,000 = 10%), treasury address, and `paused` status (`bool`). |
| `Position(Address)` | **Persistent** | `LpPosition` | Individual senior investor record: `shares` held (i128) and `deposited_amount` (i128). |
| `Junior` | **Instance** | `JuniorState` | Junior first-loss tranche aggregate state: `total_shares` (i128) and `total_assets` (i128). |
| `JuniorPosition(Address)` | **Persistent** | `LpPosition` | Individual junior first-loss investor record: `shares` held (i128) and `deposited_amount` (i128). |
| `JuniorYieldBps` | **Instance** | `u32` | Configurable share of LP factoring yield routed to the junior tranche (default 3,000 = 30%, capped at 8,000 = 80%). |

### 2.3 `factoring_escrow` Contract

| DataKey Variant | Storage Tier | Value Type | Description & Purpose |
| :--- | :--- | :--- | :--- |
| `Config` | **Instance** | `EscrowConfig` | Master factoring engine configuration: admin address, registry address, pool address, USDC address, `RateConfig` (annual bps per risk tier + origination bps), `grace_period_seconds` (u64, default 7 days), and `paused` status (`bool`). |
| `Escrow(u64)` | **Persistent** | `EscrowRecord` | Factored invoice lifecycle record: `invoice_id`, `merchant` address, `face_value` (i128), `net_payout` (i128), `total_discount` (i128), `factored_at` timestamp, `settled_at` optional timestamp, and `status` (`EscrowStatus`). |
| `TotalFactoredVolume` | **Instance** | `i128` | Cumulative volume in USDC stroops factored through the escrow since inception. |
| `ActiveEscrowCount` | **Instance** | `u32` | Count of currently active, non-settled, non-defaulted escrow advances. |

---

## 3. TTL Bump Lifecycle Constants & Rules

Soroban enforces rent on ledger footprint storage. To guarantee continuous operational availability without requiring manual user rent top-ups during standard workflows, all LiquiVault contracts execute automatic TTL extensions on every read/write access.

### 3.1 Thresholds and Bump Durations

```text
Threshold (Trigger) ──> When current TTL < Threshold
Extend Action       ──> Bump TTL to (Current Ledger + Bump Amount)
```

| Constant Name | Value (Ledgers) | Approximate Duration | Applied Scope | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `INSTANCE_LIFETIME_THRESHOLD` | `17,280` | ~1 Day (at ~5s / ledger) | Instance storage across all 3 contracts | Ensures the contract code and singleton state never fall within 24 hours of eviction. |
| `INSTANCE_BUMP_AMOUNT` | `518,400` | ~30 Days | Instance storage across all 3 contracts | Extends contract instance health for 1 full calendar month on any transaction invocation. |
| `PERSISTENT_LIFETIME_THRESHOLD` | `34,560` | ~2 Days | Persistent entries (`Invoice`, `Escrow`, `Position`) | Triggers early extension before entry reaches archival vulnerability window. |
| `PERSISTENT_BUMP_AMOUNT` | `1,036,800` | ~60 Days | Persistent entries (`Invoice`, `Escrow`, `Position`) | Provides a 2-month buffer, exceeding typical Net-30 / Net-45 commercial invoice payment terms. |

### 3.2 Automated Extension Invariants

1. **Read-Through Extension**: Any contract query (e.g., `get_invoice`, `get_escrow`, `get_lp_position`) triggers `extend_persistent_ttl` for the retrieved key.
2. **Write-Through Extension**: Any state modification (e.g., `mint_invoice`, `factor_invoice`, `deposit`) triggers both `extend_instance_ttl` and `extend_persistent_ttl`.
3. **Grace Period Safety**: The persistent bump amount of 60 days strictly exceeds the default 7-day default grace period (`grace_period_seconds = 604,800`), ensuring escrows remain live through maturity and grace period windows.

---

## 4. Archival Recovery Procedures

If an invoice or an LP position remains completely untouched past `1,036,800` ledgers (~60 days), Stellar nodes move the ledger entry into **Archived** status. 

### 4.1 Detecting an Archived Entry
Attempting to invoke a contract function targeting an archived persistent key returns a Soroban host error:
```text
Error(Storage, DeadEntry)
```

### 4.2 Restoring Archived State via Stellar CLI

Using the `stellar-cli` (v21.7+):

1. **Simulate Restoration Footprint**:
   Construct and simulate the transaction with the contract address and the target `DataKey` to obtain the restoration footprint transaction envelope.
2. **Execute Restoration**:
   Submit a `RestoreFootprint` operation signed by any active funded Stellar account:
   ```bash
   stellar contract restore \
     --id <CONTRACT_ID> \
     --key <HEX_SERIALIZED_DATAKEY> \
     --source <FEE_PAYER_ACCOUNT> \
     --network testnet
   ```
3. **Resume Contract Interaction**:
   Once the `RestoreFootprint` transaction confirms on-chain, the entry is immediately restored to active persistent storage with a renewed baseline TTL, allowing subsequent settlement or withdrawal calls to execute normally.
