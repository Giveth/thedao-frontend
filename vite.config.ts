import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Editors save files atomically via short-lived `<file>.tmp.*` files. When a
// file watcher (vite's or react-router's chokidar) tries to watch one that has
// already been renamed away, Deno's fs.watch rejects asynchronously where Node
// silently ignores it, and the unhandled rejection kills the dev server. Vite's
// own watcher is also told to ignore these paths below, but react-router dev
// runs separate chokidar instances that take no such option, so swallow this
// specific rejection process-wide.
const g = globalThis as {
  Deno?: unknown;
  addEventListener?: (type: string, cb: (event: {
    reason?: { name?: string; stack?: string };
    preventDefault: () => void;
  }) => void) => void;
};
if (g.Deno && g.addEventListener) {
  g.addEventListener("unhandledrejection", (event) => {
    if (event.reason?.name === "NotFound" && event.reason?.stack?.includes("FsWatcher")) {
      event.preventDefault();
    }
  });
}

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    // Add API middleware for dev server
    {
      name: "api-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/")) {
            try {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const pathname = url.pathname;

              if (pathname === "/api/treasury") {
                // Dynamically import and call the treasury handler
                const { default: treasury } = await import("./api/treasury.ts");
                const request = new Request(url, {
                  method: req.method,
                  headers: req.headers as HeadersInit,
                });
                const response = await treasury(request);
                
                res.statusCode = response.status;
                response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                
                const body = await response.text();
                res.end(body);
                return;
              } else if (pathname === "/api/health") {
                const { default: health } = await import("./api/health.ts");
                const request = new Request(url, {
                  method: req.method,
                  headers: req.headers as HeadersInit,
                });
                const response = await health(request);
                
                res.statusCode = response.status;
                response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                
                const body = await response.text();
                res.end(body);
                return;
              }
            } catch (error) {
              console.error("API error:", error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return;
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
    watch: {
      // Editors write changes atomically via short-lived `<file>.tmp.*` files.
      // Deno's fs.watch throws an uncaught NotFound (crashing the dev server)
      // when chokidar tries to watch one that has already been renamed away.
      ignored: ["**/*.tmp.*"],
    },
  },
  resolve: {
    alias: {
      "react-dom/server": fileURLToPath(
        new URL("./app/lib/react-dom-server.node.mjs", import.meta.url),
      ),
    },
  },
});
