<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>© {{ year }} 逸刻 · 春祺夏安，秋绥冬禧</p>

      <!-- 备案号下来后，把下面这行取消注释并填上号 -->
      <p class="icp">粤ICP备2026170399号</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.site-footer {
  margin-top: 64px;
  border-top: 1px solid $my-border-color;
  padding: 24px;
  transition:
    border-color 0.3s,
    color 0.3s;
}

.footer-inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
  font-size: 13px;
  line-height: 1.8;
  color: $my-text-light;

  .icp {
    font-size: 12px;
  }
}
</style>
