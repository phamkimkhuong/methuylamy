<script setup lang="ts">
import { prenatalContent } from '~~/shared/content'
const props = defineProps<{ content?: typeof prenatalContent }>()
const data = computed(() => props.content ?? prenatalContent)
</script>
<template>
  <section id="prenatal" class="koc-prenatal" data-design-key="prenatal" data-figma-desktop-id="2778:29934" data-figma-mobile-id="2778:30056" aria-labelledby="prenatal-heading">
    <BaseContainer class="koc-prenatal__layout">
      <div class="koc-prenatal__photos">
        <img v-for="photo in data.images" :key="photo.src" :src="photo.src" :alt="photo.alt" :width="photo.width" :height="photo.height" loading="lazy" decoding="async" />
      </div>
      <div class="koc-prenatal__content">
        <div class="koc-prenatal__badge"><img src="/images/prenatal/prenatal-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{ data.eyebrow }}</div>
        <h2 id="prenatal-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary.slice(0, -7) }}<span class="koc-prenatal__break"> </span>{{ data.headline.secondary.slice(-7) }}</span></h2>
        <p class="koc-prenatal__description">{{ data.description }}</p>
        <BaseCard v-for="item in data.modules" :key="item.id" variant="feature" class="koc-prenatal__feature">
          <span class="koc-prenatal__icon" aria-hidden="true"><img :src="item.icon" width="24" height="24" alt="" /></span>
          <div class="koc-prenatal__copy"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div>
        </BaseCard>
        <BaseButton :href="data.ctaUrl" :disabled="!data.ctaUrl" class="koc-prenatal__cta" :aria-label="data.ctaUrl ? data.ctaText : data.ctaText + ' — đang cập nhật đường dẫn'">{{ data.ctaText }}</BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>
<style scoped>
.koc-prenatal { padding-block: var(--koc-section-padding); background:linear-gradient(180deg,var(--color-neutral-100) 33.728%,var(--color-secondary-100) 100%); }
.koc-prenatal__layout,.koc-prenatal__photos,.koc-prenatal__content { display:flex; flex-direction:column; gap: var(--koc-space-6); min-width:0; }
.koc-prenatal__photos img { width:100%; height:auto; aspect-ratio:350/233; object-fit:cover; border-radius: var(--koc-radius-xl); }
.koc-prenatal__photos img + img { aspect-ratio:350/200; }
.koc-prenatal__content { align-items:center; }
.koc-prenatal__badge { display:flex; align-items:center; gap: var(--koc-space-2); padding: var(--koc-space-1) var(--koc-space-3); border: var(--koc-border-thin) solid var(--color-secondary-500); border-radius: var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font: var(--koc-weight-regular) var(--koc-body-xs-size)/var(--koc-body-xs-line) var(--font-body); }
.koc-prenatal__badge img,.koc-prenatal__icon img { flex:none; max-width:none; }
.koc-prenatal h2 { width:100%; margin:0; text-align:center; }
.koc-prenatal h2 > span { display:block; color:var(--color-primary-500); }
.koc-prenatal h2 > span + span { color:var(--color-secondary-500); }
.koc-prenatal__break { display:block; }
.koc-prenatal__description { margin:0; font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); text-align:center; }
.koc-prenatal__feature { display:flex; align-items:center; gap: var(--koc-space-3); padding: var(--koc-space-3); width:100%; }
.koc-prenatal__icon { display:flex; align-items:center; justify-content:center; flex:none; width:50px; height:50px; border-radius:50%; background:var(--color-secondary-100); }
.koc-prenatal__copy { flex:1; min-width:0; min-height:101px; display:flex; flex-direction:column; gap: 1px; }
.koc-prenatal__copy h3 { margin:0; color:var(--color-primary-500); font: var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); }
.koc-prenatal__copy p { margin:0; font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.koc-prenatal__cta { width:100%; padding: var(--koc-space-2) var(--koc-space-4); font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-prenatal__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-prenatal { background:linear-gradient(59.947818747deg,var(--color-neutral-100) 52.901%,var(--color-secondary-100) 103.5%); }
 .koc-prenatal__layout { flex-direction:row-reverse; align-items:center; justify-content:space-between; gap: var(--koc-space-8); }
 .koc-prenatal__photos { flex:0 1 485.965px; gap: var(--koc-space-5); }
 .koc-prenatal__photos img { aspect-ratio:485.965/405; }
 .koc-prenatal__photos img + img { aspect-ratio:485.965/325; }
 .koc-prenatal__content { flex:0 1 692px; align-items:flex-start; }
 .koc-prenatal__badge { padding: var(--koc-space-2) var(--koc-space-4); font-size: var(--koc-body-base-size); line-height: var(--koc-body-base-line); }
 .koc-prenatal h2 { max-width:579px; text-align:left; }
 .koc-prenatal__break { display:inline; }
 .koc-prenatal__description { text-align:justify; }
 .koc-prenatal__feature { padding: var(--koc-space-2) var(--koc-space-3); gap: var(--koc-space-2); }
 .koc-prenatal__copy { min-height:57px; }
 .koc-prenatal__copy h3 { font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
 .koc-prenatal__cta { margin-top: var(--koc-space-4); width:auto; padding: var(--koc-space-3) var(--koc-space-6); }
}
</style>
