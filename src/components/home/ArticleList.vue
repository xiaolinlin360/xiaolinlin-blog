<template>
  <div class="post-list">
    <p v-if="loading" class="hint">加载中…</p>

    <div v-for="item in list" :key="item.id" class="post">
      <div class="post-main">
        <img v-if="item.url" class="cover" :src="coverOf(item.url)" :alt="item.title" />

        <div class="body">
          <div class="head">
            <router-link :to="articleUrl(item.id)" class="title" :title="item.title">
              {{ item.title }}
            </router-link>
            <span class="date">
              <Clock />
              发布于 {{ dateOf(item.created_at) }}
            </span>
          </div>

          <p class="excerpt">{{ excerptOf(item) }}</p>
          <router-link :to="articleUrl(item.id)" class="more">…</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { getArticles, type ArticleItem } from '@/api/article'
import { API_BASE } from '@/utils/http'

const list = ref<ArticleItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await getArticles(10)
    list.value = data.articles
  } catch (error) {
    console.error('获取文章列表失败', error)
  } finally {
    loading.value = false
  }
})

/** 带参路由：/article?id=xxx，详情页那边用 route.query.id 取 */
const articleUrl = (id: string) => ({ path: '/article', query: { id } })

/** 封面可能是 /data/xxx 相对路径，也可能直接是外链 */
const coverOf = (url: string) => (url.startsWith('http') ? url : API_BASE + url)

// 转成本地日期 2026-10-18
const dateOf = (iso: string) => iso.split('T')[0]

/** 列表里优先用简介，没有就把正文的标签去掉凑一段 */
const excerptOf = (item: ArticleItem) =>
  item.introduce ||
  item.content
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
</script>

<style scoped lang="scss">
.post-list {
  margin-top: 16px;

  .hint {
    padding: 40px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }

  /* 一条就是：左封面 + 右边标题/日期/摘要，两条中间一根短横线 */
  .post {
    display: block;

    /* 最后一条后面不画线 */
    &:not(:last-child)::after {
      content: '';
      display: block;
      width: 220px;
      height: 1px;
      margin: 26px auto 0;
      background-color: $my-border-color;
    }

    /* 左边封面 + 右边文字 */
    .post-main {
      display: flex;
      gap: 16px;
      padding: 22px 0;
    }

    .cover {
      flex: none;
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid $my-border-color;
      background-color: $my-bg-hover;
    }

    .body {
      flex: 1;
      min-width: 0;
    }

    /* 标题一行 + 日期靠右 */
    .head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }

    .title {
      cursor: pointer;
      font-size: 20px;
      font-weight: 500;
      color: $my-text-main;
      transition: color 0.15s;

      &:hover {
        color: $my-accent-color;
      }
    }

    .date {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex: none;
      font-size: 12px;
      color: $my-text-light;

      /* Element Plus 图标只带 viewBox，得自己给尺寸 */
      :deep(svg) {
        width: 1em;
        height: 1em;
      }
    }

    .excerpt {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.9;
      color: $my-text-sub;

      /* 最多四行，多的用省略号收掉 */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      overflow: hidden;
    }

    .more {
      display: block;
      cursor: pointer;
      margin-top: 6px;
      text-align: right;
      font-size: 16px;
      letter-spacing: 2px;
      color: $my-text-light;

      &:hover {
        color: $my-accent-color;
      }
    }
  }
}
</style>
