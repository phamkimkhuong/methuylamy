import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'cheerio'
import { resolveSiteSettings } from '../shared/utils/site.ts'

const root = fileURLToPath(new URL('../.output/public/', import.meta.url))
const read = path => readFile(resolve(root, path), 'utf8')
const site = resolveSiteSettings(process.env.PORTFOLIO_ENV, process.env.PORTFOLIO_SITE_URL)
const profile = JSON.parse(await readFile(new URL('../content/profiles/thanh-thuy.json', import.meta.url), 'utf8'))
const courseData = JSON.parse(await readFile(new URL('../content/courses.json', import.meta.url), 'utf8'))
const courses = courseData.filter(course => course.published === true)
const hero = JSON.parse(await readFile(new URL('../content/hero.json', import.meta.url), 'utf8'))
const faqs = JSON.parse(await readFile(new URL('../content/faqs.json', import.meta.url), 'utf8'))
const tiktok = JSON.parse(await readFile(new URL('../content/tiktok.json', import.meta.url), 'utf8'))
const html = await read('index.html')
const $ = load(html)
assert.equal($('html').attr('lang'), 'vi')
assert.equal($('h1').length, 1)
// Landing H1 uses Hero copy; the Person SEO identity is checked separately.
const normalize = value => value.replace(/\s+/g, ' ').trim()
assert.deepEqual($('#hero h1 > span').toArray().map(el => normalize($(el).text())), [hero.headline.primary, hero.headline.secondary].map(normalize))
assert.ok(normalize($('#hero').text()).includes(normalize(hero.description)), 'Hero copy must exist in initial HTML')
for (const badge of hero.badges) assert.ok($('#hero').text().includes(badge))
assert.equal($('link[rel="canonical"]').attr('href'), site.url)
assert.equal($('meta[name="description"]').attr('content'), profile.description)
assert.equal($('meta[name="robots"]').attr('content'), site.indexable ? 'index, follow' : 'noindex, nofollow')
assert.equal($('script[type="application/ld+json"]').length, 1)
const graph = JSON.parse($('head script[type="application/ld+json"]').text())['@graph']
const person = graph.find(node => node['@type'] === 'Person')
assert.equal(person.name, profile.name)
assert.equal(graph.find(node => node['@type'] === 'ProfilePage').mainEntity['@id'], person['@id'])
assert.equal(graph.filter(node => node['@type'] === 'Book').length, 0)
assert.equal(graph.filter(node => node['@type'] === 'Course').length, courses.length)
const expectedSections = [
  'navbar', 'hero', 'story', 'tiktok', 'course',
  'training', 'values', 'cooperation', 'process',
  'press', 'partners', 'contact', 'faq', 'footer'
]
for (const key of expectedSections) {
  if (key === 'course' && !courseData[0].published) {
    assert.equal($('[data-design-key="course"], #course, a[href="#course"]').length, 0, 'Unpublished course and its navigation must be absent from static HTML')
    continue
  }
  const element = $(`[data-design-key="${key}"], #${key}`)
  assert.ok(element.length >= 1, `Missing expected section: ${key}`)
}
const faqSchema = graph.find(node => node['@type'] === 'FAQPage')
assert.equal(faqSchema?.mainEntity.length, faqs.length)
for (const faq of faqs) {
  assert.ok($('#faq').text().includes(faq.question))
  assert.ok($('#faq').text().includes(faq.answer))
  assert.ok(faqSchema.mainEntity.some(item => item.name === faq.question && item.acceptedAnswer.text === faq.answer))
}
assert.equal($('#navbar .koc-logo').length, 1)
assert.equal($('#footer .koc-logo').length, 1)
assert.equal($('#navbar a.koc-button[href="#contact"]').length, 1)
assert.equal($('#navbar a.koc-button').attr('target'), undefined, 'In-page CTA must not open a new tab')
assert.equal($('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').length, 0)

