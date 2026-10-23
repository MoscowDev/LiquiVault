# LiquiVault Deployment & Operational Runbook

This guide provides end-to-end instructions for deploying, initializing, configuring, and verifying the LiquiVault protocol on **Stellar Soroban Testnet** and future **Public Mainnet** networks using the Stellar CLI (`stellar-cli` v21.7+).

---

## 1. Prerequisites & Toolchain Verification

Ensure your environment is provisioned with verified tool versions:

| Tool | Required Version | Verification Command |
| :--- | :--- | :--- |
| **Rust** | `1.80.0+` | `rustc --version` |
| **WASM Target** | `wasm32-unknown-unknown` | `rustup target list --installed` |
| **Stellar CLI** | `21.7.0+` | `stellar --version` |
| **Node.js** | `v20.0.0+` or `v22.0.0+` | `node -v` |
| **Freighter Wallet** | Latest Chrome/Firefox extension | Verify browser extension |

### 1.1 Configure Stellar CLI Network and Identity

```bash
# Add Soroban Testnet configuration
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate or import deployer and admin identity
stellar keys generate --global admin --network testnet
stellar keys fund admin --network testnet

# Generate or import verifier oracle identity
stellar keys generate --global verifier --network testnet
stellar keys fund verifier --network testnet
```

---

## 2. Compilation of Smart Contracts

Compile the optimized release WASM binaries for all three workspace contracts:

```bash
cd liquivault-contracts
stellar contract build
```

The resulting binaries will be located at:
- `target/wasm32-unknown-unknown/release/invoice_registry.wasm`
- `target/wasm32-unknown-unknown/release/liquidity_pool.wasm`
- `target/wasm32-unknown-unknown/release/factoring_escrow.wasm`

---

## 3. Deployment Sequence

Deployment must occur in a specific order because contracts cross-reference each other during initialization:

```text
Step 1: Deploy / Identify USDC Asset (Token Contract)
  └── Step 2: Deploy invoice_registry.wasm
        └── Step 3: Deploy liquidity_pool.wasm
              └── Step 4: Deploy factoring_escrow.wasm
                    └── Step 5: Execute Cross-Binding Configuration
```

### Step 3.1 Deploy or Identify USDC Token
On Stellar Testnet, use the official Circle USDC Stellar Asset Contract (SAC) or deploy a test token:
```bash
# Deploy a test USDC token instance (or use existing SAC)
USDC_TOKEN_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mock_token.wasm \
  --source admin \
  --network testnet)
echo "USDC Token ID: $USDC_TOKEN_ID"
```

### Step 3.2 Deploy `invoice_registry`
```bash
REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/invoice_registry.wasm \
  --source admin \
  --network testnet)
echo "Invoice Registry ID: $REGISTRY_ID"
```

### Step 3.3 Deploy `liquidity_pool`
```bash
POOL_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/liquidity_pool.wasm \
  --source admin \
  --network testnet)
echo "Liquidity Pool ID: $POOL_ID"
```

### Step 3.4 Deploy `factoring_escrow`
```bash
ESCROW_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/factoring_escrow.wasm \
  --source admin \
  --network testnet)
echo "Factoring Escrow ID: $ESCROW_ID"
```

---

## 4. Contract Initialization & Parameter Configuration

### Step 4.1 Initialize `invoice_registry`
```bash
ADMIN_ADDR=$(stellar keys address admin)
VERIFIER_ADDR=$(stellar keys address verifier)

stellar contract invoke \
  --id $REGISTRY_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDR \
  --verifier $VERIFIER_ADDR
```

### Step 4.2 Initialize `liquidity_pool`
- `reserve_factor_bps`: `1000` (10% of gross LP yield to treasury)
- `treasury`: Treasury address receiving protocol reserves

```bash
TREASURY_ADDR=$ADMIN_ADDR

stellar contract invoke \
  --id $POOL_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDR \
  --usdc_token $USDC_TOKEN_ID \
  --reserve_factor_bps 1000 \
  --treasury $TREASURY_ADDR
```

