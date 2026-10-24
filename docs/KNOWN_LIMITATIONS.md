# Known Limitations & Operating Boundaries

This document defines the formal operational envelope, verified runtime boundaries, cryptographic assumptions, and economic trade-offs of the LiquiVault protocol.

For empirical test evidence, see [Verified Evidence](EVIDENCE.md). For complete protocol mechanics, see [Architecture](architecture.md) and [Security Policy](SECURITY.md).

---

## 1. Operating Envelope & Tested Matrix

| Operational Dimension | Supported & Verified Envelope | Unverified / Unsupported Scope |
| :--- | :--- | :--- |
| **Blockchain Protocol** | Stellar Soroban; contracts built with soroban-sdk 21.7.7 and deployed on Testnet (protocol 29) | Protocol versions < 20 or experimental future protocol changes. |
| **Soroban SDK** | `soroban-sdk = "21.7.7"` | Earlier SDK releases (v20.x, v0.x). |
| **Toolchain & Target** | Rust `1.80.0+`, target `wasm32-unknown-unknown` | Non-standard Rust toolchains or native x86 targets for contract binaries. |
| **Host Architecture** | Node.js v20.x, v22.x on Linux x64, macOS arm64/x64, Windows x64 | Node.js versions < 18.x. |
| **Asset Denomination** | Circle USDC (SEP-41 Stellar Asset Contract / Mock) | Invoices denominated in non-USDC assets (e.g. EURC, XLM) reject with `CurrencyMismatch`. |

---

## 2. In-Depth Operational Boundaries & Risk Analysis

### 2.1 Oracle & Real-World Asset Verification
* **Classification:** **Off-Chain Trust Boundary**
* **Mechanism:** The `invoice_registry` contract records an RFC-6902 SHA-256 metadata hash commitment (`BytesN<32>`) representing the original PDF/EDI trade receivable document.
* **Limitation:** Smart contracts on Soroban cannot inspect off-chain commercial realities, logistics shipping manifests, or debtor solvency. The protocol relies on the Verifier Oracle to perform off-chain Know-Your-Business (KYB) and authenticity audits. If the verifier oracle is compromised or negligent, invalid receivables could enter the protocol.

### 2.2 Senior Tranche Front-Running Risk (Finding F-3)
* **Classification:** **Partially Mitigated Economic Design**
* **Mechanism:** Defaults reduce total pool assets upon administrative execution of `write_off_default`.
* **Mitigation:** The **Junior First-Loss Tranche** absorbs defaults before senior LP capital is touched. Junior withdrawals are locked if remaining junior assets drop below 10% of deployed capital.
* **Limitation:** In catastrophic scenarios where expected defaults exceed the junior capital buffer, senior LPs who actively monitor delinquent invoices off-chain could redeem idle pool liquidity ahead of default execution, leaving passive senior LPs to absorb residual losses. An epoch-based redemption queue is planned prior to mainnet.

### 2.3 Centralized Default Execution
* **Classification:** **Administrative Control**
* **Mechanism:** `factoring_escrow::mark_defaulted` can only be triggered by the contract administrator after the maturity timestamp plus the mandatory `grace_period_seconds` (7 days).
* **Limitation:** There is currently no permissionless liquidation or keeper-rewarded default execution. Delays by the administrator in calling `mark_defaulted` delay default write-offs and portfolio loss recognition. In production, this administrative key must reside in a multisig or automated keeper network.

### 2.4 Pool Liquidity Utilization Lockup
* **Classification:** **Economic Liquidity Boundary**
* **Mechanism:** LP withdrawals (both Senior and Junior) are strictly bounded by **idle pool liquidity**:
  $$\text{Idle Liquidity} = \text{Total Senior Assets} + \text{Total Junior Assets} - \text{Deployed Capital}$$
* **Limitation:** If capital utilization reaches 100%, LPs cannot immediately redeem shares for underlying USDC. LPs must wait for active invoices to reach maturity and be settled by debtors or written off by the pool.

### 2.5 Tranche Insolvency Floor (`TrancheWipedOut`)
* **Classification:** **Edge-Case Safety Guard**
* **Mechanism:** If catastrophic defaults wipe junior assets to 0 while junior shares remain outstanding (`junior_assets == 0 && junior_shares > 0`), subsequent junior deposits are rejected with `PoolError::TrancheWipedOut`.
* **Limitation:** Fresh junior capital cannot enter the junior tranche until governance explicitly restructures or resets the tranche shares. During this period, 100% of factoring yield is automatically redirected to senior LPs.

### 2.6 State Archival & TTL Extension
* **Classification:** **Soroban Ledger Storage Boundary**
* **Mechanism:** All contract interactions bump instance and persistent entry TTLs by 30 to 60 days.
* **Limitation:** If an invoice or position is completely dormant and untouched past `1,036,800` ledgers (~60 days), Stellar nodes archive the entry. Any subsequent contract interaction will fail with `DeadEntry` until an explicit `RestoreFootprint` operation is submitted. Detailed recovery instructions are provided in [Storage Policy](storage.md).

### 2.7 Frontend Demonstration Mode
* **Classification:** **Client Application Execution Mode**
* **Mechanism:** The Next.js frontend includes a fully functional local mock state and transaction simulator (`WalletContext`) to enable immediate interactive developer walkthroughs without requiring live testnet funding.
* **Limitation:** To execute genuine on-chain Soroban transactions with Freighter, developers must configure valid contract IDs in `.env.local` pointing to deployed Testnet contracts.
