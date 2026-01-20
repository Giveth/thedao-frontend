export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ ok: true, timestamp: Date.now() }), {
    headers: { "Content-Type": "application/json" },
  });
};
