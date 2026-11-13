# Testnet release candidate after Wave rejection

This is development evidence for a future appeal, not an approval claim or a completed release announcement. The release candidate has no claimed outside users, external audit or completed independent wallet session.

## Changes

- Frontend session generations prevent delayed reads and post-write refreshes from replacing a disconnected account's state. Wallet operations are serialized and signing rechecks the active session.
- Redemption eligibility uses integer token/share arithmetic, per-position lock timestamps, pool pause, idle liquidity and junior coverage. Snapshots remain estimates; execution is authoritative.
- The testnet setup page explains fee funding, the custom LVTEST asset, the lack of a public LVTEST faucet, verifier access and repayment funding. A verifier screen supports invoice inspection and authorized approval.
- Quote assurance exercises 4,096 reproducible generated configurations across all risk tiers, conservation, separate rounding and monotonicity. Boundary tests cover invalid configuration, expiry, excessive discounts and checked overflow.
- Registry/escrow serialization tests cover all risk/status combinations and representative fields in both directions.
- Generated pool-loss checks exercise junior-only, exact-junior and junior-plus-senior defaults and compare recorded assets with token balances.
- The deployment runner supports an isolated localhost lifecycle with awaited account funding, separate checkpoints and a separate local record; its full 19-transaction lifecycle passed.
- The SDK provides a read-only preparation planner exposing network/source/sequence, simulated ledger, fee estimate and restoration keys. Manual recovery is reported explicitly; the planner does not sign or submit.

## Verification and evidence boundaries

Local verification passed 29 contract host tests, 24 SDK offline tests, 12 frontend component/unit tests and 8 Chromium browser scenarios. SDK type checking and ESM/CJS/declaration builds passed; frontend lint, type checking and static production export passed. Full npm dependency audits returned zero findings in both JavaScript repositories after the browser dependency was added.

The [public testnet demo](https://liquivault-testnet-moscowdev.dependablehamster1.chatgpt.site) was deployed successfully through Sites from frontend commit `683220de5b4d53ab1926f53ec13d66102484886a`. Its source includes the setup and verifier pages. LVTEST funding remains operator-assisted, not an implemented public faucet.

Browser fixtures emulate Freighter's window message bridge and RPC using real XDR; they do not establish live-extension signing or real ledger confirmation. Earlier signed deployment evidence remains evidence for its recorded source/WASM hashes, not a new deployment of this candidate. Final GitHub CI results must be checked for each pushed commit separately.

## Remaining release gates

- Check GitHub CI for final pushed commits; local results above are separate evidence.
- Archival/restoration now passes three times on instrumented localhost fixtures with continuous ledger ingestion. [Gate evidence](gates/README.md) records natural expiry, rejected signing, automatic restoration, confirmed withdrawal and exact balance deltas, plus all timing overrides. This supersedes the failed ledger-jump experiment and does not claim production-WASM or public-testnet recovery.
- Complete a real Freighter lifecycle with public hashes, including token funding and authorized verifier approval.
- Run [independent validation](VALIDATION_PLAN.md), address real feedback and record consented evidence.
- Contributor backlog descriptions now check implemented acceptance criteria and distinguish automatic localhost recovery from unfinished manual fallback and session stress coverage. See the [current backlog](wave/README.md).

Local issue drafts now include progress notes distinguishing implemented coverage from incomplete recovery/session stress work. Published issue bodies and open/closed state have not been changed automatically; review the final commits before closing or reassigning them.

Submit an appeal only after meaningful changes and evidence exist beyond the rejected submission. Describe actual results and unresolved work; do not promise approval or invent activity.
