<script setup lang="ts">
import type { ProfileResource } from '~~/shared/schemas/profile'
defineProps<{ id: string; title: string; items: ProfileResource[] }>()
</script>

<template>
  <UiSection v-if="items.length" :id="id" :title="title">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in items" :key="item.slug" class="rounded-2xl border border-line bg-white p-6">
        <UiResponsiveImage v-if="item.image" :image="item.image" class="mb-5" />
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <p class="my-4 leading-relaxed text-muted">{{ item.description }}</p>
        <a :href="item.url" class="text-link" :aria-label="`Tìm hiểu: ${item.title}`">Tìm hiểu thêm <span aria-hidden="true">↗</span></a>
      </article>
    </div>
  </UiSection>
</template>
