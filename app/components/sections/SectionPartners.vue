<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { partnerList } from '~~/shared/content'
import { handoffMediaDimensions } from '~~/shared/handoff-media-dimensions'
const props = defineProps<{ partners?: typeof partnerList }>()
const items = computed(() => props.partners ?? partnerList)
const rows = computed(() => [items.value.slice(0,6),items.value.slice(6,10),items.value.slice(10)])
const sizes: Record<string,number[]> = {
 'van-phuc-care':[170.853,59.136,142,49.154], hipp:[141.764,43.415,142,43.487], unbee:[132.217,39.939,142,42.894],
 thyseed:[155.664,43.552,142,39.729], wesser:[55.168,55.168,64,64], cetaphil:[91.437,44.222,142,68.676],
 'dr-papie':[153.682,43.415,142,40.115], hoppi:[110.032,46.475,142,59.977], mooimom:[194.614,58.443,142,42.643],
 emoon:[183.209,129.529,142,100.394], 'la-roche-posay':[179.583,77.024,142,60.905],
 'tommee-tippee':[162,86,142,75.4], 'lam-ha-sg':[169.304,83.735,142,70.2],
}
function logoStyle(id:string) {
 const [dw,dh,mw,mh] = sizes[id] ?? [142,88,142,88]
 return {'--desktop-width':dw+'px','--desktop-height':dh+'px','--mobile-width':mw+'px','--mobile-height':mh+'px'}
}
</script>

<template>
  <section id="partners" v-bind="designAttrs('partners')" class="koc-partners" aria-labelledby="partners-heading">
    <BaseContainer class="koc-partners__layout">
      <h2 id="partners-heading" class="koc-heading"><span>Thương Hiệu Đồng Hành</span><span>Gắn Kết Chuyên Môn</span></h2>
      <div class="koc-partners__logos">
        <div v-for="(row,index) in rows" :key="index" class="koc-partners__row">
          <component :is="partner.website ? 'a' : 'span'" v-for="partner in row" :key="partner.id" :href="partner.website" :target="partner.website ? '_blank' : undefined" :rel="partner.website ? 'noopener noreferrer' : undefined" :title="partner.name" class="koc-partners__item" :class="'koc-partners__item--'+partner.id" :style="logoStyle(partner.id)">
            <span class="koc-partners__logo">
              <template v-if="partner.id === 'tommee-tippee'">
                <span class="koc-partners__tommee-desktop"><img :src="partner.logo" width="162.009" height="86.0605" :alt="partner.name" loading="lazy" /></span>
                <img class="koc-partners__tommee-mobile" src="/images/partners/partner-tommee-mobile.svg" width="142" height="75.4" :alt="partner.name" loading="lazy" />
              </template>
              <img v-else :src="partner.logo" v-bind="handoffMediaDimensions[partner.logo] ?? {width:142,height:88}" :alt="partner.name" loading="lazy" decoding="async" />
            </span>
          </component>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-partners { padding-block:var(--koc-section-padding); }
.koc-partners__layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.koc-partners h2 { margin:0; font-size:var(--text-h2-mobile); line-height:var(--text-h2-mobile--line-height); font-weight:var(--koc-weight-regular); text-align:center; }
.koc-partners h2 span { display:block; color:var(--color-primary-500); }
.koc-partners h2 span+span { color:var(--color-secondary-500); }
.koc-partners__logos { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:var(--koc-space-4); width:100%; }
.koc-partners__row { display:contents; }
.koc-partners__item { display:flex; align-items:center; justify-content:center; width:167px; height:88px; overflow:hidden; }
.koc-partners__logo { display:block; position:relative; width:var(--mobile-width); height:var(--mobile-height); flex:none; overflow:hidden; }
.koc-partners__logo>img { position:absolute; width:100%; height:100%; max-width:none; object-fit:cover; }
.koc-partners__item--van-phuc-care .koc-partners__logo>img { height:288.93%; top:-94.02%; left:0; }
.koc-partners__item--lam-ha-sg .koc-partners__logo>img { height:268.67%; width:132.89%; top:-84.26%; left:-17.06%; }
.koc-partners__tommee-desktop { display:none; }
.koc-partners__logo>.koc-partners__tommee-mobile { width:142px; height:75.4px; }
@media(min-width:80rem) {
 .koc-partners__layout { gap:var(--koc-space-20); }
 .koc-partners h2 { font-size:var(--text-h1); line-height:var(--text-h1--line-height); font-weight:var(--koc-weight-semibold); }
 .koc-partners__logos { flex-direction:column; gap:var(--koc-space-1); }
 .koc-partners__row { display:flex; align-items:center; justify-content:center; gap:var(--koc-space-20); }
 .koc-partners__row:first-child { gap:var(--koc-space-12); }
 .koc-partners__item { width:var(--desktop-width); height:var(--desktop-height); overflow:visible; }
 .koc-partners__logo { width:var(--desktop-width); height:var(--desktop-height); }
 .koc-partners__item--van-phuc-care .koc-partners__logo>img { height:288.91%; top:-94%; }
 .koc-partners__item--lam-ha-sg .koc-partners__logo>img { height:268.71%; width:132.9%; top:-84.25%; }
 .koc-partners__tommee-mobile { display:none; }
 .koc-partners__tommee-desktop { display:block; position:absolute; inset:0 0 -0.07%; mask-image:url('/images/partners/partner-12.svg'); mask-size:162px 86.001px; mask-position:0.006px -0.001px; mask-repeat:no-repeat; }
 .koc-partners__tommee-desktop img { max-width:none; }
}
</style>
