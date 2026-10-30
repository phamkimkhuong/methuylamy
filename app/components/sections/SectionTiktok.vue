<script setup lang="ts">
import { localImageDimensions } from '~~/shared/image-dimensions'
import { designAttrs } from '~~/shared/design'
import { tiktokContent } from '~~/shared/content'

const props = defineProps<{ content?: typeof tiktokContent }>()
const data = computed(() => props.content ?? tiktokContent)
const statistics = computed(() => [
  { label: 'Following', value: data.value.stats.following },
  { label: 'Followers', value: data.value.stats.followers },
  { label: 'Likes', value: data.value.stats.likes },
])
const rail = ref<HTMLElement | null>(null)
const canPrevious = ref(false)
const canNext = ref(false)
let observer: ResizeObserver | undefined
function updateControls() {
  const el = rail.value
  canPrevious.value = !!el && el.scrollLeft > 1
  canNext.value = !!el && el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}
function scrollVideos(direction: number) {
  const el = rail.value
  if (!el) return
  const item = el.querySelector('li')
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
  const step = (item?.getBoundingClientRect().width ?? el.clientWidth) + gap
  el.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
onMounted(() => {
  observer = new ResizeObserver(updateControls)
  if (rail.value) observer.observe(rail.value)
  updateControls()
})
watch(() => data.value.videos, async () => {
  await nextTick()
  observer?.disconnect()
  if (rail.value) observer?.observe(rail.value)
  updateControls()
}, { deep: true })
onBeforeUnmount(() => observer?.disconnect())
function revealVideo(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }
}
</script>

<template>
  <section id="tiktok" v-bind="designAttrs('tiktok')" data-figma-frame="Desktop - 20" class="koc-tiktok">
    <BaseContainer class="koc-tiktok__layout">
      <h2 class="koc-heading koc-tiktok__heading" data-design-part="tiktok-heading">
        <span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span>
      </h2>
      <div class="koc-tiktok__card" data-design-part="tiktok-card">
        <div class="koc-tiktok__header" data-design-part="tiktok-header">
          <div class="koc-tiktok__identity">
            <img :src="data.avatar" :alt="data.name" width="72" height="72" loading="lazy" decoding="async" class="koc-tiktok__avatar" data-design-part="tiktok-avatar" />
            <h3 class="koc-tiktok__name" data-design-part="tiktok-name">{{ data.name }}</h3>
          </div>
          <dl class="koc-tiktok__stats" data-design-part="tiktok-stats">
            <div v-for="stat in statistics" :key="stat.label" class="koc-tiktok__stat">
              <dt>{{ stat.label }}</dt><dd>{{ stat.value }}</dd>
            </div>
          </dl>
          <BaseButton :href="data.url" class="koc-tiktok__follow" :aria-label="'Theo dõi kênh ' + data.name + ' trên TikTok (mở tab mới)'" data-design-part="tiktok-follow">
            <span class="koc-tiktok__follow-mobile">+ Theo dõi</span>
            <img src="/images/tiktok/tiktok-plus.svg" width="15" height="15" alt="" aria-hidden="true" class="koc-tiktok__follow-icon" />
            <span class="koc-tiktok__follow-desktop">Theo dõi</span>
          </BaseButton>
        </div>
        <!-- Keep the desktop preview clipping while letting keyboard users reach every video. -->
        <ul id="tiktok-videos" ref="rail" @scroll.passive="updateControls" v-if="data.videos.length" class="koc-tiktok__videos" tabindex="0" aria-label="Video TikTok, có thể cuộn ngang trên Desktop" data-design-part="tiktok-videos">
          <li v-for="video in data.videos" :key="video.id" class="koc-tiktok__video">
            <a @focus="revealVideo" :href="video.url" target="_blank" rel="noopener noreferrer" :aria-label="video.title + ' (mở TikTok trong tab mới)'">
              <img :src="video.thumbnail" v-bind="localImageDimensions[video.thumbnail] ?? { width: 153, height: 196 }" alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </a>
          </li>
        </ul>
        <template v-if="data.videos.length">
          <button type="button" class="koc-tiktok__arrow koc-tiktok__arrow--previous" aria-label="Cuộn video về trước" aria-controls="tiktok-videos" :disabled="!canPrevious" @click="scrollVideos(-1)"><img src="/images/tiktok/tiktok-chevron-left.svg" width="24" height="24" alt="" aria-hidden="true" /></button>
          <button type="button" class="koc-tiktok__arrow koc-tiktok__arrow--next" aria-label="Cuộn video tiếp theo" aria-controls="tiktok-videos" :disabled="!canNext" @click="scrollVideos(1)"><img src="/images/tiktok/tiktok-chevron-right.svg" width="24" height="24" alt="" aria-hidden="true" /></button>
        </template>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-tiktok { padding-block: var(--koc-section-padding); }
