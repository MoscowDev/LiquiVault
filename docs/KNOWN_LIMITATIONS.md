# Known limitations

LiquiVault is an experimental, pre-audit testnet project. Its demonstration uses an issuer-controlled test token with seven decimals, not Circle-issued USDC.

## Trust and commercial boundaries

The verifier/admin determines whether documents are genuine and assigns risk tiers. Hashes cannot prove trade, debtor consent, solvency or uniqueness across separately minted records. On-chain ownership is a registry field; no legal-assignment, collection, KYB or banking integration is implemented.

Administrators can pause, configure bindings/rates and upgrade WASM. Upgrade code must preserve storage compatibility; there is no timelock or automated migration framework. Role transfers require current and new admin authorization. Defaults depend on an admin acting after the grace period. Separate operational keys and independent review are necessary before considering real funds.

## Economic boundaries

- Senior capital can be lost after junior capital is exhausted. Junior capital can be entirely lost.
- Junior yield is capital-capped; no yield premium or APY is guaranteed.
- Deposits reset a 24-hour lock on that provider's tranche position. The delay blocks immediate round trips but does not eliminate all timing incentives.
- Idle liquidity and junior coverage can delay withdrawals beyond 24 hours.
- Loss recognition occurs when a default is executed. Earlier withdrawals can disadvantage remaining LPs.
- A tranche with zero assets and outstanding shares cannot accept fresh deposits. Use a separately designed migration; no reset function exists.
- Direct token donations do not mint shares or automatically update internal assets.

## Runtime and client boundaries

Use Node.js 22.13+ for the documented JavaScript tooling, a current Rust toolchain with `wasm32v1-none`, and the Stellar CLI version recorded by deployment evidence. Other platforms are not exhaustively certified.

Persistent entries can archive. Read simulations do not maintain their TTL. See [storage](storage.md). The SDK does not provide a complete archival keeper or automatic recovery workflow. Source-account sequences can conflict across concurrent transactions, wallets or tabs.

The frontend requires real Freighter and correct network settings. There is no fake connection or demo-balance fallback. It shows snapshots, connected-merchant invoices and session-only activity. APY/default-rate history is unavailable. Transactions can confirm after a polling timeout; inspect their hashes before retrying.

## Evidence boundaries

[Verification evidence](EVIDENCE.md) distinguishes host tests, live simulations and signed network operations. A historical deployment does not prove later source changes were deployed. No independent security audit, production user adoption, or Drips approval is claimed.
