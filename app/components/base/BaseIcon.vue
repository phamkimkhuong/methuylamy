<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    alt?: string
  }>(),
  {
    alt: 'Icon',
  },
)
</script>

<template>
  <img
    :src="`/images/icons/${name}.svg`"
    :alt="alt"
    width="24"
    height="24"
    loading="lazy"
    decoding="async"
    class="inline-block shrink-0 select-none pointer-events-none"
  />
</template>
