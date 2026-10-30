<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Không tìm thấy trang', robots: 'noindex, nofollow' })
</script>

<template>
  <main class="flex min-h-screen items-center bg-neutral-100 py-16">
    <BaseContainer class="flex flex-col items-center text-center">
      <p class="text-sm font-semibold uppercase tracking-wider text-primary-600">{{ error.statusCode }}</p>
      <h1 class="my-4 font-heading text-3xl font-semibold text-primary-500 sm:text-4xl">
        {{ error.statusCode === 404 ? 'Không tìm thấy trang' : 'Trang tạm thời chưa khả dụng' }}
      </h1>
      <p class="mb-8 max-w-md text-base text-neutral-800">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Bạn có thể trở về trang chủ để tiếp tục tìm hiểu.
      </p>
      <BaseButton to="/" size="md" variant="primary">Về trang chủ</BaseButton>
    </BaseContainer>
  </main>
</template> 
