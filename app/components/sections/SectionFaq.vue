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
.koc-faq { padding-block:40px; }
.faq-layout { display:flex; flex-direction:column; align-items:center; gap:24px; }
.faq-badge { display:flex; align-items:center; gap:8px; padding:4px 12px; border:1px solid #f48283; border-radius:9999px; background:#fde6e6; color:#155f95; font:400 12px/16px var(--font-body); }
.koc-faq h2 { margin:0; font-size:28px; line-height:32px; font-weight:400; text-align:center; color:#1a77ba; }
.faq-list { display:flex; flex-direction:column; gap:24px; width:100%; }
.faq-item { border:1px solid #cecece; border-radius:12px; background:#fafafa; padding:16px; }
.faq-item--open { border-color:#f48283; }
.faq-item h3 { margin:0; }
.faq-item button { display:flex; width:100%; align-items:center; justify-content:space-between; gap:12px; text-align:left; color:#1a77ba; font:600 16px/24px var(--font-body); cursor:pointer; }
.faq-item button:focus-visible { outline:2px solid #1a77ba; outline-offset:4px; }
.faq-item svg { flex:none; }
.faq-chevron--open { transform:rotate(180deg); }
.faq-answer { margin-top:12px; color:#292929; font:500 16px/24px var(--font-body); }
.faq-answer p { margin:0; white-space:pre-line; }
@media(min-width:80rem) {
 .koc-faq { padding-block:96px; }
 .faq-badge { padding:8px 16px; font:500 16px/24px var(--font-body); }
 .koc-faq h2 { font-size:48px; line-height:64px; font-weight:600; }
 .faq-item { padding:24px; border-color:#a5a5a5; }
 .faq-item--open { border:2px solid #f69b9c; }
 .faq-item button { font-size:24px; line-height:32px; font-weight:500; }
}
</style>
