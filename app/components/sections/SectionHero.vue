<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { heroContent } from '~~/shared/content'
const props = defineProps<{ content?: typeof heroContent }>()
const data = computed(() => props.content ?? heroContent)
</script>

<template>
  <section id="hero" v-bind="designAttrs('hero')" data-figma-frame="Desktop - 9" class="koc-hero" aria-labelledby="hero-heading">
    <BaseContainer class="koc-hero__layout">
      <div class="koc-hero__profile" data-design-part="hero-profile" data-figma-desktop-id="2617:11151" data-figma-mobile-id="2617:10929">
        <div class="koc-hero__badge" data-design-part="hero-badge" data-figma-desktop-id="2617:11152" data-figma-mobile-id="2617:10930">
          <img src="/images/icons/star-light.svg" alt="" aria-hidden="true" width="24" height="24" />
          <span>{{ data.eyebrow }}</span>
        </div>
        <h1 id="hero-heading" class="koc-heading koc-hero__heading" data-design-part="hero-heading" data-figma-desktop-id="2617:11153" data-figma-mobile-id="2617:10931">
          <span class="koc-hero__title-primary">{{ data.headline.primary }}</span>
          <span class="koc-hero__title-secondary">{{ data.headline.secondary }}</span>
        </h1>
        <p class="koc-hero__description" data-design-part="hero-description" data-figma-desktop-id="2617:11156" data-figma-mobile-id="2617:10934">{{ data.description }}</p>
        <ul class="koc-hero__credentials" aria-label="Chuyên môn">
          <li v-for="(badge, index) in data.badges" :key="badge" :data-design-part="'hero-credential-' + index">
            <span class="koc-hero__check-slot"><img src="/images/icons/check-badge.svg" alt="" aria-hidden="true" width="24.3506" height="23.5624" /></span>
            <span>{{ badge }}</span>
          </li>
        </ul>
        <dl class="koc-hero__stats" data-design-part="hero-stats" data-figma-desktop-id="2617:11160" data-figma-mobile-id="2617:10938">
          <div v-for="(stat, index) in data.statistics" :key="stat.label" class="koc-hero__stat" :data-design-part="'hero-stat-' + index">
            <div class="koc-hero__stat-copy"><dt>{{ stat.label }}</dt><dd>{{ stat.value }}</dd></div>
            <span v-if="index < data.statistics.length - 1" class="koc-hero__divider" aria-hidden="true"><img src="/images/hero/stats-divider.svg" width="1" height="69" alt="" /></span>
          </div>
        </dl>
      </div>
      <img class="koc-hero__portrait" :src="data.portrait.src" :alt="data.portrait.alt" :width="data.portrait.width" :height="data.portrait.height" loading="eager" fetchpriority="high" decoding="async" data-design-part="hero-portrait" data-figma-desktop-id="2617:11164" data-figma-mobile-id="2617:10942" />
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-hero { padding-block: 40px; }
.koc-hero__layout { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.koc-hero__profile { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; max-width: 579px; min-width: 0; }
.koc-hero__badge { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border: 1px solid var(--color-secondary-500); border-radius: 9999px; background: var(--color-secondary-100); color: var(--color-primary-600); font-size: 12px; line-height: 16px; font-weight: 400; }
.koc-hero__badge img { flex: none; }
.koc-hero__heading { display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center; }
.koc-hero__title-primary { color: var(--color-primary-500); }
.koc-hero__title-secondary { color: var(--color-secondary-500); width: 258px; max-width: 100%; }
.koc-hero__description { width: 100%; color: var(--color-neutral-900); font-size: 16px; line-height: 24px; font-weight: 500; text-align: center; }
.koc-hero__credentials { display: flex; flex-direction: column; gap: 24px; width: 100%; }
.koc-hero__credentials li { display: flex; align-items: center; gap: 8px; font-size: 16px; line-height: 24px; color: var(--color-neutral-900); }
.koc-hero__check-slot { position: relative; flex: 0 0 24.351px; height: 23.463px; }
.koc-hero__check-slot img { position: absolute; top: 0; left: 0; max-width: none; }
.koc-hero__stats { display: flex; flex-direction: column; align-items: stretch; gap: 8px; width: 100%; padding: 16px; border-radius: 12px; background: white; border: 1px solid var(--color-neutral-500); box-shadow: var(--koc-feature-shadow); }
.koc-hero__stat { display: flex; align-items: center; gap: 16px; padding: 8px; border-radius: 12px; }
.koc-hero__stat-copy { width: 251px; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.koc-hero__stat dt { order: 1; color: var(--color-neutral-800); font-size: 16px; line-height: 24px; }
.koc-hero__stat dd { width: 100%; text-align: center; color: var(--color-neutral-900); font-size: 24px; line-height: 32px; }
.koc-hero__divider { display: none; }
/* Figma MCP asset already contains the crop, normalized to the source raster size. */
.koc-hero__portrait { display: block; width: 100%; max-width: 506px; aspect-ratio: 350 / 400; height: auto; object-fit: fill; border-radius: 12px; }
@media (min-width: 80rem) {
  .koc-hero { padding-block: 96px; }
  .koc-hero__layout { flex-direction: row; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .koc-hero__profile { flex: 0 0 579px; align-items: flex-start; }
  .koc-hero__badge { padding: 8px 16px; font-size: 16px; line-height: 24px; font-weight: 500; }
  .koc-hero__heading { align-items: flex-start; text-align: left; }
  .koc-hero__title-secondary { width: 100%; }
  .koc-hero__description { text-align: justify; }
  .koc-hero__stats { flex-direction: row; align-items: center; justify-content: center; padding: 16px 40px; border: 1px solid var(--color-neutral-500); box-shadow: var(--koc-feature-shadow); }
  .koc-hero__stat { flex: none; padding: 12px 8px; }
  .koc-hero__stat-copy { width: auto; }
  .koc-hero__stat dt { font-size: 20px; line-height: 28px; white-space: nowrap; }
  .koc-hero__stat dd { white-space: nowrap; }
  .koc-hero__divider { display: block; position: relative; width: 0; height: 68px; }
  .koc-hero__divider img { position: absolute; top: -.5px; left: -.5px; max-width: none; }
  .koc-hero__portrait { flex: 0 0 506px; width: 506px; height: 579px; }
}
</style>
