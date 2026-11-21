<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <RouterLink to="/blog" class="brand">xiaolinlin</RouterLink>

      <!-- 图标导航：名字放 title 里，鼠标悬停显示 -->
      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :title="item.name"
        >
          <component :is="item.icon" />
        </RouterLink>
      </nav>

      <button
        class="theme-btn"
        type="button"
        :title="isDark ? '切换到亮色' : '切换到深色'"
        @click="toggleDark()"
      >
        <Moon v-if="isDark" />
        <Sunny v-else />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  HomeFilled,
  Reading,
  Picture,
  Notebook,
  ChatDotRound,
  Sunny,
  Moon,
} from '@element-plus/icons-vue'
import { isDark, toggleDark } from '@/composables/useTheme'

const navItems = [
  { name: '博客', path: '/blog', icon: HomeFilled },
  { name: '文章', path: '/article', icon: Reading },
  { name: '图库', path: '/gallery', icon: Picture },
  { name: '随笔', path: '/notes', icon: Notebook },
  { name: '留言', path: '/guestbook', icon: ChatDotRound },
]

// 深浅色状态在 composables/useTheme.ts 里统一管，这里只管用

// 滚过一点才给顶栏加毛玻璃，在最顶上时它完全透明
const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped lang="scss">
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;

  /* 默认：完全透明，贴着网格背景 */
  background-color: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(0);
  transition:
    background-color 0.3s,
    border-color 0.3s,
    backdrop-filter 0.3s;
}

/* 下滚之后：毛玻璃 + 细线 */
.site-header.is-scrolled {
  background-color: color-mix(in srgb, var(--my-bg-card) 78%, transparent);
  border-bottom-color: var(--my-border-color);
  backdrop-filter: blur(12px);
}

.header-inner {
  max-width: var(--my-content-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  color: $my-text-main;
  transition: color 0.15s;

  &:hover {
    color: $my-accent-color;
  }
}

/* margin: 0 auto 让导航在品牌和按钮之间居中 */
.nav {
  display: flex;
  gap: 4px;
  margin: 0 auto;
}

/* 图标是 SVG，宽高跟着 font-size 走 */
.nav-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
  color: $my-text-sub;
  transition:
    color 0.15s,
    background-color 0.15s;

  /* EP 图标只带 viewBox 不带宽高，必须自己给尺寸，否则会按 300x150 渲染 */
  :deep(svg) {
    width: 1em;
    height: 1em;
  }

  &:hover {
    color: $my-text-main;
    background-color: $my-bg-hover;
  }

  /* 当前页：品牌色 */
  &.router-link-exact-active {
    color: #fff;
    background-color: $my-accent-color;
  }
}

.theme-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $my-border-color;
  border-radius: 50%;
  background-color: transparent;
  color: $my-text-sub;
  font-size: 17px;
  cursor: pointer;

  :deep(svg) {
    width: 1em;
    height: 1em;
  }
  transition:
    color 0.15s,
    border-color 0.15s;

  &:hover {
    color: $my-accent-color;
    border-color: $my-accent-color;
  }
}
</style>
