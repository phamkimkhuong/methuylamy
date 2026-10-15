<script setup lang="ts">
defineProps<{ id: string; title: string; eyebrow?: string }>()
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-heading`" class="border-t border-line py-12 sm:py-16">
    <UiContainer>
      <p v-if="eyebrow" class="eyebrow mb-3">{{ eyebrow }}</p>
      <h2 :id="`${id}-heading`" class="mb-8 text-3xl font-semibold tracking-tight">{{ title }}</h2>
      <slot />
    </UiContainer>
  </section>
</template>
