# LiquiVault

[![Docs](https://github.com/MoscowDev/LiquiVault/actions/workflows/ci.yml/badge.svg)](https://github.com/MoscowDev/LiquiVault/actions/workflows/ci.yml)

An experimental invoice-factoring application on Stellar Soroban. A merchant records an invoice commitment, an authorized verifier approves it, and a liquidity pool finances an advance. Repayment distributes yield; defaults consume junior capital before senior capital.

**Testnet only, pre-audit.** The demonstration token is issued for testing; it is not Circle-issued USDC. Neither tranche guarantees principal or returns. The contracts record on-chain ownership; they do not establish legal title, verify commercial documents, or enforce repayment off-chain.

## Repositories

| Repository | Purpose | License |
| --- | --- | --- |
| [Contracts](https://github.com/MoscowDev/liquivault-contracts) | Invoice registry, senior/junior pool, factoring escrow | MIT |
| [SDK](https://github.com/MoscowDev/liquivault-sdk) | Typed clients, Stellar transaction preparation, Freighter adapter | MIT |
| [Frontend](https://github.com/MoscowDev/liquivault-frontend) | Merchant, liquidity-provider and snapshot views | MIT |
| This repository | Shared design, evidence and contributor guidance | [Apache-2.0](LICENSE) |

Each code repository has its own CI and contribution guide. File implementation issues and PRs in the repository that owns the code.

## Implemented behavior

1. A merchant mints an invoice in `Issued` status with debtor, token, amount, maturity and a SHA-256 document commitment.
2. The configured verifier or admin sets its risk tier and marks it `Verified`. Debtor status alone grants no verification rights.
3. The merchant factors a verified, unexpired invoice. Escrow updates the registry and sends the pool-funded net advance atomically.
4. Any authorized payer can repay the face value. The pool recovers the advance and divides the discount into treasury and LP yield.
5. After maturity plus the configured grace period, the escrow admin can default an unpaid advance. Junior assets absorb losses first; senior assets absorb the remainder.

The same invoice record cannot be factored twice. Deduplicating separate records for the same real-world invoice remains the verifier's responsibility.

## Pool economics

Amounts are integers in token units; the demonstration uses seven decimal places. One token is `10_000_000` units. Divisions round down.

| Rule | Behavior |
| --- | --- |
| Junior yield cap | Lesser of configured bps and `floor(junior_assets * 10000 / total_tranche_assets)` |
| Senior yield | LP yield remaining after junior allocation |
| Defaults | Junior first, then senior |
| Withdrawal liquidity | Senior + junior assets - deployed capital |
| Withdrawal lock | Each deposit locks that provider's entire position in that tranche for 24 hours |
| Junior coverage | Withdrawal must leave at least 10% of deployed capital in junior assets |
| Wipeout | A tranche with zero assets and outstanding shares rejects fresh deposits |

A junior position does not guarantee a higher return per deposited token. The cap can reduce its configured allocation. Withdrawal delays limit immediate settlement round trips but do not eliminate all timing or default-exit incentives.

### Worked example

With a 100,000-token invoice, 73-day duration, 1,000 annual bps and 50 origination bps: time discount is 2,000, origination fee is 500, and the advance is 97,500. A 10% reserve sends 250 to treasury and leaves 2,250 LP yield. With 150,000 senior and 50,000 junior assets, junior's capital cap is 25%: junior earns 562.5 and senior earns 1,687.5. This is an illustrative configuration, not an investment projection.

## Run locally

Use Node.js 22.13+ for JavaScript tooling, Rust with `wasm32v1-none` for contracts, and Stellar CLI for deployment. Clone SDK and frontend as siblings:

```sh
git clone https://github.com/MoscowDev/liquivault-sdk.git
git clone https://github.com/MoscowDev/liquivault-frontend.git
cd liquivault-sdk
npm ci
cd ../liquivault-frontend
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell use `Copy-Item .env.example .env.local`. Open http://localhost:3000 and connect Freighter on the configured testnet. A funded wallet with the configured test token is needed for writes. The frontend starts disconnected and never fabricates a wallet or transaction result.

For contract commands, see the [contract README](https://github.com/MoscowDev/liquivault-contracts#readme). For current addresses and signed smoke-test evidence, use the [deployment record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json); see the [deployment guide](docs/deployment.md) for provenance and reproduction.

## Documentation

- [Architecture and exact arithmetic](docs/architecture.md)
- [Verification evidence and its limits](docs/EVIDENCE.md)
- [Security model and disclosure](docs/SECURITY.md)
- [Known limitations](docs/KNOWN_LIMITATIONS.md)
- [Storage and archival](docs/storage.md)
- [Deployment and smoke test](docs/deployment.md)
- [Manual wallet demonstration](docs/wallet-demo.md)
- [Contributor setup and review](CONTRIBUTING.md)
- [Wave backlog and application preparation](WAVE_ISSUES.md)
- [Factual application draft](docs/WAVE_APPLICATION.md)
- [Repair history](docs/REPAIR_NOTES.md)

SEP-10/KYB, SEP-24, historical APY/default-rate analytics and production underwriting infrastructure are not implemented. Test results establish the exercised behavior, not an independent security audit or a guarantee of Drips approval.
