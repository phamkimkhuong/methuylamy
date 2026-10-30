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
.koc-cooperation { padding-block:40px; }
.koc-cooperation__layout { display:flex; flex-direction:column; align-items:center; gap:24px; }
.koc-cooperation__badge { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:4px 12px; border:1px solid #f48283; border-radius:9999px; background:#fde6e6; color:#155f95; font:400 12px/16px var(--font-body); }
.koc-cooperation__badge img { flex:none; max-width:none; }
.koc-cooperation h2 { margin:0; text-align:center; }
.koc-cooperation h2 span { display:block; color:#1a77ba; }
.koc-cooperation h2 span+span { color:#f48283; }
.koc-cooperation__body { display:grid; grid-template-columns:minmax(0,1fr); gap:24px; width:100%; align-items:center; }
.koc-cooperation__models { display:flex; flex-direction:column; gap:24px; padding:16px; border-radius:16px; background:white; min-width:0; }
.koc-cooperation__model { display:flex; align-items:center; gap:12px; padding:12px; border-radius:12px; }
.koc-cooperation__icon { display:flex; align-items:center; justify-content:center; flex:none; width:50px; height:50px; border-radius:50%; background:#fde6e6; }
.koc-cooperation__icon img { max-width:none; }
.koc-cooperation__text { min-width:0; flex:1; }
.koc-cooperation h3 { margin:0 0 1px; color:#1a77ba; font:500 20px/28px var(--font-body); }
.koc-cooperation p { margin:0; color:#292929; font:500 16px/24px var(--font-body); }
.koc-cooperation__portrait { position:relative; width:100%; aspect-ratio:350/339; overflow:hidden; border-radius:16px; }
.koc-cooperation__portrait img { position:absolute; max-width:none; width:106.75%; height:195.81%; left:0; top:-29.98%; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-cooperation__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-cooperation { padding-block:96px; }
 .koc-cooperation__badge { width:auto; padding:8px 16px; font-size:16px; line-height:24px; font-weight:500; }
 .koc-cooperation h2 span+span { margin-top:8px; }
 .koc-cooperation__body { grid-template-columns:minmax(0,698fr) minmax(0,510fr); gap:clamp(32px,5vw,72px); }
 .koc-cooperation__models { padding:24px 36px; }
 .koc-cooperation__model { padding:8px 12px; gap:8px;  }
 .koc-cooperation h3 { font-size:24px; line-height:32px; }
 .koc-cooperation p { color:#525252; }
 .koc-cooperation__portrait { aspect-ratio:510/494.093; }
 .koc-cooperation__portrait img { width:106.74%; height:195.79%; top:-29.97%; }
}
</style>
