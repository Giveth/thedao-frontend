// Round 1 transparency data: CSV parsing, on-chain funding config, and the
// share-card breakdown builder. Runtime-agnostic — used by the app (which
// bundles round1.csv via Vite ?raw), the Cloudflare Pages Functions (which
// fetch /round1.csv from static assets), and the Deno server (which reads
// the file from disk).

export type Project = {
  name: string;
  /** ETH from the Round 1 quadratic-funding matching pool. */
  matchingPool: number;
  /** ETH from the extra round inflow. */
  extraRoundInflow: number;
  /**
   * ETH equivalent of the round donations from other donors, frozen at the
   * round-month (May 2026) average price of $2,201.5410/ETH — the same set
   * rate the transparency dashboard uses, so both sites show one number.
   */
  otherDonors: number;
  /** Round 1 total in ETH (matching + extra inflow + other donors). */
  totalEth: number;
  /** Historical USD value of the other donors' donations at round time. */
  otherDonorsUsd: number;
  /**
   * USD value of the Round 1 funding frozen at the moment it moved: each
   * payout tx at its tx-day ETH price, plus the donations' book USD.
   * Grants and streamed funds are NOT included (see SEAL_ONCHAIN).
   */
  usdSent: number;
  /** Project website (or social profile when no website exists). */
  link: string;
  /** Link to the project's post-round progress update (X post, forum, blog); empty when none. */
  progressUpdate: string;
};

// =============================================================================
// round1.csv parsing
// =============================================================================

const CSV_HEADER =
  'project_name,matching_pool,extra_round_inflow,other_donors,other_donors_usd,total,usd_sent,link,progress_update';
const EXPECTED_ROWS = 135;

/** Split one CSV line, honoring double-quoted fields (names contain commas). */
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
}

export function parseRound1Csv(raw: string): Project[] {
  const lines = raw.trim().split('\n');
  if (lines[0].trim() !== CSV_HEADER) {
    throw new Error(`round1.csv: unexpected header "${lines[0]}"`);
  }
  const rows = lines.slice(1).map((line) => {
    const [name, matchingPool, extraRoundInflow, otherDonors, otherDonorsUsd, totalEth, usdSent, link, progressUpdate] =
      splitCsvLine(line.trim());
    const project: Project = {
      name,
      matchingPool: Number(matchingPool),
      extraRoundInflow: Number(extraRoundInflow),
      otherDonors: Number(otherDonors),
      otherDonorsUsd: Number(otherDonorsUsd),
      totalEth: Number(totalEth),
      usdSent: Number(usdSent),
      link,
      progressUpdate: progressUpdate ?? '',
    };
    if (!name || Number.isNaN(project.totalEth)) {
      throw new Error(`round1.csv: malformed row "${line}"`);
    }
    return project;
  });
  if (rows.length !== EXPECTED_ROWS) {
    throw new Error(`round1.csv: expected ${EXPECTED_ROWS} rows, got ${rows.length}`);
  }
  return rows;
}

/**
 * URL slug for a project's /transparency/<slug> page. Prerender asserts
 * these are unique across the CSV, so a slug identifies one project.
 */
