# Contributing to LiquiVault

Thank you for your interest in contributing to LiquiVault! We welcome contributions to smart contracts, the TypeScript SDK, the frontend application, and documentation.

---

## 1. Monorepo Structure

| Directory | Scope | Language / Framework | Primary Commands |
| :--- | :--- | :--- | :--- |
| [`liquivault-contracts/`](./liquivault-contracts) | Soroban Core Smart Contracts | Rust (`#![no_std]`), `soroban-sdk = "21.7.7"` | `cargo test --workspace`<br/>`stellar contract build` |
| [`liquivault-sdk/`](./liquivault-sdk) | Client SDK & Transaction Builders | TypeScript, Vitest, Tsup | `npm install`<br/>`npm test`<br/>`npm run build` |
| [`liquivault-frontend/`](./liquivault-frontend) | Web Application & Telemetry Portal | Next.js 14, Tailwind, shadcn/ui | `npm install`<br/>`npm test`<br/>`npm run dev` |
| [`docs/`](./docs) | Protocol Specifications & Evidence | Markdown | Documentation source |

---

## 2. Development Setup & Prerequisites

Before submitting contributions, ensure your environment matches the tested scope:

- **Rust**: `1.80.0+` with target `wasm32-unknown-unknown`
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- **Stellar CLI**: `21.7.0+`
  ```bash
  cargo install --locked stellar-cli --features opt
  ```
- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Git**: Configured with a clean working tree

---

## 3. Workflow & Contribution Process

### 3.1 Branching Strategy
1. Fork the repository and create your feature or bugfix branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. Keep branches focused on a single logical change. Avoid monolithic PRs mixing contract changes, SDK updates, and UI refactors unless directly dependent.

### 3.2 Commit Conventions
We enforce [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(contracts): add junior tranche withdrawal limit guard`
- `fix(sdk): serialize RFC-6902 metadata keys in strict lexicographical order`
- `docs(storage): document TTL bump constants and restore procedures`
- `test(frontend): assert JuniorTrancheCard renders APY and coverage ratio`

---

## 4. Verification Standards

Every Pull Request must pass the full test suite across all three workspace modules before merging.

### 4.1 Smart Contracts
```bash
cd liquivault-contracts
# Run workspace test suite
cargo test --workspace

# Check formatting and linter
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings

# Build WASM binaries
stellar contract build
```
- Smart contracts must maintain `#![no_std]`.
- All financial arithmetic must use `checked_*` methods (`checked_add`, `checked_mul`, etc.).
- Never use `unwrap()` or `expect()` in production contract code; return typed errors (`EscrowError`, `RegistryError`, `PoolError`).
- Invariants must be protected by Checks-Effects-Interactions (CEI).

### 4.2 TypeScript SDK
```bash
cd liquivault-sdk
npm install
npm test
npm run build
```
- Dual ESM and CJS bundle output must compile cleanly via `tsup`.
- SDK must strictly type all contract arguments, return values, and error mappings.

### 4.3 Web Frontend
```bash
cd liquivault-frontend
npm install
npm test
npm run build
```
- All React components must pass Vitest and React Testing Library suites.
- TypeScript compiler checks (`tsc --noEmit`) must succeed with zero errors.

---

## 5. Security & Invariant Rules

If you are modifying smart contract logic, consult [SECURITY.md](docs/SECURITY.md) and [architecture.md](docs/architecture.md):
- **Finding F-1 Invariant**: Invoices can NEVER be verified by merchants or debtors. Only the authorized Verifier Oracle or Admin can verify.
- **Finding F-2 Invariant**: Circuit breakers (`set_paused`) must be respected during state-mutating actions (mints, deposits, advances), but repayments must remain unblocked.
- **Finding F-3 Invariant**: Junior withdrawals must strictly enforce the 10% deployed capital coverage rule.
- **TTL Extension**: All persistent reads and writes must execute `extend_ttl` using the constants in [storage.md](docs/storage.md).

---

## 6. Pull Request Checklist

Before opening your Pull Request, ensure:
- [ ] Comprehensive unit tests cover new functionality or edge cases.
- [ ] `cargo test --workspace` passes (19/19 contract tests).
- [ ] `npm test` in `liquivault-sdk` passes (11/11 SDK tests).
- [ ] `npm test` in `liquivault-frontend` passes (12/12 frontend tests).
- [ ] All new files contain clean formatting and adhere to repository linting standards.
- [ ] Documentation has been updated to reflect any state, parameter, or interface changes.
- [ ] Pull request template is filled out completely.
