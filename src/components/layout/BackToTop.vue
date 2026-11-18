<!-- 回到顶部：一只猫 -->
<template>
  <a class="cd-top" :style="{ top }" href="#" aria-label="回到顶部" @click.prevent="toTop" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const HEADER = 64
const IMAGE = 950

const { y } = useWindowScroll()
const { height } = useWindowSize()
const top = computed(() => {
  if (y.value <= HEADER) return '-900px'
  return height.value < IMAGE ? `${height.value - IMAGE - HEADER}px` : '0px'
})
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style scoped lang="scss">
.cd-top {
  position: fixed;
  right: 24px;
  width: 72px;
  height: 950px;
  z-index: 9;
  background: url('/scroll.png') no-repeat;
  background-size: contain;
  transition: top 0.5s ease-in-out;
}
</style>
