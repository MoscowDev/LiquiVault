// Prepares an unsigned LVTEST changeTrust transaction for a testnet wallet.
// Public data only: it never signs or submits. Sign the printed XDR in a wallet
// (for example Freighter or Stellar Lab), then submit it yourself.
//
// Usage: node scripts/prepare-wallet-trustline.mjs <G... public key>
// Requires the sibling liquivault-sdk checkout with dependencies installed
// (it provides @stellar/stellar-sdk). The asset is read from the sibling
// liquivault-contracts deployment record when present.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(resolve(root, 'liquivault-sdk/package.json'));
const { Asset, Networks, StrKey, TransactionBuilder, Operation, Horizon } = require('@stellar/stellar-sdk');

const address = process.argv[2];
if (!address || !StrKey.isValidEd25519PublicKey(address)) {
  console.error('Usage: node scripts/prepare-wallet-trustline.mjs <G... public key>');
  process.exit(2);
}

// Fallback matches deployments/testnet.json at the time of writing.
let assetSpec = 'LVTEST:GCW7P2SWHLMTSQM3BGBB4NO7RPC2FJPQIBKGUL373WMYU3GZU4WJB2U7';
const record = resolve(root, 'liquivault-contracts/deployments/testnet.json');
if (existsSync(record)) assetSpec = JSON.parse(readFileSync(record, 'utf8')).testUsdcAsset ?? assetSpec;
const [code, issuer] = assetSpec.split(':');
assert.ok(code && StrKey.isValidEd25519PublicKey(issuer), `Unexpected asset ${assetSpec}`);

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const account = await server.loadAccount(address);
if (account.balances.some(b => b.asset_code === code && b.asset_issuer === issuer)) {
  console.log(`${code} trustline already exists for ${address}; nothing to prepare.`);
  process.exit(0);
}
const transaction = new TransactionBuilder(account, { fee: '1000', networkPassphrase: Networks.TESTNET })
  .addOperation(Operation.changeTrust({ asset: new Asset(code, issuer), limit: '1000000' }))
  .setTimeout(86400).build();
const xdr = transaction.toXDR();

const decoded = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
assert.equal(decoded.signatures.length, 0);
assert.equal(decoded.source, address);
assert.equal(decoded.operations.length, 1);
assert.equal(decoded.operations[0].type, 'changeTrust');
assert.equal(decoded.operations[0].line.getIssuer(), issuer);
assert.equal(decoded.operations[0].line.getCode(), code);

// .stellar/ is gitignored; nothing here is secret, but it is per-wallet output.
const output = resolve(root, '.stellar/wallet-trustline');
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'unsigned.xdr'), xdr + '\n');
const summary = {
  status: 'unsigned-not-submitted', preparedAt: new Date().toISOString(),
  network: 'testnet', source: decoded.source, sequence: decoded.sequence, feeStroops: decoded.fee,
  operation: 'changeTrust', assetCode: code, issuer, limit: decoded.operations[0].limit,
  expiresAt: new Date(Number(decoded.timeBounds.maxTime) * 1000).toISOString(),
  hash: Buffer.from(decoded.hash()).toString('hex'),
};
writeFileSync(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
console.log(xdr);
