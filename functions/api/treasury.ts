import {
  fetchTreasuryData,
  adjustStakingBalance,
} from "../../lib/treasury";

interface Env {
  ETH_RPC_URL: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cacheUrl = new URL(context.request.url);
  const cacheKey = new Request(cacheUrl.toString());
  // caches.default is Cloudflare Workers-specific (not in standard CacheStorage type)
  const cache = (caches as unknown as { default: Cache }).default;

  // Check edge cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchTreasuryData(context.env.ETH_RPC_URL);
    const adjustedData = adjustStakingBalance(data);

    const response = new Response(JSON.stringify(adjustedData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=2",
      },
    });

    // Store in edge cache (non-blocking)
    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    console.error("Treasury API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
