<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { pressList } from '~~/shared/content'
import { handoffMediaDimensions } from '~~/shared/handoff-media-dimensions'
const props = defineProps<{ articles?: typeof pressList }>()
const items = computed(() => props.articles ?? pressList)
</script>

<template>
  <section id="press" v-bind="designAttrs('press')" class="koc-press" aria-labelledby="press-heading">
    <BaseContainer class="koc-press__layout">
      <h2 id="press-heading" class="koc-heading"><span>Báo Chí Nói Gì</span><span>Về Mẹ Thủy Làm Y?</span></h2>
      <div class="koc-press__articles">
        <article v-for="(article,index) in items" :key="article.id" class="koc-press__article" :class="'koc-press__article--'+index">
          <a :href="article.url" target="_blank" rel="noopener noreferrer" class="koc-press__photo" :aria-label="article.title + ' (mở tab mới)'"><img :src="article.image" :alt="article.title" v-bind="handoffMediaDimensions[article.image] ?? {width:333,height:502}" loading="lazy" decoding="async" /></a>
          <span class="koc-press__source">{{ article.source }}</span>
          <div class="koc-press__content">
            <div class="koc-press__copy"><h3><a :href="article.url" target="_blank" rel="noopener noreferrer">{{ article.title }}</a></h3><p>{{ article.excerpt }}</p></div>
            <a :href="article.url" target="_blank" rel="noopener noreferrer" class="koc-press__read" :aria-label="'Đọc: '+article.title+' (mở tab mới)'"><span>Đọc Ngay</span><span class="koc-press__arrow" aria-hidden="true"><img src="/images/press/press-3.svg" alt="" width="17.5" height="15.5" /></span></a>
          </div>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-press { padding-block:var(--koc-section-padding); }
.koc-press__layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.koc-press h2 { margin:0; font-size:var(--text-h2-mobile); line-height:var(--text-h2-mobile--line-height); font-weight:var(--koc-weight-regular); text-align:center; }
.koc-press h2 span { display:block; color:var(--color-primary-500); }
.koc-press h2 span+span { color:var(--color-secondary-500); }
.koc-press__articles { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--koc-space-6); width:100%; }
.koc-press__article { position:relative; border-radius:var(--koc-radius-xl); background:var(--color-neutral-white); box-shadow:var(--koc-feature-shadow); min-width:0; }
.koc-press__photo { display:block; position:relative; height:201px; overflow:hidden; border-radius:var(--koc-radius-xl) var(--koc-radius-xl) 0 0; background:var(--color-neutral-400); }
.koc-press__photo img { position:absolute; width:100%; height:249.75%; top:-20.85%; left:0; max-width:none; }
.koc-press__article--0 .koc-press__photo img { height:261.16%; top:-23.88%; left:0.02%; }
.koc-press__article--1 .koc-press__photo img { top:-16.86%; }
.koc-press__source { position:absolute; top:176px; left:0; width:157.432px; height:36.793px; display:flex; align-items:center; justify-content:center; background:var(--color-primary-100); border-radius:0 var(--koc-radius-2xl) var(--koc-radius-2xl) 0; color:var(--color-primary-500); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.koc-press__content { display:flex; flex-direction:column; gap:var(--koc-space-6); padding:var(--koc-space-7) var(--koc-space-3); }
.koc-press__copy { display:flex; flex-direction:column; gap:var(--koc-space-2); }
.koc-press h3 { margin:0; font:var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); color:var(--color-neutral-900); }
.koc-press p { margin:0; font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); color:var(--color-neutral-800); }
.koc-press__read { display:flex; align-items:center; gap:var(--koc-space-3); align-self:flex-start; font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); color:var(--color-primary-500); }
.koc-press__read>span:first-child { text-decoration:underline; text-underline-position:from-font; }
.koc-press__arrow { position:relative; width:9px; height:15px; }
.koc-press__arrow img { position:absolute; left:-8.4996px; top:0; max-width:none; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-press__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-press h2 { font-size:var(--text-h1); line-height:var(--text-h1--line-height); font-weight:var(--koc-weight-semibold); }
 .koc-press__articles { grid-template-columns:repeat(3,minmax(0,333px)); max-width:1047px; align-items:center; }
 .koc-press h3 { font-size:var(--koc-body-2xl-size); line-height:var(--koc-body-2xl-line); display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; }
 .koc-press p { text-align:justify; }
 .koc-press__photo img,.koc-press__article--0 .koc-press__photo img { height:249.72%; top:-20.86%; left:0; }
 .koc-press__article--1 .koc-press__photo img { top:-16.86%; }
 .koc-press__source { background:var(--color-primary-200); }
 .koc-press__read { gap:var(--koc-space-4); }
}
</style>
