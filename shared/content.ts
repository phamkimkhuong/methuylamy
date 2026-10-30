import publicationData from '../content/publications.json'
import { publicationsSchema } from './schemas/publications'
import profileData from '../content/profiles/thanh-thuy.json'
import heroData from '../content/hero.json'
import storyData from '../content/story.json'
import tiktokData from '../content/tiktok.json'
import coursesData from '../content/courses.json'
import trainingData from '../content/training.json'
import valuesData from '../content/values.json'
import cooperationData from '../content/cooperation.json'
import processData from '../content/process.json'
import pressData from '../content/press.json'
import partnersData from '../content/partners.json'
import faqsData from '../content/faqs.json'
import contactData from '../content/contact.json'

import { personProfileSchema, resourceListSchema } from './schemas/profile'
import {
  heroSchema,
  storySchema,
  tiktokSchema,
  courseSchema,
  trainingSchema,
  valuesSchema,
  cooperationSchema,
  processSchema,
  pressListSchema,
  partnerListSchema,
  faqListSchema,
  contactSchema,
} from './schemas/landing'

// Fail the build immediately on invalid content; never publish corrupted data.
export const profile = personProfileSchema.parse(profileData)
export const courses = resourceListSchema.parse(coursesData).filter((_, index) => coursesData[index]?.published === true)

// Landing Section Contents (Strictly validated)
export const heroContent = heroSchema.parse(heroData)
export const storyContent = storySchema.parse(storyData)
export const tiktokContent = tiktokSchema.parse(tiktokData)
export const courseContent = courseSchema.parse(coursesData[0])
export const trainingContent = trainingSchema.parse(trainingData)
export const valuesContent = valuesSchema.parse(valuesData)
export const cooperationContent = cooperationSchema.parse(cooperationData)
export const processContent = processSchema.parse(processData)
export const pressList = pressListSchema.parse(pressData)
export const partnerList = partnerListSchema.parse(partnersData)
export const faqList = faqListSchema.parse(faqsData)
export const contactContent = contactSchema.parse(contactData)

import prenatalData from '../content/prenatal.json'
import { prenatalSchema } from './schemas/landing'
export const prenatalContent = prenatalSchema.parse(prenatalData)

export const publications = publicationsSchema.parse(publicationData)
