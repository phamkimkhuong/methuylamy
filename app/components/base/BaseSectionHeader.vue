<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    eyebrowIcon?: string
    titlePrimary: string
    titleSecondary?: string
    secondaryColor?: string
    description?: string
    align?: 'center' | 'left'
    headingTag?: 'h1' | 'h2' | 'h3'
  }>(),
  {
    align: 'center',
    headingTag: 'h2',
    secondaryColor: '#F48283',
  },
)
</script>

<template>
  <div
    class="flex flex-col"
    :class="[
      align === 'center'
        ? 'items-center text-center mx-auto'
        : 'items-start text-left',
      'max-w-4xl mb-8 xl:mb-12',
    ]"
  >
    <!-- Eyebrow Tag -->
    <div
      v-if="eyebrow"
      class="inline-flex items-center gap-1.5 px-3 py-1 mb-3.5 rounded-full bg-secondary-100/70 border border-secondary-200/60"
    >
      <BaseIcon
        v-if="eyebrowIcon"
        :name="eyebrowIcon"
        class="w-3.5 h-3.5 text-secondary-500"
      />
      <span
        class="font-body text-base font-medium uppercase tracking-wider text-primary-600"
      >
        {{ eyebrow }}
      </span>
    </div>

    <!-- Main Title Duo-Tone (Fraunces) -->
    <component
      :is="headingTag"
      class="koc-heading"
    >
      <span class="text-primary-500 block">{{ titlePrimary }}</span>
      <span
        v-if="titleSecondary"
        class="block mt-1 xl:whitespace-nowrap"
        :style="{ color: secondaryColor }"
      >
        {{ titleSecondary }}
      </span>
    </component>

    <!-- Description (Manrope) -->
    <p
      v-if="description"
      class="mt-4 font-body text-base text-neutral-900 font-medium max-w-3xl"
    >
      {{ description }}
    </p>
  </div>
</template>
