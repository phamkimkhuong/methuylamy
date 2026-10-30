<script setup lang="ts">
withDefaults(defineProps<{ as?: string; noPadding?: boolean; variant?: 'page' | 'footer' | 'content'; contentWidth?: string }>(), { as: 'div', noPadding: false, variant: 'page' })
</script>

<template>
  <component :is="as" class="koc-container" :class="['koc-container--' + variant, { 'koc-container--no-padding': noPadding }]" :style="contentWidth ? { '--koc-content-width': contentWidth } : undefined">
    <slot />
  </component>
</template>
