<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { courseContent } from '~~/shared/content'
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const navLinks = [
  ...(courseContent.published ? [{ label: 'Khóa học trực tuyến', href: '#course' }] : []),
  { label: 'Đào tạo', href: '#training' },
  { label: 'Dành cho đối tác', href: '#cooperation' },
]
const isDrawerOpen = ref(false)
const activeSection = ref(navLinks[0]?.href ?? '#training')
const opener = ref<HTMLButtonElement | null>(null)
const brand = ref<HTMLAnchorElement | null>(null)
const drawer = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let desktopMedia: MediaQueryList | undefined
let previousOverflow = ''
let previousFocus: HTMLElement | null = null
let background: HTMLElement | null = null
let previousInert = false
let disposed = false
let cleanupTargetFocus: (() => void) | undefined

function restoreBackground() {
  document.body.style.overflow = previousOverflow
  if (background) background.inert = previousInert
  background = null
}
async function openDrawer() {
  if (isDrawerOpen.value || desktopMedia?.matches) return
  previousOverflow = document.body.style.overflow
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  background = document.getElementById('__nuxt')
  previousInert = background?.inert ?? false
  isDrawerOpen.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  if (disposed || !isDrawerOpen.value) return
  closeButton.value?.focus({ preventScroll: true })
  if (background) background.inert = true
}
function closeDrawer(restoreFocus = true) {
  if (!isDrawerOpen.value) return
  isDrawerOpen.value = false
  restoreBackground()
  if (restoreFocus) (previousFocus?.isConnected ? previousFocus : opener.value)?.focus({ preventScroll: true })
}
async function followLink(event: MouseEvent, href: string) {
  // Keep modified clicks native; ordinary in-page links close before scrolling.
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  activeSection.value = href
  closeDrawer(false)
  await nextTick()
  const target = document.getElementById(href.slice(1))
  if (!target) { opener.value?.focus({ preventScroll: true }); return }
  if (location.hash !== href) history.pushState(null, '', href)
  cleanupTargetFocus?.()
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1')
    const cleanup = () => {
      target.removeEventListener('blur', cleanup)
      if (target.getAttribute('tabindex') === '-1') target.removeAttribute('tabindex')
      if (cleanupTargetFocus === cleanup) cleanupTargetFocus = undefined
    }
    cleanupTargetFocus = cleanup
    target.addEventListener('blur', cleanup, { once: true })
  }
  // Keep the section focusable until blur; removing tabindex immediately drops focus.
  target.focus({ preventScroll: true })
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
function onKeydown(event: KeyboardEvent) {
  if (!isDrawerOpen.value) return
  if (event.key === 'Escape') { event.preventDefault(); closeDrawer(); return }
  if (event.key !== 'Tab' || !drawer.value) return
  const items = Array.from(drawer.value.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'))
  const first = items[0], last = items[items.length - 1]
  if (!first || !last) return
  const current = document.activeElement
  if (event.shiftKey && (current === first || !drawer.value.contains(current))) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && (current === last || !drawer.value.contains(current))) { event.preventDefault(); first.focus() }
}
function onBreakpoint() {
  if (!desktopMedia?.matches || !isDrawerOpen.value) return
  closeDrawer(false)
  brand.value?.focus({ preventScroll: true })
}
function onHashChange() {
  if (navLinks.some(link => link.href === location.hash)) activeSection.value = location.hash
}
onMounted(() => {
  desktopMedia = matchMedia('(min-width: 80rem)')
  desktopMedia.addEventListener('change', onBreakpoint)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('hashchange', onHashChange)
  onHashChange()
})
onBeforeUnmount(() => {
  disposed = true
  cleanupTargetFocus?.()
  closeDrawer(false)
  desktopMedia?.removeEventListener('change', onBreakpoint)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('hashchange', onHashChange)
})
</script>

