# Wave application draft

Status update: the maintainer reported rejection of all four repositories. This is the original submission draft, not an appeal ready to send. Use the [post-rejection release candidate](RELEASE_CANDIDATE.md) and [independent validation protocol](VALIDATION_PLAN.md) to prepare evidence of subsequent work. Original test counts and backlog descriptions below refer to the earlier submission.

This is factual application material for the maintainer to review and submit through Drips. It is not a submitted application or an approval notice. Check the current [readiness results](READINESS.md) and CI before copying it.

## Project

LiquiVault is an experimental, pre-audit invoice-factoring application on Stellar Soroban. Its registry records invoice commitments and verifier approvals; escrow coordinates factoring/repayment/default; a senior/junior liquidity pool accounts for advances, yield and first-loss absorption. A TypeScript SDK prepares real Stellar transactions and a Next.js interface reads state and uses Freighter.

The project is testnet-only and uses a custom issuer-controlled LVTEST asset, not Circle USDC. There is no production underwriting service, KYB/SEP-10 flow, SEP-24 anchor or legal collection integration. On-chain ownership records are not a claim of legally enforceable receivable assignment.

## Stellar relevance and reusable work

- Soroban contracts with checked financial arithmetic, role authorization and atomic cross-contract accounting.
- SDK wire-type handling, resource/auth preparation, wallet signing and confirmed-result polling.
- Regression coverage for tranche allocation, wipeout, withdrawal timing and registry/escrow consistency.
- A signed repaired-contract deployment with public transaction/ledger and WASM/source provenance, plus executable offline/network examples.

## Repositories and evidence

- [Contracts](https://github.com/MoscowDev/liquivault-contracts): 25 host tests, formatting/clippy, explicit cdylib builds and public deployment validation.
- [SDK](https://github.com/MoscowDev/liquivault-sdk): 20 offline tests, type checking, ESM/CJS declarations/build, arithmetic example and an opt-in live simulation/preparation test.
- [Frontend](https://github.com/MoscowDev/liquivault-frontend): clean lockfile installation, strict lint/type checks, six tests and a production build.
- [Signed deployment record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json): 19 confirmed transactions covering setup, deposit, mint, separate verifier approval, factor and settle, with exact integer accounting assertions.

The verifier identity in the demonstration is a distinct configured key controlled by the deployment operator; it is not a claimed external commercial auditor. No outside contributors, production customers or independent security audit are claimed.

## Contributor work

The [published backlog](wave/README.md) contains nine genuine unfinished issues, three in each code repository. They cover quote property tests, wire compatibility, archival/restoration, typed errors, admin wire tests, browser wallet coverage, refresh races and redemption eligibility. Each has context, acceptance criteria and verification commands. Completed repairs are excluded.

## Maintainer review before submission

1. Confirm the code repositories' latest CI and the [current readiness report](READINESS.md).
2. Install/sync the Drips GitHub app using your account and select repositories allowed by the current application limits.
3. State your actual capacity to review applications and PRs during the Wave; do not promise a schedule you cannot maintain.
4. Review and accept applicable program terms yourself. If a repository was previously rejected, use the documented appeal process rather than a fresh duplicate application.
5. Wait for organizer selection before assigning actual program labels or describing issues as reward eligible.

The [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/) and [terms](https://docs.drips.network/wave/terms-and-rules/) govern participation. Repository quality and tests do not guarantee approval.
