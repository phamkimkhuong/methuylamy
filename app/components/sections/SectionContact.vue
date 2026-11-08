<script setup lang="ts">
import { contactContent } from '~~/shared/content'
import { designAttrs } from '~~/shared/design'
import { useLeadSubmit } from '~~/app/composables/useLeadSubmit'

const props = defineProps<{ content?: typeof contactContent }>()
const data = computed(() => props.content ?? contactContent)

const config = useRuntimeConfig()
const siteKey = (config.public.turnstileSiteKey as string) || ''

const form = reactive({ fullName: '', phone: '', email: '', note: '' })
const {
  isLoading,
  fieldErrors,
  generalError,
  submitLead,
} = useLeadSubmit()

const turnstileContainerRef = ref<HTMLElement | null>(null)
const turnstileWidgetId = ref<string | null>(null)
const turnstileToken = ref<string>('')

// Tải Cloudflare Turnstile script
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
      defer: true,
    },
  ],
})

function renderTurnstile() {
  if (typeof window === 'undefined') return
  const turnstile = (window as any).turnstile
  if (!turnstile || !turnstileContainerRef.value || !siteKey) return
  if (turnstileWidgetId.value) return

  try {
    turnstileWidgetId.value = turnstile.render(turnstileContainerRef.value, {
      sitekey: siteKey,
      action: 'lead_submit',
      theme: 'light',
      callback: (token: string) => {
        turnstileToken.value = token
      },
      'expired-callback': () => {
        turnstileToken.value = ''
      },
      'error-callback': () => {
        turnstileToken.value = ''
      },
    })
  } catch {
    // Dự phòng khi Turnstile gặp lỗi môi trường
  }
}

function resetTurnstile() {
  turnstileToken.value = ''
  if (turnstileWidgetId.value && typeof window !== 'undefined' && (window as any).turnstile?.reset) {
    try {
      (window as any).turnstile.reset(turnstileWidgetId.value)
    } catch {
      // ignore
    }
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if ((window as any).turnstile) {
    renderTurnstile()
  } else {
    turnstilePoll = setInterval(() => {
      if ((window as any).turnstile) {
        clearInterval(turnstilePoll)
        renderTurnstile()
      }
    }, 150)
    turnstileDeadline = setTimeout(() => clearInterval(turnstilePoll), 10000)
  }
})

onBeforeUnmount(() => {
  disposed = true
  clearInterval(turnstilePoll)
  clearTimeout(turnstileDeadline)
  closeResult()
  if (turnstileWidgetId.value && typeof window !== 'undefined' && (window as any).turnstile?.remove) {
    try {
      (window as any).turnstile.remove(turnstileWidgetId.value)
    } catch {
      // ignore
    }
  }
})

const resultDialog = ref<HTMLDialogElement | null>(null)
const submitButton = ref<HTMLButtonElement | null>(null)
const resultKind = ref<'success' | 'error'>('success')
const resultMessage = ref('')
let previousBodyOverflow = ''
let dialogLocked = false
let disposed = false
let turnstilePoll: ReturnType<typeof setInterval> | undefined
let turnstileDeadline: ReturnType<typeof setTimeout> | undefined
function closeResult() {
  resultDialog.value?.close()
  if (dialogLocked) {
    document.body.style.overflow = previousBodyOverflow
    if (!disposed) submitButton.value?.focus({ preventScroll: true })
  }
  dialogLocked = false
}
function onDialogClick(event: MouseEvent) {
  if (!resultDialog.value) return
  const rect = resultDialog.value.getBoundingClientRect()
  const isInside = (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  )
  if (!isInside) {
    closeResult()
  }
}
async function openResult(kind: 'success' | 'error', message: string) {
  if (disposed) return
  resultKind.value = kind
  resultMessage.value = message
  await nextTick()
  if (disposed || !resultDialog.value) return
  previousBodyOverflow = document.body.style.overflow
  dialogLocked = true
  document.body.style.overflow = 'hidden'
  resultDialog.value.showModal()
}

const fields = [
  { key: 'fullName', label: 'Họ và tên', type: 'text', autocomplete: 'name', placeholder: 'Nguyễn Như Linh', max: 120 },
  { key: 'phone', label: 'Số điện thoại', type: 'tel', autocomplete: 'tel', placeholder: '0345678***', max: 10 },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'Email của bạn', max: 254 },
] as const

