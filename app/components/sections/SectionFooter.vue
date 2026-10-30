<script setup lang="ts">
import { designAttrs } from '~~/shared/design'
import { profile, contactContent, courseContent } from '~~/shared/content'
const facebook = profile.socialLinks.find(link => /(^|\.)facebook\.com$/.test(new URL(link.url).hostname))
const tiktok = profile.socialLinks.find(link => /(^|\.)tiktok\.com$/.test(new URL(link.url).hostname))
const footerEmail = 'info@methuylamy.vn'
</script>

<template>
  <footer id="footer" v-bind="designAttrs('footer')" class="koc-footer">
    <BaseContainer no-padding class="footer-layout">
      <div class="footer-brand">
        <a href="#hero" class="footer-logo" aria-label="Mẹ Thủy Làm Y — về đầu trang"><BaseBrandLogo /></a>
        <p class="footer-tagline">Cùng bạn đồng hành<br />trên hành trình làm mẹ</p>
      </div>
      <div class="footer-groups">
        <nav class="footer-group" aria-labelledby="footer-training">
          <h2 id="footer-training">Đào tạo</h2>
          <ul>
            <li><a href="#training">Đào tạo chuyên sâu</a></li>
            <li v-if="courseContent.published"><a href="#course">Khóa học trực tuyến</a></li>
            <li class="footer-prenatal"><a href="#prenatal">Lớp học tiền sản</a></li>
            <li><a href="#books">Sách</a></li>
          </ul>
        </nav>
        <nav class="footer-group" aria-labelledby="footer-cooperation">
          <h2 id="footer-cooperation">Hợp tác</h2>
          <ul>
            <li><a href="#cooperation">Hình thức hợp tác</a></li>
            <li><a href="#press">Báo chí nói gì</a></li>
            <li><a href="#partners">Thương hiệu đồng hành</a></li>
            <li><a href="#faq">Câu hỏi thường gặp (FAQ)</a></li>
          </ul>
        </nav>
        <div class="footer-contact">
          <div class="footer-group">
            <h2>Liên hệ</h2>
            <ul>
              <li><a :href="'mailto:'+footerEmail">Email: {{ footerEmail }}</a></li>
              <li><a :href="'tel:'+contactContent.contactInfo.hotline.replace(/[^+0-9]/g,'')">Hotline: {{ contactContent.contactInfo.hotline }}</a></li>
            </ul>
          </div>
          <div class="footer-socials" aria-label="Mạng xã hội">
            <component :is="facebook ? 'a' : 'span'" :href="facebook?.url" :target="facebook ? '_blank' : undefined" :rel="facebook ? 'noopener noreferrer' : undefined" class="footer-social" :aria-label="facebook ? 'Facebook Mẹ Thủy Làm Y (mở tab mới)' : 'Facebook — chưa có liên kết chính thức'" :aria-disabled="!facebook || undefined">
              <span class="footer-social-icon"><img class="footer-facebook" src="/images/footer/footer-facebook.svg" width="80" height="80" alt="Facebook" /></span>
            </component>
            <a v-if="tiktok" :href="tiktok.url" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="TikTok Mẹ Thủy Làm Y (mở tab mới)"><img src="/images/footer/footer-tiktok.svg" width="36" height="36" alt="TikTok" /></a>
          </div>
        </div>
      </div>
    </BaseContainer>
  </footer>
</template>

<style scoped>
.koc-footer { padding-block:var(--koc-space-8); color:var(--color-neutral-900); font:var(--koc-weight-medium) var(--koc-body-base-size)/var(--koc-body-base-line) var(--font-body); background:linear-gradient(180deg,var(--color-neutral-100) 29.842%,var(--color-primary-100) 110.04%); }
.footer-layout { display:flex; flex-direction:column; gap:var(--koc-space-6); padding-inline:var(--koc-space-4); }
.footer-brand { display:flex; flex-direction:column; align-items:flex-start; gap:var(--koc-space-6); }
.footer-logo { display:flex; height:32px; align-items:center; }
.footer-tagline { margin:0; font:var(--koc-weight-regular) var(--text-h2-mobile)/var(--text-h2-mobile--line-height) var(--font-heading); font-variation-settings:"SOFT" 0,"WONK" 1; color:var(--color-neutral-800); }
.footer-groups { display:flex; flex-direction:column; gap:var(--koc-space-6); }
.footer-group { display:flex; flex-direction:column; gap:var(--koc-space-6); min-width:0; }
.footer-group h2 { margin:0; font:var(--koc-weight-medium) var(--koc-body-2xl-size)/var(--koc-body-2xl-line) var(--font-body); }
.footer-group ul { display:flex; flex-direction:column; gap:var(--koc-space-3); list-style:none; padding:0; margin:0; }
.footer-group a { overflow-wrap:anywhere; }
.footer-contact { display:flex; flex-direction:column; gap:var(--koc-space-6); }
.footer-socials { display:flex; gap:var(--koc-space-3); }
.footer-social { display:flex; padding:var(--koc-space-1) var(--koc-space-2); align-items:center; }
.footer-social-icon { display:block; width:36px; height:36px; }
.footer-facebook { display:block; max-width:none; transform:scale(.45); transform-origin:top left; }
.footer-prenatal { display:none; }
.koc-footer a:hover { color:var(--color-primary-500); text-decoration:underline; }
.koc-footer a:focus-visible { outline:2px solid var(--color-primary-500); outline-offset:var(--koc-space-1); border-radius:4px; }
@media(min-width:40rem) and (max-width:79.999rem) { .footer-groups { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media(min-width:80rem) {
 .koc-footer { padding-block:var(--koc-space-12); background:linear-gradient(180deg,var(--color-neutral-100) 23.039%,var(--color-primary-100) 118.14%); }
 .footer-layout { flex-direction:row; justify-content:space-between; padding-inline:var(--koc-space-20); }
 .footer-tagline { font-size:var(--text-h4); line-height:var(--text-h4--line-height); }
 .footer-groups { flex:none; width:742px; flex-direction:row; justify-content:space-between; gap:0; }
 .footer-group { width:206px; }
 .footer-contact { gap:var(--koc-space-3); }
 .footer-prenatal { display:list-item; }
}
</style>
