<template>
  <div v-if="article" class="article-detail">
    <!-- 左边：正文 -->
    <article class="article">
      <!-- 上半截：左边字数/标题/标签，右边封面 -->
      <div class="header">
        <div class="head-main">
          <img v-if="article.url" class="cover" :src="coverOf(article.url)" :alt="article.title" />
          <div class="stats">
            <span><Document /> {{ wordCount }} 字</span>
            <span><Clock /> {{ readMinutes }} 分钟</span>
          </div>

          <h1 class="title">{{ article.title }}</h1>

          <div class="meta">
            <span class="item"><Calendar /> {{ dateOf(article.created_at) }}</span>
            <span v-for="label in article.labels" :key="label.id" class="item">
              <PriceTag /> {{ label.label_name }}
            </span>
            <span class="item"><View /> 浏览量 {{ article.views }}</span>
            <button
              class="item praise-btn"
              :class="{ activePraise: isPraised }"
              @click="togglePraise"
            >
              <Star /> {{ isPraised ? '已收藏' : '收藏' }} {{ article.praise_count }}
            </button>
          </div>

          <!-- 不是博主A 自己写的，就当投稿处理 -->
          <template v-if="!isOwner">
            <p class="notice">本文为朋友投稿。</p>
            <p class="notice">投稿者：{{ article.username_name }}</p>
          </template>
          <!-- 简介：正文前面单独一块 -->
          <p v-if="article.introduce" class="intro">{{ article.introduce }}</p>
        </div>
      </div>

      <div class="content">{{ article.content }}</div>

      <!-- 附件下载 -->
      <div v-if="article.attachments.length" class="attachments">
        <a
          v-for="file in article.attachments"
          :key="file.id"
          class="download"
          :href="API_BASE + file.url"
          :download="file.file_name"
        >
          <Download />
          {{ file.file_name }}
        </a>
      </div>
    </article>

    <!-- 右边：评论 -->
    <aside class="comments">
      <CommentBox :article-id="article.id" />
    </aside>
  </div>

  <p v-else-if="failed" class="loading">文章不存在，或者还没发布</p>
  <p v-else class="loading">加载中…</p>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, Clock, Document, Download, PriceTag, Star, View } from '@element-plus/icons-vue'
import {
  getArticleDetail,
  addView,
  praiseArticle,
  offPraiseArticle,
  type ArticleDetail,
} from '@/api/article'
import { getProfile } from '@/api/profile'
import { API_BASE } from '@/utils/http'
import { coverOf, dateOf } from '@/utils/format'
import CommentBox from '@/components/article/CommentBox.vue'

const route = useRoute()
const id = String(route.params.uuid ?? '') //直接通过路由拿到id

const article = ref<ArticleDetail | null>(null)
const ownerId = ref('')
const failed = ref(false)

/* ---------- 收藏：后端只 +1，防重复靠本地记了哪些 id ---------- */

const readPraised = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('praised-articles') ?? '[]')
  } catch {
    return []
  }
}

const isPraised = ref(false) //是不是已经收藏过这篇

/** 点一下收藏，再点一下取消（本地记 id，后端只管加减数字） */
const togglePraise = async () => {
  try {
    if (isPraised.value) {
      const { praise_count } = await offPraiseArticle(id)
      article.value!.praise_count = praise_count
      localStorage.setItem(
        'praised-articles',
        JSON.stringify(readPraised().filter((item) => item !== id)),
      )
      isPraised.value = false
    } else {
      const { praise_count } = await praiseArticle(id)
      article.value!.praise_count = praise_count
      localStorage.setItem('praised-articles', JSON.stringify([...readPraised(), id]))
      isPraised.value = true
    }
  } catch (error) {
    console.error('切换收藏失败', error)
  }
}

