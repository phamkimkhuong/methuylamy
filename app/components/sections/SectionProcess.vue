<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { processContent } from '~~/shared/content'
const props = defineProps<{ content?: typeof processContent }>()
const data = computed(() => props.content ?? processContent)
</script>

<template>
  <section id="process" v-bind="designAttrs('process')" class="koc-process" aria-labelledby="process-heading">
    <BaseContainer class="koc-process__layout">
      <h2 id="process-heading" class="koc-heading"><span>{{ data.headline.primary }}</span><span>{{ data.headline.secondary }}</span></h2>
      <ol class="koc-process__steps">
        <li v-for="item in data.steps" :key="item.step" class="koc-process__step">
          <div class="koc-process__top"><span class="koc-process__tag">{{ item.step }}</span><span class="koc-process__arrow" aria-hidden="true"><img src="/images/process/process-chevron.svg" width="23.9992" height="24.0001" alt="" aria-hidden="true" /></span></div>
          <h3>{{ item.title }}</h3><p>{{ item.description }}</p>
        </li>
      </ol>
      <div v-if="data.mascot" class="koc-process__mascot"><img :src="data.mascot" width="463" height="289" alt="Linh vật y khoa Vạn Phúc Care" loading="lazy" decoding="async" /></div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-process { padding-block:40px; }
.koc-process__layout { display:flex; flex-direction:column; align-items:center; gap:24px; }
.koc-process h2 { margin:0; text-align:center; font-size:28px; line-height:32px; font-weight:400; }
.koc-process h2 span { display:block; color:#1a77ba; }
.koc-process h2 span+span { color:#f48283; }
.koc-process__steps { display:grid; grid-template-columns:minmax(0,1fr); gap:24px; width:100%; margin:0; padding:0; list-style:none; }
.koc-process__step { display:flex; flex-direction:column; align-items:flex-start; padding:24px 16px; border-radius:16px; background:white; filter:drop-shadow(0 1px 2.5px #00000026); min-width:0; }
.koc-process__top { display:flex; align-items:flex-start; justify-content:space-between; width:100%; margin-bottom:12px; }
.koc-process__tag { border:1px solid #1a77ba; border-radius:9999px; background:#d1e4f1; padding:4px 8px; font:500 16px/24px var(--font-body); }
.koc-process__arrow { display:flex; align-items:center; justify-content:center; width:50px; height:50px; flex:none; }
.koc-process__arrow img { max-width:none; }
.koc-process h3 { margin:0 0 16px; font:500 24px/32px var(--font-body); color:#1a77ba; }
.koc-process p { margin:0; font:500 16px/24px var(--font-body); color:#525252; }
.koc-process__mascot { position:relative; overflow:hidden; width:210px; height:172.4px; }
.koc-process__mascot img { position:absolute; max-width:none; width:220.51%; height:167.87%; top:-21.82%; left:-69.22%; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-process__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-process { padding-block:96px; }
 .koc-process h2 { font-size:48px; line-height:64px; font-weight:600; }
 .koc-process__steps { grid-template-columns:390fr 380fr 380fr; gap:12px; max-width:1174px; }
 .koc-process__step { background:transparent; filter:none; }
 .koc-process__step:not(:last-child) { border-right:1px solid #f48283;  }
 .koc-process__step:last-child { filter:none; }
 .koc-process__top { align-items:center; max-width:348px; }
 .koc-process__tag { background:#a3c9e3; }
 .koc-process p { color:#292929; text-align:justify; }
 .koc-process__mascot { height:172px; }
 .koc-process__mascot img { width:220.5%; height:167.88%; left:-69.2%; }
}
</style>
