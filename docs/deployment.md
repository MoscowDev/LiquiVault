# Deployment and smoke-test reproduction

The authoritative public record is [contracts/deployments/testnet.json](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json). It contains network, public contract/account IDs, time, execution output and, for new deployments, source/WASM provenance and transaction hashes. It contains no private keys.

The October 2026 deployment predates the tranche/accounting repairs and is retained in the dated historical record. The current record identifies the repaired source/WASM and 19 confirmed setup/lifecycle transactions. Do not reuse the historical addresses to claim the new protections. The historical 10,000-token invoice returned 9,785.6179288 to the merchant; settlement yielded 192.9438641 to LPs and 21.4382071 to treasury. Older prose overstated that yield by ten times; raw integer records are authoritative.

## Prerequisites

Use Rust with `wasm32v1-none`, Stellar CLI (the locally verified version is 28.1.0), and Node.js 22.13+ for SDK validation. Bash users may use the shell deployment entry point; a portable Node deployment runner is available in the contracts repository.

```sh
rustup target add wasm32v1-none
git clone https://github.com/MoscowDev/liquivault-contracts.git
cd liquivault-contracts
cargo test --workspace --locked
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -A clippy::inconsistent_digit_grouping -A clippy::too_many_arguments -D warnings
for c in invoice_registry liquidity_pool factoring_escrow; do
  cargo rustc -p "$c" --crate-type cdylib --target wasm32v1-none --release --locked
done
```

The crates are rlibs for host tests. A plain `cargo build --target wasm32v1-none` does not replace the explicit cdylib build above.

## Signed demonstration

Run the deployment script from a reviewed checkout. It must use **testnet only**, create fresh development identities, fund them with Friendbot, deploy current WASM, initialize all three contracts, issue an explicitly named test asset and execute:

1. Senior/junior deposits.
2. Merchant mint (`Issued`).
3. Independent verifier approval (`Verified`).
4. Merchant factoring (`Factored` and funded advance).
5. Payer settlement (`Settled`, deployed capital zero).
6. Exact checks for token balances, protocol fee and capital-capped tranche yield.

The smoke test intentionally does not wait 24 hours or withdraw freshly deposited shares. Host tests cover the withdrawal lock's boundary.

Never use production identities, disclose generated private keys, or overwrite a historical evidence record after a partial failure. Persist the new public record only after all assertions pass. Record WASM hashes, build-source identity, tool versions, ledger numbers and transaction hashes so reviewers can distinguish a deployment from an offline calculation.

## Connect clients

Copy the new contract IDs into the SDK integration fixture and frontend `.env.example` defaults using the synchronization tooling. Rebuild the SDK, run its opt-in network test and build the frontend. Set the matching network passphrase in Freighter. The test token is issuer-controlled and is not Circle-issued USDC.

## Operational boundaries

For a development wallet trustline, test-token provisioning and independent invoice verification, see the [manual wallet walkthrough](wallet-demo.md). Never publish issuer keys to make a demo easier.

Administrators can upgrade only contracts that already expose `upgrade`. The old immutable deployment cannot gain an upgrade entry point retroactively; a fresh deployment is required. Compatible upgrades still require schema review and a separate test plan. This runbook does not certify mainnet, legal enforceability or an audited production environment.
