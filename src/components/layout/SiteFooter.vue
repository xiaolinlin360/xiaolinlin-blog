<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>© {{ year }} xiaolinlin · にほんごがわからないと、このぶんはよめないよ。</div>
      <div>粤ICP备2026170399号</div>
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
  display: flex;
  justify-content: space-between;
}
</style>
