<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { faqList } from '~~/shared/content'
const props = defineProps<{ faqs?: typeof faqList }>()
const items = computed(() => props.faqs ?? faqList)
const openIndex = ref<number | null>(0)
</script>
<template>
  <section id="faq" v-bind="designAttrs('faq')" class="koc-faq" aria-labelledby="faq-heading">
    <BaseContainer class="faq-layout">
      <div class="faq-badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />FAQ</div>
      <h2 id="faq-heading" class="koc-heading">Câu Hỏi Thường Gặp</h2>
      <div class="faq-list">
        <div v-for="(faq,index) in items" :key="index" class="faq-item" :class="{ 'faq-item--open':openIndex===index }">
          <h3><button :id="'faq-button-'+index" type="button" :aria-expanded="openIndex===index" :aria-controls="'faq-panel-'+index" @click="openIndex=openIndex===index ? null : index"><span>{{ faq.question }}</span><svg aria-hidden="true" width="21" height="12" viewBox="0 0 21 12" :class="{ 'faq-chevron--open':openIndex===index }"><path d="m1 1 9.5 9.5L20 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button></h3>
          <div v-show="openIndex===index" :id="'faq-panel-'+index" role="region" :aria-labelledby="'faq-button-'+index" class="faq-answer"><p>{{ faq.answer }}</p></div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
<style scoped>
.koc-faq { padding-block:var(--koc-section-padding); }
.faq-layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.faq-badge { display:flex; align-items:center; gap:var(--koc-space-2); padding:var(--koc-space-1) var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-secondary-500); border-radius:var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font:var(--koc-weight-regular) var(--koc-body-xs-size)/var(--koc-body-xs-line) var(--font-body); }
.koc-faq h2 { margin:0; font-size:var(--text-h2-mobile); line-height:var(--text-h2-mobile--line-height); font-weight:var(--koc-weight-regular); text-align:center; color:var(--color-primary-500); }
.faq-list { display:flex; flex-direction:column; gap:var(--koc-space-6); width:100%; }
.faq-item { border:var(--koc-border-thin) solid var(--color-neutral-500); border-radius:var(--koc-radius-xl); background:var(--color-neutral-offwhite); padding:var(--koc-space-4); }
.faq-item--open { border-color:var(--color-secondary-500); }
.faq-item h3 { margin:0; }
.faq-item button { display:flex; width:100%; align-items:center; justify-content:space-between; gap:var(--koc-space-3); text-align:left; color:var(--color-primary-500); font:var(--koc-weight-semibold) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); cursor:pointer; }
.faq-item button:focus-visible { outline:2px solid var(--color-primary-500); outline-offset:var(--koc-space-1); }
.faq-item svg { flex:none; }
.faq-chevron--open { transform:rotate(180deg); }
.faq-answer { margin-top:var(--koc-space-3); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.faq-answer p { margin:0; white-space:pre-line; }
@media(min-width:80rem) {
 .faq-badge { padding:var(--koc-space-2) var(--koc-space-4); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
 .koc-faq h2 { font-size:var(--text-h1); line-height:var(--text-h1--line-height); font-weight:var(--koc-weight-semibold); }
 .faq-item { padding:var(--koc-space-6); border-color:var(--color-neutral-600); }
 .faq-item--open { border:2px solid var(--color-secondary-400); }
 .faq-item button { font-size:var(--koc-body-2xl-size); line-height:var(--koc-body-2xl-line); font-weight:var(--koc-weight-medium); }
}
</style>
