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
.koc-hero { --hero-profile-width: 579px; --hero-photo-width: 506px; padding-block: var(--koc-section-padding); }
.koc-hero__layout { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); }
.koc-hero__profile { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); width: 100%; max-width: var(--hero-profile-width); min-width: 0; }
.koc-hero__badge { display: inline-flex; align-items: center; gap: var(--koc-space-2); padding: var(--koc-space-1) var(--koc-space-3); border: var(--koc-border-thin) solid var(--color-secondary-500); border-radius: var(--koc-radius-full); background: var(--color-secondary-100); color: var(--color-primary-600); font-size: var(--koc-body-xs-size); line-height: var(--koc-body-xs-line); font-weight: var(--koc-weight-regular); }
.koc-hero__badge img { flex: none; }
.koc-hero__heading { display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center; }
.koc-hero__title-primary { color: var(--color-primary-500); }
.koc-hero__title-secondary { color: var(--color-secondary-500); width: 258px; max-width: 100%; }
.koc-hero__description { width: 100%; color: var(--color-neutral-900); font-size: var(--koc-body-base-size); line-height: var(--koc-body-base-line); font-weight: var(--koc-weight-medium); text-align: center; }
.koc-hero__credentials { display: flex; flex-direction: column; gap: var(--koc-space-6); width: 100%; }
.koc-hero__credentials li { display: flex; align-items: center; gap: var(--koc-space-2); font-size: var(--koc-body-base-size); line-height: var(--koc-body-base-line); color: var(--color-neutral-900); }
.koc-hero__check-slot { position: relative; flex: 0 0 24.351px; height: 23.463px; }
.koc-hero__check-slot img { position: absolute; top: 0; left: 0; max-width: none; }
.koc-hero__stats { display: flex; flex-direction: column; align-items: stretch; gap: var(--koc-space-2); width: 100%; padding: var(--koc-space-4); border-radius: var(--koc-radius-xl); background: var(--color-neutral-white); border: var(--koc-border-thin) solid var(--color-neutral-500); box-shadow: var(--koc-feature-shadow); }
.koc-hero__stat { display: flex; align-items: center; gap: var(--koc-space-4); padding: var(--koc-space-2); border-radius: var(--koc-radius-xl); }
.koc-hero__stat-copy { width: 251px; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: var(--koc-space-2); }
.koc-hero__stat dt { order: 1; color: var(--color-neutral-800); font-size: var(--koc-body-base-size); line-height: var(--koc-body-base-line); }
.koc-hero__stat dd { width: 100%; text-align: center; color: var(--color-neutral-900); font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
.koc-hero__divider { display: none; }
/* Figma MCP asset already contains the crop, normalized to the source raster size. */
.koc-hero__portrait { display: block; width: 100%; max-width: var(--hero-photo-width); aspect-ratio: 350 / 400; height: auto; object-fit: fill; border-radius: var(--koc-radius-xl); }
@media (min-width: 80rem) {
  .koc-hero__layout { flex-direction: row; align-items: flex-start; justify-content: space-between; gap: var(--koc-space-6); }
  .koc-hero__profile { flex: 0 0 var(--hero-profile-width); align-items: flex-start; }
  .koc-hero__badge { padding: var(--koc-space-2) var(--koc-space-4); font-size: var(--koc-body-base-size); line-height: var(--koc-body-base-line); font-weight: var(--koc-weight-medium); }
  .koc-hero__heading { align-items: flex-start; text-align: left; }
  .koc-hero__title-secondary { width: 100%; }
  .koc-hero__description { text-align: justify; }
  .koc-hero__stats { flex-direction: row; align-items: center; justify-content: center; padding: var(--koc-space-4) var(--koc-space-10); }
  .koc-hero__stat { flex: none; padding: var(--koc-space-3) var(--koc-space-2); }
  .koc-hero__stat-copy { width: auto; }
  .koc-hero__stat dt { font-size: var(--koc-body-xl-size); line-height: var(--koc-body-xl-line); white-space: nowrap; }
  .koc-hero__stat dd { white-space: nowrap; }
  .koc-hero__divider { display: block; position: relative; width: 0; height: 68px; }
  .koc-hero__divider img { position: absolute; top: -.5px; left: -.5px; max-width: none; }
  .koc-hero__portrait { flex: 0 0 var(--hero-photo-width); width: var(--hero-photo-width); height: 579px; }
}
</style>
