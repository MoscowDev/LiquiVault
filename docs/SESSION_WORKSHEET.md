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

The maintainer reported that the tester approved the wording below and granted permission to share it in LiquiVault's documentation and Drips appeal. The review uses anonymous attribution. The [evidence log](EVIDENCE.md#lvtest-wallet-funding-and-return-payment) records the confirmed return payment.

> On 28 November 2026, I tested whether I could receive LiquiVault's LVTEST token and send it back from my own Freighter wallet on Stellar Testnet. My wallet had an active trustline for LVTEST. The account funding the test sent me 100 LVTEST first and then another 1,000 LVTEST.
>
> I sent 300 LVTEST back to the account that funded me. I expected the payment to reach that account using the same LVTEST asset I had received. The transaction succeeded and was confirmed on Stellar Testnet at ledger 5961439. That completed the receive-and-return flow I set out to test.
>
> A useful follow-up would be to try a deposit from the LiquiVault interface. I'd check whether the app explains what I'm authorizing in Freighter, then compare the confirmed transaction with the deposit and balance shown in the app.

The session record currently covers the return transfer. Ask the tester to describe any LiquiVault steps they tried and what they observed before adding app feedback.

### Maintainer review for the 28 November 2026 session

> I arranged Testnet funding so an independent tester could use their own wallet. Before funding it, I verified that the wallet had an authorized trustline for LiquiVault's configured LVTEST issuer. The funding account made two confirmed payments totaling 1,100 LVTEST. The tester then used their wallet to send 300 LVTEST back.
>
> I checked the return payment on Horizon and confirmed that the source was the funded wallet, the destination was the original funding account, and the asset used LiquiVault's configured issuer. I recorded all three confirmed payments in the public evidence log.
>
> For the next session, I'd ask the tester to follow the hosted app's setup instructions and attempt a liquidity deposit. I'd capture what they see at wallet connection, transaction approval, and confirmation, along with their feedback on any step that needs clearer instructions.

Recruit a real developer or prospective user. A setup failure is useful feedback; it is not a completed lifecycle. AI review and maintainer-operated tests do not count as independent-person validation. Use the [invitation draft](VALIDATION_INVITATION.md) and [validation protocol](VALIDATION_PLAN.md); no invitation has been sent by preparing this worksheet.
