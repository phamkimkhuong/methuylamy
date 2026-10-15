import { books, courses, profile } from '../../shared/content'

export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.portfolio
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  if (!site.indexable) return '# Preview\n\nThis preview is not intended for indexing.\n'
  return [
    `# ${profile.brandName}`, '',
    `> ${profile.name} — ${profile.jobTitle}. ${profile.description}`, '',
    ...profile.biography, '',
    '## Hồ sơ', `- [${profile.name}](${site.url})`, '',
    ...(profile.specialties.length ? ['## Chuyên môn', ...profile.specialties.map(item => `- ${item}`), ''] : []),
    '## Liên kết',
    ...[...profile.socialLinks, ...profile.links].map(link => `- [${link.label}](${link.url})`),
    ...(books.length ? ['', '## Sách & tài liệu', ...books.map(item => `- [${item.title}](${item.url}): ${item.description}`)] : []),
    ...(courses.length ? ['', '## Khóa học', ...courses.map(item => `- [${item.title}](${item.url}): ${item.description}`)] : []),
    '',
  ].join('\n')
})
