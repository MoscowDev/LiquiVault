// Reports evidence gaps. Never submits an appeal or treats a fixture as an independent person.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'gates');
const status = JSON.parse(readFileSync(resolve(root, 'status.json'), 'utf8'));
function evidence(path) {
  const target = resolve(root, path);
  const rel = relative(root, target);
  assert.ok(rel && !rel.startsWith('..') && !isAbsolute(rel), 'Evidence must stay inside docs/gates');
  return JSON.parse(readFileSync(target, 'utf8'));
}
assert.equal(status.schemaVersion, 1);
assert.ok(Array.isArray(status.archivalEvidence));
assert.ok(Array.isArray(status.independentSessions));
const pending = [];
assert.ok(status.archivalEvidence.length >= 1);
for (const path of status.archivalEvidence) {
  const record = evidence(path);
  assert.equal(record.status, 'confirmed');
  assert.equal(record.network, 'standalone');
  assert.equal(record.scope, 'instrumented-standalone-only');
  for (const field of ['archivedBefore', 'rejectedSigningPreservedArchive', 'instanceAndPositionRestored', 'withdrawalCompleted', 'tokenBalanceDeltaVerified']) assert.equal(record[field], true, `${path}: ${field}`);
  assert.match(record.hash, /^[0-9a-f]{64}$/);
  assert.ok(Number.isSafeInteger(record.ledger) && record.ledger > 0);
  assert.ok(Number.isSafeInteger(record.targetLedger) && record.targetLedger > 0);
  assert.ok(record.ledger > record.targetLedger);
  assert.equal(record.before.liveUntilLedgers.length, 2);
  assert.ok(record.before.liveUntilLedgers.every(value => Number.isSafeInteger(value) && value > 0 && value < record.targetLedger));
  assert.equal(record.expiredEntryTtls.length, 2);
  assert.ok(record.expiredEntryTtls.every(value => Number.isSafeInteger(value) && value >= 0 && value < record.targetLedger));
  assert.equal(record.restoredLiveUntilLedgers.length, 2);
  assert.ok(record.restoredLiveUntilLedgers.every(value => Number.isSafeInteger(value) && value >= record.ledger));
  assert.ok(Array.isArray(record.restorationKeys) && record.restorationKeys.length >= 2);
  assert.ok(BigInt(record.withdrawalTokenUnits) > 0n);
  assert.equal(record.fixtureManifest.canonicalSourcesModified, false);
  assert.ok(record.fixtureManifest.patches.length > 0);
}
if (!status.walletEvidence) pending.push('real-wallet-extension-lifecycle');
else {
  const wallet = evidence(status.walletEvidence);
  assert.equal(wallet.scope, 'maintainer-operated-real-extension-testnet');
  assert.equal(wallet.status, 'confirmed');
  assert.equal(wallet.network, 'testnet');
  assert.equal(wallet.rejectionCheck.providerResponseObserved, true);
  assert.equal(wallet.rejectionCheck.unchanged, true);
  for (const method of ['deposit', 'mint_invoice', 'factor_invoice', 'settle_invoice']) {
    const transaction = wallet.transactions.find(item => item.method === method);
    assert.ok(transaction && transaction.signer === 'official-extension' && transaction.confirmed === true, `Missing real extension result for ${method}`);
    assert.match(transaction.hash, /^[0-9a-f]{64}$/);
  }
  assert.equal(wallet.assertionsPassed, true);
}
if (!status.independentSessions.length) pending.push('independent-developer-or-user-feedback');
for (const path of status.independentSessions) {
  const session = evidence(path);
  assert.equal(session.scope, 'independent-person-validation');
  assert.equal(session.independentOfMaintainer, true);
  assert.equal(session.consentRecorded, true);
  assert.ok(session.participantReference && session.completedAt && Number.isFinite(Date.parse(session.completedAt)));
  assert.ok(Array.isArray(session.stepsActuallyAttempted) && session.stepsActuallyAttempted.length);
  assert.ok(session.feedbackSummary && session.maintainerResponse);
}
console.log(JSON.stringify({ evidenceComplete: pending.length === 0, pending, note: 'Structural evidence validation; not independent attestation, an audit, program eligibility or an approval guarantee.' }, null, 2));
if (process.argv.includes('--require-complete') && pending.length) process.exitCode = 1;
