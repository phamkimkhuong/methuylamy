<script setup lang="ts">
withDefaults(defineProps<{
  href?: string
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), { variant: 'primary', type: 'button', disabled: false })

const styles = 'inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-center text-sm font-semibold transition-colors'
</script>

<template>
  <a v-if="href && !disabled" :href="href" :class="[styles, variant === 'primary' ? 'border-accent bg-accent text-white hover:bg-accent/90' : 'border-line bg-white text-ink hover:border-accent']"><slot /></a>
  <button v-else :type="type" :disabled="disabled" :class="[styles, variant === 'primary' ? 'border-accent bg-accent text-white' : 'border-line bg-white text-ink', 'disabled:cursor-not-allowed disabled:opacity-50']"><slot /></button>
</template>
