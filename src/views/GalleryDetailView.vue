<template>
  <div v-if="album && current" class="album-detail">
    <header class="head">
      <h1 class="title">{{ album.title }}</h1>
      <p class="meta">{{ album.photos.length }} 张 · {{ dateOf(album.created_at) }}</p>
    </header>

    <!-- 新增：左右布局容器 -->
    <div class="layout">
      <!-- 缩略图：点哪张看哪张（挪到左边） -->
      <ul class="thumbs">
        <li
          v-for="(photo, i) in photos"
          :key="photo.id"
          :class="{ active: i === index }"
          @click="index = i"
        >
          <img :src="coverOf(photo.url)" :alt="photo.file_name" loading="lazy" />
        </li>
      </ul>

      <!-- 大图：左右箭头翻页，底部一个「3 / 7」计数（挪到右边） -->
      <div class="viewer">
        <img :key="current.id" :src="coverOf(current.url)" :alt="current.file_name" />

        <button class="nav prev" :class="{ off: index === 0 }" title="上一张" @click="prev">
          ‹
        </button>
        <button
          class="nav next"
          :class="{ off: index === photos.length - 1 }"
          title="下一张"
          @click="next"
        >
          ›
        </button>

        <span class="counter">{{ index + 1 }} / {{ photos.length }}</span>
      </div>
    </div>
  </div>

  <p v-else-if="failed" class="empty">相册不存在，或者里面还没有照片</p>
  <p v-else class="empty">加载中…</p>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { getGalleryDetail, type GalleryDetail } from '@/api/gallery'
import { coverOf, dateOf } from '@/utils/format'

const route = useRoute()
const id = String(route.params.id ?? '')

const album = ref<GalleryDetail | null>(null)
const failed = ref(false)
const index = ref(0)

const photos = computed(() => album.value?.photos ?? [])
/** 当前看的那张（照片没了就是 undefined，模板里用 v-if 挡着） */
const current = computed(() => photos.value[index.value] ?? photos.value[0])

const prev = () => {
  if (index.value > 0) index.value--
}
const next = () => {
  if (index.value < photos.value.length - 1) index.value++
}

/** 键盘左右也能翻 */
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') prev()
  if (event.key === 'ArrowRight') next()
}

onMounted(async () => {
  try {
    album.value = await getGalleryDetail(id)
  } catch (error) {
    console.error('获取相册失败', error)
    failed.value = true
  }
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped lang="scss">
.album-detail {
  padding-top: 8px;

  /* ---------- 顶上：相册名 + 张数/日期 ---------- */
  .head {
    // text-align: center;

    .title {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 4px;
      color: $my-text-main;
    }

    .meta {
      margin-top: 12px;
      font-size: 12px;
      letter-spacing: 1px;
      color: $my-text-light;
    }
  }

  /* ---------- 新增：左右布局容器 ---------- */
  .layout {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }

  /* ---------- 大图区 ---------- */
  .viewer {
    position: relative;
    flex: 1; /* 新增：占满右侧剩余宽度 */
    min-width: 0; /* 新增：防止 flex 子项撑破 */
    display: flex;
    align-items: center;
    justify-content: center;
    height: min(70vh, 620px);
    overflow: hidden;

    img {
      max-width: 80%;
      max-height: 80%;
      border-radius: 10px;
      box-shadow:
        0 10px 40px $my-shadow-color,
        0 0 0 1px $my-shadow-color;
      /* 换图时淡入 */
      animation: fade-in 0.28s ease both;
    }

    /* 左右箭头：半透明圆钮，悬停变成粉紫渐变发光 */
    .nav {
      position: absolute;
      top: 50%;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 4px;
      font-size: 32px;
      line-height: 1;
      color: $my-text-main;
      background: $my-shadow-color;
      border: 1px solid $my-shadow-color;
      border-radius: 50%;
      cursor: pointer;
      transform: translateY(-50%);
      transition: 0.25s;

      &.prev {
        left: 18px;
      }

      &.next {
        right: 18px;
      }

      &:hover {
        color: #fff;
        border-color: transparent;
        background: linear-gradient(135deg, #ff8fab, #b39ddb);
        box-shadow: 0 0 22px $my-shadow-color;
        transform: translateY(-50%) scale(1.12);
      }

      /* 到头了：半透明不可点 */
      &.off {
        opacity: 0.22;
        cursor: not-allowed;

        &:hover {
          color: #ffd9e3;
          background: #ffffff24;
          border-color: rgba(255, 143, 171, 0.5);
          box-shadow: none;
          transform: translateY(-50%);
        }
      }
    }

    /* 底部计数胶囊 */
    .counter {
      position: absolute;
      bottom: 14px;
      left: 50%;
      padding: 3px 16px;
      font-size: 12px;
      letter-spacing: 1px;
      color: #ffd9e3;
      background: #ffffff24;
      border: 1px solid rgba(255, 143, 171, 0.35);
      border-radius: 999px;
      pointer-events: none;
      transform: translateX(-50%);
    }
  }

  /* ---------- 缩略图条：改成左侧纵向滚动 ---------- */
  .thumbs {
    display: flex;
    flex-direction: column; /* 横向 wrap → 纵向 */
    gap: 10px;
    margin-top: 0; /* 原来 18px，改 0（间距由 .layout 负责） */
    padding: 0 4px 0 0; /* 给滚动条留点空隙 */
    list-style: none;
    max-height: min(70vh, 620px); /* 和右侧大图等高 */
    overflow-y: auto; /* 图片多了就滚动 */
    flex-shrink: 0;

    li {
      flex-shrink: 0; /* 新增：纵向 flex 里不被压缩 */
      width: 84px;
      height: 84px;
      overflow: hidden;
      border: 2px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      opacity: 0.65;
      transition:
        opacity 0.15s,
        border-color 0.15s;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        opacity: 1;
      }

      /* 当前这张高亮 */
      &.active {
        opacity: 1;
        border-color: #ff8fab;
      }
    }
  }

  .empty {
    padding: 60px 0;
    text-align: center;
    font-size: 13px;
    color: $my-text-light;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
