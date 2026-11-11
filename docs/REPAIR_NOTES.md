# LiquiVault repair notes

Local source changes across `liquivault-contracts`, `liquivault-sdk`, and `liquivault-frontend`.

## Implemented

- Capped junior yield by junior capital / total tranche capital as well as the configured bps. Arithmetic remains checked and allocations round down.
- Added a 24-hour withdrawal lock to each provider's senior/junior position, reset by deposits into that tranche. Existing shares are also locked on top-up. This blocks immediate settlement round trips but does not eliminate all timing incentives.
- Rejected deposits/previews into wiped-out senior tranches with outstanding shares and report zero share value after wipeout. Wiped-out pools require migration; no recapitalization mechanism was added.
- Restricted registry defaults to escrow, preserving atomic escrow/registry/pool accounting.
- Allowed repayments during escrow pause, added pool/registry administrator transfer with new-admin authorization, and added admin-authorized WASM upgrades to all three contracts. Upgrades require storage-compatible code and trust the administrator.
- Rebuilt SDK transactions using actual Stellar source accounts, sequences, fees and operation XDR; prepare transactions before wallet signing; poll confirmation; return confirmed ledger/return values. Rejected submissions and failed ledger results raise errors. Confirmation errors/timeouts preserve the submitted hash for inspection.
- Encoded invoice IDs/maturity as u64, token values as i128, risk enums as u32, and rate structs using symbol keys. Decoded contract fields, enums, byte hashes and timestamps into the SDK's types.
- Updated Stellar SDK to 17.4 after a live test demonstrated that v12 cannot parse the current testnet protocol. Node 22.12+ is required.
- Connected the frontend to the repaired sibling SDK. Wallets start disconnected; missing Freighter and network/account mismatches produce errors. Balances, positions, merchant invoices and quotes come from contracts. Minting leaves invoices Issued until authorized verification. Activity includes confirmed writes from this session.
- Removed fabricated wallets, authentication tokens, hashes, balances and named-company invoice fixtures, along with unsupported authentication/native-token claims. Replaced fallback metadata hashing with actual Web Crypto SHA-256. Unavailable historical APY/default metrics are labelled unavailable.
- Made frontend lint fail CI and added its ESLint configuration/dependencies. CI checks out and builds the sibling SDK; merge/publish those SDK changes first.

## Verification

- Contracts: 25 unit tests passed, including regression coverage for the four primary contract findings; clippy passed with the repository's CI flags; release builds for wasm32v1-none passed.
- SDK: typecheck, 17 unit tests and dual ESM/CommonJS builds with declarations passed. The opt-in live test passed separately. Tests cover actual XDR shape/types, preparation before signing, confirmation polling, rejected submissions and failed ledger results.
- Live testnet: the opt-in integration test read pool state and invoice 1, then prepared an unsigned mint with real authorization and resource-fee data. No transaction was signed or submitted.
- Frontend: ESLint, six tests and production build passed. No interactive Freighter browser signing session was exercised.

## Deployment and remaining limits

The recorded testnet contracts predate these repairs. They have no upgrade entry point, so they must be redeployed and frontend/SDK addresses updated. The newly added upgrade function cannot update historical contracts retroactively. The configured testnet token is not Circle-issued USDC.

A signed mint / independent verify / factor / repay smoke test on newly deployed contracts remains necessary before rollout. The live SDK test currently targets the historical deployment, so it does not prove that the repaired contract WASM is deployed.

Dependency installation/audit reports outstanding vulnerabilities in existing dependencies, including old Next.js and test-tooling packages. These advisories have not been fully remediated in this functional repair; production readiness is not established.

SEP-10/KYB, SEP-24 anchor flows, a historical activity indexer, APY history and default-rate history are not implemented.
