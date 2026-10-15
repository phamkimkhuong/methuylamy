import assert from 'node:assert/strict'
import test from 'node:test'
import { personProfileSchema, resourceListSchema } from '../shared/schemas/profile.ts'
import { createProfileGraph } from '../shared/utils/profile-schema.ts'
import { resolveSiteSettings, serializeJsonLd } from '../shared/utils/site.ts'

const minimalProfile = { slug: 'example', name: 'Example', brandName: 'Profile', jobTitle: 'Example role', description: 'Example description' }

test('preview is non-indexable by default; invalid production origins fail closed', () => {
  assert.equal(resolveSiteSettings().indexable, false)
  assert.equal(resolveSiteSettings('production', 'https://methuylamy.vn').url, 'https://methuylamy.vn/')
  for (const url of [undefined, 'http://methuylamy.vn', 'https://example.com', 'https://methuylamy.vn:3103', 'https://methuylamy.vn/test', 'https://user:pass@methuylamy.vn', 'https://methuylamy.vn/?test=1']) {
    assert.throws(() => resolveSiteSettings('production', url))
  }
  assert.throws(() => resolveSiteSettings('prod'))
})

test('a future staff profile may omit all optional sections without fake schema entries', () => {
  const profile = personProfileSchema.parse(minimalProfile)
  const graph = createProfileGraph(profile, 'https://example.com/', [], [])['@graph']
  assert.deepEqual(graph.map(node => node['@type']), ['ProfilePage', 'Person'])
  assert.deepEqual(profile.credentials, [])
  assert.equal('image' in graph[1], false)
  assert.equal('worksFor' in graph[1], false)
})

test('reject empty identity, unsafe links and duplicate resource slugs', () => {
  assert.equal(personProfileSchema.safeParse({ ...minimalProfile, name: ' ' }).success, false)
  assert.equal(personProfileSchema.safeParse({ ...minimalProfile, links: [{ label: 'Unsafe', url: 'javascript:alert(1)' }] }).success, false)
  const resource = { slug: 'same', title: 'Example', description: 'Example', url: 'https://example.com/' }
  assert.equal(resourceListSchema.safeParse([resource, resource]).success, false)
})

test('editorial text cannot terminate a JSON-LD script', () => {
  const input = { name: '</script><script>alert(1)</script>\u2028' }
  const serialized = serializeJsonLd(input)
  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), input)
})
