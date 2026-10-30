<script setup lang="ts">
import { contactContent } from '~~/shared/content'
import { designAttrs } from '~~/shared/design'
const props = defineProps<{ content?: typeof contactContent }>()
const data = computed(() => props.content ?? contactContent)
const form = reactive({ fullName: '', phone: '', email: '', note: '' })
const errors = ref<Record<string, string>>({})
const unavailable = ref(false)
const fields = [
  { key: 'fullName', label: 'Họ và tên', type: 'text', autocomplete: 'name', placeholder: 'Nguyễn Như Linh', max: 150 },
  { key: 'phone', label: 'Số điện thoại', type: 'tel', autocomplete: 'tel', placeholder: '0345678***', max: 10 },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'Email của bạn', max: 254 },
] as const
function submit() {
  const next: Record<string, string> = {}
  if (!form.fullName.trim()) next.fullName = 'Vui lòng nhập họ và tên.'
  if (!/^0[35789][0-9]{8}$/.test(form.phone.trim())) next.phone = 'Vui lòng nhập số điện thoại Việt Nam gồm 10 số.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Vui lòng nhập email hợp lệ.'
  if (form.note.length > 500) next.note = 'Ghi chú tối đa 500 ký tự.'
  errors.value = next
  unavailable.value = Object.keys(next).length === 0
  if (!unavailable.value) nextTick(() => document.getElementById('contact-' + Object.keys(next)[0])?.focus())
  // The portfolio has no lead API configuration yet. Never acknowledge an unsaved lead.
}
</script>

<template>
  <section id="contact" v-bind="designAttrs('contact')" class="koc-contact" aria-labelledby="contact-heading">
    <BaseContainer class="contact-layout">
      <div class="contact-badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{ data.eyebrow }}</div>
      <h2 id="contact-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
      <div class="contact-columns">
        <form class="contact-form" novalidate @submit.prevent="submit">
          <div class="contact-fields">
            <div v-for="field in fields" :key="field.key" class="contact-field" :class="{ 'contact-field--wide': field.key === 'email' }">
              <label :for="'contact-'+field.key"><span aria-hidden="true">*</span> {{ field.label }}</label>
              <input :id="'contact-'+field.key" v-model="form[field.key]" :name="field.key" :type="field.type" :autocomplete="field.autocomplete" :placeholder="field.placeholder" :maxlength="field.max" required :aria-invalid="!!errors[field.key]" :aria-describedby="errors[field.key] ? 'contact-error-'+field.key : undefined" @input="unavailable=false; delete errors[field.key]" />
              <p v-if="errors[field.key]" :id="'contact-error-'+field.key" class="contact-error">{{ errors[field.key] }}</p>
            </div>
            <div class="contact-field contact-field--wide">
              <label for="contact-note">Ghi chú</label>
              <textarea id="contact-note" v-model="form.note" name="note" rows="1" maxlength="500" placeholder="Cho chúng tôi biết thêm về nhu cầu của bạn!" :aria-invalid="!!errors.note" :aria-describedby="errors.note ? 'contact-error-note' : undefined" @input="unavailable=false; delete errors.note" />
              <p v-if="errors.note" id="contact-error-note" class="contact-error">{{ errors.note }}</p>
            </div>
          </div>
          <button class="contact-submit" type="submit">Gửi yêu cầu tư vấn</button>
          <p v-if="unavailable" class="contact-error" role="alert">Form chưa kết nối hệ thống tiếp nhận. Thông tin của bạn chưa được gửi; vui lòng liên hệ qua email hoặc hotline bên dưới.</p>
        </form>
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
.koc-contact { padding-block:40px; color:#292929; font:500 16px/24px var(--font-body); }
.contact-layout { display:flex; flex-direction:column; align-items:center; gap:24px; }
.contact-badge { display:flex; align-items:center; gap:8px; padding:4px 12px; border:1px solid #f48283; border-radius:9999px; background:#fde6e6; color:#155f95; font:400 12px/16px var(--font-body); }
.koc-contact h2 { margin:0; font-size:28px; line-height:32px; font-weight:400; text-align:center; }
.koc-contact h2 span { display:block; color:#1a77ba; }
.koc-contact h2 span+span { color:#f48283; }
.contact-columns { display:flex; flex-direction:column; width:100%; gap:24px; }
.contact-form { min-width:0; display:flex; flex-direction:column; align-items:flex-start; gap:20px; padding:24px 16px; border:1px solid #cecece; border-radius:24px; background:#fafafa; }
.contact-fields { display:grid; gap:20px; width:100%; }
.contact-field { display:flex; flex-direction:column; gap:12px; min-width:0; }
.contact-field label { font-size:20px; line-height:28px; }
.contact-field label span { color:red; }
.contact-field input,.contact-field textarea { width:100%; min-width:0; padding:12px; border:1px solid #cecece; border-radius:12px; background:#fafafa; color:#292929; font:500 16px/24px var(--font-body); }
.contact-field textarea { min-height:74px; resize:vertical; }
.contact-field input::placeholder,.contact-field textarea::placeholder { color:#cecece; opacity:1; }
.contact-field [aria-invalid=true] { border-color:#b42318; }
.contact-error { margin:0; color:#b42318; font-size:14px; line-height:20px; }
.contact-submit { width:100%; padding:8px 16px; border-radius:9999px; background:#1a77ba; color:#fafafa; cursor:pointer; }
.contact-info { display:flex; flex-direction:column; gap:24px; padding:24px; border:1px solid #f69b9c; border-radius:24px; background:#f8f8f8; }
.contact-info h3 { margin:0; font:400 24px/28px var(--font-heading); color:#f48283; }
.contact-info p { margin:0; overflow-wrap:anywhere; }
.contact-info-group { display:flex; flex-direction:column; gap:8px; }
.contact-info h4 { margin:0; font:500 20px/28px var(--font-body); }
.contact-hours { white-space:pre-line; }
.contact-info a:hover { text-decoration:underline; }
.koc-contact :is(input,textarea,button,a):focus-visible { outline:2px solid #1a77ba; outline-offset:3px; }
@media(min-width:40rem) and (max-width:79.999rem) { .contact-layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-contact { padding-block:96px; }
 .contact-badge { padding:8px 16px; font-size:16px; line-height:24px; font-weight:500; }
 .koc-contact h2 { font-size:48px; line-height:64px; font-weight:600; }
 .contact-columns { flex-direction:row; gap:32px; justify-content:center; align-items:stretch; }
 .contact-form { width:658px; padding:32px 24px; }
 .contact-fields { grid-template-columns:repeat(2,minmax(0,1fr)); column-gap:8px; }
 .contact-field--wide { grid-column:1/-1; }
 .contact-field textarea { min-height:50px; }
 .contact-submit { width:auto; padding:12px 24px; }
 .contact-info { width:367px; padding:48px 40px; flex:none; }
 .contact-info h3 { font-size:36px; line-height:48px; }
 .contact-description { margin-top:-12px!important; }
 .contact-info h4 { font-size:24px; line-height:32px; }
}
</style>
