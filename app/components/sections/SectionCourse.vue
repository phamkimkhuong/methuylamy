<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { designAttrs } from '~~/shared/design'
import { courseContent } from '~~/shared/content'

const props = defineProps<{ content?: typeof courseContent }>()
const data = computed(() => props.content ?? courseContent)
const showPlayer = ref(false)
const isLoading = ref(false)
const videoError = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
let hlsInstance: any = null

function cleanupHls() {
  if (hlsInstance) {
    try {
      hlsInstance.destroy()
    } catch {
      // ignore
    }
    hlsInstance = null
  }
}

onBeforeUnmount(() => {
  cleanupHls()
})

watch(() => data.value.videoSrc, () => {
  cleanupHls()
  showPlayer.value = false
  isLoading.value = false
  videoError.value = false
})

async function resolveStreamUrl(src: string): Promise<string> {
  // If src is already a direct video file or m3u8, return as-is
  if (src.endsWith('.m3u8') || src.endsWith('.mp4')) {
    return src
  }

  // Van Phuc Care public intro video token request
  const res = await fetch('https://edu.vanphuccare.vn/api/u/video/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: '695b75cab1c8ae233f7ff35f',
      isIntroVideo: true,
      _t: Date.now(),
    }),
  })

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`)
  }

  const json = await res.json()
  const token = json.data?.token
  if (!token) {
    throw new Error('Video token not found')
  }

  return `https://edu.vanphuccare.vn/api/video/stream/${token}`
}

async function openPlayer() {
  if (!data.value.videoSrc || isLoading.value) return
  videoError.value = false
  isLoading.value = true
  showPlayer.value = true

  cleanupHls()

  try {
    const streamUrl = await resolveStreamUrl(data.value.videoSrc)
    await nextTick()

    const videoEl = videoRef.value
    if (!videoEl) {
      throw new Error('Video element not found')
    }

    const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('/api/video/stream/')

    if (isHls) {
      const HlsModule = await import('hls.js')
      const Hls = HlsModule.default || HlsModule

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        })
        hlsInstance = hls
        hls.loadSource(streamUrl)
        hls.attachMedia(videoEl)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          isLoading.value = false
          videoEl.play().catch(() => {})
        })

        hls.on(Hls.Events.ERROR, (_event: string, errorData: any) => {
          if (errorData?.fatal) {
            switch (errorData.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                cleanupHls()
                videoError.value = true
                showPlayer.value = false
                isLoading.value = false
                break
            }
          }
        })
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS for Safari
        videoEl.src = streamUrl
        videoEl.addEventListener('loadedmetadata', () => {
          isLoading.value = false
          videoEl.play().catch(() => {})
        }, { once: true })
      } else {
        videoEl.src = streamUrl
        isLoading.value = false
      }
    } else {
      videoEl.src = streamUrl
      isLoading.value = false
      videoEl.play().catch(() => {})
    }
  } catch {
    cleanupHls()
    videoError.value = true
    showPlayer.value = false
    isLoading.value = false
  }
}
</script>

<template>
  <section id="course" v-bind="designAttrs('course')" data-figma-frame="Desktop - 21" class="koc-course" aria-labelledby="course-heading">
    <BaseContainer class="koc-course__content">
      <h2 id="course-heading" class="koc-course__heading">
        <span>{{ data.headline.primary }}</span>
        <span>{{ data.headline.secondary }}</span>
      </h2>
      <p class="koc-course__description">{{ data.description }}</p>
      <div class="koc-course__media">
        <video
          v-if="showPlayer && data.videoSrc"
          ref="videoRef"
          class="koc-course__video"
          controls
          playsinline
          controlslist="nodownload noplaybackrate"
          :aria-label="data.headline.primary"
          @error="videoError = true; showPlayer = false"
        >
          Trình duyệt không hỗ trợ phát video.
        </video>
        <div v-if="isLoading" class="koc-course__loading" aria-label="Đang tải video...">
          <div class="koc-course__spinner" />
        </div>
        <template v-if="!showPlayer">
          <div class="koc-course__cover" aria-hidden="true">
            <img :src="data.coverImage" alt="" width="998" height="542" loading="lazy" decoding="async" />
          </div>
          <!-- The Handoff contains a fully opaque light fill above the image. -->
          <div class="koc-course__fill" aria-hidden="true" />
          <button
            type="button"
            class="koc-course__play"
            :disabled="!data.videoSrc || isLoading"
            :aria-label="data.videoSrc ? 'Mở video giới thiệu khóa học' : 'Video giới thiệu khóa học đang được chuẩn bị'"
            @click="openPlayer"
          >
            <span class="koc-course__mobile-play" aria-hidden="true"><img src="/images/course/course-mobile-circle.svg" width="56" height="56" alt="" /><span><img src="/images/course/course-mobile-play.svg" width="17.3205" height="15" alt="" /></span></span>
            <span class="koc-course__circle" aria-hidden="true"><img src="/images/course/course-play-circle.svg" alt="" width="86" height="86" /></span>
            <span class="koc-course__triangle" aria-hidden="true"><span><img src="/images/course/course-play-triangle.svg" alt="" width="35.0565" height="26.3377" /></span></span>
          </button>
          <p v-if="videoError" class="koc-course__error" role="alert">Không tải được video. Vui lòng kiểm tra kết nối rồi bấm nút phát để thử lại.</p>
        </template>
      </div>
      <BaseButton :href="data.ctaUrl" class="koc-course__cta">{{ data.ctaText }}</BaseButton>
    </BaseContainer>
  </section>
