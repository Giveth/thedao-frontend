import csvRaw from './round1.csv?raw';
import { parseRound1Csv } from '../../../lib/transparency-data';

// All data logic lives in lib/transparency-data.ts so the share-card server
// endpoints (Cloudflare Functions + Deno) can reuse it; this module binds it
// to the Vite-bundled CSV and re-exports everything for the app.
export {
  CO_FUNDER_USD_RAISED,
  ETHX_TOKEN,
  getGrantsTotalEth,
  getGrantsTotalUsd,
  getStreamUrl,
  LAST_UPDATED,
  OPERATIONAL_MULTISIG,
  SEAL_ONCHAIN,
  slugifyProject,
  SNAPSHOT_TIMESTAMP,
  SUPERFLUID_SUBGRAPH_URL,
  USD_PER_ETH_STREAMED,
} from '../../../lib/transparency-data';
export type { OnchainFunding, Project, StreamState } from '../../../lib/transparency-data';

export const projects = parseRound1Csv(csvRaw);

export function getMetaDescription(): string {
  return `TheDAO Security Fund transparency report — ${projects.length} Ethereum security projects funded, with every allocation accountable and verifiable on-chain.`;
}
