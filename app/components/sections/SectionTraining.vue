<script setup lang="ts">
import { computed } from 'vue'
import { designAttrs } from '~~/shared/design'
import { trainingContent } from '~~/shared/content'

const props = defineProps<{ content?: typeof trainingContent }>()
const data = computed(() => props.content ?? trainingContent)
</script>

<template>
  <section id="training" v-bind="designAttrs('training')" data-figma-frame="Desktop - 22" data-handoff-desktop="2617:11215" data-handoff-mobile="2617:10987" class="koc-training" aria-labelledby="training-heading">
    <BaseContainer class="koc-training__layout">
      <div v-if="data.images.length" class="koc-training__photos">
        <div v-for="(photo, index) in data.images" :key="photo.src" class="koc-training__photo" :class="{ 'koc-training__photo--practical': index === 0 }">
          <img :src="photo.src" :alt="photo.alt" :width="photo.width ?? 486" :height="photo.height ?? 324" loading="lazy" decoding="async" />
        </div>
      </div>
      <div class="koc-training__content">
        <div class="koc-training__badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />ĐÀO TẠO</div>
        <h2 id="training-heading" class="koc-heading koc-training__heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
        <p class="koc-training__description">{{ data.description }}</p>
        <div v-if="data.modules.length" class="koc-training__modules">
          <BaseCard v-for="module in data.modules" :key="module.id" variant="feature" class="koc-training__module" :data-module="module.id">
            <span class="koc-training__icon" aria-hidden="true"><img :src="module.icon" alt="" width="24" height="24" loading="lazy" /></span>
            <div class="koc-training__module-copy"><h3>{{ module.title }}</h3><p><template v-if="module.desktopDescription"><span class="koc-training__mobile-copy">{{ module.description }}</span><span class="koc-training__desktop-copy">{{ module.desktopDescription }}</span></template><template v-else>{{ module.description }}</template></p></div>
          </BaseCard>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-training { padding-block: var(--koc-section-padding); background:var(--color-neutral-100); }
.koc-training__badge,.koc-training__desktop-copy { display:none; }
.koc-training__module[data-module="breastfeeding"] { padding: var(--koc-space-2) var(--koc-space-3); gap: var(--koc-space-2); }
.koc-training__module[data-module="breastfeeding"] .koc-training__module-copy { min-height:81px; }
.koc-training__module[data-module="breastfeeding"] h3 { font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
.koc-training__layout { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); }
.koc-training__photos, .koc-training__content { display: flex; flex-direction: column; gap: var(--koc-space-6); width: 100%; min-width: 0; }
.koc-training__photo { position: relative; width: 100%; aspect-ratio: 350 / 166; overflow: hidden; border-radius: var(--koc-radius-xl); }
.koc-training__photo img { width: 100%; height: 100%; object-fit: cover; }
.koc-training__photo--practical { aspect-ratio: 350 / 233; }
.koc-training__photo--practical img { position: absolute; max-width: none; width: 120.26%; height: 120.26%; left: -12.84%; top: -9.55%; }
.koc-training__heading { margin: 0; width: 100%; text-align: center; }
.koc-training__heading span { display: block; color: var(--color-primary-500); }
.koc-training__heading span + span { color: var(--color-secondary-500); }
.koc-training__description { margin: 0; font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); text-align: center; }
.koc-training__modules { display: flex; flex-direction: column; gap: var(--koc-space-6); }
.koc-training__module { display: flex; align-items: center; gap: var(--koc-space-3); padding: var(--koc-space-3); }
.koc-training__icon { display: flex; flex: none; align-items: flex-start; width: 50px; height: 50px; padding: var(--koc-space-3); background: var(--color-secondary-100); border-radius: var(--koc-radius-full); }
.koc-training__icon img { flex: none; max-width: none; }
.koc-training__module-copy { display: flex; flex: 1; flex-direction: column; gap: 1px; min-width: 0; min-height: 101px; }
.koc-training__module-copy h3 { margin: 0; color: var(--color-primary-500); font: var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); }
.koc-training__module-copy p { margin: 0; color: var(--color-neutral-800); font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
@media (min-width: 40rem) and (max-width: 79.999rem) { .koc-training__layout { max-width: 720px; } }
@media (min-width: 80rem) {
  .koc-training__layout { flex-direction: row; justify-content: space-between; gap: 26.035px; }
  .koc-training__photos { flex: 0 1 485.965px; gap: var(--koc-space-5); }
  .koc-training__photo { aspect-ratio: 485.965 / 231.037; }
  .koc-training__photo--practical { aspect-ratio: 4096 / 2731; }
  .koc-training__content { flex: 0 1 768px; }
  .koc-training__heading { max-width: 579px; text-align: left; }
  .koc-training__description { max-width: 546px; text-align: justify; }
  .koc-training__module { padding: var(--koc-space-2) var(--koc-space-3); gap: var(--koc-space-2); }
  .koc-training__module-copy, .koc-training__module[data-module="breastfeeding"] .koc-training__module-copy { min-height: 57px; }
  .koc-training__badge { display:flex; align-items:center; gap: var(--koc-space-2); align-self:flex-start; padding: var(--koc-space-2) var(--koc-space-4); border: var(--koc-border-thin) solid var(--color-secondary-500); border-radius: var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
  .koc-training__badge img { max-width:none; flex:none; }
  .koc-training__mobile-copy { display:none; }
  .koc-training__desktop-copy { display:inline; }
  .koc-training__module-copy h3 { font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
}
@media (min-width: 90rem) { .koc-training__module-copy p { white-space: pre-wrap; } }
</style>
