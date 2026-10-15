import { profile } from './shared/content'
import { resolveSiteSettings } from './shared/utils/site'

const site = resolveSiteSettings(process.env.PORTFOLIO_ENV, process.env.PORTFOLIO_SITE_URL)

export default defineNuxtConfig({
  compatibilityDate: '2026-10-02',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: { cssPath: '~/assets/css/main.css', viewer: false },
  typescript: { strict: true },
  runtimeConfig: { public: { portfolio: site } },
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: `${profile.brandName} — ${profile.name}`,
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
