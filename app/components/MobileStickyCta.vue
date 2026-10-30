<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
</script>
<template>
  <aside v-bind="designAttrs('sticky')" class="koc-sticky-cta" aria-label="Liên hệ hợp tác nhanh">
    <BaseButton href="#contact" full-width data-figma-mobile-id="2617:11381">Liên hệ hợp tác</BaseButton>
  </aside>
</template>
<style scoped>
.koc-sticky-cta { position: fixed; bottom: 0; inset-inline: 0; z-index: 40; padding: 12px 16px max(24px, env(safe-area-inset-bottom)); background: white; box-shadow: var(--shadow-cta); }
@media (min-width: 80rem) { .koc-sticky-cta { display: none; } }
</style>