const wordCount = computed(() => article.value?.content.length ?? 0)
/** 平均 200 字 1 分钟，向上取整，最少 1 分钟 */
const readMinutes = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)))
/** 作者就是博主A（权限 0 那位）才不算投稿 */
const isOwner = computed(() => !ownerId.value || article.value?.user_id === ownerId.value)

onMounted(async () => {
  try {
    const [detail, profile] = await Promise.all([getArticleDetail(id), getProfile()])
    article.value = detail
    ownerId.value = profile.id

    // 这篇以前收藏过没有（本地记的）
    isPraised.value = readPraised().includes(id)

    // 浏览量 +1，把最新数字盖回来
    const fresh = await addView(id)
    article.value.views = fresh.views
  } catch (error) {
    console.error('获取文章详情失败', error)
    failed.value = true
  }
})
</script>

<style scoped lang="scss">
.article-detail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;

  .article,
  .comments {
    padding: 24px;
    border: 1px solid $my-border-color;
    border-radius: 16px;
    background-color: transparent;
  }
  .comments {
    padding: 14px;
  }
  /* ---------- 正文 ---------- */
  .article {
    min-width: 0;

    /* 上半截：左边字数/标题/标签，右边封面 */
    .header {
      .head-main {
        display: flow-root;
      }

      /* 封面钉在右上角，图比例随便，裁一裁 */
      .cover {
        float: right;
        width: 480px;
        max-height: 280px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid $my-border-color;
        background-color: $my-bg-hover;
        margin-left: 24px;
        margin-bottom: 16px;
      }
      /* 简介：正文前面单独一块，左边一道主题色竖线 */
      .intro {
        margin-top: 20px;
        padding: 10px 0 10px 14px;
        border-left: 3px solid $my-accent-color;
        font-size: 14px;
        line-height: 1.9;
        color: $my-text-sub;
      }
    }

    /* 附件下载：正文最底下一排按钮 */
    .attachments {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px dashed $my-border-color;

      .download {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border: 1px solid $my-border-color;
        border-radius: 8px;
        font-size: 13px;
        color: $my-text-sub;
        transition:
          color 0.15s,
          border-color 0.15s;

        &:hover {
          color: $my-accent-color;
          border-color: $my-accent-color;
        }
      }
    }

    /* 顶上那行：多少字 / 读几分钟 */
    .stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: $my-text-light;

      span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }

    /* 标题左边一根蓝色竖线 */
    .title {
      position: relative;
      margin-top: 16px;
      padding-left: 16px;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.4;
      color: $my-text-main;

      &::before {
        content: '';
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        width: 4px;
        border-radius: 2px;
        background-color: $my-accent-color;
      }
    }

    /* 日期 / 标签 / 浏览量 / 收藏，一排小方块 */
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;

      .item {
        background-color: #00000000;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        border: 1px solid $my-border-color;
        border-radius: 6px;
        font-size: 12px;
        color: $my-text-sub;
      }
      .activePraise {
        color: $my-accent-color;
        border-color: $my-accent-color;
      }
      .praise-btn {
        width: 85px;
      }
    }

    /* 投稿说明：左边一道短线 */
    .notice {
      margin-top: 18px;
      padding: 2px 0 2px 14px;
      border-left: 3px solid $my-border-color;
      font-size: 14px;
      color: $my-text-sub;
    }

    .content {
      margin-top: 22px;
      font-size: 15px;
      line-height: 2;
      color: $my-text-main;
      /* 正文里的换行原样保留 */
      white-space: pre-wrap;
    }
  }

  /* ---------- 评论 ---------- */
  .loading {
    padding: 60px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }

  /* Element Plus 图标只带 viewBox，得自己给尺寸 */
  :deep(svg) {
    width: 1em;
    height: 1em;
  }

  /* 窄了就把评论放到下面 */
  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }

  /* 再窄一点，封面也从右边挪到标题上面 */
  @media (max-width: 720px) {
    .article .header {
      flex-direction: column;

      .cover {
        width: 100%;
        height: 200px;
      }
    }
  }
}
</style>
