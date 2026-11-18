<template>
  <div class="tag-link">
    <!-- 第一行：技术标签，底色就是各语言的品牌色，全改为 a 标签 -->
    <div class="tags">
      <a
        v-for="tag in tags"
        :key="tag.name"
        class="tag"
        href="#"
        :style="{
          backgroundColor: `#${tag.color ?? tag.icon.hex}`,
          color: textColor(tag.color ?? tag.icon.hex),
        }"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path :d="tag.icon.path" fill="currentColor" />
        </svg>
        {{ tag.name }}
      </a>
    </div>

    <!-- 第二行：链接。还没想好去处的给个 # 占位，乱跳也没事 -->
    <div class="links">
      <a
        v-for="link in links"
        :key="link.name"
        class="link"
        :href="link.href || '#'"
        :target="link.href?.startsWith('http') ? '_blank' : undefined"
        :title="link.name"
      >
        <!-- simple-icons 给的是 path 字符串，Element Plus 给的是组件，所以分两种画法 -->
        <svg v-if="link.path" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="link.path" fill="currentColor" />
        </svg>
        <component :is="link.comp" v-else />
        <span>{{ link.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  siVuedotjs,
  siSupabase,
  siCss,
  siHtml5,
  siJavascript,
  siNodedotjs,
  siPython,
  siGithub,
} from 'simple-icons'
import { Reading, Cloudy, Sunny, Picture, Avatar, MagicStick } from '@element-plus/icons-vue'

interface BrandIcon {
  path: string
  hex: string
}

/** 标签：icon 来自 simple-icons，path 是 SVG 路径，hex 是官方品牌色 */
const tags: { name: string; icon: BrandIcon; color?: string }[] = [
  { name: 'Vue', icon: siVuedotjs },
  { name: 'CSS', icon: siCss },
  { name: 'HTML5', icon: siHtml5 },
  { name: 'Javascript', icon: siJavascript },
  { name: 'Node.js', icon: siNodedotjs },
  { name: 'Python', icon: siPython },
  { name: 'Supabase', icon: siSupabase },
]

/** 底色亮的配深色字，不然 JavaScript 那种亮黄配白字根本看不清 */
const textColor = (hex: string) => {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 > 160 ? '#1f2328' : '#fff'
}

interface LinkItem {
  name: string
  /** 留空就是还没想好去哪，先不渲染链接 */
  href?: string
  /** simple-icons 的路径，和 comp 二选一 */
  path?: string
  /** Element Plus 图标组件 */
  comp?: Component
}

const links: LinkItem[] = [
  { name: 'Github', href: 'https://github.com/xiaolinlin360', path: siGithub.path },
  // TODO: Blog 要跳另一个主页面，等那边做出来再把地址填上
  { name: 'Blog', comp: Reading },
  { name: 'Cloud', comp: Cloudy },
  { name: 'Light', comp: Sunny },
  { name: 'Album', comp: Picture },
  { name: 'Virtual Characters', comp: Avatar },
  // Skills 要做特殊效果，等下一轮再动
  { name: 'Skills', comp: MagicStick },
]
</script>

<style scoped lang="scss">
.tag-link {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
}

/* ---------- 标签 ---------- */
.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 6px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  transition: transform 0.18s;
  /* 消除 a 标签默认的下划线 */
  text-decoration: none;
  cursor: pointer;

  svg {
    width: 13px;
    height: 13px;
  }
}

/* ---------- 链接 ---------- */
.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
}

.link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $my-text-sub;
  transition: color 0.15s;
  /* 消除 a 标签默认的下划线 */
  text-decoration: none;
  cursor: pointer;

  /* Element Plus 图标只带 viewBox，必须自己给尺寸 */
  :deep(svg) {
    width: 1em;
    height: 1em;
  }

  /* 全都装成能点的样子，加个 hover 效果 */
  &:hover {
    color: $my-accent-color;
  }
}
</style>
