<template>
  <div class="notes">
    <h1 class="title">随 笔</h1>

    <p v-if="loading" class="empty">加载中…</p>
    <p v-else-if="list.length === 0" class="empty">还没有随笔</p>

    <!-- 一条随笔一张卡片，点进去看渲染好的 markdown 全文 -->
    <router-link v-for="note in list" :key="note.id" :to="`/notes/${note.id}`" class="note-card">
      <time class="date">{{ dateOf(note.created_at) }}</time>
      <h2 v-if="note.title" class="note-title">{{ note.title }}</h2>
      <p class="text">{{ plain(note.content) }}</p>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNotes, type NoteItem } from '@/api/note'
import { dateOf } from '@/utils/format'

const list = ref<NoteItem[]>([])
const loading = ref(false)

/** 卡片里只显示纯文本：markdown 的图片整段去掉，链接只留文字 */
const plain = (text: string) =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*`>_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

onMounted(async () => {
  loading.value = true
  try {
    const data = await getNotes()
    list.value = data.notes
  } catch (error) {
    console.error('获取随笔失败', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.notes {
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* 一段段短文，别拉太宽，读着累 */
  max-width: 760px;
  margin: 0 auto;
  padding-top: 8px;

  .title {
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 6px;
    color: $my-text-main;
  }

  /* 一条随笔：透明底 + 一圈描边，悬停描边变主题色 */
  .note-card {
    display: block;
    padding: 18px 20px;
    border: 1px solid $my-border-color;
    border-radius: 16px;
    background-color: transparent;
    transition:
      border-color 0.2s,
      transform 0.2s;

    &:hover {
      border-color: $my-accent-color;
      transform: translateY(-2px);
    }

    .date {
      font-size: 12px;
      letter-spacing: 1px;
      color: $my-text-light;
    }

    .note-title {
      margin-top: 8px;
      font-size: 15px;
      font-weight: 600;
      color: $my-text-main;
    }

    /* 摘要：最多四行，点进详情看全文 */
    .text {
      margin-top: 10px;
      font-size: 15px;
      line-height: 1.9;
      color: $my-text-sub;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      overflow: hidden;
    }
  }

  .empty {
    padding: 60px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }
}
</style>