<template>
  <header id="navbar" v-bind="designAttrs('navbar')" data-figma-frame="Menu" class="koc-navbar">
    <BaseContainer class="koc-navbar__row">
      <a ref="brand" href="#hero" aria-label="Mẹ Thủy Làm Y - Trang chủ" class="koc-navbar__brand"><BaseBrandLogo /></a>
      <nav class="koc-navbar__links" aria-label="Điều hướng chính">
        <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
      <BaseButton href="#contact" size="lg" class="koc-navbar__contact">Liên hệ hợp tác</BaseButton>
      <button ref="opener" type="button" class="koc-navbar__toggle" aria-label="Mở menu điều hướng" aria-controls="mobile-navigation" :aria-expanded="isDrawerOpen" @click="openDrawer">
        <img src="/images/navbar/menu.svg" alt="" aria-hidden="true" width="24" height="24" />
      </button>
    </BaseContainer>
    <Teleport to="body">
      <div v-if="isDrawerOpen" id="mobile-navigation" ref="drawer" v-bind="designAttrs('drawer')" class="koc-drawer" role="dialog" aria-modal="true" aria-label="Menu di động">
        <div class="koc-drawer__top">
          <BaseBrandLogo variant="mobile" />
          <button ref="closeButton" type="button" class="koc-drawer__close" aria-label="Đóng menu" @click="closeDrawer()"><img src="/images/navbar/drawer-close.svg" alt="" aria-hidden="true" width="24" height="24" /></button>
        </div>
        <nav class="koc-drawer__links" aria-label="Điều hướng di động">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" :class="{ 'is-active': activeSection === link.href }" :aria-current="activeSection === link.href ? 'location' : undefined" @click="followLink($event, link.href)">
            <span>{{ link.label }}</span><span class="koc-drawer__chevron" aria-hidden="true"><img :src="activeSection === link.href ? '/images/navbar/drawer-chevron-active.svg' : '/images/navbar/drawer-chevron-default.svg'" alt="" width="25.5" height="24" /></span>
          </a>
        </nav>
        <div class="koc-drawer__actions"><BaseButton href="#contact" full-width @click="followLink($event, '#contact')">Liên hệ hợp tác</BaseButton></div>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
.koc-navbar { background: var(--color-neutral-100); }
.koc-navbar__row { display: flex; align-items: center; justify-content: space-between; padding-block: 24px; gap: 24px; }
.koc-navbar__brand { display: flex; flex: none; }
.koc-navbar__links, .koc-navbar__contact { display: none; }
.koc-navbar__toggle { display: flex; align-items: center; justify-content: center; position: relative; flex: none; width: 24px; height: 24px; border: 0; background: transparent; cursor: pointer; }
.koc-navbar__toggle::before { content: ''; position: absolute; inset: -10px; }
.koc-drawer { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; width: 100%; height: 100dvh; overflow-y: auto; overscroll-behavior: contain; background: var(--color-neutral-100); color: var(--color-neutral-900); }
.koc-drawer__top { display: flex; align-items: center; justify-content: space-between; flex: none; padding: 12px 20px; }
.koc-drawer__close { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex: none; border-radius: 9999px; border: 0; background: var(--color-primary-100); cursor: pointer; }
.koc-drawer__links { display: flex; flex-direction: column; padding: 8px 20px 0; flex: none; }
.koc-drawer__links a { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding-block: 16px; font: 500 20px/28px var(--font-body); }
.koc-drawer__links a.is-active { color: var(--color-primary-500); }
.koc-drawer__chevron { position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex: none; }
.koc-drawer__chevron img { position: absolute; left: -1.5px; top: 0; max-width: none; }
.koc-drawer__actions { margin-top: auto; padding: 16px 20px max(32px, env(safe-area-inset-bottom)); flex: none; }
@media (min-width: 80rem) {
  .koc-navbar__row { padding-block: 32px; }
  .koc-navbar__links { display: flex; gap: 36px; align-items: center; font: 600 20px/28px var(--font-body); }
  .koc-navbar__links a { white-space: nowrap; }
  .koc-navbar__links a:hover { color: var(--color-primary-500); }
  .koc-navbar__contact { display: inline-flex; }
  .koc-navbar__toggle { display: none; }
}
</style>
