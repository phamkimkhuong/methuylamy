import profileData from '../content/profiles/thanh-thuy.json'
import booksData from '../content/books.json'
import coursesData from '../content/courses.json'
import { personProfileSchema, resourceListSchema } from './schemas/profile'

// Fail the build on invalid content; never publish a partially empty profile.
export const profile = personProfileSchema.parse(profileData)
export const books = resourceListSchema.parse(booksData)
export const courses = resourceListSchema.parse(coursesData)
