/// <reference lib="deno.ns" />

import satori from "satori";
import { html as toVdom } from "satori-html";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { buildCardHtml, buildLandingHtml, loadGoogleFontData } from "../lib/share-card.ts";
import { buildShareParams, parseRound1Csv, type Project } from "../lib/transparency-data.ts";

// One-time initializations, shared across requests.
let wasmReady: Promise<void> | undefined;
function ensureResvgWasm(): Promise<void> {
  wasmReady ??= (async () => {
    try {
      const wasm = await Deno.readFile(
        new URL("../node_modules/@resvg/resvg-wasm/index_bg.wasm", import.meta.url),
      );
      await initWasm(wasm);
    } catch {
      // Deployment without node_modules — fall back to the CDN copy.
      await initWasm(fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm"));
    }
  })();
  return wasmReady;
}

let fontsReady: Promise<{ regular: ArrayBuffer; semibold: ArrayBuffer }> | undefined;
function ensureFonts() {
  fontsReady ??= (async () => {
    const [regular, semibold] = await Promise.all([
      loadGoogleFontData("Inter Tight", 400),
      loadGoogleFontData("Inter Tight", 600),
    ]);
    return { regular, semibold };
  })();
  return fontsReady;
}

// Cached logo data URI — only successful fetches are kept, so a transient
// failure doesn't bake a logo-less card into the PNG cache. The SVG is
// rasterized to PNG because this resvg-wasm build doesn't draw nested SVG
// <image> elements (2x the 56px display size for crispness).
let logoDataUriCache: string | undefined;
async function loadLogo(origin: string): Promise<string | undefined> {
  if (logoDataUriCache) return logoDataUriCache;
  try {
    const res = await fetch(`${origin}/dao-logo.svg`);
    if (!res.ok) return undefined;
    await ensureResvgWasm();
    const png = new Resvg(await res.text(), { fitTo: { mode: "width", value: 112 } })
      .render()
      .asPng();
    let bin = "";
    for (const byte of png) bin += String.fromCharCode(byte);
    logoDataUriCache = `data:image/png;base64,${btoa(bin)}`;
    return logoDataUriCache;
  } catch {
    return undefined;
  }
}

let projectsPromise: Promise<Project[]> | undefined;
function loadProjects(origin: string): Promise<Project[]> {
  projectsPromise ??= (async () => {
    try {
      const csv = await Deno.readTextFile(
        new URL("../app/routes/transparency/round1.csv", import.meta.url),
      );
      return parseRound1Csv(csv);
    } catch {
      // Deployment without app sources — use the served static copy.
      const res = await fetch(`${origin}/round1.csv`);
      if (!res.ok) throw new Error(`round1.csv fetch failed: ${res.status}`);
      return parseRound1Csv(await res.text());
    }
  })();
  return projectsPromise;
}

/** In-memory PNG cache with per-entry expiry (streamed amounts move). */
const pngCache = new Map<string, { png: Uint8Array<ArrayBuffer>; expires: number }>();
const PNG_CACHE_MAX = 200;
const PNG_CACHE_TTL_MS = 3_600_000;

async function renderImage(origin: string, name: string): Promise<Response> {
  const project = (await loadProjects(origin)).find((p) => p.name === name);
  if (!project) return new Response("Unknown project", { status: 404 });

  const headers = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=3600",
  };

  const cacheKey = `${origin}|${name}`;
  const cached = pngCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return new Response(cached.png, { headers });

  await ensureResvgWasm();
  const [{ regular, semibold }, logoDataUri] = await Promise.all([
    ensureFonts(),
    loadLogo(origin),
  ]);

  const params = buildShareParams(project, Date.now());
  // satori-html's VNode is satori's documented input, but satori's public
  // signature is typed as ReactNode — bridge the two.
  const vdom = toVdom(buildCardHtml(params, logoDataUri)) as unknown as Parameters<
    typeof satori
  >[0];
  const svg = await satori(vdom, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter Tight", data: regular, weight: 400, style: "normal" },
      { name: "Inter Tight", data: semibold, weight: 600, style: "normal" },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng() as Uint8Array<ArrayBuffer>;

  // Don't cache a card that rendered without the logo (transient fetch miss).
  if (logoDataUri) {
    if (pngCache.size >= PNG_CACHE_MAX) {
      const oldest = pngCache.keys().next().value;
      if (oldest !== undefined) pngCache.delete(oldest);
    }
    pngCache.set(cacheKey, { png, expires: Date.now() + PNG_CACHE_TTL_MS });
  }

  return new Response(png, { headers });
}

/**
 * GET /s/<project>      — share landing page (og/twitter card + redirect).
 * GET /s/<project>.png  — the card image itself.
 * Deno twin of functions/s/[project].ts.
 */
export default function share(req: Request): Promise<Response> | Response {
  const url = new URL(req.url);
  let segment = url.pathname.replace(/^\/s\//, "");
  try {
    segment = decodeURIComponent(segment);
  } catch {
    // Keep the raw value if it is not valid percent-encoding.
  }

  const wantsImage = segment.endsWith(".png");
  const name = (wantsImage ? segment.slice(0, -4) : segment).slice(0, 60);
  if (!name) return Response.redirect(`${url.origin}/transparency`, 302);

  if (wantsImage) return renderImage(url.origin, name);

  return new Response(buildLandingHtml(url.origin, url.pathname, name), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
