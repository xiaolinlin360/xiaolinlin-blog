<template>
  <aside class="profile-card">
    <p class="tagline">{{ tagline }}</p>

    <img class="avatar" :src="avatar" :alt="name" />

    <h1 class="name">{{ name }}</h1>
    <p class="bio">{{ bio }}</p>

    <p class="location">
      <LocationInformation />
      {{ location }}
    </p>

    <div class="foot">
      <span class="count">{{ total }} 篇文章</span>
      <div class="icons">
        <router-link to="/" title="回到首页"><HomeFilled /></router-link>
        <a href="https://github.com/xiaolinlin360" target="_blank" title="GitHub">
          <svg viewBox="0 0 24 24"><path :d="siGithub.path" fill="currentColor" /></svg>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LocationInformation, HomeFilled } from '@element-plus/icons-vue'
import { siGithub } from 'simple-icons'
import { getProfile } from '@/api/profile'
import { getTotalArticle } from '@/api/article'
import { API_BASE } from '@/utils/http'

// 简介、坐标这些接口里还没有，先写死；等 profile 接口加了字段再换
const tagline = '记录 · 分享 · 存档'
const bio = '前端 / Node 后端都在摸，平时写点东西存档。'
const location = '中国 重庆'

const name = ref('xiaolinlin')
const avatar = ref('/avatar.webp')
const total = ref(0)

onMounted(async () => {
  try {
    const [profile, count] = await Promise.all([getProfile(), getTotalArticle()])
    name.value = profile.name
    if (profile.imgurl) avatar.value = API_BASE + profile.imgurl
    total.value = count.total
  } catch (error) {
    console.error('获取个人信息失败', error)
  }
})
</script>

<style scoped lang="scss">
.profile-card {
  padding: 24px 20px 18px;
  border-radius: 16px;
  background-color: $my-bg-card;
  border: 1px solid $my-border-color;

  .tagline {
    text-align: center;
    font-size: 12px;
    letter-spacing: 1px;
    color: $my-text-light;
  }

  .avatar {
    display: block;
    width: 108px;
    height: 108px;
    margin: 18px auto 14px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid $my-bg-card;
    background-color: $my-bg-hover;
  }

  .name {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    color: $my-text-main;
  }

  .bio {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.8;
    color: $my-text-sub;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    font-size: 12px;
    color: $my-text-light;

    /* Element Plus 图标只带 viewBox，得自己给尺寸 */
    :deep(svg) {
      width: 1em;
      height: 1em;
    }
  }

  /* 底部一条：文章数 + 两个图标 */
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid $my-border-color;

    .count {
      font-size: 13px;
      color: $my-text-main;
    }

    .icons {
      display: flex;
      align-items: center;
      gap: 12px;

      a {
        display: flex;
        font-size: 16px;
        color: $my-text-sub;
        transition: color 0.15s;

        &[href]:hover,
        &:hover {
          color: $my-accent-color;
        }
      }

      svg {
        width: 1em;
        height: 1em;
      }
    }
  }
}
</style>
