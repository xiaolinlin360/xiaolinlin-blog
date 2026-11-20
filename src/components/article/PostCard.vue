<template>
  <router-link :to="articleUrl" class="post-card">
    <div class="cover-box">
      <img v-if="article.url" class="cover" :src="coverOf(article.url)" :alt="article.title" />
      <div v-else class="cover none">暂无封面</div>
    </div>

    <div class="info">
      <div class="meta">
        <span v-if="categoryName" class="category">{{ categoryName }}</span>
        <span v-if="latest" class="badge">最新</span>
      </div>

      <h3 class="title">{{ article.title }}</h3>

      <p class="excerpt">{{ excerptOf(article) }}</p>

      <div class="foot">
        <div class="tags">
          <span v-for="label in article.labels" :key="label.id" class="tag">
            # {{ label.label_name }}
          </span>
        </div>
        <span class="date">{{ dateOf(article.created_at) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleItem } from '@/api/article'
import { coverOf, dateOf, excerptOf } from '@/utils/format'

const props = defineProps<{
  article: ArticleItem
  /** 子分类名，父组件从 subsets 里查好传进来 */
  categoryName?: string
  /** 是不是最新一篇，是就挂个「最新」角标 */
  latest?: boolean
}>()

/** 带参路由，跟首页列表保持一致 */
const articleUrl = computed(() => ({ path: '/article', query: { id: props.article.id } }))
</script>

<style scoped lang="scss">
.post-card {
  display: block;
  overflow: hidden;
  border-radius: 12px;
  background-color: $my-bg-card;
  border: 1px solid $my-border-color;
  transition:
    transform 0.18s,
    border-color 0.18s;

  &:hover {
    border-color: $my-accent-color;
  }

  /* 封面按 16:9 撑满整张卡片上沿 */
  .cover-box {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background-color: $my-bg-hover;

    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;

      /* 没封面时用一块占位色 + 一行字 */
      &.none {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: $my-text-light;
      }
    }
  }

  .info {
    padding: 14px 16px 16px;
  }

  /* 分类标签 + 「最新」角标 */
  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;

    .category {
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      color: $my-accent-color;
      background-color: color-mix(in srgb, var(--my-accent-color) 12%, transparent);
    }

    .badge {
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      color: $my-text-light;
      background-color: $my-bg-hover;
    }
  }

  .title {
    /* 钉死两行的高度（16px × 1.5 × 2）：
       标题只有一行时也把位置占满，卡片才不会被内容撑成高矮不一 */
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: $my-text-main;

    /* 最多两行，多的收掉 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  /* 简介同样钉死两行 */
  .excerpt {
    height: 40px; /* 13px × 20px 行高 × 2 */
    margin-top: 6px;
    font-size: 13px;
    line-height: 20px;
    color: $my-text-sub;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  /* 底部：左边一串 # 标签，右边日期 */
  .foot {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;

    .tags {
      display: flex;
      /* 标签永远只占一行，多了裁掉，否则标签换行会把底部撑高 */
      flex-wrap: nowrap;
      overflow: hidden;
      gap: 4px 10px;
      min-width: 0;

      .tag {
        font-size: 12px;
        color: $my-text-light;
      }
    }

    .date {
      flex: none;
      font-size: 12px;
      color: $my-text-light;
    }
  }
}
</style>
