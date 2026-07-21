// Shared logic for the project share card (/s/<project>) and its OG image
// (/api/share-image). Used by both deployments: Cloudflare Pages Functions
// (functions/) render the HTML with workers-og, the Deno server (api/)
// renders the same HTML with satori + resvg-wasm.

export type ShareRowKind = "round" | "grant" | "stream";
export type ShareRow = [label: string, eth: string, kind: ShareRowKind | undefined];

export type ShareImageParams = {
  project: string;
  rows: ShareRow[];
  total: string;
  usd: string;
};

/** Escape a string for safe interpolation into HTML. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Builds the 1200x630 card markup (satori-flavored HTML). Mirrors
 * ProjectModal's popup, minus the close and share buttons. Whitespace is
 * pre-collapsed: satori turns inter-tag whitespace into flex children,
 * which breaks space-between layouts.
 */
export function buildCardHtml(params: ShareImageParams, logoDataUri?: string): string {
  const { project, rows, total, usd } = params;
  const green = "#5CB75A";

  const rowsHtml = rows
    .map(([label, eth, kind], i) => {
      const tag =
        kind === "round"
          ? `<div style="display:flex;margin-left:10px;padding:3px 10px;border-radius:999px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:1px;">ROUND 1</div>`
          : "";
      const dot =
        kind === "stream"
          ? `<div style="display:flex;width:9px;height:9px;border-radius:999px;background:${green};margin-right:10px;"></div>`
          : "";
      return `
      <div style="display:flex;width:100%;justify-content:space-between;align-items:center;padding:13px 0;${
        i > 0 ? "border-top:1px solid rgba(255,255,255,0.1);" : ""
      }">
        <div style="display:flex;align-items:center;">
          ${dot}
          <span style="font-size:21px;color:rgba(255,255,255,0.8);">${esc(label)}</span>
          ${tag}
        </div>
        <span style="font-size:21px;color:${kind === "stream" ? green : "#ffffff"};">${esc(eth)} ETH</span>
      </div>`;
    })
    .join("");

  const logoHtml = logoDataUri
    ? `<img src="${logoDataUri}" style="position:absolute;top:30px;right:34px;width:56px;height:56px;" />`
    : "";

  const html = `
  <div style="display:flex;width:1200px;height:630px;align-items:center;justify-content:center;background:linear-gradient(142deg,#2c5e86 31%,#1f435f 90%);font-family:'Inter Tight';">
    <div style="display:flex;position:relative;flex-direction:column;width:720px;padding:30px 34px;border-radius:24px;border:1px solid rgba(255,255,255,0.15);background:linear-gradient(160deg,rgba(44,94,134,0.85) 0%,rgba(31,67,95,0.97) 100%);box-shadow:0 25px 50px rgba(0,0,0,0.35);">
      ${logoHtml}
      <div style="display:flex;flex-direction:column;padding-right:80px;">
        <span style="font-size:34px;color:#ffffff;">${esc(project)}</span>
        <span style="font-size:20px;color:rgba(255,255,255,0.5);margin-top:10px;">Full breakdown</span>
      </div>
      <div style="display:flex;width:100%;flex-direction:column;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:4px 22px;margin-top:22px;">
        ${rowsHtml}
      </div>
      <div style="display:flex;width:100%;justify-content:space-between;align-items:center;margin-top:20px;">
        <span style="font-size:23px;font-weight:600;color:rgba(255,255,255,0.8);">TOTAL</span>
        <div style="display:flex;flex-direction:column;align-items:flex-end;">
          <span style="font-size:23px;font-weight:600;color:${green};">${esc(total)} ETH</span>
          ${usd ? `<span style="font-size:18px;color:rgba(255,255,255,0.5);">≈ ${esc(usd)} when sent</span>` : ""}
        </div>
      </div>
    </div>
  </div>`;

  return html.replace(/>\s+</g, "><").trim();
}

/**
 * Fetches the DAO logo from the deployment's own static assets and returns
 * it as a data URI, or undefined if unavailable (the card then renders
 * without it).
 */
export async function fetchLogoDataUri(origin: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${origin}/dao-logo.svg`);
    if (!res.ok) return undefined;
    return `data:image/svg+xml;base64,${btoa(await res.text())}`;
  } catch {
    return undefined;
  }
}

/**
 * Fetches a Google-hosted TTF/OTF for satori. The css2 endpoint serves
 * truetype URLs to clients without a modern browser User-Agent.
 */
export async function loadGoogleFontData(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${
    encodeURIComponent(family)
  }:wght@${weight}`;
  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": "curl/8.0" } });
  if (!cssRes.ok) throw new Error(`Font CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const fontUrl =
    css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/)?.[1] ??
    css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`No font URL found for ${family} ${weight}`);
  const fontRes = await fetch(fontUrl);
  if (!fontRes.ok) throw new Error(`Font fetch failed: ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

/**
 * Builds the share landing page: og/twitter card meta for crawlers (image
 * rendered by /s/<project>.png) plus an instant redirect for humans.
 */
export function buildLandingHtml(origin: string, pathname: string, project: string): string {
  const image = new URL(`/s/${encodeURIComponent(project)}.png`, origin);

  const title = `${project} — funded by TheDAO Security Fund`;
  const description = `Full breakdown of the funding ${project} received for Ethereum security. Public, verifiable, on-chain.`;
  const target = `${origin}/transparency`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(origin + pathname)}">
<meta property="og:image" content="${esc(image.toString())}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@thedaofund">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image.toString())}">
<link rel="canonical" href="${esc(target)}">
</head>
<body>
<p>Redirecting to <a href="${esc(target)}">the transparency page</a>…</p>
<!-- JS redirect, not meta refresh: Telegram's (and some other) link-preview
     crawlers follow meta refresh and would scrape /transparency's generic
     card instead of this page's tags. Crawlers don't execute JS. -->
<script>location.replace(${JSON.stringify(target)})</script>
</body>
</html>`;
}
