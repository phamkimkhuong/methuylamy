import { z } from 'zod'

const text = z.string().trim().min(1)
const httpsUrl = z.url().refine(value => value.startsWith('https://'), 'URL must use HTTPS')
export const imageSchema = z.object({
  src: text.refine(value => /^\/(?!\/)/.test(value) || value.startsWith('https://'), 'Use a local /path or HTTPS image'),
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})
const linkSchema = z.object({ label: text, url: httpsUrl })
const entrySchema = z.object({ title: text, description: text.optional() })

export const personProfileSchema = z.object({
  slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: text,
  brandName: text,
  alternateNames: z.array(text).default([]),
  jobTitle: text,
  description: text,
  biography: z.array(text).default([]),
  portrait: imageSchema.optional(),
  specialties: z.array(text).default([]),
  organization: z.object({ name: text, url: httpsUrl, entityId: httpsUrl }).optional(),
  socialLinks: z.array(linkSchema).default([]),
  links: z.array(linkSchema).default([]),
  experience: z.array(entrySchema).default([]),
  credentials: z.array(entrySchema).default([]),
})

export const resourceSchema = z.object({
  slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  description: text,
  url: httpsUrl,
  image: imageSchema.optional(),
})

export const resourceListSchema = z.array(resourceSchema).refine(
  items => new Set(items.map(item => item.slug)).size === items.length,
  'Resource slugs must be unique',
)

export type PersonProfile = z.infer<typeof personProfileSchema>
export type ProfileImage = z.infer<typeof imageSchema>
export type ProfileResource = z.infer<typeof resourceSchema>
