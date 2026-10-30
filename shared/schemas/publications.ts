import { z } from 'zod'

const text = z.string().trim().min(1)
const linkUrl = z.string().trim().refine(
  value => /^#[a-z0-9_-]+$/i.test(value) || (value.startsWith('https://') && URL.canParse(value)),
  'Must be an in-page anchor (#id) or an https:// URL'
).optional()

export const publicationsSchema = z.array(z.object({
  id: z.enum(['upcoming', 'resources']),
  designKey: z.enum(['book-1', 'book-2']),
  badge: text,
  headline: z.object({ primary: text, secondary: text }),
  description: text,
  mobileDescription: text,
  benefits: z.array(text),
  ctaText: text,
  mobileCtaText: text,
  image: text,
  ctaUrl: linkUrl,
}))

export type PublicationItem = z.infer<typeof publicationsSchema>[number]

