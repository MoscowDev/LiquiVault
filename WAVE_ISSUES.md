# Contributor backlog

The [backlog index](docs/wave/README.md) lists every published issue with its current status. Issue bodies are generated from [docs/wave/issues.json](docs/wave/issues.json); returned URLs are recorded in [docs/wave/published.json](docs/wave/published.json).

## Current state (25 November 2026)

Eight of the first nine issues were completed and closed with the commits that implemented them. SDK #1 stays open, narrowed to the part that is still missing: named per-contract error codes. Seven new issues cover verified gaps:

| Repository | Open issues | Complexity |
| --- | --- | --- |
| Contracts | Event assertions in host tests; specific error variants in escrow negative paths; Windows/macOS CI | Medium, Trivial, Trivial |
| SDK | Named contract error codes; packed ESM/CJS/TypeScript consumer check; typed event decoders | Medium, Medium, High |
| Frontend | Missing-trustline guidance; build revision and contract IDs in the app | Medium, Trivial |

Each issue states its context, scope, acceptance criteria and verification command. Suggested complexity is advisory; the maintainer sets program complexity in the Drips app. Trivial issues carry the `good first issue` label.

## Publishing changes

```sh
node scripts/publish-wave-issues.mjs                      # dry run: list drafts
node scripts/publish-wave-issues.mjs --publish            # create missing issues
node scripts/publish-wave-issues.mjs --publish --refresh  # also update changed bodies and titles
```

The publisher checks the authenticated account and deduplicates by a hidden marker in each body. It does not change open/closed state, apply Drips labels or submit an application.

## Drips submission

Follow the [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/). Appeals are filed from the Orgs and Repos dashboard; the first is possible two weeks after rejection, a declined appeal starts a one-month cooldown, and each repository has at most three appeals. A local `help wanted` label does not imply acceptance. No star count, user traction or contributor activity is claimed.
