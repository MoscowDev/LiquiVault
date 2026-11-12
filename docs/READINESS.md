# Submission readiness

## Post-rejection development

All four submitted repositories were rejected by the Stellar Wave Program according to the maintainer's notification. The notification lists general selection factors; it does not identify a specific technical defect in LiquiVault. No appeal has been submitted by this development pass.

The [release candidate](RELEASE_CANDIDATE.md) records subsequent changes and local verification, including browser coverage, session safety, integer redemption checks, quote/wire/pool assurance and restoration planning. The [public demo](https://liquivault-testnet-moscowdev.dependablehamster1.chatgpt.site) is deployed; a completed live Freighter lifecycle, network archival recovery and [independent validation](VALIDATION_PLAN.md) remain unverified. Historical results below describe the earlier submission pass, not program approval or evidence of outside adoption.

Maintenance verification completed in November 2026. The project has reviewable code, corrected documentation, signed repaired-contract evidence and a genuine contributor backlog for a Drips Wave application. This is not an approval notice, independent security audit or real-fund certification.

## Verified local results

| Component | Result |
| --- | --- |
| Contracts | 25 host tests; formatting and clippy passed; current cdylib WASM deployed and exercised |
| SDK | 20 offline tests; typecheck; ESM/CJS declarations/build; corrected offline example passed |
| Live SDK | Reads and unsigned mint preparation passed against the repaired deployment |
| Frontend | Clean `npm ci`; strict lint; fresh route-type generation/typecheck; 6 tests; Next.js 16 production build passed |
| JavaScript audits | Zero findings in full SDK and frontend dependency audits, including development dependencies, at verification time |
| Public proof | 19 confirmed testnet transactions; integer accounting, role/lifecycle and balance assertions passed |
| Documentation | UTF-8 and standalone relative links checked in all four repositories; historical values corrected and separated |
| Contributor backlog | [Nine opened issues](wave/README.md), three per code repository, with scope, acceptance criteria and verification |

The frontend now uses Next.js 16.4.6 / React 19.3.1; both JavaScript repositories use Vitest 5.1.0 and documented Node.js 22.13+ tooling. Scoped dependency overrides address advisories and must be rechecked during future upgrades. Audit results are time-specific, not a guarantee against undiscovered vulnerabilities.

## Review the actual evidence

### Recheck on 12 November 2026

The current local source passed 25 contract tests, formatting and clippy; 20 offline SDK tests, type checking, ESM/CJS and declaration builds, and the arithmetic example; and 6 frontend tests, lint, route-type generation/type checking and the production build. Documentation encoding and relative-link checks passed in all four repositories. The public deployment-record validator passed its 19-transaction and exact-accounting checks. This validator checks the recorded evidence; it does not independently re-query every transaction.

The opt-in SDK test also passed against testnet: deployed pool/invoice reads and unsigned mint preparation with resource/auth data. No transaction was signed or submitted. Full npm dependency audits returned zero findings for both JavaScript repositories, including development dependencies. The SDK build required a rerun outside the filesystem sandbox because esbuild could not read a parent directory; that rerun passed, including declarations.

GitHub reported successful CI for these exact committed revisions:

| Repository | Commit | CI run |
| --- | --- | --- |
| Contracts | `e68735c25a5d530a5b3f96cb4fcbfa962fb98e17` | [Passed](https://github.com/MoscowDev/liquivault-contracts/actions/runs/43051492988) |
| SDK | `e4c6a34de4f5c32d38fd5187c6767fcbf3355caf` | [Passed](https://github.com/MoscowDev/liquivault-sdk/actions/runs/43051481524) |
| Frontend | `92f537c63718a8bb27f76a0a2af85bc3ab338ef4` | [Passed](https://github.com/MoscowDev/liquivault-frontend/actions/runs/43052426908) |
| Overview | `798e57fb204e84d2b11b2af85ccc461ca0a275cb` | [Passed](https://github.com/MoscowDev/LiquiVault/actions/runs/43053598322) |

The overview and SDK have local documentation/tooling corrections beyond those commits. They clarify Protocol 23+ automatic restoration, retain manual recovery and rent maintenance as backlog work, and add issue-body refresh support. The CI inspector now filters for the exact commit's push CI workflow and fails on Git inspection errors. These edits need to be committed/pushed and checked by CI before representing the public repositories as containing them. The changed SDK restoration issue description is a local draft until explicitly refreshed on GitHub; this recheck did not publish issue edits.

The restoration correction follows the official [Stellar state archival documentation](https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival). Interactive Freighter signing and Drips account/application steps remain owner checks below.

- [Contracts CI](https://github.com/MoscowDev/liquivault-contracts/actions/workflows/ci.yml)
- [SDK CI](https://github.com/MoscowDev/liquivault-sdk/actions/workflows/ci.yml)
- [Frontend CI](https://github.com/MoscowDev/liquivault-frontend/actions/workflows/ci.yml)
- [Overview/docs CI](https://github.com/MoscowDev/LiquiVault/actions/workflows/ci.yml)
- [Signed deployment record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json)
- [Detailed evidence boundaries](EVIDENCE.md)
- [Manual wallet walkthrough](wallet-demo.md)
- [Application draft](WAVE_APPLICATION.md)

Use `node scripts/github-status.mjs` from the overview checkout to inspect CI for the exact local commits and identify dirty worktrees. A stale green badge is not evidence for an unpushed change. Deployment keys/checkpoints stay in ignored local `.stellar/` directories; only public evidence is committed.

## Remaining owner and review steps

Drips app installation, repository application/appeal, personal eligibility/terms and organizer selection require the maintainer's account. Follow the [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/). The application draft leaves review-capacity commitments for the maintainer to state honestly. Public issue labels do not establish program approval. No application or appeal has been submitted automatically.

Interactive Freighter-extension signing was not exercised by this maintenance pass; signed CLI execution and SDK simulation/preparation were verified separately. The wallet walkthrough provides a repeatable manual check. Mainnet readiness, external adoption, legal assignment, production underwriting and an independent security audit are not claimed. The [known limitations](KNOWN_LIMITATIONS.md) remain part of the submission.