const localAssets = []
$('script[src], link[href], img[src], image[href]').each((_, element) => {
  const path = $(element).attr('src') || $(element).attr('href')
  if (path?.startsWith('/') && !path.startsWith('//')) localAssets.push(path)
})
for (const path of new Set(localAssets)) {
  const diskPath = resolve(root, decodeURIComponent(path.split('?')[0]).replace(/^\//, ''))
  assert.ok(diskPath.startsWith(root.endsWith(sep) ? root : root + sep))
  assert.ok((await stat(diskPath)).size > 0, `Missing or empty asset: ${path}`)
}
$('img').each((_, element) => {
  assert.ok(Number($(element).attr('width')) > 0 && Number($(element).attr('height')) > 0, 'Images need intrinsic dimensions')
  assert.ok($(element).attr('alt') || $(element).attr('aria-hidden') === 'true' || $(element).parents('[aria-hidden="true"]').length > 0, 'Informative images need alt text')
})
$('a[href^="#"]').each((_, element) => {
  const target = $(element).attr('href').slice(1)
  assert.equal($(`[id="${target}"]`).length, 1, `Broken anchor: ${target}`)
})
assert.equal(/api\.figma\.com|figma\.com\/api\/mcp\/asset/.test(html), false)

const robots = await read('robots.txt')
const sitemap = load(await read('sitemap.xml'), { xml: true })
const llms = await read('llms.txt')
if (site.indexable) {
  assert.ok(robots.includes(`Sitemap: ${site.url}sitemap.xml`))
  assert.equal(sitemap('loc').text(), site.url)
  assert.ok(llms.includes(profile.name) && llms.includes(site.url))
} else {
  assert.equal(robots.includes('Sitemap:'), false)
  assert.equal(sitemap('loc').length, 0)
  assert.equal(llms.includes(profile.name), false)
}
const errorPage = load(await read('404.html'))
assert.ok(errorPage('meta[name="robots"]').attr('content')?.includes('noindex'))
assert.equal(errorPage('h1').text(), 'Không tìm thấy trang')
await assert.rejects(() => read('200.html'), { code: 'ENOENT' })
console.log(`Verified ${site.environment} static artifact: SSR content, schema, SEO files, anchors, local fonts and ${new Set(localAssets).size} local assets.`)

// TikTok content must be available without a client-side embed or API request.
assert.equal($('#tiktok .koc-tiktok__card').length, 1)
assert.equal($('#tiktok .koc-tiktok__video').length, tiktok.videos.length)
for (const [index, video] of tiktok.videos.entries()) {
  const anchor = $('#tiktok .koc-tiktok__video a').eq(index)
  assert.equal(anchor.attr('href'), video.url)
  assert.ok(anchor.attr('aria-label').includes(video.title))
  assert.equal(anchor.attr('target'), '_blank')
  assert.ok(anchor.attr('rel').includes('noopener'))
  assert.equal(anchor.find('img').attr('src'), video.thumbnail)
}
assert.equal($('#tiktok .koc-tiktok__follow').attr('href'), tiktok.url)
assert.equal($('#tiktok iframe').length, 0)
console.log('Verified TikTok SSR cards, labels, links and local thumbnails.')

// Course visibility is independent from whether the introduction video is ready.
if (courseData[0].published) {
  assert.equal($('#course').length, 1)
  assert.equal($('#navbar a[href="#course"]').length, 1)
  assert.equal($('#footer a[href="#course"]').length, 1)
  assert.equal($('#course .koc-course__cta').text().trim(), courseData[0].ctaText)
  assert.equal($('#course .koc-course__cta').attr('href'), courseData[0].ctaUrl)
  assert.equal($('#course .koc-course__play').is('[disabled]'), !courseData[0].videoSrc)
  assert.equal($('#course video').length, 0, 'Media is mounted only after user interaction')
  console.log('Verified published Course, navigation, CTA and missing-video state.')
}

// Informational sections must remain complete in SSR, without interaction or API requests.
const training = JSON.parse(await readFile(new URL('../content/training.json', import.meta.url), 'utf8'))
const values = JSON.parse(await readFile(new URL('../content/values.json', import.meta.url), 'utf8'))
for (const [id, data] of [['training', training], ['values', values]]) {
  assert.equal($('#' + id + ' h2').length, 1)
  assert.deepEqual($('#' + id + ' h2 > span').toArray().map(el => $(el).text()), [data.headline.primary, data.headline.secondary])
}
assert.equal($('#training .koc-training__photo').length, training.images.length)
assert.equal($('#training .koc-training__module').length, training.modules.length)
for (const item of training.modules) {
  assert.ok($('#training').text().includes(item.title) && $('#training').text().includes(item.description))
  assert.equal($('#training img[src="' + item.icon + '"]').length, 1)
}
assert.equal($('#values .koc-values__card').length, values.items.length)
for (const item of values.items) {
  const card = $('#values [data-pillar="' + item.id + '"]')
  if (item.desktopTitle) {
    assert.equal(card.find('.koc-values__mobile-title').text(), item.title)
    assert.equal(card.find('.koc-values__desktop-title').text(), item.desktopTitle)
  } else assert.equal(card.find('h3').text(), item.title)
  if (item.desktopImage) {
    assert.equal(card.find('source').attr('srcset'), item.desktopImage)
    assert.equal(card.find('source').attr('media'), '(min-width: 80rem)')
    assert.ok((await stat(resolve(root, item.desktopImage.slice(1)))).size > 0)
  }
  assert.equal(card.find('p').text(), item.description)
  assert.equal(card.find('.koc-values__photo img').attr('src'), item.image)
  assert.equal(card.find('.koc-values__icon img').attr('src'), item.icon)
}
console.log('Verified Training and Values SSR content, photos and original icons.')

const prenatal = JSON.parse(await readFile(new URL('../content/prenatal.json', import.meta.url), 'utf8'))
assert.equal($('#prenatal').length, 1)
assert.equal($('#prenatal .koc-prenatal__feature').length, prenatal.modules.length)
assert.equal($('#prenatal .koc-prenatal__photos img').length, 2)
assert.equal($('#prenatal .koc-prenatal__cta').attr('href'), prenatal.ctaUrl)
assert.equal($('#prenatal .koc-prenatal__cta').attr('rel'), 'noopener noreferrer')
assert.ok(normalize($('#course .koc-course__description').text()).includes(courseData[0].description))
console.log('Verified prenatal SSR, feature cards, photo slots and approved CTA.')

assert.equal($('#upcoming a.koc-publication__cta[href="#contact"]').length, 1)
assert.equal($('#upcoming a.koc-publication__cta').attr('target'), undefined, 'In-page CTA must not open a new tab')
assert.equal($('#upcoming button').length, 0)
assert.equal($('#upcoming li').length, 4)

assert.equal($('#resources button:disabled').length, 1)
assert.equal($('#resources a').length, 0)
assert.equal($('#resources li').length, 4)
console.log('Verified upcoming book CTA to contact form and resource library inactive state.')
