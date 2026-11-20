import { fetchTreasuryData } from "../../lib/treasury";

interface Env {
  ETH_RPC_URL: string;
  BEACON_API_URL: string;
}

/**
 * A snapshot is fresh for a minute: the page polls once a minute, and the
 * staked balance (read at the finalized beacon state) moves once an epoch.
 */
const FRESH_SECS = 60;
/**
 * After that it is still served at once, while a newer one is fetched in the
 * background, for up to a day; this also covers RPC or beacon API outages.
 */
const STALE_SECS = 24 * 60 * 60;
/** Browsers may reuse a response for this long. */
const BROWSER_SECS = 30;
const FETCHED_AT = "X-Fetched-At";

interface Snapshot {
  body: string;
  /** Unix ms. */
  fetchedAt: number;
}

// An isolate serves many requests: they share the last snapshot, and
// concurrent refreshes share one upstream fetch.
let memory: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

// caches.default is Cloudflare Workers-specific (not in standard CacheStorage type).
const edgeCache = () => (caches as unknown as { default: Cache }).default;

/** Fetches a new snapshot and keeps it in memory and in this location's edge cache. */
function refresh(env: Env, cacheKey: Request): Promise<Snapshot> {
  inflight ??= (async () => {
    const data = await fetchTreasuryData(env.ETH_RPC_URL, env.BEACON_API_URL);
    const snapshot = { body: JSON.stringify(data), fetchedAt: Date.now() };
    memory = snapshot;
    await edgeCache().put(
      cacheKey,
      new Response(snapshot.body, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${STALE_SECS}`,
          [FETCHED_AT]: String(snapshot.fetchedAt),
        },
      }),
    );
    return snapshot;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** The newest snapshot this isolate knows of, from memory or else the edge cache. */
async function lastSnapshot(cacheKey: Request): Promise<Snapshot | null> {
  if (memory) return memory;
  const hit = await edgeCache().match(cacheKey);
  if (!hit) return null;
  const fetchedAt = Number(hit.headers.get(FETCHED_AT));
  if (!Number.isFinite(fetchedAt)) return null;
  memory = { body: await hit.text(), fetchedAt };
  return memory;
}

/**
 * The error as one line, for the logs. viem's messages quote the request URL,
 * and an RPC URL often carries an API key, so both configured URLs are masked.
 */
function logSafe(error: unknown, env: Env): string {
  let text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  for (const url of [env.ETH_RPC_URL, env.BEACON_API_URL]) {
    if (url) text = text.replaceAll(url, "<redacted>");
  }
  return text;
}

function respond(snapshot: Snapshot): Response {
  return new Response(snapshot.body, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, max-age=${BROWSER_SECS}`,
      [FETCHED_AT]: String(snapshot.fetchedAt),
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // One entry per location, whatever the query string.
  const cacheKey = new Request(new URL("/api/treasury", context.request.url).toString());

  const last = await lastSnapshot(cacheKey);
  const ageSecs = last ? (Date.now() - last.fetchedAt) / 1000 : Infinity;

  if (last && ageSecs < STALE_SECS) {
    if (ageSecs >= FRESH_SECS) {
      context.waitUntil(
        refresh(context.env, cacheKey).catch((error) =>
          console.error("Treasury refresh failed:", logSafe(error, context.env))
        ),
      );
    }
    return respond(last);
  }

  try {
    return respond(await refresh(context.env, cacheKey));
  } catch (error) {
    console.error("Treasury API error:", logSafe(error, context.env));
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
