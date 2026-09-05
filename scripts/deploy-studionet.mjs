import { readFileSync } from 'node:fs'; import { createClient } from 'genlayer-js'; import { studionet } from 'genlayer-js/chains';
if (!process.env.DEPLOYER_PRIVATE_KEY) throw new Error('DEPLOYER_PRIVATE_KEY is required only for this explicit deployment command; it is never read by the app.');
const client=createClient({chain:studionet});
for (const file of ['contracts/cantrap_vault.py','contracts/cantrap_arena.py']) { console.log(`${file}: ${readFileSync(file).length} bytes; deploy with explicit constructor addresses after recording source SHA-256.`); }
console.log('Deployment order: deploy Arena with zero vault address; deploy Vault with Arena address; call Arena.bind_vault(Vault address) before any create_challenge. Then record actual source SHA-256, tx hashes, receipts, and readbacks.');
