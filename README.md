# LiquiVault Protocol

**Institutional-Grade Decentralized Invoice Factoring & Liquidity Pool Protocol on Stellar Soroban**

LiquiVault enables global SMEs and institutional merchants to tokenize unpaid trade receivables on Stellar Soroban and atomically swap them for immediate USDC liquidity at an algorithmic risk-adjusted discount, backed by an institutional USDC liquidity pool (`lvUSDC`).

---

## Repository Structure

This workspace is structured across three distinct repositories:

| Repository | Tech Stack | Description |
| :--- | :--- | :--- |
| [`./liquivault-contracts`](./liquivault-contracts) | Rust (`no_std`), `soroban-sdk` | Core Soroban smart contracts: `invoice_registry`, `liquidity_pool`, and `factoring_escrow`. |
| [`./liquivault-sdk`](./liquivault-sdk) | TypeScript, `@stellar/stellar-sdk`, `tsup`, `vitest` | Dual ESM/CJS TypeScript SDK providing typed contract clients, Soroban transaction builders, and Freighter SEP-10/wallet adapters. |
| [`./liquivault-frontend`](./liquivault-frontend) | Next.js 14 (App Router), Tailwind CSS, `shadcn/ui`, `lucide-react` | Institutional web application with Merchant Factoring Portal, Investor Liquidity Pool Portal, and Protocol Analytics Dashboard. |

---

## Protocol Architecture

```
+-------------------------------------------------------------------------+
|                        LiquiVault Frontend (Next.js 14)                 |
|     /merchant                /investor                 /dashboard       |
+---------+------------------------+-------------------------+------------+
          |                        |                         |
          v                        v                         v
+-------------------------------------------------------------------------+
|                      @liquivault/sdk (TypeScript SDK)                   |
|   Contract Wrappers  |  Soroban Tx Builders  |  Freighter & RPC Client  |
+---------+------------------------+-------------------------+------------+
          |                        |                         |
          v                        v                         v
+-------------------------------------------------------------------------+
|                    Stellar Soroban Smart Contracts (Rust)               |
|                                                                         |
|  +----------------------+   +----------------------+                    |
|  |   invoice_registry   |<--|   factoring_escrow   |                    |
|  | (Tokenize & Verify)  |   | (Algorithmic Swap &  |                    |
|  +----------------------+   |  Maturity Settlement)|                    |
|                             +----------+-----------+                    |
|                                        |                                |
|                                        v                                |
|                             +----------------------+                    |
|                             |    liquidity_pool    |                    |
|                             | (USDC Vault, lvUSDC  |                    |
|                             |  Shares & Pro-Rata)  |                    |
|                             +----------------------+                    |
+-------------------------------------------------------------------------+
```

---

## Quick Start

### 1. Smart Contracts (`liquivault-contracts`)
```bash
cd liquivault-contracts
cargo test --workspace
stellar contract build
```

### 2. TypeScript SDK (`liquivault-sdk`)
```bash
cd liquivault-sdk
npm install
npm test
npm run build
```

### 3. Web Application (`liquivault-frontend`)
```bash
cd liquivault-frontend
cp .env.example .env.local
npm install
npm run dev
```
