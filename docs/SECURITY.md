# LiquiVault Security Policy & Threat Model

> **Notice:** The LiquiVault protocol is currently deployed for testing and evaluation on Stellar Soroban Testnet. The codebase is pre-independent audit. Do not deploy to public mainnet with real capital without completing external professional audits.

---

## 1. Vulnerability Disclosure & Bug Reporting

Security reports are treated with the highest priority. If you identify a suspected vulnerability, race condition, or economic exploit:

* **Private Reporting:** Do NOT disclose the vulnerability publicly in open GitHub issues or discussion forums. Submit reports securely via GitHub Private Vulnerability Reporting under the **Security** tab of the repository.
* **Alternative Email:** Contact the security team directly at `security@liquivault.fi` with PGP-encrypted details if GitHub reporting is unavailable.
* **Acknowledgment SLA:** The core maintainers acknowledge receipt of vulnerability submissions within **48 hours** and provide triage assessments within **72 hours**.
* **Bug Bounty:** Critical and high-severity findings responsibly disclosed prior to mainnet deployment are eligible for retrospective recognition and bounty awards.

---

## 2. Protocol Roles & Trust Boundary Matrix

The protocol establishes explicit trust boundaries between privileged protocol actors and untrusted external counterparties:

| Protocol Actor | Capabilities & Privileges | Trust Level | Security Assumptions & Boundaries |
| :--- | :--- | :--- | :--- |
| **Contract Admin** | Can pause/unpause contracts, update rate configurations, transfer the admin role (requires the new admin's signature too), and trigger default write-offs after grace expiration. | **Trusted** | Must be secured via an institutional multisig (e.g., 3-of-5 Gnosis/Stellar threshold). Cannot arbitrarily siphon pool capital or modify settled invoice terms. |
| **Verifier Oracle** | Authorized to invoke `verify_invoice` and assign commercial credit risk tiers (`TierA`, `TierB`, `TierC`). | **Trusted** | Responsible for off-chain document validation (invoices, bills of lading, corporate registry authenticity). Dishonesty permits bad receivables into the pool. |
| **Debtor** | Designated commercial counterparty responsible for invoice repayment at maturity. | **Untrusted** | Has NO verification rights (mitigating Finding F-1). Cannot factor invoices or modify payment terms. |
| **Merchant** | Mints tokenized receivables and factors them for immediate pool liquidity. | **Untrusted** | Receives advance capital only after successful oracle underwriting. Cannot verify their own invoices. |
| **Senior LP (`lvUSDC`)** | Deposits USDC into senior vault; burns shares for principal plus yield. | **Untrusted** | Protected from first-loss defaults up to junior capital capacity. Bounded by idle pool liquidity. |
| **Junior LP (`jUSDC`)** | Deposits USDC into junior vault; earns outsized yield share in exchange for first-loss risk. | **Untrusted** | Absorbs initial default shocks. Withdrawals blocked if remaining capital drops below 10% of deployed capital. |

---

## 3. Vulnerability Findings & Mitigations Matrix

### Finding F-1: Self-Verification Exploit by Malicious Merchants
* **Severity:** **Critical**
* **Status:** **RESOLVED**
* **Vulnerability Description:** Earlier iterations of `invoice_registry::verify_invoice` permitted either the designated Verifier Oracle OR the named `debtor` address to verify invoices. Because merchants freely choose the `debtor` address during `mint_invoice`, a rogue merchant could specify a secondary address they controlled, mint a fictitious $1,000,000 receivable, self-verify at Tier A, and atomically factor it to drain USDC liquidity from the pool.
* **Mitigation Implemented:** Self-verification by merchants and debtors is strictly prohibited on-chain. `verify_invoice` now enforces that `caller == config.verifier || caller == config.admin`. 
* **Regression Proof:** Automated test `test_debtor_and_merchant_cannot_verify_own_invoice` passes with 0 errors.

### Finding F-2: Unpausable Liquidity Pool
* **Severity:** **High**
* **Status:** **RESOLVED**
* **Vulnerability Description:** While `factoring_escrow` and `invoice_registry` contained operational circuit breakers, `liquidity_pool` checked `state.paused` during deposits and withdrawals but lacked an admin method to toggle the boolean.
* **Mitigation Implemented:** Added an admin-only `set_paused(paused: bool)` method with strict authentication, event emission, and state persistence. Emergency pausing blocks new deposits and withdrawals while preserving the ability of debtors to repay existing advances (`repay_liquidity`).
* **Regression Proof:** Automated test `test_set_paused_blocks_deposit_and_withdraw_and_requires_admin`.

### Finding F-3: Front-Running Default Write-Offs
* **Severity:** **High**
* **Status:** **PARTIALLY MITIGATED (Architecture Roadmap)**
* **Vulnerability Description:** When an invoice defaults, `factoring_escrow::mark_defaulted` triggers `liquidity_pool::write_off_default`, reducing total pool assets and decreasing the NAV share price for remaining liquidity providers. In an un-tranched pool, sophisticated LPs monitoring delinquent invoices off-chain could front-run the admin's `mark_defaulted` transaction, withdrawing 100% of their idle liquidity and dumping the entire loss on remaining passive LPs.
* **Mitigation Implemented:** 
  1. Implemented a **Junior First-Loss Tranche** (`jUSDC`) absorbing 100% of defaults up to total junior capital before senior `lvUSDC` capital experiences any loss.
  2. Implemented the **10% Deployed Capital Coverage Rule**: Junior withdrawals are rejected if remaining junior capital would fall below 10% of outstanding deployed advances.
* **Remaining Mainnet Recommendation:** Implement an epoch-based withdrawal queue (e.g., 7-day redemption delay) before public mainnet deployment to prevent senior front-running of remaining senior capital during extreme default events exceeding junior capacity.

### Finding F-4: Desynchronized Default Marking Authority
* **Severity:** **Medium**
* **Status:** **DOCUMENTED / CONTROLLED**
* **Vulnerability Description:** If `invoice_registry::mark_defaulted` is called independently of `factoring_escrow::mark_defaulted`, invoice state moves to `Defaulted` without notifying the escrow or pool to write off the loss.
* **Mitigation Implemented:** In production, default execution is restricted to the factoring escrow contract via `invoice_registry::mark_defaulted` caller checks (`caller == config.factoring_escrow`). Escrow enforces maturity timestamp plus mandatory `grace_period_seconds` (default 7 days) prior to state execution.

### Finding F-5: Off-Chain Document Authenticity Verification
* **Severity:** **Medium**
* **Status:** **OPERATIONAL BOUNDARY**
* **Vulnerability Description:** The protocol verifies an on-chain SHA-256 metadata hash commitment (`BytesN<32>`), ensuring that commercial invoice documents cannot be altered post-minting. However, the Soroban host cannot inspect real-world physical goods or verify that the underlying commercial debt is legally enforceable.
* **Mitigation Implemented:** Documented as an explicit operational boundary in `KNOWN_LIMITATIONS.md`. Verifier oracles must be licensed financial institutions with legal recourse and KYB underwriting requirements.

### Finding F-6: Pool Share Dilution & NAV Flooring Boundaries
* **Severity:** **Medium**
* **Status:** **RESOLVED**
* **Vulnerability Description:** If catastrophic defaults reduce tranche assets to 0 while shares remain outstanding, subsequent deposits could mint shares at a distorted 1:1 exchange rate.
* **Mitigation Implemented:** If junior assets are reduced to 0 by defaults while `total_shares > 0`, fresh junior deposits are rejected with `TrancheWipedOut`. All subsequent factoring yield is automatically redirected to senior LPs until governance restructures the tranche.

### Finding F-7: Missing Administrative Events & Unsafe Admin Transfers
* **Severity:** **Low**
* **Status:** **RESOLVED**
* **Vulnerability Description:** Immediate single-step admin transfers pose a risk of permanent contract lockup if an invalid address is supplied.
* **Mitigation Implemented:** `factoring_escrow::transfer_admin` requires authorization from both the current and the new admin in the same call, so control cannot be handed to a mistyped or unowned address. (This is a single dual-signature call, not a propose/accept flow; `invoice_registry` and `liquidity_pool` do not yet support admin transfer.) Added explicit event emissions for administrative parameter updates.

---

## 4. Formal Invariants & Mathematical Guarantees

Every protocol transaction strictly maintains the following invariants:

$$\text{Total Senior Assets} + \text{Total Junior Assets} \ge \text{Deployed Capital}$$

$$\text{Total Discount} < \text{Face Value} \quad (\text{Net Merchant Payout} > 0)$$

$$\text{Remaining Junior Assets} \ge \text{Deployed Capital} \times 10\% \quad (\text{During Junior Redemptions})$$

$$\text{Share Price} = \frac{\text{Total Assets} \times 10{,}000{,}000}{\text{Total Shares}} \ge 10{,}000{,}000 \quad (\text{Under Non-Default Operational State})$$

All arithmetic computations across the protocol use checked integer math (`checked_add`, `checked_sub`, `checked_mul`, `checked_div`). Any calculation resulting in an overflow or underflow immediately reverts with `EscrowError::ArithmeticOverflow` or `PoolError::ArithmeticOverflow`.

---

## 5. Pre-Mainnet Production Checklist

- [ ] Complete formal independent security audit with a top-tier Web3 security firm.
- [ ] Migrate all contract administrative keys to an institutional multisig (Gnosis Safe / Stellar multi-party signature).
- [ ] Implement epoch-based withdrawal redemption queues for senior LPs.
- [ ] Deploy decentralized keeper bots for automated maturity monitoring and grace period default triggers.
- [ ] Launch continuous monitoring telemetry with alerting on abnormal withdrawal spikes.
