/**
 * Centralized URL and Domain utilities for consistent handling of 
 * standard domains and GSC sc-domain: properties.
 */

/**
 * Strips the 'sc-domain:' prefix from a domain string for display.
 */
export function getDisplayDomain(domain: string): string {
  return domain.replace('sc-domain:', '');
}

/**
 * Strips protocol and sc-domain prefix to get a clean host for IndexNow.
 */
export function getIndexNowHost(domain: string): string {
  return domain
    .replace('sc-domain:', '')
    .replace('https://', '')
    .replace('http://', '')
    .split('/')[0];
}

/**
 * Constructs the full URL for the IndexNow key verification file.
 */
export function getIndexNowKeyLocation(site: { domain: string, indexNowKey: string | null, indexNowKeyLocation?: string | null }): string | null {
  if (!site.indexNowKey) return null;
  
  const displayDomain = getDisplayDomain(site.domain);
  const protocol = site.domain.startsWith('http') ? '' : 'https://';
  
  if (site.indexNowKeyLocation) {
    return site.indexNowKeyLocation;
  }
  
  return `${protocol}${displayDomain}/${site.indexNowKey}.txt`;
}
