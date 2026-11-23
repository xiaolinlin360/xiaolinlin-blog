<template>
  <aside v-if="headings.length" class="toc">
    <h2 class="toc-title">文章目录</h2>
    <nav>
      <a
        v-for="(item, index) in headings"
        :key="item.id"
        class="toc-item"
        :class="{ sub: item.level > 1, active: item.id === activeId }"
        :href="`#${item.id}`"
        @click="go($event, item.id)">
        <span class="mark">{{ index + 1 }}</span>
        <span class="text">{{ item.text }}</span>
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Heading } from '@/utils/markdown'

const props = defineProps<{ headings: Heading[] }>()

/** 当前高亮的那一条 */
const activeId = ref('')

/**
 * 点目录：自己接管，别让浏览器原生跳（原生是“啪”一下到位的）。
 * scrollIntoView 带 smooth 会丝滑滚过去，标题上的 scroll-margin-top 负责让开顶栏。
 * 地址栏用 replaceState 同步，不产生历史记录、也不惊动路由。
 */
const go = (event: MouseEvent, id: string) => {
  event.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  activeId.value = id
}

/** 滚动时看哪个标题刚过顶，就高亮哪一条 */
const onScroll = () => {
  let current = ''
  for (const item of props.headings) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= 140) current = item.id
  }
  activeId.value = current
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped lang="scss">
.toc {
  position: sticky;
  top: 88px;
  padding: 18px 16px;
  border: 1px solid $my-border-color;
  border-radius: 16px;

  .toc-title {
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
    color: $my-text-main;
  }

  .toc-item {
    display: flex;
    gap: 8px;
    padding: 5px 0;
    font-size: 13px;
    line-height: 1.6;
    color: $my-text-sub;
    transition: color 0.15s;

    .mark {
      flex: none;
      width: 15px;
      font-size: 12px;
      color: $my-text-light;
    }

    .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    /* 二级以下往后缩一点 */
    &.sub {
      padding-left: 14px;
      font-size: 12px;
    }

    &:hover {
      color: $my-text-main;
    }

    /* 滚到这个标题时高亮 */
    &.active,
    &.active .mark {
      color: $my-accent-color;
    }
  }
}
</style>
