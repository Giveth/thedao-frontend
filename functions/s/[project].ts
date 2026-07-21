import { ImageResponse, loadGoogleFont } from "workers-og";
import { buildCardHtml, buildLandingHtml, fetchLogoDataUri } from "../../lib/share-card";
import { buildShareParams, parseRound1Csv, type Project } from "../../lib/transparency-data";

// Parsed CSV cache, shared across requests within one isolate.
let projectsPromise: Promise<Project[]> | undefined;
function loadProjects(origin: string): Promise<Project[]> {
  projectsPromise ??= (async () => {
    const res = await fetch(`${origin}/round1.csv`);
    if (!res.ok) throw new Error(`round1.csv fetch failed: ${res.status}`);
    return parseRound1Csv(await res.text());
  })();
  return projectsPromise;
}

/**
 * /s/<project>      — share landing page: og/twitter card meta for crawlers,
 *                     instant redirect to /transparency for humans.
 * /s/<project>.png  — the card image itself (1200x630 breakdown, satori).
 *
 * The breakdown is computed server-side from round1.csv + the on-chain
 * config, so links carry no query params.
 */
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const raw = Array.isArray(context.params.project)
    ? context.params.project[0]
    : context.params.project;
  let segment = String(raw ?? "");
  try {
    segment = decodeURIComponent(segment);
  } catch {
    // Keep the raw value if it is not valid percent-encoding.
  }

  const wantsImage = segment.endsWith(".png");
  const name = (wantsImage ? segment.slice(0, -4) : segment).slice(0, 60);
  if (!name) return Response.redirect(`${url.origin}/transparency`, 302);

  if (!wantsImage) {
    return new Response(buildLandingHtml(url.origin, url.pathname, name), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(url.toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const project = (await loadProjects(url.origin)).find((p) => p.name === name);
  if (!project) return new Response("Unknown project", { status: 404 });

  const logoDataUri = await fetchLogoDataUri(url.origin);
  const params = buildShareParams(project, Date.now());
  const html = buildCardHtml(params, logoDataUri);

  const [interTight, interTightSemibold] = await Promise.all([
    loadGoogleFont({ family: "Inter Tight", weight: 400 }),
    loadGoogleFont({ family: "Inter Tight", weight: 600 }),
  ]);

  const image = new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter Tight", data: interTight, weight: 400, style: "normal" },
      { name: "Inter Tight", data: interTightSemibold, weight: 600, style: "normal" },
    ],
  });

  const response = new Response(image.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
  // Don't edge-cache a card that rendered without the logo (transient miss).
  if (logoDataUri) context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
