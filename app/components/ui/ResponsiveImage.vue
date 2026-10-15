<script setup lang="ts">
import type { ProfileImage } from '~~/shared/schemas/profile'
withDefaults(defineProps<{ image: ProfileImage; priority?: boolean }>(), { priority: false })
</script>

<template>
  <img :src="image.src" :alt="image.alt" :width="image.width" :height="image.height"
    :loading="priority ? 'eager' : 'lazy'" :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async" class="h-auto max-w-full rounded-2xl" />
</template>
