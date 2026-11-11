# Wallet demonstration on testnet

This walkthrough uses the current issuer-controlled **LVTEST** asset and repaired testnet deployment. It is not Circle-issued USDC. Use a development wallet; no real funds are required. The signed CLI proof and an interactive Freighter demonstration are different verification scopes.

## Prepare

1. Install/unlock Freighter and select Stellar testnet with passphrase `Test SDF Network ; September 2015`.
2. Fund its public account through Stellar Friendbot. XLM pays network fees; Friendbot does not supply LVTEST.
3. Add a trustline for the `testUsdcAsset` code and issuer in the [deployment record](https://github.com/MoscowDev/liquivault-contracts/blob/main/deployments/testnet.json). Approve the trustline in the wallet. Never paste the wallet seed into an issue, application, browser form or repository.
4. Obtain test tokens from the deployment's test issuer. If you created your own deployment, its isolated admin alias is available in the ignored CLI config directory. A public record does not grant access to its issuer key.

From a contracts checkout whose own deployment runner created the keys:

```sh
stellar --config-dir .stellar/proofs/<run-id>/config contract invoke \
  --id <usdcToken> --source admin --network testnet -- \
  mint --to <WALLET_PUBLIC_KEY> --amount 100000000000
```

That mints 10,000 test tokens using seven decimals. Replace public IDs with your own record. Do not expose the local config folder or share generated keys.

## Try the application

Follow the [frontend setup](https://github.com/MoscowDev/liquivault-frontend#readme), copy its environment example and start the server. Connect Freighter. A missing wallet, rejected access or wrong network should show an error and leave the wallet disconnected.

For a small demonstration, change the form's sample amount to 1,000 test tokens, deposit into either tranche and approve the prepared transaction. Wait for a confirmed ledger and refreshed balance. The full position in that tranche is now locked for 24 hours; topping up resets that lock. Do not treat an arithmetic withdrawal preview as authorization.

Mint a 1,000-test-token invoice with a distinct debtor account, future maturity, reference and metadata hash. Replace any larger sample amount in the form. The result must be **Issued**. The verifier/admin must inspect the underlying test data and approve separately; minting does not perform automatic verification.

For a deployment you control, verify with its separate verifier alias:

```sh
stellar --config-dir .stellar/proofs/<run-id>/config contract invoke \
  --id <invoiceRegistry> --source verifier --network testnet -- \
  verify_invoice --caller <VERIFIER_PUBLIC_KEY> --invoice_id <ID> --risk_tier 1
```

Wait for the next snapshot, preview the contract quote and factor the verified invoice. The pool needs enough idle liquidity. The connected payer must hold the full face value to repay; it need not be the invoice's named debtor. Approve repayment and confirm that the invoice is Settled and the deployed advance is removed.

## Check failure behavior

Reject a wallet signature: no success hash or artificial balance change should appear. Switch the wallet account/network: reconnect before continuing. If submission or confirmation is interrupted, inspect the reported hash on testnet before retrying. A transaction may confirm after a client timeout.

The UI lists the connected merchant's invoices and confirmed activity from this session, not a global history. APY/default-rate history and KYB/SEP-10/SEP-24 flows are unavailable. A checklist run is not an independent audit or production certification.
