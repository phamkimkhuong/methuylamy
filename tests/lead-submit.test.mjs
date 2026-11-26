import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { ref } from 'vue'
import { useLeadSubmit } from '../app/composables/useLeadSubmit.ts'

test('useLeadSubmit sends note as note (not address) and validates fieldErrors.note', async (t) => {
  const prevRef = globalThis.ref
  const prevRuntimeConfig = globalThis.useRuntimeConfig
  const prevFetch = globalThis.fetch

  const requests = []
  globalThis.ref = ref
  globalThis.useRuntimeConfig = () => ({ public: { leadApiUrl: 'https://admin.vanphuccare.vn/api/public/leads' } })
  globalThis.fetch = async (url, options) => {
    requests.push({ url, body: JSON.parse(String(options.body)) })
    return {
      ok: true,
      status: 200,
      headers: new Headers(),
      async json() {
        return { status: true, message: 'OK', data: { leadId: 'lead_1', eventId: 'evt_1' } }
      },
    }
  }

  t.after(() => {
    globalThis.ref = prevRef
    globalThis.useRuntimeConfig = prevRuntimeConfig
    globalThis.fetch = prevFetch
  })

  const { submitLead, fieldErrors, validate } = useLeadSubmit()

  assert.equal(validate({ fullName: 'Linh', phone: '0393842932', note: 'a'.repeat(501) }), false)
  assert.ok(fieldErrors.value.note)
  assert.equal(fieldErrors.value.address, undefined)

  const ok = await submitLead({
    fullName: 'Linh',
    phone: '0393842932',
    email: 'nhulinh@gmail.com',
    note: '  test   send lead  ',
    captchaToken: 'tok_123',
  })

  assert.equal(ok, true)
  assert.equal(requests.length, 1)
  assert.equal(requests[0].body.note, 'test send lead')
  assert.equal(requests[0].body.address, undefined)

  globalThis.fetch = async () => ({
    ok: false,
    status: 422,
    headers: new Headers(),
    async json() {
      return {
        status: false,
        message: 'Invalid',
        error: { code: 'VALIDATION_ERROR', message: 'Invalid', fields: { note: 'Ghi chú không hợp lệ' } },
      }
    },
  })

  const rejected = await submitLead({
    fullName: 'Linh',
    phone: '0393842932',
    note: 'valid note',
    captchaToken: 'tok_123',
  })
  assert.equal(rejected, false)
  assert.equal(fieldErrors.value.note, 'Ghi chú không hợp lệ')
})

test('SectionContact maps form.note to submitLead note and binds fieldErrors.note', async () => {
  const source = await readFile(new URL('../app/components/sections/SectionContact.vue', import.meta.url), 'utf8')
  assert.match(source, /note:\s*form\.note/)
  assert.doesNotMatch(source, /address:\s*form\.note/)
  assert.match(source, /fieldErrors\.note/)
  assert.doesNotMatch(source, /!!fieldErrors\.address/)
})
