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
.koc-contact { --contact-error-color:#b42318; padding-block:var(--koc-section-padding); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.contact-layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.contact-badge { display:flex; align-items:center; gap:var(--koc-space-2); padding:var(--koc-space-1) var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-secondary-500); border-radius:var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font:var(--koc-weight-regular) var(--koc-body-xs-size)/var(--koc-body-xs-line) var(--font-body); }
.koc-contact h2 { margin:0; font-size:var(--text-h2-mobile); line-height:var(--text-h2-mobile--line-height); font-weight:var(--koc-weight-regular); text-align:center; }
.koc-contact h2 span { display:block; color:var(--color-primary-500); }
.koc-contact h2 span+span { color:var(--color-secondary-500); }
.contact-columns { display:flex; flex-direction:column; width:100%; gap:var(--koc-space-6); }
.contact-form { min-width:0; display:flex; flex-direction:column; align-items:flex-start; gap:var(--koc-space-5); padding:var(--koc-space-6) var(--koc-space-4); border:var(--koc-border-thin) solid var(--color-neutral-500); border-radius:var(--koc-radius-3xl); background:var(--color-neutral-offwhite); }
.contact-fields { display:grid; gap:var(--koc-space-5); width:100%; }
.contact-field { display:flex; flex-direction:column; gap:var(--koc-space-3); min-width:0; }
.contact-field label { font-size:var(--koc-body-xl-size); line-height:var(--koc-body-xl-line); }
.contact-field label span { color:var(--color-error-500); }
.contact-field input,.contact-field textarea { width:100%; min-width:0; padding:var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-neutral-500); border-radius:var(--koc-radius-xl); background:var(--color-neutral-offwhite); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.contact-field textarea { min-height:74px; resize:vertical; }
.contact-field input::placeholder,.contact-field textarea::placeholder { color:var(--color-neutral-500); opacity:1; }
.contact-field [aria-invalid=true] { border-color:var(--contact-error-color); }
.contact-error { margin:0; color:var(--contact-error-color); font-size:var(--koc-body-sm-size); line-height:var(--koc-body-sm-line); }
.contact-submit { width:100%; padding:var(--koc-space-2) var(--koc-space-4); border-radius:var(--koc-radius-full); background:var(--color-primary-500); color:var(--color-neutral-offwhite); cursor:pointer; }
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
