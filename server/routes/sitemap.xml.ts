import { escapeXml } from '../../shared/utils/site'

export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.portfolio
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.indexable ? `\n  <url><loc>${escapeXml(site.url)}</loc></url>\n` : ''}</urlset>\n`
})
