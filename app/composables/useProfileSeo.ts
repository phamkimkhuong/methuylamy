import { courses, faqList, heroContent, profile } from '~~/shared/content'
import { createProfileGraph } from '~~/shared/utils/profile-schema'
import { serializeJsonLd } from '~~/shared/utils/site'

export function useProfileSeo() {
  const { url, indexable } = useRuntimeConfig().public.portfolio
  const title = profile.seoTitle || profile.brandName
  const ogImg = profile.ogImage || profile.portrait
  const image = ogImg ? new URL(ogImg.src, url).href : undefined
  useSeoMeta({
    title, description: profile.description,
    robots: indexable ? 'index, follow' : 'noindex, nofollow',
    ogTitle: title, ogDescription: profile.description, ogUrl: url,
    ogType: 'profile', ogLocale: 'vi_VN', ogSiteName: profile.brandName,
    themeColor: '#F48283',
    ...(image ? {
      ogImage: image,
      ogImageWidth: ogImg?.width,
      ogImageHeight: ogImg?.height,
      ogImageType: ogImg?.src.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      ogImageAlt: ogImg?.alt || profile.brandName,
      twitterImage: image,
    } : {}),
    twitterCard: 'summary_large_image',
    twitterTitle: title, twitterDescription: profile.description,
  })
  useHead({
    meta: [
      { name: 'geo.region', content: 'VN-HN' },
      { name: 'geo.placename', content: 'Hà Nội' },
      { name: 'geo.position', content: '21.028511;105.804817' },
      { name: 'ICBM', content: '21.028511, 105.804817' },
    ],
    link: [
      { rel: 'canonical', href: url },
      // LCP Image Preload for Core Web Vitals optimization
      {
        rel: 'preload',
        as: 'image',
        href: heroContent.portrait.src,
        fetchpriority: 'high',
      },
    ],
    script: [{
      key: 'profile-graph', type: 'application/ld+json', tagPosition: 'head',
      innerHTML: serializeJsonLd(createProfileGraph(profile, url, courses, faqList)),
    }],
  })
}
