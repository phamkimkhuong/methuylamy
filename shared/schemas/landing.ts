import { z } from 'zod'

const text = z.string().trim().min(1)
const httpsUrl = z.string().trim().url()

export const imageSchema = z.object({
  src: text,
  alt: text,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export const headlineSchema = z.object({
  primary: text,
  secondary: text,
})

export const heroSchema = z.object({
  eyebrow: text,
  headline: headlineSchema,
  description: text,
  badges: z.array(text),
  statistics: z.array(
    z.object({
      value: text,
      label: text,
    }),
  ),
  portrait: imageSchema,
})

export const storySchema = z.object({
  // SVG export dimensions may be fractional; legacy story data can omit a signature.
  signature: imageSchema.extend({ width: z.number().positive(), height: z.number().positive() }).optional(),
  headline: headlineSchema,
  lead: text,
  content: text,
  image: imageSchema,
})

export const tiktokVideoSchema = z.object({
  id: text,
  title: text,
  thumbnail: text,
  url: httpsUrl,
})

export const tiktokSchema = z.object({
  headline: headlineSchema,
  handle: text,
  name: text,
  avatar: text,
  url: httpsUrl,
  stats: z.object({
    following: text,
    followers: text,
    likes: text,
  }),
  videos: z.array(tiktokVideoSchema),
})

export const courseSchema = z.object({
  published: z.boolean().default(false),
  // Direct media source for the native player; page/embed URLs are not video files.
  videoSrc: z.union([
    text.regex(/^\/(?!\/)[^\s\\]+$/, 'Use a local /path'),
    z.string().trim().url().refine(value => value.startsWith('https://'), 'Video URL must use HTTPS'),
  ]).optional(),
  headline: headlineSchema,
  description: text,
  coverImage: text,
  ctaText: text,
  ctaUrl: httpsUrl,
})

export const trainingModuleSchema = z.object({
  desktopDescription: text.optional(),
  id: text,
  icon: text,
  title: text,
  description: text,
})

export const trainingSchema = z.object({
  headline: headlineSchema,
  description: text,
  modules: z.array(trainingModuleSchema),
  images: z.array(imageSchema),
})

export const valuePillarSchema = z.object({
  desktopTitle: text.optional(),
  desktopImage: text.optional(),
  id: text,
  title: text,
  description: text,
  image: text,
  icon: text,
})

export const valuesSchema = z.object({
  headline: headlineSchema,
  items: z.array(valuePillarSchema),
})

export const cooperationModelSchema = z.object({
  id: text,
  title: text,
  description: text,
  icon: text,
})

export const cooperationSchema = z.object({
  eyebrow: text,
  headline: headlineSchema,
  image: text,
  models: z.array(cooperationModelSchema),
})

export const processStepSchema = z.object({
  step: text,
  title: text,
  description: text,
})

export const processSchema = z.object({
  headline: headlineSchema,
  mascot: text,
  steps: z.array(processStepSchema),
})

export const pressArticleSchema = z.object({
  id: text,
  title: text,
  excerpt: text,
  source: text,
  image: text,
  url: httpsUrl,
})

export const pressListSchema = z.array(pressArticleSchema)

export const partnerItemSchema = z.object({
  id: text,
  name: text,
  logo: text,
  website: httpsUrl.optional(),
})

export const partnerListSchema = z.array(partnerItemSchema)

export const faqItemSchema = z.object({
  question: text,
  answer: text,
})

export const faqListSchema = z.array(faqItemSchema)

export const contactSchema = z.object({
  eyebrow: text,
  headline: headlineSchema,
  contactInfo: z.object({
    title: text,
    description: text,
    email: text.email(),
    hotline: text,
    workingHours: text,
  }),
  serviceOptions: z.array(text),
})

export type HeroContent = z.infer<typeof heroSchema>
export type StoryContent = z.infer<typeof storySchema>
export type TiktokContent = z.infer<typeof tiktokSchema>
export type CourseContent = z.infer<typeof courseSchema>
export type TrainingContent = z.infer<typeof trainingSchema>
export type ValuesContent = z.infer<typeof valuesSchema>
export type CooperationContent = z.infer<typeof cooperationSchema>
export type ProcessContent = z.infer<typeof processSchema>
export type PressArticle = z.infer<typeof pressArticleSchema>
export type PartnerItem = z.infer<typeof partnerItemSchema>
export type FaqItem = z.infer<typeof faqItemSchema>
export type ContactContent = z.infer<typeof contactSchema>

export const prenatalSchema = trainingSchema.extend({
  eyebrow: text,
  ctaText: text,
  ctaUrl: z.string().url().refine(value => value.startsWith('https://'), 'Use HTTPS').optional(),
})
