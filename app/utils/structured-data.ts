import type { Thing, WithContext } from "schema-dts";
import {
  ORGANIZATION_LEGAL_NAME,
  ORGANIZATION_NAME,
  SITE_DESCRIPTION,
  SITE_FOUNDED,
  SITE_LOGO,
  SITE_NAME,
  SITE_PUNCHLINE,
  SITE_URL,
  SOCIAL_LINKS,
} from "~/data/site";

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    foundingDate: SITE_FOUNDED,
    sameAs: Object.values(SOCIAL_LINKS),
    description: SITE_DESCRIPTION,
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebSiteSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_PUNCHLINE,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
  };
}

/**
 * Generate all structured data for the homepage
 */
export function generateHomepageStructuredData(): WithContext<Thing>[] {
  return [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
  ];
}

/**
 * Convert structured data to script tag format for meta function
 */
export function structuredDataToMetaTags(structuredData: WithContext<Thing> | WithContext<Thing>[]) {
  const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];

  return dataArray.map((data) => ({
    "script:ld+json": data,
  }));
}

