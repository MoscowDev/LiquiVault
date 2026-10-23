## Description
Provide a concise explanation of what this PR implements, fixes, or enhances.

## Related Issues
Closes #(issue number)

## Changes Checklist
- [ ] **Smart Contracts (`liquivault-contracts`)**:
  - [ ] Checked arithmetic used for all financial calculations
  - [ ] CEI pattern followed (storage updated before cross-contract calls)
  - [ ] Tested with `cargo test --workspace`
- [ ] **TypeScript SDK (`liquivault-sdk`)**:
  - [ ] Contract clients and builders updated with TypeScript typing
  - [ ] Tested with `npm test` and built with `npm run build`
- [ ] **Frontend (`liquivault-frontend`)**:
  - [ ] React components updated with accessible UI
  - [ ] Tested with `npm test` and verified with `npm run build`
- [ ] **Documentation**:
  - [ ] Updated relevant documentation in `docs/` or READMEs

## Test Verification
Summary of automated and manual tests executed:
```text
cargo test --workspace
npm test in liquivault-sdk
npm test in liquivault-frontend
```
