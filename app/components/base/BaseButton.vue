<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  target?: '_blank' | '_self'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  iconRight?: string
  iconLeft?: string
  fullWidth?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', disabled: false, fullWidth: false })
const externalTarget = computed(() => props.target ?? (props.href && /^https?:\/\//i.test(props.href) ? '_blank' : undefined))
const classes = computed(() => ['koc-button', 'koc-button--' + props.variant, 'koc-button--' + props.size, { 'koc-button--full': props.fullWidth }])
</script>

<template>
  <!-- Disabled links use native disabled buttons: no mouse or keyboard navigation. -->
  <button v-if="disabled || (!to && !href)" :type="type" :disabled="disabled" :class="classes">
    <BaseIcon v-if="iconLeft" :name="iconLeft" class="w-5 h-5 shrink-0" />
    <slot />
    <BaseIcon v-if="iconRight" :name="iconRight" class="w-5 h-5 shrink-0" />
  </button>
  <NuxtLink v-else-if="to" :to="to" :target="target" :rel="target === '_blank' ? 'noopener noreferrer' : undefined" :class="classes">
    <BaseIcon v-if="iconLeft" :name="iconLeft" class="w-5 h-5 shrink-0" />
    <slot />
    <BaseIcon v-if="iconRight" :name="iconRight" class="w-5 h-5 shrink-0" />
  </NuxtLink>
  <a v-else :href="href" :target="externalTarget" :rel="externalTarget === '_blank' ? 'noopener noreferrer' : undefined" :class="classes">
    <BaseIcon v-if="iconLeft" :name="iconLeft" class="w-5 h-5 shrink-0" />
    <slot />
    <BaseIcon v-if="iconRight" :name="iconRight" class="w-5 h-5 shrink-0" />
  </a>
</template>