async function submit() {
  if (isLoading.value) return
  if (siteKey && !turnstileToken.value && form.fullName.trim().length >= 2 && /^0[35789]\d{8}$/.test(form.phone.trim())) {
    await openResult('error', 'Vui lòng hoàn tất xác minh chống spam trước khi gửi thông tin.')
    return
  }
  const success = await submitLead({
    fullName: form.fullName,
    phone: form.phone,
    email: form.email,
    address: form.note,
    captchaToken: turnstileToken.value,
  })

  if (disposed) return
  if (success) {
    form.fullName = ''
    form.phone = ''
    form.email = ''
    form.note = ''
    await openResult('success', 'Cảm ơn Ba/Mẹ đã tin tưởng và đăng ký tư vấn cùng Mẹ Thủy Làm Y. Bộ phận dịch vụ khách hàng sẽ liên hệ lại trong thời gian sớm nhất.')
  } else if (generalError.value) {
    await openResult('error', generalError.value)
  } else {
    const field = Object.keys(fieldErrors.value)[0]
    await nextTick()
    document.getElementById(field === 'address' ? 'contact-note' : 'contact-' + field)?.focus()
  }
  resetTurnstile()
}
</script>

<template>
  <section id="contact" v-bind="designAttrs('contact')" class="koc-contact" aria-labelledby="contact-heading">
    <BaseContainer class="contact-layout">
      <div class="contact-badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{ data.eyebrow }}</div>
      <h2 id="contact-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>Hành Trình Nuôi Con <span class="koc-mobile-break"></span>Hạnh Phúc</span></h2>
      <div class="contact-columns">
        <div class="contact-form">
          <form class="contact-form-inner" :aria-busy="isLoading" novalidate @submit.prevent="submit">
            <div class="contact-fields">
              <div v-for="field in fields" :key="field.key" class="contact-field" :class="{ 'contact-field--wide': field.key === 'email' }">
                <label :for="'contact-'+field.key"><span aria-hidden="true">*</span> {{ field.label }}</label>
                <input
                  :id="'contact-'+field.key"
                  v-model="form[field.key]"
                  :name="field.key"
                  :type="field.type"
                  :autocomplete="field.autocomplete"
                  :placeholder="field.placeholder"
                  :maxlength="field.max"
                  :disabled="isLoading"
                  required
                  :aria-invalid="!!fieldErrors[field.key]"
                  :aria-describedby="fieldErrors[field.key] ? 'contact-error-'+field.key : undefined"
                  @input="delete fieldErrors[field.key]"
                />
                <p v-if="fieldErrors[field.key]" :id="'contact-error-'+field.key" class="contact-error">{{ fieldErrors[field.key] }}</p>
              </div>
              <div class="contact-field contact-field--wide">
                <label for="contact-note">Ghi chú</label>
                <textarea
                  id="contact-note"
                  v-model="form.note"
                  name="note"
                  rows="1"
                  maxlength="500"
                  :disabled="isLoading"
                  placeholder="Cho chúng tôi biết thêm về nhu cầu của bạn!"
                  :aria-invalid="!!fieldErrors.address"
                  :aria-describedby="fieldErrors.address ? 'contact-error-note' : undefined"
                  @input="delete fieldErrors.address"
                />
                <p v-if="fieldErrors.address" id="contact-error-note" class="contact-error">{{ fieldErrors.address }}</p>
              </div>
            </div>

            <!-- Khung Cloudflare Turnstile CAPTCHA -->
            <div v-if="siteKey" ref="turnstileContainerRef" class="contact-turnstile" />

            <!-- Nút gửi kèm trạng thái Loading -->
            <button ref="submitButton" class="contact-submit" type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="contact-spinner" aria-hidden="true" />
              <span role="status" aria-live="polite">{{ isLoading ? 'Đang gửi thông tin...' : 'Gửi yêu cầu tư vấn' }}</span>
            </button>
          </form>
        </div>

        <aside class="contact-info" aria-label="Kênh liên hệ">
          <h3>{{ data.contactInfo.title }}</h3>
          <p class="contact-description">{{ data.contactInfo.description }}</p>
          <div class="contact-info-group"><h4>Liên hệ</h4><p>Email: <a :href="'mailto:'+data.contactInfo.email">{{ data.contactInfo.email }}</a><br />Hotline: <a :href="'tel:'+data.contactInfo.hotline.replace(/[^+0-9]/g,'')">{{ data.contactInfo.hotline }}</a></p></div>
          <div class="contact-info-group"><h4>Giờ làm việc</h4><p class="contact-hours">{{ data.contactInfo.workingHours }}</p></div>
        </aside>
      </div>
    </BaseContainer>
    <ClientOnly>
    <Teleport to="body">
      <dialog ref="resultDialog" class="lead-result" :class="{ 'lead-result--error': resultKind === 'error' }" aria-labelledby="lead-result-title" aria-describedby="lead-result-message" @click="onDialogClick" @close="closeResult" @cancel.prevent="closeResult">
        <button class="lead-result__close" type="button" aria-label="Đóng thông báo" autofocus @click="closeResult"><span aria-hidden="true">×</span></button>
        <div v-if="resultKind === 'success'" class="lead-result__art" aria-hidden="true">
          <img src="/images/contact/register-mascot.webp" width="160" height="160" alt="" />
          <img class="lead-result__check" src="/images/contact/register-check.png" width="64" height="64" alt="" />
        </div>
        <div v-else class="lead-result__error-icon" aria-hidden="true">!</div>
        <h2 id="lead-result-title">{{ resultKind === 'success' ? 'Đăng ký thành công' : 'Chưa thể gửi đăng ký' }}</h2>
        <p id="lead-result-message">{{ resultMessage }}</p>
        <p v-if="resultKind === 'error'" class="lead-result__hint">Thông tin đã nhập vẫn được giữ trong form. Bạn có thể đóng thông báo và thử gửi lại.</p>
      </dialog>
    </Teleport>
    </ClientOnly>
  </section>
