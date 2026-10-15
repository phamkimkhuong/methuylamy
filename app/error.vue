<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Không tìm thấy trang', robots: 'noindex, nofollow' })
</script>

<template>
  <main class="flex min-h-screen items-center">
    <UiContainer>
      <p class="eyebrow">{{ error.statusCode }}</p>
      <h1 class="my-5 text-4xl font-semibold">{{ error.statusCode === 404 ? 'Không tìm thấy trang' : 'Trang tạm thời chưa khả dụng' }}</h1>
      <p class="mb-8 text-muted">Bạn có thể trở về trang chủ để tiếp tục tìm hiểu.</p>
      <UiButton href="/">Về trang chủ</UiButton>
    </UiContainer>
  </main>
</template>
