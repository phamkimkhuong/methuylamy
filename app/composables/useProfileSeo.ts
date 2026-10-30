import { courses, faqList, heroContent, profile } from '~~/shared/content'
import { createProfileGraph } from '~~/shared/utils/profile-schema'
import { serializeJsonLd } from '~~/shared/utils/site'

export function useProfileSeo() {
  const { url, indexable } = useRuntimeConfig().public.portfolio
  const title = profile.brandName
  const image = profile.portrait ? new URL(profile.portrait.src, url).href : undefined
  useSeoMeta({
    title, description: profile.description,
    robots: indexable ? 'index, follow' : 'noindex, nofollow',
    ogTitle: title, ogDescription: profile.description, ogUrl: url,
    ogType: 'profile', ogLocale: 'vi_VN', ogSiteName: profile.brandName,
    ...(image ? { ogImage: image, twitterImage: image } : {}),
    twitterCard: image ? 'summary_large_image' : 'summary',
    twitterTitle: title, twitterDescription: profile.description,
  })
  useHead({
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
