<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'responsive' | 'mobile' | 'desktop' }>(), { variant: 'responsive' })
</script>

<template>
  <span class="koc-logo" :class="'koc-logo--' + variant" role="img" aria-label="Mẹ Thủy Làm Y">
    <svg class="koc-logo__shield" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <image href="/images/brand/logo-methuylamy.svg" width="276" height="36" />
    </svg>
    <svg class="koc-logo__wordmark" viewBox="48 0 228 36" aria-hidden="true" focusable="false">
      <image href="/images/brand/logo-methuylamy.svg" width="276" height="36" />
    </svg>
  </span>
</template>
