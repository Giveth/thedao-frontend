/// <reference lib="deno.ns" />

import {
  fetchTreasuryData,
  type TreasuryResponse,
} from "../lib/treasury.ts";

// =============================================================================
// Deno KV Cache
// =============================================================================

const kv = await Deno.openKv();
const CACHE_KEY = ["treasury"];
const CACHE_TTL_MS = 2000;

interface CachedData {
  data: TreasuryResponse;
  timestamp: number;
}

async function getTreasuryData(): Promise<TreasuryResponse> {
  const cached = await kv.get<CachedData>(CACHE_KEY);
  if (cached.value && Date.now() - cached.value.timestamp < CACHE_TTL_MS) {
    return cached.value.data;
  }

  const ethRpcUrl = Deno.env.get("ETH_RPC_URL");
  const beaconApiUrl = Deno.env.get("BEACON_API_URL");
  const data = await fetchTreasuryData(ethRpcUrl!, beaconApiUrl!);

  await kv.set(CACHE_KEY, { data, timestamp: Date.now() });
  return data;
}

// =============================================================================
// API Handler
// =============================================================================

export default async function treasury(_req: Request): Promise<Response> {
  try {
    const data = await getTreasuryData();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=2",
      },
    });
  } catch (error) {
    console.error("Treasury API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
