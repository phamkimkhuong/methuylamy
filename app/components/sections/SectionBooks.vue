<script setup lang="ts">
import { publications } from '~~/shared/content'
import { designAttrs } from '~~/shared/design'
const props=defineProps<{ items?: typeof publications }>()
const entries=computed(()=>props.items ?? publications)
</script>
<template>
 <div id="books">
  <section v-for="item in entries" :key="item.id" :id="item.id" v-bind="designAttrs(item.designKey)" class="koc-publication" :class="'koc-publication--'+item.id" :aria-labelledby="item.id+'-heading'">
   <BaseContainer class="koc-publication__layout">
    <div class="koc-publication__badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{item.badge}}</div>
    <div class="koc-publication__image"><img :src="item.image" :alt="item.headline.primary" :width="item.id === 'upcoming' ? 479 : 590" height="560" loading="lazy" decoding="async" /></div>
    <div class="koc-publication__content">
     <h2 :id="item.id+'-heading'" class="koc-heading"><span>{{item.headline.primary}}</span><span>{{item.headline.secondary}}</span></h2>
     <p class="koc-publication__description"><span class="desktop-copy">{{item.description}}</span><span class="mobile-copy">{{item.mobileDescription}}</span></p>
     <ul><li v-for="benefit in item.benefits" :key="benefit"><span class="koc-publication__check"><img src="/images/icons/check-badge.svg" width="24.3506" height="23.5624" alt="" aria-hidden="true" /></span><span>{{benefit}}</span></li></ul>
     <BaseButton :href="item.ctaUrl" :disabled="!item.ctaUrl" class="koc-publication__cta"><span v-if="item.id === 'resources'" class="koc-publication__download" aria-hidden="true"><img src="/images/publications/resource-download.svg" width="24" height="20.5714" alt="" /></span><span class="desktop-copy">{{item.ctaText}}</span><span class="mobile-copy">{{item.mobileCtaText}}</span></BaseButton>
    </div>
   </BaseContainer>
  </section>
 </div>
</template>
<style scoped>
.koc-publication { padding-block:40px; background:#f8f8f8; }
.koc-publication--upcoming { background:linear-gradient(180deg,#f8f8f8,#fde6e6); }
.koc-publication__layout { display:grid; grid-template-columns:minmax(0,1fr); gap:24px; }
.koc-publication__badge { display:flex; align-items:center; justify-self:center; gap:8px; padding:8px 16px; border:1px solid #f48283; border-radius:9999px; background:#fde6e6; color:#155f95; font:500 16px/24px var(--font-body); text-transform:uppercase; }
.koc-publication__badge img { flex:none; max-width:none; }
.koc-publication__image { height:auto; aspect-ratio:350/410; border-radius:16px; overflow:hidden; }
.koc-publication__image img { width:100%; height:100%; object-fit:cover; }
.koc-publication__content { display:flex; flex-direction:column; gap:24px; min-width:0; }
.koc-publication h2 { margin:0; text-align:center; }
.koc-publication h2 span { display:block; color:#1a77ba; }
.koc-publication h2 span+span { color:#f48283; }
.koc-publication__description { margin:0; text-align:center; font:500 16px/24px var(--font-body); }
.koc-publication ul { display:flex; flex-direction:column; gap:20px; margin:0; padding:0; list-style:none; }
.koc-publication li { display:flex; align-items:center; gap:8px; font:500 16px/24px var(--font-body); }
.koc-publication__check { flex:none; width:24.3506px; height:23.463px; }
.koc-publication__check img { max-width:none; }
.koc-publication__cta { align-self:stretch; padding:8px 16px; font:500 16px/24px var(--font-body); gap:12px; }
.koc-publication__cta:disabled { opacity:1; cursor:default; }
.koc-publication__download { position:relative; width:9px; height:15px; flex:none; }
.koc-publication__download img { position:absolute; left:-7px; top:-8.8095px; max-width:none; }
.desktop-copy { display:none; }
.koc-publication--resources .koc-publication__image { grid-row:3; aspect-ratio:350/292; }
.koc-publication--resources .koc-publication__image img { object-fit:contain; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-publication__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-publication { padding-block:96px; }
 .koc-publication--upcoming { background:linear-gradient(109.843093deg,#f8f8f8 57.484%,#fde6e6 109.02%); }
 .koc-publication__layout { grid-template-columns:minmax(0,479fr) minmax(0,654fr); column-gap:clamp(32px,10.20833vw,147px); row-gap:24px; align-items:center; }
 .koc-publication__image { grid-column:1; grid-row:1/3; height:560px; aspect-ratio:auto; }
 .koc-publication__badge { grid-column:2; grid-row:1; align-self:end; justify-self:start; text-transform:none; }
 .koc-publication__content { grid-column:2; grid-row:2; align-self:start; }
 .koc-publication__layout { grid-template-rows:63px auto; }
 .koc-publication h2 { text-align:left; }
 .koc-publication__description { text-align:justify; }
 .koc-publication__cta { align-self:flex-start; padding:12px 24px; }
 .desktop-copy { display:inline; }.mobile-copy { display:none; }
 .koc-publication--resources .koc-publication__layout { grid-template-columns:minmax(0,654fr) minmax(0,590fr); column-gap:36px; }
 .koc-publication--resources .koc-publication__badge { grid-column:1; }
 .koc-publication--resources .koc-publication__content { grid-column:1; }
 .koc-publication--resources .koc-publication__image { grid-column:2; grid-row:1/3; aspect-ratio:auto; }
}
</style>
