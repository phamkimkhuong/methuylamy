<script setup lang="ts">
import { computed } from 'vue'
import { designAttrs } from '~~/shared/design'
import { valuesContent } from '~~/shared/content'
import { localImageDimensions } from '~~/shared/image-dimensions'

const props = defineProps<{ content?: typeof valuesContent }>()
const data = computed(() => props.content ?? valuesContent)
</script>

<template>
  <section id="values" v-bind="designAttrs('values')" data-figma-frame="Desktop - 12" data-handoff-desktop="2617:11226" data-handoff-mobile="2617:10996" class="koc-values" aria-labelledby="values-heading">
    <BaseContainer class="koc-values__layout">
      <div class="koc-values__badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />TRI THỨC</div>
      <h2 id="values-heading" class="koc-heading koc-values__heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
      <div v-if="data.items.length" class="koc-values__cards">
        <BaseCard v-for="item in data.items" :key="item.id" variant="feature" class="koc-values__card" :data-pillar="item.id">
          <div class="koc-values__photo"><picture><source v-if="item.desktopImage" media="(min-width: 80rem)" :srcset="item.desktopImage" /><img :src="item.image" :alt="item.title" :width="localImageDimensions[item.image]?.width ?? 340" :height="localImageDimensions[item.image]?.height ?? 250" loading="lazy" decoding="async" /></picture></div>
          <div class="koc-values__body">
            <span class="koc-values__icon" aria-hidden="true"><img :src="item.icon" alt="" width="24" height="24" loading="lazy" /></span>
            <div class="koc-values__copy"><h3><template v-if="item.desktopTitle"><span class="koc-values__mobile-title">{{ item.title }}</span><span class="koc-values__desktop-title">{{ item.desktopTitle }}</span></template><template v-else>{{ item.title }}</template></h3><p>{{ item.description }}</p></div>
          </div>
        </BaseCard>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-values { padding-block: var(--koc-section-padding); background:linear-gradient(180deg,var(--color-neutral-100),var(--color-primary-100)); }
.koc-values__badge,.koc-values__desktop-title { display:none; }
.koc-values__layout { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); }
.koc-values__heading { margin: 0; width: 100%; max-width: 350px; text-align: center; }
.koc-values__heading span { display: block; color: var(--color-primary-500); }
.koc-values__heading span + span { color: var(--color-secondary-500); }
.koc-values__cards { display: flex; flex-direction: column; gap: var(--koc-space-6); width: 100%; max-width: 350px; }
.koc-values__card { display: grid; grid-template-rows: minmax(160px, 1fr) auto; gap: var(--koc-space-3); min-height: 400px; padding: var(--koc-space-3); border: var(--koc-border-thin) solid var(--color-neutral-500); min-width: 0; }
.koc-values__photo { position: relative; min-width: 0; overflow: hidden; border-radius: var(--koc-radius-lg); }
.koc-values__photo img { position:absolute; width:100%; height:100%; inset:0; object-fit:cover; }

.koc-values__body { display: flex; align-items: center; gap: var(--koc-space-2); min-width: 0; }
.koc-values__icon { display: flex; flex: none; align-items: center; justify-content: center; width: 50px; height: 50px; background: var(--color-secondary-100); border-radius: var(--koc-radius-full); }
.koc-values__icon img { flex: none; max-width: none; }
.koc-values__copy { display: flex; flex: 1; flex-direction: column; gap: var(--koc-space-2); min-width: 0; min-height: 0; }
.koc-values__copy h3 { margin: 0; color: var(--color-primary-500); font: var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); }
.koc-values__copy p { margin: 0; color: var(--color-neutral-800); font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
@media (min-width: 80rem) {
  .koc-values { background:linear-gradient(215.341184deg,var(--color-neutral-100) 45.458%,var(--color-primary-100) 109.66%); }
  .koc-values__badge { display:flex; align-items:center; gap: var(--koc-space-2); padding: var(--koc-space-2) var(--koc-space-4); border: var(--koc-border-thin) solid var(--color-secondary-500); border-radius: var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
  .koc-values__badge img { max-width:none; flex:none; }
  .koc-values__mobile-title { display:none; }
  .koc-values__desktop-title { display:inline; }
  .koc-values__heading { max-width: 827px; }
  .koc-values__cards { flex-direction: row; gap: var(--koc-space-10); max-width: 1179.817px; }
  .koc-values__card { flex: 0 1 366.409px; }

  
  .koc-values__body { width: calc(100% - 2px); }

  .koc-values__copy h3 { font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
  .koc-values__copy p { text-align: justify; }

}
</style>
