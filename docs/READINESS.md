# Submission readiness

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
