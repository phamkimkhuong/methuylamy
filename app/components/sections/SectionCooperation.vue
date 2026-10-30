<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { cooperationContent } from '~~/shared/content'
const props = defineProps<{ content?: typeof cooperationContent }>()
const data = computed(() => props.content ?? cooperationContent)
</script>

<template>
  <section id="cooperation" v-bind="designAttrs('cooperation')" class="koc-cooperation" aria-labelledby="cooperation-heading">
    <BaseContainer class="koc-cooperation__layout">
      <div class="koc-cooperation__badge"><img src="/images/icons/training-star.svg" width="24" height="24" alt="" aria-hidden="true" />{{ data.eyebrow }}</div>
      <h2 id="cooperation-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
      <div class="koc-cooperation__body">
        <div class="koc-cooperation__models">
          <article v-for="model in data.models" :key="model.id" class="koc-cooperation__model">
            <div class="koc-cooperation__icon"><img :src="model.icon" width="24" height="24" alt="" aria-hidden="true" loading="lazy" /></div>
            <div class="koc-cooperation__text"><h3>{{ model.title }}</h3><p>{{ model.description }}</p></div>
          </article>
        </div>
        <div class="koc-cooperation__portrait"><img :src="data.image" alt="Mẹ Thủy bế em bé" width="544" height="968" loading="lazy" decoding="async" /></div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-cooperation { padding-block:var(--koc-section-padding); }
.koc-cooperation__layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.koc-cooperation__badge { display:flex; align-items:center; justify-content:center; gap:var(--koc-space-2); width:100%; padding:var(--koc-space-1) var(--koc-space-3); border:var(--koc-border-thin) solid var(--color-secondary-500); border-radius:var(--koc-radius-full); background:var(--color-secondary-100); color:var(--color-primary-600); font:var(--koc-weight-regular) var(--koc-body-xs-size)/var(--koc-body-xs-line) var(--font-body); }
.koc-cooperation__badge img { flex:none; max-width:none; }
.koc-cooperation h2 { margin:0; text-align:center; }
.koc-cooperation h2 span { display:block; color:var(--color-primary-500); }
.koc-cooperation h2 span+span { color:var(--color-secondary-500); }
.koc-cooperation__body { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--koc-space-6); width:100%; align-items:center; }
.koc-cooperation__models { display:flex; flex-direction:column; gap:var(--koc-space-6); padding:var(--koc-space-4); border-radius:var(--koc-radius-2xl); background:var(--color-neutral-white); min-width:0; }
.koc-cooperation__model { display:flex; align-items:center; gap:var(--koc-space-3); padding:var(--koc-space-3); border-radius:var(--koc-radius-xl); }
.koc-cooperation__icon { display:flex; align-items:center; justify-content:center; flex:none; width:50px; height:50px; border-radius:50%; background:var(--color-secondary-100); }
.koc-cooperation__icon img { max-width:none; }
.koc-cooperation__text { min-width:0; flex:1; }
.koc-cooperation h3 { margin:0 0 1px; color:var(--color-primary-500); font:var(--koc-weight-medium) var(--koc-body-xl-size)/var(--koc-body-xl-line) var(--font-body); }
.koc-cooperation p { margin:0; color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.koc-cooperation__portrait { position:relative; width:100%; aspect-ratio:350/339; overflow:hidden; border-radius:var(--koc-radius-2xl); }
.koc-cooperation__portrait img { position:absolute; max-width:none; width:106.75%; height:195.81%; left:0; top:-29.98%; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-cooperation__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-cooperation__badge { width:auto; padding:var(--koc-space-2) var(--koc-space-4); font-size:var(--koc-body-base-size); line-height:var(--koc-body-base-line); font-weight:var(--koc-weight-medium); }
 .koc-cooperation h2 span+span { margin-top:var(--koc-space-2); }
 .koc-cooperation__body { grid-template-columns:minmax(0,698fr) minmax(0,510fr); gap:clamp(var(--koc-space-8),5vw,72px); }
 .koc-cooperation__models { padding:var(--koc-space-6) var(--koc-space-9); }
 .koc-cooperation__model { padding:var(--koc-space-2) var(--koc-space-3); gap:var(--koc-space-2);  }
 .koc-cooperation h3 { font-size:var(--koc-body-2xl-size); line-height:var(--koc-body-2xl-line); }
 .koc-cooperation p { color:var(--color-neutral-800); }
 .koc-cooperation__portrait { aspect-ratio:510/494.093; }
 .koc-cooperation__portrait img { width:106.74%; height:195.79%; top:-29.97%; }
}
</style>
