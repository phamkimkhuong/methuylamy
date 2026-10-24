// Polyfill Set methods (ES2025) if running on Node < 22 (e.g. Node 20 local host)
if (!('difference' in Set.prototype)) {
  const S = Set.prototype as any
  S.difference = function (o: Iterable<any>) { const r = new Set(this); for (const e of o) r.delete(e); return r }
  S.intersection = function (o: Iterable<any>) { const r = new Set(); for (const e of o) if (this.has(e)) r.add(e); return r }
  S.union = function (o: Iterable<any>) { const r = new Set(this); for (const e of o) r.add(e); return r }
  S.isSubsetOf = function (o: any) { for (const e of this) if (!o.has(e)) return false; return true }
  S.isSupersetOf = function (o: any) { for (const e of o) if (!this.has(e)) return false; return true }
  S.isDisjointFrom = function (o: any) { for (const e of this) if (o.has(e)) return false; return true }
  S.symmetricDifference = function (o: Iterable<any>) { const r = new Set(this); for (const e of o) { if (r.has(e)) r.delete(e); else r.add(e) }; return r }
}

import { profile } from './shared/content'
import { resolveSiteSettings } from './shared/utils/site'
import tailwindcss from '@tailwindcss/vite'

const site = resolveSiteSettings(process.env.PORTFOLIO_ENV, process.env.PORTFOLIO_SITE_URL)

export default defineNuxtConfig({
  compatibilityDate: '2026-10-02',
  ssr: true,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  typescript: { strict: true },
  runtimeConfig: { public: { portfolio: site } },
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: `${profile.brandName} — ${profile.name}`,
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Manrope:wght@400..700&display=swap',
        },
      ],
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  nitro: {
    preset: 'static',
    compressPublicAssets: true,
    hooks: {
      'prerender:generate'(route) {
        // Keep public/404.html usable without JS. Do not ship Nuxt's empty SPA
        // fallback documents or let a static host serve unknown URLs as 200.
        if (route.route === '/200.html' || route.route === '/404.html') route.skip = true
      },
    },
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: ['/', '/robots.txt', '/sitemap.xml', '/llms.txt'],
    },
  },
})