</template>

<style scoped>
.koc-contact { --contact-error-color:#b42318; padding-block:var(--koc-section-padding); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.contact-layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.contact-badge { display:flex; align-items:center; gap:var(--koc-space-2); padding:var(--koc-space-1) var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-secondary-500); border-radius:var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font:var(--koc-weight-regular) var(--koc-body-xs-size)/var(--koc-body-xs-line) var(--font-body); }
.koc-contact h2 { margin:0; font-size:var(--text-h1-mobile); line-height:var(--text-h1-mobile--line-height); font-weight:var(--koc-weight-semibold); text-align:center; }
.koc-contact h2 span { display:block; color:var(--color-primary-500); }
.koc-contact h2 span+span { color:var(--color-secondary-500); }
.contact-columns { display:flex; flex-direction:column; width:100%; gap:var(--koc-space-6); }
.contact-form { min-width:0; display:flex; flex-direction:column; align-items:flex-start; gap:var(--koc-space-5); padding:var(--koc-space-6) var(--koc-space-4); border:var(--koc-border-thin) solid var(--color-neutral-500); border-radius:var(--koc-radius-3xl); background:var(--color-neutral-offwhite); }
.contact-form-inner { width:100%; display:flex; flex-direction:column; align-items:flex-start; gap:var(--koc-space-5); }
.contact-fields { display:grid; gap:var(--koc-space-5); width:100%; }
.contact-field { display:flex; flex-direction:column; gap:var(--koc-space-3); min-width:0; }
.contact-field label { font-size:var(--koc-body-xl-size); line-height:var(--koc-body-xl-line); }
.contact-field label span { color:var(--color-error-500); }
.contact-field input,.contact-field textarea { width:100%; min-width:0; padding:var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-neutral-500); border-radius:var(--koc-radius-xl); background:var(--color-neutral-offwhite); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.contact-field textarea { min-height:74px; resize:vertical; }
.contact-field input::placeholder,.contact-field textarea::placeholder { color:var(--color-neutral-500); opacity:1; }
.contact-field [aria-invalid=true] { border-color:var(--contact-error-color); }
.contact-error { margin:0; color:var(--contact-error-color); font-size:var(--koc-body-sm-size); line-height:var(--koc-body-sm-line); }
.contact-turnstile { min-height:65px; margin-block:var(--koc-space-2); }
.contact-submit { display:inline-flex; align-items:center; justify-content:center; gap:var(--koc-space-2); width:100%; padding:var(--koc-space-2) var(--koc-space-4); border-radius:var(--koc-radius-full); background:var(--color-primary-500); color:var(--color-neutral-offwhite); cursor:pointer; font-weight:var(--koc-weight-medium); }
.contact-submit:disabled { opacity:0.7; cursor:not-allowed; }
.contact-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.4); border-top-color:#ffffff; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }
.contact-info { display:flex; flex-direction:column; gap:var(--koc-space-6); padding:var(--koc-space-6); border:var(--koc-border-thin) solid var(--color-secondary-400); border-radius:var(--koc-radius-3xl); background:var(--color-neutral-100); }
.contact-info h3 { margin:0; font:var(--koc-weight-regular) var(--text-h3-mobile)/var(--text-h3-mobile--line-height) var(--font-heading); color:var(--color-secondary-500); }
.contact-info p { margin:0; overflow-wrap:anywhere; }
.contact-info-group { display:flex; flex-direction:column; gap:var(--koc-space-2); }
.contact-info h4 { margin:0; font:var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); }
.contact-hours { white-space:pre-line; }
.contact-info a:hover { text-decoration:underline; }
.koc-contact :is(input,textarea,button,a):focus-visible { outline:2px solid var(--color-primary-500); outline-offset:3px; }
@media(min-width:40rem) and (max-width:79.999rem) { .contact-layout { max-width:720px; } }
@media(min-width:80rem) {
 .contact-badge { padding:var(--koc-space-2) var(--koc-space-4); font-size:var(--koc-body-base-size); line-height:var(--koc-body-base-line); font-weight:var(--koc-weight-medium); }
 .koc-contact h2 { font-size:var(--text-h1); line-height:var(--text-h1--line-height); font-weight:var(--koc-weight-semibold); }
 .contact-columns { flex-direction:row; gap:var(--koc-space-8); justify-content:center; align-items:stretch; }
 .contact-form { width:658px; padding:var(--koc-space-8) var(--koc-space-6); }
 .contact-fields { grid-template-columns:repeat(2,minmax(0,1fr)); column-gap:var(--koc-space-2); }
 .contact-field--wide { grid-column:1/-1; }
 .contact-field textarea { min-height:50px; }
 .contact-submit { width:auto; padding:var(--koc-space-3) var(--koc-space-6); }
 .contact-info { width:367px; padding:var(--koc-space-12) var(--koc-space-10); flex:none; }
 .contact-info h3 { font-size:var(--text-h3); line-height:var(--text-h3--line-height); }
 .contact-description { margin-top:calc(-1 * var(--koc-space-3))!important; }
 .contact-info h4 { font-size:var(--koc-body-2xl-size); line-height:var(--koc-body-2xl-line); }
}

