<template>
  <div v-if="note" class="note-detail">
    <article class="note">
      <header class="head">
        <time class="date">{{ dateOf(note.created_at) }}</time>
        <h1 v-if="note.title" class="title">{{ note.title }}</h1>
      </header>

      <!-- 正文：markdown 渲染出来的 HTML -->
      <div class="markdown" v-html="html"></div>

      <router-link to="/notes" class="back">← 返回随笔列表</router-link>
    </article>

    <!-- 右栏只留目录 -->
    <TocNav :headings="headings" />
  </div>

  <p v-else-if="failed" class="loading">这篇随笔不存在</p>
  <p v-else class="loading">加载中…</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNotes, type NoteItem } from '@/api/note'
import { renderMarkdown, type Heading } from '@/utils/markdown'
import { dateOf } from '@/utils/format'
import TocNav from '@/components/markdown/TocNav.vue'

const route = useRoute()
const id = String(route.params.id ?? '')

const note = ref<NoteItem | null>(null)
const failed = ref(false)
const html = ref('')
const headings = ref<Heading[]>([])

onMounted(async () => {
  try {
    // 接口只有列表，就直接取列表再挑出这一篇
    const data = await getNotes(50)
    const found = data.notes.find((item) => item.id === id)
    if (!found) return (failed.value = true)

    note.value = found
    const rendered = renderMarkdown(found.content)
    html.value = rendered.html
    headings.value = rendered.headings
  } catch (error) {
    console.error('获取随笔失败', error)
    failed.value = true
  }
})
</script>

<style scoped lang="scss">
.note-detail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;

  .note {
    margin-top: 24px;
    min-width: 0;
    max-width: 820px;
    padding: 26px 28px;
    border: 1px solid $my-border-color;
    border-radius: 16px;
  }

  .head {
    padding-bottom: 18px;
    border-bottom: 1px dashed $my-border-color;

    .date {
      font-size: 12px;
      letter-spacing: 1px;
      color: $my-text-light;
    }

    .title {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.4;
      color: $my-text-main;
    }
  }

  /* 正文排版在 style/markdown.scss 里，这里只管间距 */
  .markdown {
    margin-top: 18px;
  }

  .back {
    display: inline-block;
    margin-top: 28px;
    font-size: 13px;
    color: $my-text-sub;
    transition: color 0.15s;

    &:hover {
      color: $my-accent-color;
    }
  }

  .loading {
    padding: 60px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }

  /* 窄了就把目录收起来 */
  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);

    :deep(.toc) {
      display: none;
    }

    .note {
      padding: 20px 18px;
    }
  }
}
</style>
