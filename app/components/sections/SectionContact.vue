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
  isSuccess,
  fieldErrors,
  generalError,
  submitLead,
  reset: resetLeadSubmit,
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
    const timer = setInterval(() => {
      if ((window as any).turnstile) {
        clearInterval(timer)
        renderTurnstile()
      }
    }, 150)
    setTimeout(() => clearInterval(timer), 10000)
  }
})

onBeforeUnmount(() => {
  if (turnstileWidgetId.value && typeof window !== 'undefined' && (window as any).turnstile?.remove) {
    try {
      (window as any).turnstile.remove(turnstileWidgetId.value)
    } catch {
      // ignore
    }
  }
})

const fields = [
  { key: 'fullName', label: 'Họ và tên', type: 'text', autocomplete: 'name', placeholder: 'Nguyễn Như Linh', max: 120 },
  { key: 'phone', label: 'Số điện thoại', type: 'tel', autocomplete: 'tel', placeholder: '0345678***', max: 10 },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'Email của bạn', max: 254 },
] as const

async function submit() {
  const success = await submitLead({
    fullName: form.fullName,
    phone: form.phone,
    email: form.email,
    address: form.note,
    captchaToken: turnstileToken.value,
  })

  if (success) {
    form.fullName = ''
    form.phone = ''
    form.email = ''
    form.note = ''
    resetTurnstile()
  } else {
    resetTurnstile()
  }
}

function handleAnotherRequest() {
  resetLeadSubmit()
  resetTurnstile()
  nextTick(() => {
    renderTurnstile()
  })
}
</script>

<template>
  <section id="contact" v-bind="designAttrs('contact')" class="koc-contact" aria-labelledby="contact-heading">
    <BaseContainer class="contact-layout">
      <div class="contact-badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{ data.eyebrow }}</div>
      <h2 id="contact-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
      <div class="contact-columns">
        <div class="contact-form">
          <!-- TRẠNG THÁI THÀNH CÔNG (SUCCESS STATE) -->
          <div v-if="isSuccess" class="contact-success" role="status" aria-live="polite">
            <div class="contact-success__icon" aria-hidden="true">
              <img src="/images/icons/check-badge.svg" width="48" height="48" alt="" />
            </div>
            <h3 class="contact-success__title">Đăng ký thành công!</h3>
            <p class="contact-success__message">
              Cảm ơn Ba/Mẹ đã tin tưởng và đăng ký dịch vụ của MeThuyLamY. Bộ phận dịch vụ khách hàng sẽ liên hệ lại trong thời gian sớm nhất.
            </p>
            <button type="button" class="contact-submit contact-submit--another" @click="handleAnotherRequest">
              Gửi thêm yêu cầu khác
            </button>
          </div>

          <!-- FORM TIẾP NHẬN LEAD -->
          <form v-else class="contact-form-inner" novalidate @submit.prevent="submit">
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

            <!-- Thông báo lỗi chung từ Server hoặc Mạng -->
            <div v-if="generalError" class="contact-error-alert" role="alert">
              <p class="contact-error-alert__text">{{ generalError }}</p>
            </div>

            <!-- Nút gửi kèm trạng thái Loading -->
            <button class="contact-submit" type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="contact-spinner" aria-hidden="true" />
              <span>{{ isLoading ? 'Đang gửi thông tin...' : 'Gửi yêu cầu tư vấn' }}</span>
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
.contact-error-alert { width:100%; padding:var(--koc-space-3) var(--koc-space-4); border:1px solid var(--contact-error-color); border-radius:var(--koc-radius-xl); background:#fef3f2; color:var(--contact-error-color); }
.contact-error-alert__text { margin:0; font-size:var(--koc-body-sm-size); line-height:var(--koc-body-sm-line); }
.contact-submit { display:inline-flex; align-items:center; justify-content:center; gap:var(--koc-space-2); width:100%; padding:var(--koc-space-2) var(--koc-space-4); border-radius:var(--koc-radius-full); background:var(--color-primary-500); color:var(--color-neutral-offwhite); cursor:pointer; font-weight:var(--koc-weight-medium); }
.contact-submit:disabled { opacity:0.7; cursor:not-allowed; }
.contact-submit--another { width:auto; align-self:center; margin-top:var(--koc-space-2); }
.contact-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.4); border-top-color:#ffffff; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }
.contact-success { width:100%; display:flex; flex-direction:column; align-items:center; text-align:center; gap:var(--koc-space-4); padding:var(--koc-space-8) var(--koc-space-4); }
.contact-success__icon { display:flex; align-items:center; justify-content:center; }
.contact-success__title { margin:0; font-size:var(--koc-body-2xl-size); line-height:var(--koc-body-2xl-line); color:var(--color-primary-600); font-weight:var(--koc-weight-semibold); }
.contact-success__message { margin:0; max-width:480px; font-size:var(--koc-body-base-size); line-height:var(--koc-body-base-line); color:var(--color-neutral-700); }
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
</style>
