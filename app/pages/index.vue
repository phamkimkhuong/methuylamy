<script setup lang="ts">
import SectionsSectionPrenatal from '~/components/sections/SectionPrenatal.vue'
import { courseContent } from '~~/shared/content'
useProfileSeo()
</script>

<template>
  <div
    class="min-h-screen bg-neutral-white text-neutral-900 font-body selection:bg-secondary-100 selection:text-primary-500"
  >
    <!-- 1. Header & Navigation (Desktop & Mobile Drawer) -->
    <SectionsSectionNavbar />

    <main id="main-content">
      <!-- 2. Hero Section (Desktop - 9) -->
      <SectionsSectionHero />

      <!-- 3. Story Section (Desktop - 10) -->
      <SectionsSectionStory />

      <!-- 4. TikTok Section (Desktop - 20) -->
      <SectionsSectionTiktok />

      <!-- 5. Video Course Section (Desktop - 21) -->
      <SectionsSectionCourse v-if="courseContent.published" />

      <SectionsSectionPrenatal />

      <!-- 6. Professional Training Section (Desktop - 22) -->
      <SectionsSectionTraining />

      <!-- 7. Knowledge Pillars / Core Values (Desktop - 12) -->
      <SectionsSectionValues />

      <!-- 8. Publications & Knowledge Library (Desktop - 23, 24) -->
      <SectionsSectionBooks />

      <!-- 9. Cooperation Models & Medical Reviews (Desktop - 19) -->
      <SectionsSectionCooperation />

      <!-- 10. Process Flow & Brand Quality Assurance (Desktop - 13) -->
      <SectionsSectionProcess />

      <!-- 11. Press Articles & Media Endorsements (Desktop - 14) -->
      <SectionsSectionPress />

      <!-- 12. Accompanying Partner Brands (Desktop - 15) -->
      <SectionsSectionPartners />

      <!-- 13. Direct Contact & Consultation Lead Form (Desktop - 16) -->
      <SectionsSectionContact />
      
      <!-- 14. Frequently Asked Questions (Desktop - 17) -->
      <SectionsSectionFaq />
    </main>

    <!-- 15. Comprehensive Footer (Desktop 2449:5206) -->
    <SectionsSectionFooter />

    <!-- 16. Mobile Sticky CTA Conversion Bar (< 1280px) -->
    <MobileStickyCta />
  </div>
</template>
