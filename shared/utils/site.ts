export function resolveSiteSettings(environment?: string, rawUrl?: string) {
  const mode = environment || 'staging'
  if (!['staging', 'production'].includes(mode)) {
    throw new Error('PORTFOLIO_ENV must be staging or production')
  }
  const indexable = mode === 'production'
  if (indexable && !rawUrl) throw new Error('Production requires PORTFOLIO_SITE_URL')
  const url = new URL(rawUrl || 'http://localhost:3103')
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PORTFOLIO_SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment')
  }
  if (indexable && url.origin !== 'https://methuylamy.vn') {
    throw new Error('Production canonical origin must be https://methuylamy.vn')
  }
  return { url: `${url.origin}/`, indexable, environment: mode }
}

export function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)
}

// Prevent a content string containing </script> from escaping the JSON-LD tag.
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}
