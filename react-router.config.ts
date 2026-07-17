import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender() {
    return [
      "/",
      "/ethsecurity-badges",
      "/funding-rounds",
      "/transparency",
      "/sitemap.xml",
    ];
  },
} satisfies Config;

