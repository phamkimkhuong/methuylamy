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

import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { profile } from './shared/content'
import { resolveSiteSettings } from './shared/utils/site'
import tailwindcss from '@tailwindcss/vite'

const site = resolveSiteSettings(process.env.PORTFOLIO_ENV, process.env.PORTFOLIO_SITE_URL)
const publicDir = fileURLToPath(new URL('./public', import.meta.url))
const fileHashCache = new Map<string, string>()

function sanitizePath(rawPath: string): string {
  const end = rawPath.search(/[?#]/)
  return end === -1 ? rawPath : rawPath.slice(0, end)
}

function getAssetHash(publicPath: string): string {
  const cleanPath = sanitizePath(publicPath)
  if (!cleanPath) return ''
  const cached = fileHashCache.get(cleanPath)
  if (cached) return cached
  const diskPath = resolve(publicDir, cleanPath.replace(/^\//, ''))
  if (existsSync(diskPath)) {
    const hash = createHash('md5').update(readFileSync(diskPath)).digest('hex').slice(0, 8)
    fileHashCache.set(cleanPath, hash)
    return hash
  }
  return ''
}

// Version source URLs before both SSR and client compilation. Rewriting only
// prerendered HTML leaves Vue's client data pointing at a different cached asset.
function versionAssetUrl(path: string): string {
  const hash = getAssetHash(path)
  if (!hash) return path
  const url = new URL(path, 'https://assets.invalid')
  url.searchParams.set('v', hash)
  return url.pathname + url.search + url.hash
}

function versionAssetSource(source: string): string {
  return source
    .replace(/(["'])(\/images\/[^"'\s)]+)\1/g,
      (_match: string, quote: string, path: string) => quote + versionAssetUrl(path) + quote)
    .replace(/url\((\/images\/[^\s)'"()]+)\)/g,
      (_match: string, path: string) => 'url(' + versionAssetUrl(path) + ')')
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-02',
  ssr: true,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      {
        name: 'portfolio-public-asset-versions',
        enforce: 'pre',
        apply: 'build',
        transform(source, id) {
          const path = id.split('?')[0]!.replace(/\\/g, '/')
          const root = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/')
          if (!['app/', 'content/', 'shared/'].some(dir => path.startsWith(root + dir))) return
          if (!/\.(vue|json|ts|js|css)$/.test(path)) return
          const code = versionAssetSource(source)
          return code === source ? undefined : { code, map: null }
        },
      },
      tailwindcss(),
    ],
  },
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      portfolio: site,
      leadApiUrl: process.env.LEAD_API_URL || 'https://admin.vanphuccare.vn/api/public/leads',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '0x4AAAAAAFfV0g-yO07UT7yb',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: profile.seoTitle || profile.brandName,
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#F48283' },
      ],
    },
  },
  nitro: {
    preset: 'static',
    compressPublicAssets: true,
    routeRules: {
      '/images/**': {
        headers: {
          'cache-control': 'public, max-age=0, must-revalidate',
        },
      },
      '/sitemap.xml': {
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate',
        },
      },
      '/robots.txt': {
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate',
        },
      },
    },
    hooks: {
      'prerender:generate'(route) {
        // Keep public/404.html usable without JS. Do not ship Nuxt's empty SPA
        // fallback documents or let a static host serve unknown URLs as 200.
        if (route.route === '/200.html' || route.route === '/404.html') route.skip = true
        // Use the same versioning as the client bundle for Nitro's final HTML.
        if (typeof route.contents === 'string' && route.fileName?.endsWith('.html')) {
          route.contents = versionAssetSource(route.contents)
        }


      },
    },
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: ['/', '/robots.txt', '/sitemap.xml', '/llms.txt'],
    },
  },
})
