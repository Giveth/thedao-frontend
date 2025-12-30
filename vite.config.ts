import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  ...denoWorkaround(command),
}));

function denoWorkaround(command: string) {
  const isDeno = typeof globalThis !== "undefined" && "Deno" in globalThis;
  if (!isDeno || command !== "build") {
    return undefined;
  }
  // See: https://github.com/remix-run/react-router/issues/12568#issuecomment-2625776697
  return {
    resolve: {
      alias: {
        "react-dom/server": "react-dom/server.node",
      },
    },
  };
}
