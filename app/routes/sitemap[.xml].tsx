import { SITE_URL } from "~/data/site";
import { projects, slugifyProject } from "~/routes/transparency.($project)/data";

// Define all pages for the sitemap
const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/ethsecurity-badges", priority: "0.8", changefreq: "monthly" },
  { path: "/funding-rounds", priority: "0.8", changefreq: "monthly" },
  { path: "/transparency", priority: "0.8", changefreq: "weekly" },
  ...projects.map((p) => ({
    path: `/transparency/${slugifyProject(p.name)}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

export function loader() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
