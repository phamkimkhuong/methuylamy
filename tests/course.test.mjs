import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { courseSchema } from '../shared/schemas/landing.ts'

const data = JSON.parse(await readFile(new URL('../content/courses.json', import.meta.url), 'utf8'))[0]
test('unpublished and legacy course data stay valid without a video', () => {
  const { videoSrc: _v, ...withoutVideo } = data
  assert.equal(courseSchema.parse({ ...withoutVideo, published: false }).published, false)
  assert.equal(courseSchema.parse({ ...withoutVideo, published: true }).videoSrc, undefined)
  const { published: _published, ...legacy } = withoutVideo
  assert.equal(courseSchema.parse(legacy).published, false)
  assert.equal(courseSchema.parse(data).videoSrc, data.videoSrc)
})
test('optional video source rejects unsafe or malformed URLs', () => {
  for (const videoSrc of ['', 'javascript:alert(1)', '//example.com/video.mp4', 'http://example.com/video.mp4', 'https://']) {
    assert.equal(courseSchema.safeParse({ ...data, published: true, videoSrc }).success, false)
  }
  for (const videoSrc of ['/videos/course.mp4', 'https://example.com/course.mp4']) {
    assert.equal(courseSchema.parse({ ...data, published: true, videoSrc }).videoSrc, videoSrc)
  }
})
