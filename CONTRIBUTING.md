# Contributing

Choose the repository that owns the change: [contracts](https://github.com/MoscowDev/liquivault-contracts), [SDK](https://github.com/MoscowDev/liquivault-sdk), [frontend](https://github.com/MoscowDev/liquivault-frontend), or this documentation repository. Each repository has a contribution guide and CI workflow.

## Setup

Use Node.js 22.13+ and npm. The frontend depends on the sibling SDK; build/install the SDK first. Contract development requires Rust with the `wasm32v1-none` target. Stellar CLI is only needed for deployment or signed network demonstrations.

```sh
git clone https://github.com/MoscowDev/liquivault-sdk.git
git clone https://github.com/MoscowDev/liquivault-frontend.git
cd liquivault-sdk
npm ci
npm run typecheck
npm test
npm run build
cd ../liquivault-frontend
npm ci
npm run lint
npm test
npm run build
```

For contracts, clone the contracts repository and use its exact CI commands. A normal `cargo build` produces rlibs: deployment requires the documented `cargo rustc --crate-type cdylib` commands.

## Working on an issue

Read the issue and affected code before requesting assignment. Describe a bounded approach and disclose dependencies. Do not request work that is already complete or fabricate activity. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Create a branch, keep the change focused, and include:

- The problem and resulting behavior.
- Meaningful verification, including failures or checks you could not run.
- Documentation changes for changed APIs, arithmetic or operational assumptions.
- A reference to the issue being resolved.

Never commit secret keys, wallet seeds, auth tokens, `.env.local`, or local Stellar configuration. Public contract IDs, public keys and transaction hashes are appropriate deployment evidence.

## Review

Maintainers review correctness, security, test quality and contributor clarity. Passing CI is necessary but does not establish security. Contract changes should cover authorization, arithmetic boundaries and cross-contract consistency. If AI tools helped, understand and verify the resulting work; do not submit untested generated changes.

Security-sensitive findings belong in private reports under the [security policy](docs/SECURITY.md), not public issue bodies. For non-sensitive work, use the repository's issue template with clear acceptance criteria.

## Documentation checks

```sh
node scripts/check-docs.mjs
```

This checks relative Markdown links and text integrity in this repository. CI also checks external links. Keep historical evidence explicitly dated and separate from current source verification. Do not describe testnet tokens as Circle USDC or on-chain records as legally enforceable assignments.

## Drips Wave

[WAVE_ISSUES.md](WAVE_ISSUES.md) records the backlog's publication state. Participation follows the [official maintainer process](https://docs.drips.network/wave/maintainers/participating-in-a-wave/). A local label does not establish acceptance or reward eligibility. Maintainers should publish scoped issues, check applications during a Wave, and review submissions promptly. No response-time or approval guarantee is made here.
