# Repair history

The initial November repair pass added capital-capped junior yield, tranche-position withdrawal locks, senior wipeout protection, escrow-only registry defaults, repayment during pause, admin transfer and compatible WASM upgrade entry points. It replaced JSON transactions/nonexistent reads with real Stellar SDK preparation and confirmation, and connected the frontend to contract state without fabricated wallets, balances or hashes.

The subsequent submission-readiness pass synchronizes documentation/licenses, corrects the historical ten-times yield error, replaces stale examples, upgrades supported framework/test tooling, adds docs/audit checks, deploys a fresh signed testnet proof, synchronizes public client defaults and publishes genuine unfinished backlog items. Nested metadata hashing now preserves nested fields rather than filtering them out with a top-level JSON replacer.

[READINESS.md](READINESS.md) records verified current results and account-dependent steps. [EVIDENCE.md](EVIDENCE.md) separates host tests, simulations, signed execution and historical records. No independent audit, real-fund readiness, user adoption or Drips approval is claimed.
