# Wave preparation and unfinished backlog

Following rejection, the [release candidate](docs/RELEASE_CANDIDATE.md) implements portions of this backlog. The original published issue descriptions are historical scope, not an assertion that all nine tasks remain untouched. Local descriptions must record the new progress before any future contributor assignment; this pass does not automatically close GitHub issues or send issue comments.

The reviewed issue descriptions are in [docs/wave/issues.json](docs/wave/issues.json). They describe unfinished work rather than completed repair tasks. Each includes code context, bounded acceptance criteria and verification commands. Suggested complexity is advisory; the maintainer sets program complexity after repository approval.

Publication status and actual issue URLs are recorded in [docs/wave/published.json](docs/wave/published.json). Until that file contains a returned GitHub URL, an entry is a prepared draft, not an opened issue. No PR, outside contributor, adoption, approval or reward history is fabricated.

## Proposed distribution

The [published backlog](docs/wave/README.md) provides direct links to the opened issues.

- Contracts: property-based quote coverage, wire-type compatibility, archival/restoration integration.
- SDK: typed error mapping, explicit restoration planning, admin-builder and changed-body tests.
- Frontend: browser wallet-flow tests, refresh/session race handling, redemption eligibility.

These tasks extend the project; they do not defer the security dependency updates or documentation corrections from this maintenance pass. Significant economic changes and production deployment are outside their scope.

## Publish or inspect

```sh
node scripts/publish-wave-issues.mjs
node scripts/publish-wave-issues.mjs --publish
```

After reviewing changed draft descriptions, use `--publish --refresh` to synchronize changed bodies of existing marked issues. Unchanged bodies are left alone.

The default is a dry run. Publishing uses an existing GitHub credential in memory, checks the authenticated account and deduplicates by a stable marker. It does not install the Drips app, apply a program label, submit an application or create fake contribution activity. If account authorization is unavailable, retain the drafts and authenticate through the normal GitHub flow.

## Drips submission

Follow the [official maintainer guide](https://docs.drips.network/wave/maintainers/participating-in-a-wave/). Install/sync the GitHub app, select relevant code repositories, apply and wait for organizer approval. Use the actual program workflow/label only after approval. Repository application limits and appeal rules are set by Drips; a local `help wanted` label does not imply acceptance.

Prioritize contracts first, then SDK; submit the frontend when its contributor workflow is independently verified. Review applications and PRs promptly during the Wave. No minimum star count or invented user traction is claimed.
