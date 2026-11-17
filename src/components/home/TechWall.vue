<template>
  <div class="tech-wall">
    <div v-for="(column, ci) in columns" :key="ci" class="tech-col">
      <div
        v-for="item in column"
        :key="item.name"
        class="tech-icon"
        :title="item.name"
        :style="{ color: brandColor(item.hex), '--rot': item.rot, '--dx': item.dx }"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path :d="item.path" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  siVuedotjs,
  siTypescript,
  siVite,
  siSass,
  siPinia,
  siExpress,
  siNodedotjs,
  siPostgresql,
  siPnpm,
  siGit,
  siGithub,
  siMarkdown,
  siElement,
  siFigma,
  siNginx,
  siDocker,
  siCloudflare,
  siJavascript,
  siNpm,
  siDeno,
  siDeepseek,
} from 'simple-icons'

// 图标来自 simple-icons，hex 是官方品牌色
const techList = [
  { name: 'Vue 3', icon: siVuedotjs },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Vite', icon: siVite },
  { name: 'Sass', icon: siSass },
  { name: 'Pinia', icon: siPinia },
  { name: 'Vue Router', icon: siVuedotjs },
  { name: 'Express', icon: siExpress },
  { name: 'Node.js', icon: siNodedotjs },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'pnpm', icon: siPnpm },
  { name: 'Element Plus', icon: siElement },
  { name: 'Markdown', icon: siMarkdown },
  { name: 'Git', icon: siGit },
  { name: 'GitHub', icon: siGithub },
  { name: 'Figma', icon: siFigma },
  { name: 'Nginx', icon: siNginx },
  { name: 'Docker', icon: siDocker },
  { name: 'npm', icon: siNpm },
  { name: 'JavaScript', icon: siJavascript },
  { name: 'Deepseek', icon: siDeepseek },
  { name: 'Deno.js', icon: siDeno },
  { name: 'Cloudflare', icon: siCloudflare },
]

/** 用 index 直接算角度：范围 -9 ~ 9 度，看起来没有规律但每页一致 */
const rotationOf = (index: number) => `${((index * 7) % 25) - 12}deg`

/** 横向微移：范围 -5 ~ 5 px */
const offsetOf = (index: number) => `${((index * 3) % 11) - 5}px`

interface WallItem {
  name: string
  hex: string
  path: string
  rot: string
  dx: string
}

// 每隔 3 个取一个，分成三列；带上原始序号算角度，三列的抖动才不重复
const columns: WallItem[][] = [0, 1, 2].map((columnIndex) =>
  techList
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index % 3 === columnIndex)
    .map(({ item, index }) => ({
      name: item.name,
      hex: item.icon.hex,
      path: item.icon.path,
      rot: rotationOf(index),
      dx: offsetOf(index),
    })),
)
/**
 * 品牌色太黑的（GitHub / Express / Markdown）在暗色底上看不见，
 * 换成正文颜色；判断用人眼亮度，不能直接比十六进制数值大小。
 */
const brandColor = (hex: string) => {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const brightness = r * 0.299 + g * 0.587 + b * 0.114
  return brightness < 60 ? 'var(--my-text-main)' : `#${hex}`
}
</script>

<style scoped lang="scss">
.tech-wall {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px 0;
}

/* 三列各自错开高度和间距，避免看起来像表格 */
.tech-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &:nth-child(1) {
    margin-top: 0;
  }

  &:nth-child(2) {
    margin-top: 36px;
    gap: 22px;
  }

  &:nth-child(3) {
    margin-top: 14px;
    gap: 18px;
  }
}

.tech-icon {
  width: 44px;
  margin-bottom: 24px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: color-mix(in srgb, var(--my-bg-card) 15%, transparent);
  border: 1px solid $my-border-color;
  box-shadow: 0 6px 16px $my-shadow-color;

  /* 每个图标自己的角度 + 横向偏移 */
  transform: rotate(var(--rot)) translateX(var(--dx));
  transition:
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.18s,
    box-shadow 0.18s;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    border-color: $my-accent-color;
    box-shadow: 0 10px 22px $my-shadow-color;
  }
}
</style>