export function slugifyProject(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// =============================================================================
// Static KPIs
// =============================================================================

/** USD raised from co-funders & donors during Round 1. */
export const CO_FUNDER_USD_RAISED = 615_677;

/**
 * ETH price used to value the LIVE-STREAMED portion only (Round 1 figures
 * carry their own frozen USD in round1.csv). The transparency dashboard
 * values each streamed day at that day's price; this is the running average
 * of that valuation as of the snapshot, applied to the live tail as an
 * approximation.
 */
export const USD_PER_ETH_STREAMED = 2017.98;

/** Date of the last round1.csv snapshot (streamed amounts update live on top). */
export const LAST_UPDATED = 'July 17, 2026';

// =============================================================================
// On-chain configuration (SEAL & SEAL 911 grants + Superfluid streams)
// =============================================================================

/** TheDAO Security Fund operational multisig — sender of grants and streams. */
export const OPERATIONAL_MULTISIG = '0x5256d6d94ed14667fa1661a99f5b142b1e051b8e';

/** Superfluid ETHx super token on Ethereum mainnet. */
export const ETHX_TOKEN = '0xc22bea0be9872d8b7b3933cec70ece4d53a900da';

export const SUPERFLUID_SUBGRAPH_URL =
  'https://subgraph-endpoints.superfluid.dev/eth-mainnet/protocol-v1';

export type StreamState = {
  /** Current flow rate in wei per second. */
  flowRate: bigint;
  /** Wei streamed up to `updatedAtTimestamp`. */
  streamedUntilUpdatedAt: bigint;
  /** Unix seconds of the last stream update. */
  updatedAtTimestamp: number;
};

export type OnchainFunding = {
  /** Receiving address of the grants and Superfluid stream. */
  receiver: string;
  /** One-off direct ETH grants from the operational multisig; USD frozen at the tx-day price. */
  grants: { amountEth: number; amountUsd: number; txHash: string }[];
  /**
   * Verified on-chain stream state, used as a fallback so streamed amounts
   * keep ticking even when the Superfluid subgraph is unreachable.
   */
  streamFallback: StreamState;
};

/** Projects whose funding continues on-chain, keyed by CSV project name. */
export const SEAL_ONCHAIN: Record<string, OnchainFunding> = {
  'SEAL 911': {
    receiver: '0xba5ed9942ea64e8d789187e0af6a0390d78ba5ed',
    grants: [
      {
        amountEth: 133.7,
        amountUsd: 269930.11,
        txHash: '0x1afa1f24bbaf6e880d673069d27c9c83fb565eec0ade26638eca2b7f93654034',
      },
    ],
    streamFallback: {
      flowRate: 1547453703703n,
      streamedUntilUpdatedAt: 0n,
      updatedAtTimestamp: 1770856115,
    },
  },
  SEAL: {
    receiver: '0x5ea1d9a6ddc3a0329378a327746d71a2019ec332',
    grants: [
      {
        amountEth: 69.0,
        amountUsd: 139305.74,
        txHash: '0x1afa1f24bbaf6e880d673069d27c9c83fb565eec0ade26638eca2b7f93654034',
      },
    ],
    streamFallback: {
      flowRate: 798611111111n,
      streamedUntilUpdatedAt: 0n,
      updatedAtTimestamp: 1770856115,
    },
  },
};

export function getGrantsTotalEth(name: string): number {
  const onchain = SEAL_ONCHAIN[name];
  if (!onchain) return 0;
  return onchain.grants.reduce((sum, g) => sum + g.amountEth, 0);
}

/** Superfluid explorer page of a project's stream, or undefined if it has none. */
export function getStreamUrl(name: string): string | undefined {
  const onchain = SEAL_ONCHAIN[name];
  if (!onchain) return undefined;
  return `https://explorer.superfluid.org/eth-mainnet/streams/${OPERATIONAL_MULTISIG}-${onchain.receiver}-${ETHX_TOKEN}-0.0`;
}

export function getGrantsTotalUsd(name: string): number {
  const onchain = SEAL_ONCHAIN[name];
  if (!onchain) return 0;
  return onchain.grants.reduce((sum, g) => sum + g.amountUsd, 0);
}

// =============================================================================
// Formatting (shared by the app UI and the server-rendered share cards)
// =============================================================================

/** "1,052.1935" — ETH amount with a fixed number of decimals. */
export function formatEth(n: number, decimals = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/** "$615,677" — whole-dollar USD amount. */
export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

// =============================================================================
// Share-card breakdown (server-side twin of ProjectModal's rows)
// =============================================================================

/**
 * ETH streamed to a project as of `nowMs`, from the verified fallback stream
 * state (servers don't poll the Superfluid subgraph).
 */
export function streamedFallbackEth(name: string, nowMs: number): number {
  const stream = SEAL_ONCHAIN[name]?.streamFallback;
  if (!stream) return 0;
  const elapsedSeconds = BigInt(Math.max(0, Math.floor(nowMs / 1000) - stream.updatedAtTimestamp));
  const wei = stream.streamedUntilUpdatedAt + stream.flowRate * elapsedSeconds;
  return Number(wei) / 1e18;
}

/**
 * Builds the share-card params for one project: the same rows, total, and
 * USD value ProjectModal displays. Structurally matches ShareImageParams in
 * share-card.ts.
 */
export function buildShareParams(project: Project, nowMs: number) {
  const rows: [string, string, 'round' | 'grant' | 'stream' | undefined][] = [];
  if (project.matchingPool > 0) {
    rows.push(['Matching pool', formatEth(project.matchingPool), 'round']);
  }
  if (project.extraRoundInflow > 0) {
    rows.push(['Extra round inflow', formatEth(project.extraRoundInflow), 'round']);
  }
  if (project.otherDonors > 0) {
    rows.push(['Other donations', formatEth(project.otherDonors), 'round']);
  }
  const onchain = SEAL_ONCHAIN[project.name];
  for (const grant of onchain?.grants ?? []) {
    rows.push(['Direct grant', formatEth(grant.amountEth), 'grant']);
  }
  const streamedEth = onchain ? streamedFallbackEth(project.name, nowMs) : 0;
  if (onchain) rows.push(['Streaming via Superfluid', formatEth(streamedEth), 'stream']);

  const totalEth = project.totalEth + getGrantsTotalEth(project.name) + streamedEth;
  const totalUsd =
    project.usdSent + getGrantsTotalUsd(project.name) + streamedEth * USD_PER_ETH_STREAMED;

  return {
    project: project.name,
    rows,
    total: formatEth(totalEth),
    usd: formatUsd(totalUsd),
  };
}
