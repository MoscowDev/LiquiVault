# LiquiVault Deployment & Operational Runbook

This guide covers deploying, initializing, and smoke-testing LiquiVault on **Stellar Soroban Testnet** with the Stellar CLI.

---

## 0. Live Testnet Deployment

The protocol is deployed on Stellar Testnet. The full record (accounts and smoke-test output) is in [`liquivault-contracts/deployments/testnet.json`](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json).

| Contract | Testnet ID |
| :--- | :--- |
| `invoice_registry` | [`CBYTATTI4S32LCK5W2N4P6U64MAGROW5ZH7DOXAO4CIOY2KWDNIDLSQY`](https://stellar.expert/explorer/testnet/contract/CBYTATTI4S32LCK5W2N4P6U64MAGROW5ZH7DOXAO4CIOY2KWDNIDLSQY) |
| `liquidity_pool` | [`CCRZRIUMDZ67YDHWMPUFO2LZNGKS2QDRPNK23MUVBYMXYHDDQNNDULGR`](https://stellar.expert/explorer/testnet/contract/CCRZRIUMDZ67YDHWMPUFO2LZNGKS2QDRPNK23MUVBYMXYHDDQNNDULGR) |
| `factoring_escrow` | [`CBQGNTVLNXV2LZ47GTOUK2TQNTNBNWUWSAKXVYHCURAVL7UZENQ7U42C`](https://stellar.expert/explorer/testnet/contract/CBQGNTVLNXV2LZ47GTOUK2TQNTNBNWUWSAKXVYHCURAVL7UZENQ7U42C) |
| Test USDC (SAC) | [`CCELQDGSNDDQHVDXQM3CXBCR4LOGLVAIKKET4RY72MZP7SKTEOY2RO2K`](https://stellar.expert/explorer/testnet/contract/CCELQDGSNDDQHVDXQM3CXBCR4LOGLVAIKKET4RY72MZP7SKTEOY2RO2K) |

> The USDC token is a **LiquiVault-issued test asset** (`USDC:GDQBC44K...RV2O`) wrapped as a Stellar Asset Contract, so the smoke test can mint balances. It is not Circle USDC.

**Smoke-test result (10,000 USDC invoice, 60 days, Tier B):**

| Step | On-chain result |
| :--- | :--- |
| Senior / junior deposits | 50,000 / 20,000 USDC |
| Factoring quote | 1,643.82 time discount + 500.00 origination fee = 2,143.82 total |
| Merchant received | 9,785.62 USDC (net of the 2,143.82 discount on 10,000 face value) |
| Settlement | 214.38 USDC (10%) to treasury; 1,929.44 USDC LP yield |
| Tranche split | Junior +578.83 (30%), Senior +1,350.61 (70%) |
| Invoice status | `Settled` (3), owned by the escrow contract |

---

## 1. Prerequisites

| Tool | Version used | Check |
| :--- | :--- | :--- |
| Rust | 1.84+ (tested on 1.99) | `rustc --version` |
| WASM target | `wasm32v1-none` | `rustup target add wasm32v1-none` |
| Stellar CLI | 22+ (tested on 28.1) | `stellar --version` |
| Node.js | v20 / v22 | `node -v` |

---

## 2. One-Command Deploy

```bash
git clone https://github.com/MoscowDev/liquivault-contracts.git
cd liquivault-contracts
./scripts/deploy_testnet.sh
```

The [script](https://github.com/MoscowDev/liquivault-contracts/blob/main/scripts/deploy_testnet.sh) builds the WASM, creates and funds identities (`lv-admin`, `lv-verifier`, `lv-treasury`, `lv-merchant`, `lv-debtor`, `lv-lp`), issues test USDC, deploys and initializes all three contracts, runs the smoke test, and writes `deployments/testnet.json`. Each run creates a fresh deployment.

---

## 3. Manual Steps

### 3.1 Build

The crates are declared as `rlib` so host-side unit tests link on every platform, so request `cdylib` explicitly when building WASM:

```bash
for c in invoice_registry liquidity_pool factoring_escrow; do
  cargo rustc -p $c --crate-type cdylib --target wasm32v1-none --release
done
# -> target/wasm32v1-none/release/{invoice_registry,liquidity_pool,factoring_escrow}.wasm
```

`factoring_escrow` calls the other two contracts through declared interfaces (`src/interfaces.rs`) rather than linking their crates, so its WASM only exports its own entrypoints.

### 3.2 Deploy

All three contracts take each other's addresses at initialization, so deploy all of them first, then initialize:

```bash
REGISTRY=$(stellar contract deploy --wasm target/wasm32v1-none/release/invoice_registry.wasm --source lv-admin --network testnet)
POOL=$(stellar contract deploy --wasm target/wasm32v1-none/release/liquidity_pool.wasm --source lv-admin --network testnet)
ESCROW=$(stellar contract deploy --wasm target/wasm32v1-none/release/factoring_escrow.wasm --source lv-admin --network testnet)
```

### 3.3 Initialize

```bash
stellar contract invoke --id $REGISTRY --source lv-admin --network testnet -- initialize \
  --admin $ADMIN --verifier $VERIFIER --factoring_escrow $ESCROW

stellar contract invoke --id $POOL --source lv-admin --network testnet -- initialize \
  --admin $ADMIN --usdc_token $USDC --factoring_escrow $ESCROW \
  --treasury $TREASURY --reserve_factor_bps 1000

stellar contract invoke --id $ESCROW --source lv-admin --network testnet -- initialize \
  --admin $ADMIN --invoice_registry $REGISTRY --liquidity_pool $POOL --usdc_token $USDC \
  --rate_config '{"grace_period_seconds":604800,"origination_fee_bps":50,"tier_a_annual_bps":600,"tier_b_annual_bps":1000,"tier_c_annual_bps":1500}'
```

`set_factoring_escrow` exists on the registry and pool for rotating the escrow later; it is not needed for a fresh deployment.

### 3.4 Smoke Test

Amounts use 7 decimals (`100000000000` = 10,000 USDC). `risk_tier`: `0` = A, `1` = B, `2` = C.

```bash
stellar contract invoke --id $POOL --source lv-lp --network testnet -- deposit --provider $LP --amount 500000000000
stellar contract invoke --id $POOL --source lv-lp --network testnet -- deposit_junior --provider $LP --amount 200000000000

stellar contract invoke --id $REGISTRY --source lv-merchant --network testnet -- mint_invoice \
  --merchant $MERCHANT --debtor $DEBTOR --currency $USDC --face_value 100000000000 \
  --maturity_timestamp $MATURITY --metadata_hash <64-hex-char-sha256> \
  --invoice_number INV-TESTNET-001 --risk_tier 1

stellar contract invoke --id $REGISTRY --source lv-verifier --network testnet -- verify_invoice \
  --caller $VERIFIER --invoice_id 1 --risk_tier 1

stellar contract invoke --id $ESCROW --source lv-merchant --network testnet -- factor_invoice \
  --merchant $MERCHANT --invoice_id 1

stellar contract invoke --id $ESCROW --source lv-debtor --network testnet -- settle_invoice \
  --payer $DEBTOR --invoice_id 1
```

---

## 4. Connecting Frontend & SDK

`liquivault-frontend/.env.example` is pre-filled with the testnet IDs above:

```bash
git clone https://github.com/MoscowDev/liquivault-frontend.git
cd liquivault-frontend
cp .env.example .env.local
npm run dev
```
