<template>
  <div class="album">
    <ul class="photos">
      <li v-for="item in list" :key="item.id" class="photo-item">
        <RouterLink :to="`/gallery/${item.id}`" class="link">
          <!-- 相框里的照片 -->
          <span class="frame">
            <img v-if="item.gallery_urls[0]" :src="coverOf(item.gallery_urls[0])" :alt="item.title" />
            <span v-else class="no-photo">暂无</span>
          </span>
          <p class="caption">{{ item.title }} [{{ item.photo_count }}]</p>
        </RouterLink>
      </li>
    </ul>

    <p v-if="!loading && list.length === 0" class="empty">还没有相册</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGalleries, type GalleryItem } from '@/api/gallery'
import { coverOf } from '@/utils/format'

const list = ref<GalleryItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await getGalleries()
    list.value = data.gallerys
  } catch (error) {
    console.error('获取相册失败', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.album {
  padding-top: 8px;

  /* ---------- 网格：每格 200px，居中 -------- */
  .photos {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    justify-content: center;
    gap: 36px 26px;
    margin-top: 30px;
    padding: 12px 10px 46px;
    list-style: none;
  }

  /* ========== 一张「拍立得」=========
     白边全靠 padding：上 10px、左右 10px、下面交给 caption 撑 */
  .photo-item {
    position: relative; /* 胶带要绝对定位 */
    overflow: visible; /* 胶带贴在 -11px，得能探出纸外 */
    width: 200px;
    padding: 10px 10px 0;
    text-align: center;
    cursor: pointer;

    /* 米白纸张（有一点渐变，不是死白）+ 1px 描边 + 两层阴影 */
    background: linear-gradient(168deg, #fffefb, #fbf6f0);
    border: 1px solid hsla(330, 9%, 43%, 0.1);
    border-radius: 2px;
    box-shadow:
      0 1px 2px #4a44581a,
      0 10px 22px #4a445824;

    /* 整张纸歪 4 度，回弹用那个 overshoot 的贝塞尔 */
    transform: rotate(-4deg);
    transition:
      box-shadow 0.35s ease,
      transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);

    /* 顶上那道胶带：半透明粉色渐变 + 两边点线做撕口，往反方向歪 2 度 */
    &::before {
      content: '';
      position: absolute;
      top: -11px;
      left: 50%;
      width: 78px;
      height: 22px;
      transform: translateX(-50%) rotate(-2deg);
      background: linear-gradient(105deg, #ffb7c58c, #ffcdda6b);
      border-left: 2px dotted hsla(0, 0%, 100%, 0.7);
      border-right: 2px dotted hsla(0, 0%, 100%, 0.7);
      box-shadow: 0 1px 3px #4a44581f;
    }

    /* 悬停：抬起来一点，阴影加深 */
    &:hover {
      transform: rotate(-4deg) translateY(-7px);
      box-shadow:
        0 2px 4px #4a44581a,
        0 18px 34px #4a445833;
      z-index: 2;
    }

    /* 整张纸都能点，点进相册内页 */
    > .link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    /* ---------- 相框里的照片 ---------- */
    .frame {
      display: block;
      position: relative;
      width: 178px;
      height: 178px;
      margin: 0 auto;
      overflow: hidden;
      background-color: #ece5eb;
      box-shadow: 0 0 0 1px #4a445829;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
      }

      /* 内阴影：照片「陷」进纸里那种凹感 */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        box-shadow: inset 0 2px 6px #4a445847;
        pointer-events: none;
      }

      /* 相册里一张照片都没有时的占位 */
      .no-photo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 13px;
        color: #b3a8b0;
      }
    }

    /* 悬停时照片自己再放大一点点 */
    &:hover .frame img {
      transform: scale(1.05);
    }

    /* ---------- 底下那行字（超出用省略号） ---------- */
    .caption {
      margin: 9px 0 0;
      padding: 0 2px 10px;
      font-size: 16px;
      line-height: 20px;
      color: #6b5e66; /* 纸上写字，固定深灰，不跟深浅色主题走 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