.lead-result { position:fixed; inset:0; margin:auto; width:min(480px,calc(100% - 32px)); max-height:calc(100dvh - 32px); overflow-y:auto; border:0; border-radius:var(--koc-radius-3xl); padding:64px 24px 36px; background:var(--color-neutral-offwhite); color:var(--color-neutral-800); text-align:center; box-shadow:0 16px 48px rgb(0 0 0 / .2); font:var(--koc-weight-medium) var(--koc-body-sm-size)/var(--koc-body-sm-line) var(--font-body); }
.lead-result::backdrop { background:rgb(29 51 66 / .8); }
.lead-result__close { position:absolute; top:16px; right:16px; width:44px; height:44px; display:grid; place-items:center; border:0; background:transparent; color:var(--color-neutral-900); cursor:pointer; font-size:28px; }
.lead-result__close:focus-visible { outline:2px solid var(--color-primary-500); outline-offset:2px; border-radius:var(--koc-radius-lg); }
.lead-result__art { position:relative; width:160px; height:160px; margin:0 auto 28px; }
.lead-result__art > img:first-child { width:100%; height:100%; object-fit:contain; }
.lead-result__check { position:absolute; width:64px; height:64px; bottom:12px; left:48px; }
.lead-result h2 { margin:0 0 12px; color:var(--color-secondary-600); font:var(--koc-weight-semibold) var(--text-h2-mobile)/var(--text-h2-mobile--line-height) var(--font-heading); }
.lead-result p { margin:0; }
.lead-result__hint { margin-top:12px!important; }
.lead-result__error-icon { width:72px; height:72px; margin:0 auto 24px; border:3px solid #b42318; border-radius:50%; color:#b42318; font-size:44px; line-height:66px; }
.lead-result--error h2 { color:#b42318; }
@media(prefers-reduced-motion:reduce) { .contact-spinner { animation:none; } }
</style>
