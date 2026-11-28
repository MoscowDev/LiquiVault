# Wallet and independent-feedback session worksheet

Status: blank preparation material, not completed evidence. Copy into private notes for the actual session. Publish only consented information. Leave docs/gates/status.json unchanged until actual evidence is available.

## Real Freighter session

See the [18 November terminal evidence](gates/testnet-terminal-2026-11-18.md) for the signed CLI lifecycle, redemption-lock simulations and mocked frontend results. Use this worksheet to capture the separate live browser observations.

- Date/time and operator:
- Testnet public G-address (never a secret):
- Browser and official Freighter versions:
- Demo URL and known frontend revision (write unknown if not established):
- SDK/contracts revisions and deployed addresses:
- Fee funding, LVTEST trustline/funding result:
- Deposit: amount/tranche, before/after balances, confirmed hash/ledger:
- Mint: synthetic reference, amount, maturity, invoice ID, confirmed hash/ledger:
- Separate authorized verification: confirmed hash/ledger and Verified status:
- Factor: quote, actual advance, confirmed hash/ledger and Factored status:
- Repay: face-value funding, confirmed hash/ledger and Settled status:
- Reject a signature: actual provider response, unchanged balances, no success claim:
- Switch account/network: observed behavior and any bug:
- Redemption lock: observed restriction; later withdrawal hash only if attempted:
- Attempted/completed steps, failures and linked fixes:

Only after confirmation, create the real wallet receipt matching the fields checked by scripts/check-appeal-gates.mjs. Do not turn this worksheet into a passing receipt by filling expected outcomes.

## Independent participant session

- Date and participant reference (anonymous if requested):
- Relevant role and relationship to maintainer:
- Why the participant is independent:
- Consent to publishing this summary and any public addresses/hashes:
- Exact revisions or hosted build provenance:
- Steps actually attempted, time spent, and steps not attempted:
- Expected/actual outcomes, blockers and reproduction details:
- Participant feedback in their own words, if consented:
- Maintainer response, fixes with links, and unresolved concerns:

### Tester note for the 28 November 2026 session

Draft for the tester to edit and approve. App feedback and publication consent are pending. The [evidence log](EVIDENCE.md#lvtest-wallet-funding-and-return-payment) records the confirmed return payment.

> On 28 November 2026, I used my Freighter wallet on Stellar Testnet to send 300 LVTEST back to the account that had funded my test wallet. I wanted to check that I could send the test tokens back after receiving them. The transfer succeeded and was confirmed in ledger 5961439.

The session record currently covers the return transfer. Ask the tester to describe any LiquiVault steps they tried and what they observed before adding app feedback.

Ask the tester to confirm their sharing preference separately.

> You may share my edited note in LiquiVault's documentation and Drips appeal [anonymously / under my chosen name]. You may include the relevant Testnet transaction hashes [yes / no].

Recruit a real developer or prospective user. A setup failure is useful feedback; it is not a completed lifecycle. AI review and maintainer-operated tests do not count as independent-person validation. Use the [invitation draft](VALIDATION_INVITATION.md) and [validation protocol](VALIDATION_PLAN.md); no invitation has been sent by preparing this worksheet.
