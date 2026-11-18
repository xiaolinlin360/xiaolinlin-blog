<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import BackToTop from '@/components/layout/BackToTop.vue'
</script>

<template>
  <!-- 顶栏 -->
  <SiteHeader />

  <main class="site-main">
    <RouterView />
  </main>
  <!-- 底栏：备案信息 -->
  <SiteFooter />
  <!-- 回到顶部：一只猫 -->
  <BackToTop />
</template>

<style scoped lang="scss">
.site-main {
  max-width: var(--my-content-width);
  margin: 0 auto;
  padding: 0px 30px;
  // padding: 32px 24px 0;
  /* 底部留给 footer 自己的 margin-top */
  min-height: calc(100vh - 64px - 140px);
}
</style>
