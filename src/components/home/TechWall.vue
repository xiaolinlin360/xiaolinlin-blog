<template>
  <div class="tech-wall" :class="{ 'is-gone': gone }">
    <div v-for="(column, ci) in columns" :key="ci" class="tech-col">
      <div
        v-for="item in column"
        :key="item.i"
        class="tech-icon"
        :title="item.name"
        :style="{ color: brandColor(item.hex), '--rot': item.rot, '--dx': item.dx, '--i': item.i }"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path :d="item.path" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import { skillClicks } from '@/composables/useSkillFx'

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

/** 当前排布。点 Skills 的时候会整个打乱，图标就换位置了 */
const wall = ref([...techList])

/** 用 index 直接算角度：范围 -12 ~ 12 度，看起来没有规律但每页一致 */
const rotationOf = (index: number) => `${((index * 7) % 25) - 12}deg`

/** 横向微移：范围 -14 ~ 14 px */
const offsetOf = (index: number) => `${((index * 3) % 20) - 14}px`

interface WallItem {
  name: string
  hex: string
  path: string
  rot: string
  dx: string
  i: number
}

// 每隔 3 个取一个，分成三列；带上原始序号算角度，三列的抖动才不重复
const columns = computed<WallItem[][]>(() =>
  [0, 1, 2].map((columnIndex) =>
    wall.value
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => index % 3 === columnIndex)
      .map(({ item, index }) => ({
        name: item.name,
        hex: item.icon.hex,
        path: item.icon.path,
        rot: rotationOf(index),
        dx: offsetOf(index),
        // 第几个出场：index 换算过来正好是从上往下一行一行扫
        i: index,
      })),
  ),
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

/* ---------- 点 Skills 的特效：依次淡出 → 打乱位置 → 依次淡入 ---------- */

const GAP = 30 // 每个图标差 40ms 出场
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const gone = ref(false) // true = 整墙透明（CSS 里按 --i 排队淡出）
const running = ref(false) // 动画播放中，别让连点把计时器叠成一团

const play = async () => {
  if (running.value) return
  running.value = true

  gone.value = true // 从上到下依次消失
  await wait(wall.value.length * GAP + 300)

  wall.value = [...wall.value].sort(() => Math.random() - 0.5) // 全看不见了，趁机换位置
  gone.value = false // 再按新顺序依次出现

  await wait(wall.value.length * GAP + 300)
  running.value = false
}

watch(skillClicks, play)
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
    box-shadow 0.18s,
    /* 只有透明度这个属性按 --i 排队，前面几个的 hover 不受影响 */ opacity 0.3s
      calc(var(--i) * 40ms);

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    border-color: $my-accent-color;
    box-shadow: 0 10px 22px $my-shadow-color;
  }
}

/* 点 Skills 时整墙依次淡出 */
.tech-wall.is-gone .tech-icon {
  opacity: 0;
}
</style>
