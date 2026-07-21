import { readFileSync } from "node:fs";
import type { Config } from "@react-router/dev/config";
import { parseRound1Csv, slugifyProject } from "./lib/transparency-data";

export default {
  ssr: false,
  prerender() {
    // One page per project so /transparency/<slug> ships its own card meta.
    const csv = readFileSync("app/routes/transparency.($project)/round1.csv", "utf8");
    const slugs = parseRound1Csv(csv).map((p) => slugifyProject(p.name));
    if (new Set(slugs).size !== slugs.length) {
      throw new Error("round1.csv: two project names slugify to the same URL");
    }
    return [
      "/",
      "/ethsecurity-badges",
      "/funding-rounds",
      "/transparency",
      ...slugs.map((slug) => `/transparency/${slug}`),
      "/sitemap.xml",
    ];
  },
} satisfies Config;
