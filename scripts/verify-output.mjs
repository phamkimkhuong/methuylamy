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
const books = JSON.parse(await readFile(new URL('../content/books.json', import.meta.url), 'utf8'))
const courses = JSON.parse(await readFile(new URL('../content/courses.json', import.meta.url), 'utf8'))
const html = await read('index.html')
const $ = load(html)
assert.equal($('html').attr('lang'), 'vi')
assert.equal($('h1').length, 1)
assert.equal($('h1').text().trim(), profile.name)
assert.ok($('main').text().includes(profile.description), 'Profile must exist in initial HTML')
for (const specialty of profile.specialties ?? []) assert.ok($('main').text().includes(specialty))
assert.equal($('link[rel="canonical"]').attr('href'), site.url)
assert.equal($('meta[name="description"]').attr('content'), profile.description)
assert.equal($('meta[name="robots"]').attr('content'), site.indexable ? 'index, follow' : 'noindex, nofollow')
assert.equal($('script[type="application/ld+json"]').length, 1)
const graph = JSON.parse($('head script[type="application/ld+json"]').text())['@graph']
const person = graph.find(node => node['@type'] === 'Person')
assert.equal(person.name, profile.name)
assert.equal(graph.find(node => node['@type'] === 'ProfilePage').mainEntity['@id'], person['@id'])
assert.equal(graph.filter(node => node['@type'] === 'Book').length, books.length)
assert.equal(graph.filter(node => node['@type'] === 'Course').length, courses.length)
for (const [id, items] of [['sach', books], ['khoa-hoc', courses], ['chung-chi', profile.credentials ?? []], ['kinh-nghiem', profile.experience ?? []]]) {
  assert.equal($(`[id="${id}"]`).length, items.length ? 1 : 0, `Optional section ${id}`)
}

const localAssets = []
$('script[src], link[href], img[src]').each((_, element) => {
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
  assert.ok($(element).attr('alt'))
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
console.log(`Verified ${site.environment} static artifact: SSR content, schema, SEO files, anchors, optional sections and ${new Set(localAssets).size} local assets.`)
