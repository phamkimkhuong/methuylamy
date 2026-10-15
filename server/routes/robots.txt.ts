export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.portfolio
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  // Allow staging crawling so crawlers can read noindex in HTML. Authentication
  // and X-Robots-Tag at the staging host are additional deployment protections.
  return site.indexable
    ? `User-agent: *\nAllow: /\nSitemap: ${site.url}sitemap.xml\n`
    : 'User-agent: *\nAllow: /\n# Staging: HTML pages carry noindex; no URLs submitted for indexing.\n'
})