### Step 4.3 Initialize `factoring_escrow`
- Rate Configuration:
  - `tier_a_annual_bps`: `600` (6.00% APR)
  - `tier_b_annual_bps`: `1000` (10.00% APR)
  - `tier_c_annual_bps`: `1500` (15.00% APR)
  - `origination_fee_bps`: `50` (0.50% flat origination fee)
- `grace_period_seconds`: `604800` (7 days)

```bash
stellar contract invoke \
  --id $ESCROW_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDR \
  --invoice_registry $REGISTRY_ID \
  --liquidity_pool $POOL_ID \
  --usdc_token $USDC_TOKEN_ID \
  --tier_a_annual_bps 600 \
  --tier_b_annual_bps 1000 \
  --tier_c_annual_bps 1500 \
  --origination_fee_bps 50 \
  --grace_period_seconds 604800
```

---

## 5. Cross-Binding Configuration

To enforce security boundaries, the pool and registry must authorize the escrow contract as the sole executing factoring engine:

### Step 5.1 Authorize Escrow on `liquidity_pool`
```bash
stellar contract invoke \
  --id $POOL_ID \
  --source admin \
  --network testnet \
  -- set_factoring_escrow \
  --escrow $ESCROW_ID
```

### Step 5.2 Authorize Escrow on `invoice_registry`
```bash
stellar contract invoke \
  --id $REGISTRY_ID \
  --source admin \
  --network testnet \
  -- set_factoring_escrow \
  --escrow $ESCROW_ID
```

---

## 6. Post-Deployment Verification & Smoke Testing

Run an automated end-to-end smoke test to verify all permissions and math:

### 6.1 Deposit Liquidity (Senior & Junior)
```bash
# Deposit 50,000 USDC into Senior Tranche
stellar contract invoke \
  --id $POOL_ID \
  --source admin \
  --network testnet \
  -- deposit \
  --from $ADMIN_ADDR \
  --amount 500000000000

# Deposit 10,000 USDC into Junior Tranche
stellar contract invoke \
  --id $POOL_ID \
  --source admin \
  --network testnet \
  -- deposit_junior \
  --from $ADMIN_ADDR \
  --amount 100000000000
```

### 6.2 Mint and Verify Smoke Invoice
```bash
DEBTOR_ADDR=$VERIFIER_ADDR
MATURITY=$(($(date +%s) + 86400 * 60)) # 60 days in future

# Mint 10,000 USDC Invoice
stellar contract invoke \
  --id $REGISTRY_ID \
  --source admin \
  --network testnet \
  -- mint_invoice \
  --merchant $ADMIN_ADDR \
  --debtor $DEBTOR_ADDR \
  --face_value 100000000000 \
  --currency $USDC_TOKEN_ID \
  --maturity $MATURITY \
  --invoice_ref "INV-TEST-001" \
  --metadata_hash "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Verify Invoice with Tier A
stellar contract invoke \
  --id $REGISTRY_ID \
  --source verifier \
  --network testnet \
  -- verify_invoice \
  --invoice_id 1 \
  --risk_tier 1
```

### 6.3 Factor Invoice via Escrow
```bash
stellar contract invoke \
  --id $ESCROW_ID \
  --source admin \
  --network testnet \
  -- factor_invoice \
  --invoice_id 1
```

---

## 7. Connecting Frontend & SDK

Update the client environment variables in `liquivault-frontend/.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

NEXT_PUBLIC_INVOICE_REGISTRY_ID=<DEPLOYED_REGISTRY_ID>
NEXT_PUBLIC_LIQUIDITY_POOL_ID=<DEPLOYED_POOL_ID>
NEXT_PUBLIC_FACTORING_ESCROW_ID=<DEPLOYED_ESCROW_ID>
NEXT_PUBLIC_USDC_TOKEN_ID=<DEPLOYED_USDC_TOKEN_ID>
NEXT_PUBLIC_VERIFIER_ORACLE_ADDRESS=<DEPLOYED_VERIFIER_ADDR>
```

Start the frontend application:
```bash
cd liquivault-frontend
npm run build
npm run start
```
