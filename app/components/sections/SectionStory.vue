<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { storyContent } from '~~/shared/content'

const props = defineProps<{ content?: typeof storyContent }>()
const data = computed(() => props.content ?? storyContent)
</script>

<template>
  <section id="story" v-bind="designAttrs('story')" data-figma-frame="Desktop - 10" class="koc-story" aria-labelledby="story-heading">
    <BaseContainer class="koc-story__layout">
      <h2 id="story-heading" class="koc-heading koc-story__heading" data-design-part="story-heading">
        <span class="koc-story__primary">{{ data.headline.primary }}</span>
        <span class="koc-story__secondary">{{ data.headline.secondary }}</span>
      </h2>
      <p class="koc-story__lead" data-design-part="story-lead">{{ data.lead }}</p>
      <div class="koc-story__row">
        <!-- The original MCP raster already contains Figma's crop. -->
        <img :src="data.image.src" :alt="data.image.alt" :width="data.image.width ?? 511" :height="data.image.height ?? 300" loading="lazy" decoding="async" class="koc-story__photo" data-design-part="story-photo" />
        <BaseCard variant="quote" class="koc-story__quote" data-design-part="story-quote">
          <div class="koc-story__quote-content">
            <p data-design-part="story-note">{{ data.content }}</p>
            <img v-if="data.signature" :src="data.signature.src" :alt="data.signature.alt" :width="data.signature.width" :height="data.signature.height" loading="lazy" decoding="async" class="koc-story__signature" data-design-part="story-signature" />
          </div>
        </BaseCard>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-story { padding-block: var(--koc-section-padding); }
.koc-story__layout { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); }
.koc-story__heading { display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center; }
.koc-story__primary { color: var(--color-primary-500); }
.koc-story__secondary { color: var(--color-secondary-500); }
.koc-story__lead { font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); color: var(--color-neutral-900); }
.koc-story__lead { width: 100%; max-width: 1039.417px; text-align: center; }
.koc-story__row { display: flex; flex-direction: column; align-items: stretch; gap: var(--koc-space-6); width: 100%; max-width: 511px; }
.koc-story__photo { display: block; width: 100%; height: auto; aspect-ratio: 350 / 206; object-fit: fill; border-radius: var(--koc-radius-3xl); }
.koc-story__quote-content { display: flex; flex-direction: column; align-items: flex-end; gap: var(--koc-space-6); width: 100%; }
.koc-story__quote-content p { width: 100%; margin: 0; white-space: pre-line; font: italic var(--koc-weight-regular) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-heading); font-variation-settings: "SOFT" 0, "WONK" 1; color: var(--color-neutral-900); }
.koc-story__signature { display: block; flex: none; max-width: none; }
@media (min-width: 80rem) {
  .koc-story__heading { width: 736px; }
  .koc-story__primary { width: 511px; }
  .koc-story__secondary { width: 736px; }
  .koc-story__row { flex-direction: row; gap: 18px; max-width: 1040px; align-items: stretch; }
  .koc-story__photo { width: 511px; height: 300.344px; flex: none; }
  .koc-story__quote { display: flex; align-items: center; justify-content: center; flex: 0 0 511px; min-width: 0; min-height: 300.344px; }
  /* The source inner frame is wider than the card's nominal padded area. */
  .koc-story__quote-content { flex: none; width: 440.569px; min-height: 238.123px; justify-content: space-between; }
  .koc-story__quote-content p { text-align: justify; }
}
</style>
