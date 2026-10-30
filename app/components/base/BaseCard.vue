<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'legacy' | 'feature' | 'quote' | 'press' | 'form' | 'accordion'
  hoverEffect?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  expanded?: boolean
}>(), { variant: 'legacy', hoverEffect: true, padding: 'md', border: true, expanded: false })
const paddingClasses = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
</script>

<template>
  <div :class="variant === 'legacy'
    ? ['bg-neutral-white rounded-2xl shadow-card transition-all duration-300', border && 'border border-neutral-200/70', hoverEffect && 'hover:shadow-lg hover:-translate-y-0.5', paddingClasses[padding]]
    : ['koc-card', 'koc-card--' + variant, { 'koc-card--expanded': expanded }]">
    <slot />
  </div>
</template>
