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
.koc-process { padding-block:var(--koc-section-padding); }
.koc-process__layout { display:flex; flex-direction:column; align-items:center; gap:var(--koc-space-6); }
.koc-process h2 { margin:0; text-align:center; font-size:var(--text-h2-mobile); line-height:var(--text-h2-mobile--line-height); font-weight:var(--koc-weight-regular); }
.koc-process h2 span { display:block; color:var(--color-primary-500); }
.koc-process h2 span+span { color:var(--color-secondary-500); }
.koc-process__steps { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--koc-space-6); width:100%; margin:0; padding:0; list-style:none; }
.koc-process__step { display:flex; flex-direction:column; align-items:flex-start; padding:var(--koc-space-6) var(--koc-space-4); border-radius:var(--koc-radius-2xl); background:var(--color-neutral-white); filter:drop-shadow(0 1px 2.5px #00000026); min-width:0; }
.koc-process__top { display:flex; align-items:flex-start; justify-content:space-between; width:100%; margin-bottom:var(--koc-space-3); }
.koc-process__tag { border:var(--koc-border-thin) solid var(--color-primary-500); border-radius:var(--koc-radius-full); background:var(--color-primary-100); padding:var(--koc-space-1) var(--koc-space-2); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); }
.koc-process__arrow { display:flex; align-items:center; justify-content:center; width:50px; height:50px; flex:none; }
.koc-process__arrow img { max-width:none; }
.koc-process h3 { margin:0 0 var(--koc-space-4); font:var(--koc-weight-medium) var(--koc-body-2xl-size)/var(--koc-body-2xl-line) var(--font-body); color:var(--color-primary-500); }
.koc-process p { margin:0; font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); color:var(--color-neutral-800); }
.koc-process__mascot { position:relative; overflow:hidden; width:210px; height:172.4px; }
.koc-process__mascot img { position:absolute; max-width:none; width:220.51%; height:167.87%; top:-21.82%; left:-69.22%; }
@media(min-width:40rem) and (max-width:79.999rem) { .koc-process__layout { max-width:720px; } }
@media(min-width:80rem) {
 .koc-process h2 { font-size:var(--text-h1); line-height:var(--text-h1--line-height); font-weight:var(--koc-weight-semibold); }
 .koc-process__steps { grid-template-columns:390fr 380fr 380fr; gap:var(--koc-space-3); max-width:1174px; }
 .koc-process__step { background:transparent; filter:none; }
 .koc-process__step:not(:last-child) { border-right:var(--koc-border-thin) solid var(--color-secondary-500);  }
 .koc-process__top { align-items:center; max-width:348px; }
 .koc-process__tag { background:var(--color-primary-200); }
 .koc-process p { color:var(--color-neutral-900); text-align:justify; }
 .koc-process__mascot { height:172px; }
 .koc-process__mascot img { width:220.5%; height:167.88%; left:-69.2%; }
}
</style>
