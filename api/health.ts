/// <reference lib="deno.ns" />

export default function health(_req: Request): Response {
  return Response.json({ ok: true, timestamp: Date.now() });
}