.koc-tiktok__layout { display: flex; flex-direction: column; align-items: center; gap: var(--koc-space-6); }
.koc-tiktok__heading { display: flex; flex-direction: column; width: 100%; text-align: center; color: var(--color-primary-500); }
.koc-tiktok__heading span + span { color: var(--color-secondary-500); }
.koc-tiktok__card { position: relative; display: flex; flex-direction: column; gap: var(--koc-space-6); width: 100%; padding: var(--koc-space-4); border-radius: var(--koc-radius-3xl); background: var(--color-neutral-white); color: var(--color-neutral-900); box-shadow: inset 0 0 0 1px var(--color-secondary-400), var(--koc-feature-shadow); }
.koc-tiktok__header { display: grid; gap: var(--koc-space-6); width: 100%; }
.koc-tiktok__identity { display: flex; align-items: center; gap: var(--koc-space-3); min-width: 0; }
.koc-tiktok__avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex: none; }
.koc-tiktok__name { font: var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); min-width: 0; flex: 1; }
.koc-tiktok__stats { display: flex; gap: var(--koc-space-2); width: 100%; }
.koc-tiktok__stat { display: flex; flex: 1 1 0; flex-direction: column; align-items: center; gap: var(--koc-space-1); min-width: 0; }
.koc-tiktok__stat dt { order: 1; font: var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.koc-tiktok__stat dd { font: var(--koc-weight-medium) var(--koc-body-2xl-size)/var(--koc-body-2xl-line) var(--font-body); }
.koc-tiktok__follow { justify-self: start; min-width: 126px; }
.koc-tiktok__follow-icon, .koc-tiktok__follow-desktop { display: none; }
.koc-tiktok__videos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--koc-space-3); width: 100%; }
.koc-tiktok__video { min-width: 0; aspect-ratio: 153 / 196; }
.koc-tiktok__video a { display: block; width: 100%; height: 100%; border-radius: var(--koc-radius-xl); overflow: hidden; }
.koc-tiktok__video img { display: block; width: 100%; height: 100%; object-fit: cover; }
.koc-tiktok__video a:focus-visible { outline-offset: -3px; }
.koc-tiktok__arrow { display: none; }
@media (min-width: 80rem) {
  .koc-tiktok__arrow { display: flex; align-items: center; justify-content: center; position: absolute; top: 246.66px; width: 50px; height: 50px; padding: 13px; border: 0; border-radius: 50%; background: var(--color-neutral-white); cursor: pointer; }
  .koc-tiktok__arrow--previous { left: -.73px; }
  .koc-tiktok__arrow--next { left: 966.27px; }
  .koc-tiktok__arrow:disabled { cursor: default; opacity: .5; }
  .koc-tiktok__arrow:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }
  .koc-tiktok__heading { width: 633px; }
  .koc-tiktok__card { width: 1034.546px; height: 441px; padding: var(--koc-space-7) var(--koc-space-9); gap: var(--koc-space-8); border: 1px solid var(--color-secondary-400); box-shadow: 0 4px 4px rgb(0 0 0 / .25); }
  .koc-tiktok__header { grid-template-columns: 71.854px minmax(0, 1fr) auto; grid-template-rows: 32px 32px; gap: var(--koc-space-2) var(--koc-space-5); flex: none; }
  .koc-tiktok__identity { display: contents; }
  .koc-tiktok__avatar { grid-column: 1; grid-row: 1 / 3; align-self: center; width: 71.854px; height: 71.854px; }
  .koc-tiktok__name { grid-column: 2; grid-row: 1; width: 348px; font-size: var(--koc-body-2xl-size); line-height: var(--koc-body-2xl-line); }
  .koc-tiktok__stats { grid-column: 2; grid-row: 2; display: grid; grid-template-columns: 89px 124px 87px; gap: var(--koc-space-6); width: 348px; }
  .koc-tiktok__stat { flex: none; flex-direction: row; white-space: nowrap; }
  .koc-tiktok__follow { grid-column: 3; grid-row: 1; min-width: 103px; padding: var(--koc-space-2) var(--koc-space-4); gap: var(--koc-space-2); font-size: var(--koc-body-xs-size); line-height: var(--koc-body-xs-line); font-weight: 400; }
  .koc-tiktok__follow-mobile { display: none; }
  .koc-tiktok__follow-icon, .koc-tiktok__follow-desktop { display: block; }
  .koc-tiktok__videos { display: flex; width: 951px; height: 279.535px; flex: none; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; }
  .koc-tiktok__videos::-webkit-scrollbar { display: none; }
  .koc-tiktok__video { flex: 0 0 218.444px; height: 279.535px; }
}
</style>
