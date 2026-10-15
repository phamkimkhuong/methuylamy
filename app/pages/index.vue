<script setup lang="ts">
import { books, courses, profile } from '~~/shared/content'
useProfileSeo()
</script>

<template>
  <div>
    <header class="border-b border-line">
      <UiContainer class="flex flex-wrap items-center justify-between gap-5 py-6">
        <a href="/" class="text-lg font-semibold tracking-tight">{{ profile.brandName }}<span class="text-accent" aria-hidden="true">.</span></a>
        <nav aria-label="Điều hướng chính" class="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
          <a href="#gioi-thieu" class="hover:text-accent">Giới thiệu</a>
          <a v-if="profile.specialties.length" href="#chuyen-mon" class="hover:text-accent">Chuyên môn</a>
          <a href="#ket-noi" class="hover:text-accent">Kết nối</a>
        </nav>
      </UiContainer>
    </header>

    <main id="main-content" tabindex="-1">
      <section id="gioi-thieu" aria-labelledby="profile-heading">
        <UiContainer class="grid items-center gap-12 py-16 sm:py-24 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p class="eyebrow mb-5">{{ profile.jobTitle }}</p>
            <h1 id="profile-heading" class="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">{{ profile.name }}</h1>
            <p class="mt-4 text-2xl text-accent">{{ profile.brandName }}</p>
            <p class="mt-7 max-w-xl text-lg leading-relaxed text-muted">{{ profile.description }}</p>
            <p v-for="paragraph in profile.biography" :key="paragraph" class="mt-4 max-w-xl leading-relaxed text-muted">{{ paragraph }}</p>
            <div class="mt-9 flex flex-wrap gap-3">
              <UiButton href="#ket-noi">Kết nối với Thanh Thủy</UiButton>
              <UiButton v-if="profile.links[0]" :href="profile.links[0].url" variant="secondary">{{ profile.links[0].label }}</UiButton>
            </div>
          </div>
          <UiResponsiveImage v-if="profile.portrait" :image="profile.portrait" priority />
          <aside v-else aria-label="Thông tin chuyên môn" class="flex min-h-72 flex-col justify-between rounded-3xl border border-line bg-white p-8 sm:p-10">
            <span aria-hidden="true" class="text-7xl font-light tracking-tighter text-accent/30">TT<span class="text-accent">.</span></span>
            <div class="mt-12">
              <p class="text-xl font-semibold">{{ profile.jobTitle }}</p>
              <a v-if="profile.organization" :href="profile.organization.url" class="text-link mt-2 inline-block text-muted">{{ profile.organization.name }}</a>
            </div>
          </aside>
        </UiContainer>
      </section>

      <UiSection v-if="profile.specialties.length" id="chuyen-mon" title="Chuyên môn & lĩnh vực đào tạo" eyebrow="Đồng hành cùng mẹ và bé">
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="(specialty, index) in profile.specialties" :key="specialty" class="flex items-start gap-5 rounded-2xl border border-line bg-white p-6">
            <span aria-hidden="true" class="text-sm text-accent">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="text-lg font-medium">{{ specialty }}</span>
          </li>
        </ul>
      </UiSection>

      <UiSection v-if="profile.experience.length" id="kinh-nghiem" title="Quá trình công tác">
        <article v-for="entry in profile.experience" :key="entry.title" class="mb-6">
          <h3 class="text-xl font-semibold">{{ entry.title }}</h3>
          <p v-if="entry.description" class="mt-2 leading-relaxed text-muted">{{ entry.description }}</p>
        </article>
      </UiSection>
      <UiSection v-if="profile.credentials.length" id="chung-chi" title="Bằng cấp & chứng chỉ">
        <article v-for="entry in profile.credentials" :key="entry.title" class="mb-6">
          <h3 class="text-xl font-semibold">{{ entry.title }}</h3>
          <p v-if="entry.description" class="mt-2 leading-relaxed text-muted">{{ entry.description }}</p>
        </article>
      </UiSection>
      <ProfileResources id="sach" title="Sách & tài liệu" :items="books" />
      <ProfileResources id="khoa-hoc" title="Khóa học" :items="courses" />

      <UiSection id="ket-noi" title="Cùng kết nối, cùng sẻ chia" eyebrow="Mẹ Thủy Làm Y">
        <p class="max-w-xl leading-relaxed text-muted">Theo dõi những chia sẻ của Thanh Thủy và tìm hiểu các khóa học, dịch vụ tại Vạn Phúc Care.</p>
        <ul class="mt-7 flex flex-wrap gap-3">
          <li v-for="link in [...profile.socialLinks, ...profile.links]" :key="link.url">
            <UiButton :href="link.url" variant="secondary">{{ link.label }} <span class="ml-2" aria-hidden="true">↗</span></UiButton>
          </li>
        </ul>
      </UiSection>
    </main>

    <footer class="border-t border-line py-7 text-sm text-muted">
      <UiContainer class="flex flex-wrap justify-between gap-3">
        <p>{{ profile.brandName }} · {{ profile.name }}</p>
        <a href="#gioi-thieu" class="text-link">Về đầu trang ↑</a>
      </UiContainer>
    </footer>
  </div>
</template>
