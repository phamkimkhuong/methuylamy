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
.koc-press { padding-block:40px; }
.koc-press__layout { display:flex; flex-direction:column; align-items:center; gap:24px; }
.koc-press h2 { margin:0; font-size:28px; line-height:32px; font-weight:400; text-align:center; }
.koc-press h2 span { display:block; color:#1a77ba; }
.koc-press h2 span+span { color:#f48283; }
.koc-press__articles { display:grid; grid-template-columns:minmax(0,1fr); gap:24px; width:100%; }
.koc-press__article { position:relative; border-radius:12px; background:white; box-shadow:0 1px 5px #00000026; min-width:0; }
.koc-press__photo { display:block; position:relative; height:201px; overflow:hidden; border-radius:12px 12px 0 0; background:#d8d8d8; }
.koc-press__photo img { position:absolute; width:100%; height:249.75%; top:-20.85%; left:0; max-width:none; }
.koc-press__article--0 .koc-press__photo img { height:261.16%; top:-23.88%; left:0.02%; }
.koc-press__article--1 .koc-press__photo img { top:-16.86%; }
.koc-press__source { position:absolute; top:176px; left:0; width:157.432px; height:36.793px; display:flex; align-items:center; justify-content:center; background:#d1e4f1; border-radius:0 16px 16px 0; color:#1a77ba; font:500 16px/24px var(--font-body); }
.koc-press__content { display:flex; flex-direction:column; gap:24px; padding:28px 12px; }
.koc-press__copy { display:flex; flex-direction:column; gap:8px; }
.koc-press h3 { margin:0; font:500 20px/28px var(--font-body); color:#292929; }
.koc-press p { margin:0; font:500 16px/24px var(--font-body); color:#525252; }
.koc-press__read { display:flex; align-items:center; gap:12px; align-self:flex-start; font:500 16px/24px var(--font-body); color:#1a77ba; }
.koc-press__read>span:first-child { text-decoration:underline; text-underline-position:from-font; }
.koc-press__arrow { position:relative; width:9px; height:15px; }
.koc-press__arrow img { position:absolute; left:-8.4996px; top:0; max-width:none; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-press__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-press { padding-block:96px; }
 .koc-press h2 { font-size:48px; line-height:64px; font-weight:600; }
 .koc-press__articles { grid-template-columns:repeat(3,minmax(0,333px)); max-width:1047px; align-items:center; }
 .koc-press h3 { font-size:24px; line-height:32px; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; }
 .koc-press p { text-align:justify; }
 .koc-press__photo img,.koc-press__article--0 .koc-press__photo img { height:249.72%; top:-20.86%; left:0; }
 .koc-press__article--1 .koc-press__photo img { top:-16.86%; }
 .koc-press__source { background:#a3c9e3; }
 .koc-press__read { gap:16px; }
}
</style>
