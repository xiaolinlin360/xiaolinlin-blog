<template>
  <div class="blog-layout">
    <ProfileCard class="side" />

    <section class="main">
      <!-- 顶上一排分类：全部 + 大分类「文章」下面的子分类 -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: tab.id === activeId }"
          @click="select(tab.id)"
        >
          <span class="icon">{{ tab.id === '' ? '💠' : '🏷️' }}</span>
          <span class="text">{{ tab.name }}</span>
        </button>
      </div>

      <h2 class="heading">
        {{ heading }}
        <span class="count">{{ total }}</span>
      </h2>

      <div class="grid">
        <PostCard
          v-for="(item, index) in list"
          :key="item.id"
          :article="item"
          :category-name="nameOf(item)"
          :latest="index === 0 && !activeId"
        />
      </div>

      <p v-if="!loading && list.length === 0" class="empty">这个分类下还没有文章</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProfileCard from '@/components/article/ProfileCard.vue'
import PostCard from '@/components/article/PostCard.vue'
import { getArticles, getTotalArticle, type ArticleItem } from '@/api/article'
import { getCategories, getSubsets, type Subset } from '@/api/subset'

const subsets = ref<Subset[]>([])
const activeId = ref('') // '' = 全部文章
const list = ref<ArticleItem[]>([])
const total = ref(0)
const loading = ref(false)

/** 「全部文章」是写死的第一项，后面接接口拿到的子分类 */
const tabs = computed(() => [
  { id: '', name: '全部文章' },
  ...subsets.value.map((item) => ({ id: item.id, name: item.name })),
])

const heading = computed(
  () => tabs.value.find((tab) => tab.id === activeId.value)?.name ?? '全部文章',
)

/** 子分类 id -> 名字，卡片上的分类角标要用 */
const nameOf = (item: ArticleItem) =>
  subsets.value.find((subset) => subset.id === item.subset_id)?.name ?? ''

const load = async () => {
  loading.value = true
  try {
    const [page, count] = await Promise.all([
      getArticles(12, 1, activeId.value || undefined),
      getTotalArticle(activeId.value || undefined),
    ])
    list.value = page.articles
    total.value = count.total
  } catch (error) {
    console.error('获取文章列表失败', error)
  } finally {
    loading.value = false
  }
}

const select = (id: string) => {
  activeId.value = id
  load()
}

onMounted(async () => {
  try {
    // 先找到 path 是 /blog 的那个大分类，再拿它下面的子分类
    const categories = await getCategories()
    const blog = categories.find((item) => item.path === '/blog')
    if (blog) subsets.value = await getSubsets(blog.id)
  } catch (error) {
    console.error('获取分类失败', error)
  }
  await load()
})
</script>

<style scoped lang="scss">
.blog-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  /* 右边文章少的时候别让整行跟着塌下来，
     否则左边的 sticky 卡片会被容器高度挤回去（跳 24px） */
  min-height: calc(100vh - 64px - 140px);

  /* 左边个人卡跟着滚 */
  .side {
    position: sticky;
    top: 88px;
  }

  .main {
    min-width: 0;
  }

  /* ---------- 顶上一排分类 (微调重写) ---------- */
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    margin-bottom: 4px;

    .tab {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 0 10px 0;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 14px;
      color: $my-text-sub;
      cursor: pointer;
      outline: none;
      transition: color 0.3s ease;

      .icon {
        font-size: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* 未选中：去色并降低透明度，呈现银灰质感 */
        filter: grayscale(100%) opacity(0.6);
        transition: filter 0.3s ease;
      }

      .text {
        letter-spacing: 0.5px;
      }

      /* 悬浮态 */
      &:hover:not(.active) {
        color: $my-text-main;
        .icon {
          filter: grayscale(100%) opacity(0.8);
        }
      }

      /* 当前选中的那个 */
      &.active {
        color: $my-accent-color;

        /* 选中：强制将 Emoji 转为主题蓝 */
        .icon {
          filter: sepia(100%) hue-rotate(190deg) saturate(500%) brightness(110%);
          opacity: 1;
        }
      }

      /* 底部指示线 (无发光) */
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $my-accent-color;
        border-radius: 2px;
        opacity: 0;
        transform: scaleX(0.5);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* 选中时下划线展开 */
      &.active::after {
        opacity: 1;
        transform: scaleX(1);
      }
    }
  }

  .heading {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 18px 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: $my-text-main;

    .count {
      font-size: 13px;
      font-weight: 400;
      color: $my-text-light;
    }
  }

  /* ---------- 文章卡片：两列 ---------- */
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .empty {
    padding: 60px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }

  /* 窄了就收成一列，再把个人卡挪到最上面 */
  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);

    .side {
      position: static;
    }

    .grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
