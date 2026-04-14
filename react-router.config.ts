import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender() {
    return [
      "/",
      "/eth-security-badge",
      "/sitemap.xml",
    ];
  },
} satisfies Config;

