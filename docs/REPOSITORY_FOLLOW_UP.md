# Repository follow-up, 19 November 2026

| Repository | Change | Verification |
| --- | --- | --- |
| SDK | Explicit footprint restore preparation and confirmation, admin operation XDR checks, and signer-body integrity coverage. | Type checking and the ESM, CJS and declaration build passed. 32 tests passed and one opt-in Testnet case was skipped. |
| Frontend | Install from a standalone checkout using a pinned public SDK commit. CI uses the same install path. | In a clean clone, npm installed the SDK, then lint, type checking, 13 unit/component tests, eight fixture-based browser tests and the static production build passed. The test copy used port 3101 to avoid an existing local server. |
| Contracts | Added a separate restore fixture mode that checks live ledger entries before rebuilding and submitting a withdrawal. | 29 host tests passed. On the instrumented Protocol 28 network, restoration confirmed at ledger 654 and the rebuilt withdrawal at ledger 656 with an exact balance delta. [Run receipt](gates/archival-recovery-separate-2026-11-19.json) |

The frontend pins SDK revision `6d603afd5d2df04146928a9e2c150c6252d2e6b6`. The new recovery API is available in the SDK repository. The hosted demo still needs a live Freighter receipt and independent participant feedback. [Session worksheet](SESSION_WORKSHEET.md)

GitHub CI passed for SDK revision `5070f9343d24ca912f4d96cfd727346581b75446` and frontend revision `560f1913fd617ea6d125ac542737b248fe53881b`. [SDK CI](https://github.com/MoscowDev/liquivault-sdk/actions/runs/44530656024) · [Frontend CI](https://github.com/MoscowDev/liquivault-frontend/actions/runs/44530656184)

The first fixture attempt timed out while Docker read the image settings. The retry used the same pinned image and ran with natural expiry and the recorded TTL and lock overrides. The network run explicitly restored keys found by the automatic-restoration simulation. The RPC manual-preamble response and failure paths were exercised with SDK test fixtures.
