import type { PersonProfile, ProfileResource } from '../schemas/profile'

export interface FaqItem {
  question: string
  answer: string
}

export function createProfileGraph(
  profile: PersonProfile,
  url: string,
  courses: ProfileResource[],
  faqs: FaqItem[] = []
) {
  const personId = `${url}#person`
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    alternateName: profile.alternateNames,
    jobTitle: profile.jobTitle,
    description: profile.description,
    url,
    ...(profile.portrait ? { image: new URL(profile.portrait.src, url).href } : {}),
    ...(profile.specialties.length ? { knowsAbout: profile.specialties } : {}),
    ...(profile.socialLinks.length ? { sameAs: profile.socialLinks.map(link => link.url) } : {}),
    ...(profile.organization ? { worksFor: { '@id': profile.organization.entityId } } : {}),
    ...(profile.credentials?.length ? {
      hasCredential: profile.credentials.map(c => ({
        '@type': 'EducationalOccupationalCredential',
        name: c.title,
        ...(c.description ? { description: c.description } : {}),
      })),
    } : {}),
    ...(profile.experience?.length ? {
      hasOccupation: profile.experience.map(e => ({
        '@type': 'Occupation',
        name: e.title,
        ...(e.description ? { description: e.description } : {}),
      })),
    } : {}),
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage', '@id': `${url}#profile`, url,
        name: profile.brandName, inLanguage: 'vi-VN',
        mainEntity: { '@id': personId },
      },
      person,
      ...(profile.organization ? [{
        '@type': 'Organization', '@id': profile.organization.entityId,
        name: profile.organization.name, url: profile.organization.url,
      }] : []),
      ...courses.map(course => ({
        '@type': 'Course', '@id': `${url}#course-${course.slug}`,
        name: course.title, description: course.description, url: course.url,
      })),
      ...(faqs.length ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }] : []),
    ],
  }
}
