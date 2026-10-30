import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { storySchema } from '../shared/schemas/landing.ts'

test('existing story content remains valid without a signature; SVG dimensions retain precision', async () => {
  const current = JSON.parse(await readFile(new URL('../content/story.json', import.meta.url), 'utf8'))
  const { signature, ...legacy } = current
  assert.equal(storySchema.parse(legacy).signature, undefined)
  assert.deepEqual(storySchema.parse(current).signature, signature)
  assert.equal(storySchema.safeParse({ ...current, signature: { ...signature, height: 0 } }).success, false)
})
