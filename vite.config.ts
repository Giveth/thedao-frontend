import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
  },
  resolve: {
    alias: {
      "react-dom/server": fileURLToPath(
        new URL("./app/lib/react-dom-server.node.mjs", import.meta.url),
      ),
    },
  },
});