</template>

<style scoped>
.koc-course { padding-block: 40px; background:linear-gradient(179.55069deg,#f8f8f8 27.315%,#d1e4f1 99.554%); }
.koc-course__mobile-play { position:absolute; inset:0; }
.koc-course__mobile-play > span { position:absolute; left:20px; top:20px; transform:rotate(90deg); }
.koc-course__circle,.koc-course__triangle { display:none; }
.koc-course__content { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.koc-course__heading { width: 100%; margin: 0; text-align: center; font: 600 32px/36px var(--font-heading); }
.koc-course__heading > span { display: block; color: var(--color-primary-500); }
.koc-course__heading > span + span { color: var(--color-secondary-500); }
.koc-course__description { margin: 0; max-width: 912px; text-align: center; font: 500 16px/24px var(--font-body); }
.koc-course__media { position: relative; width: 100%; max-width: 998px; aspect-ratio: 350 / 190; border-radius: 16px; overflow: hidden; background: var(--color-neutral-100); }
.koc-course__cover, .koc-course__fill { position: absolute; inset: 0; }
.koc-course__cover img { position: absolute; width: 105.71%; max-width: none; height: 109.49%; left: -2.91%; top: -9.55%; }
.koc-course__fill { background: var(--color-neutral-100); }
.koc-course__play { position: absolute; top: 50%; left: 50%; width: 56px; height: 56px; transform: translate(-50%, -50%); padding: 0; border: 0; background: transparent; border-radius: 50%; cursor: pointer; }
.koc-course__play:disabled { cursor: default; }
.koc-course__circle { position: absolute; inset: 0 auto auto 0; width: 86px; height: 86px; transform: scale(calc(56 / 86)); transform-origin: top left; }
.koc-course__circle img, .koc-course__triangle img { max-width: none; }
.koc-course__triangle { position: absolute; width: 38px; height: 47px; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(.526316); }
.koc-course__triangle > span { position: absolute; width: 47px; height: 38px; left: -4.5px; top: 4.5px; transform: rotate(90deg); }
.koc-course__triangle img { position: absolute; left: 12.71%; top: 5.69%; }
.koc-course__video { width: 100%; height: 100%; object-fit: contain; background: #000; }
.koc-course__loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.4); z-index: 2; }
.koc-course__spinner { width: 48px; height: 48px; border: 4px solid rgba(255, 255, 255, 0.3); border-top-color: #fff; border-radius: 50%; animation: koc-spin 0.8s linear infinite; }
@keyframes koc-spin { to { transform: rotate(360deg); } }
.koc-course__error { position: absolute; bottom: 12px; inset-inline: 16px; margin: 0; text-align: center; font: 500 12px/16px var(--font-body); }
.koc-course__cta { width: 100%; min-height: 40px; font-size: 16px; line-height: 24px; padding:8px 16px; }
@media (min-width: 80rem) {
  .koc-course { padding-block: 96px; background:linear-gradient(53.8411485deg,#d1e4f1 3.0636%,#f8f8f8 41.041%); }
  .koc-course__mobile-play { display:none; }
  .koc-course__circle,.koc-course__triangle { display:block; }
  .koc-course__heading { max-width: 585px; font-size: 48px; line-height: 64px; }
  .koc-course__heading > span { display: flex; justify-content: center; align-items: center; height: 54px; }
  .koc-course__heading > span:first-child { width: 502px; margin-inline: auto; }
  .koc-course__media { aspect-ratio: 998 / 542; }
  .koc-course__play { width: 86px; height: 86px; }
  .koc-course__circle { transform: none; }
  .koc-course__triangle { transform: translate(-50%, -50%); }
  .koc-course__cta { width: auto; min-width: 162px; min-height: 48px; padding: 12px 24px; font-size: 16px; line-height: 24px; }
}
</style>
