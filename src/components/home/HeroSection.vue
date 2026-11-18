<template>
  <section class="hero-card">
    <div class="hero-header">
      <div class="identity">
        <!-- 先用本地这张顶着；等公开接口做好，换成博主A的头像（users.imgurl） -->
        <img class="avatar" :src="owner.imgurl" :alt="owner.name" />

        <div class="intro">
          <h1 class="name">{{ owner.name }}</h1>
          <p class="slogan">记录 · 分享 · 存档</p>
        </div>
      </div>
      <div class="github-stats-container">
        <a href="https://github.com/xiaolinlin360" class="stats-card">
          <img :src="streakUrl" alt="GitHub Streak" />
        </a>
      </div>
    </div>
    <div class="snake-wrapper" :class="{ 'is-light': !isDark }">
      <img
        :class="{ 'snake-dark': isDark }"
        :src="snakeUrl"
        alt="github contribution grid snake animation"
      />
    </div>
    <TagAndLink />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TagAndLink from '@/components/home/TagAndLink.vue'
import { isDark } from '@/composables/useTheme'
import { getProfile } from '@/api/profile'
import { API_BASE } from '@/utils/http'

// 先给一份兜底（本地头像 + 写死的名字），接口回来了再盖掉
const owner = ref({ name: 'xiaolinlin', imgurl: '/avatar.webp' })

onMounted(async () => {
  try {
    const data = await getProfile()
    owner.value = {
      name: data.name,
      // 接口给的是 /data/xxx 这种相对路径，要拼上后端地址才是个能用的图
      imgurl: data.imgurl ? API_BASE + data.imgurl : owner.value.imgurl,
    }
  } catch (error) {
    console.error('获取站点信息失败', error)
  }
})

// 贡献度卡片是外部图床，深浅两套主题只能靠 URL 参数切
const streakUrl = computed(
  () =>
    `https://streak-stats.demolab.com?user=xiaolinlin360&hide_border=true&card_height=210&locale=en&background=00000000&theme=${isDark.value ? 'aura' : 'catppuccin_latte'}`,
)

//贪吃蛇图，深色用 -dark
const snakeUrl = computed(
  () =>
    `https://raw.githubusercontent.com/lxfriday/lxfriday/output/github-contribution-grid-snake${isDark.value ? '-dark' : ''}.svg`,
)
</script>

<style scoped lang="scss">
.hero-card {
  padding: 24px;
  border-radius: 20px;
  transition:
    background-color 0.3s,
    border-color 0.3s;

  .hero-header {
    display: flex;
    justify-content: space-between;
  }

  .identity {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    object-fit: cover;
    /* 圆润八边形：8 个角各磨一次。这条路径是按 64×64 画的，改尺寸要重新生成 */
    clip-path: path(
      'M59.72 37.48Q59.72 43.48 55.47 47.72L47.72 55.47Q43.48 59.72 37.48 59.72L26.52 59.72Q20.52 59.72 16.28 55.47L8.53 47.72Q4.28 43.48 4.28 37.48L4.28 26.52Q4.28 20.52 8.53 16.28L16.28 8.53Q20.52 4.28 26.52 4.28L37.48 4.28Q43.48 4.28 47.72 8.53L55.47 16.28Q59.72 20.52 59.72 26.52Z'
    );
  }

  .name {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 2px;
    color: $my-text-main;
  }

  .slogan {
    margin: 6px 0 0;
    font-size: 13px;
    color: $my-text-sub;
  }

  .github-stats-container {
    .stats-card img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .snake-wrapper {
    img {
      display: block;
      width: 100%;
      height: auto;
    }

    /* 深色模式那张图空白格子是深蓝，用 screen blend 一下才跟背景接得上 */
    img.snake-dark {
      mix-blend-mode: screen;
    }

    /* 浅色模式的空白格子是 #ebedf0，跟页面底色 #f5f5f5 几乎一个色，
       垫一层白底卡片网格才显得出来 */
    &.is-light {
      padding: 10px;
      border-radius: 12px;
      background-color: $my-bg-card;
      border: 1px solid $my-border-color;
    }
  }
}
</style>
