# Independent testnet validation

Status: recruitment and independent sessions have not been completed. This document is a protocol, not evidence of users or adoption. Do not publish a participant's name, address, recordings or feedback without permission. Never request secret keys, recovery phrases, real invoices or customer data.

## Product hypothesis

LiquiVault explores whether a small business and a liquidity provider can understand and reproduce an invoice-advance lifecycle with transparent on-chain accounting. Stellar provides token transfers and atomic cross-contract updates; document authenticity, underwriting, duplicate detection, legal rights and collection remain off-chain. Faster payment or commercial viability has not been established.

The first validation group should include an independent Stellar developer, someone familiar with business invoicing and someone assessing liquidity-provider risk. These are recruitment targets, not claimed participants. Maintainer capacity and participant availability determine the schedule.

## Developer session

1. Start from fresh clones, following each repository's contribution guide. Record operating system, Node/Rust/CLI versions and commit IDs.
2. Run offline checks and inspect the public deployment record. Record setup time and every undocumented prerequisite.
3. Open the testnet demo, follow its setup page and connect a dedicated Freighter test wallet. Record missing-token or verifier-access blockers honestly.
4. Reproduce rejection, wrong-network and account-switch behavior. Use synthetic invoice details and small test-token amounts.
5. Complete the wallet walkthrough where operator funding and verifier access are available. Retain public transaction hashes only with participant consent.
6. File specific bugs and confusing copy with reproduction steps, expected/actual behavior and relevant public hashes. Do not call a setup attempt a completed lifecycle.

## Use-case interview

Ask how invoices are currently issued, verified and financed; who bears collection risk; how duplicate financing is prevented; what legal documentation is required; and which delays are most costly. Ask participants to explain the advance, repayment obligation, admin/verifier trust and first-loss risk in their own words after trying the demo. Do not lead participants toward endorsement or infer willingness to pay from polite feedback.

## Evidence record

For each consenting participant, record date, public/anonymous identifier, role, independence from the maintainer, exact commits, attempted/completed steps, blockers, feedback and linked fixes. Keep private notes outside Git. Only count sessions that happened; leave unattempted steps marked unattempted.

Before appealing, summarize observed problems and the changes made in response. Include remaining limitations and unresolved feedback. A release or test count alone does not demonstrate independent use or program eligibility.
