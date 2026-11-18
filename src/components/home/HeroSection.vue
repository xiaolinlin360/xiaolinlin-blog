<template>
  <section class="hero-card">
    <div class="hero-header">
      <div class="identity">
        <!-- 暂时用渐变八边形 + 一个字占位；等公开接口做好，换成博主A的头像（users.imgurl） -->
        <div class="avatar">逸</div>

        <div class="intro">
          <h1 class="name">xiaolinlin</h1>
          <p class="slogan">记录 · 分享 · 存档</p>
        </div>
      </div>
      <div class="github-stats-container">
        <a href="https://github.com/xiaolinlin360" class="stats-card">
          <img
            :src="
              isDark
                ? 'https://streak-stats.demolab.com?user=xiaolinlin360&hide_border=true&card_height=210&theme=aura&locale=en&background=00000000'
                : 'https://streak-stats.demolab.com?user=xiaolinlin360&hide_border=true&card_height=210&theme=catppuccin_latte&locale=en&background=00000000'
            "
            alt="GitHub Streak"
          />
        </a>
      </div>
    </div>
    <div class="snake-wrapper">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="
            https://raw.githubusercontent.com/lxfriday/lxfriday/output/github-contribution-grid-snake-dark.svg
          "
        />
        <source
          media="(prefers-color-scheme: light)"
          srcset="
            https://raw.githubusercontent.com/lxfriday/lxfriday/output/github-contribution-grid-snake.svg
          "
        />
        <img
          alt="github contribution grid snake animation"
          src="https://raw.githubusercontent.com/lxfriday/lxfriday/output/github-contribution-grid-snake.svg"
        />
      </picture>
    </div>
    <TagAndLink />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TagAndLink from '@/components/home/TagAndLink.vue'
const isDark = ref(true) //先写死，后面再改
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    /* 圆润八边形：8 个角各磨一次。这条路径是按 64×64 画的，改尺寸要重新生成 */
    clip-path: path('M59.72 37.48Q59.72 43.48 55.47 47.72L47.72 55.47Q43.48 59.72 37.48 59.72L26.52 59.72Q20.52 59.72 16.28 55.47L8.53 47.72Q4.28 43.48 4.28 37.48L4.28 26.52Q4.28 20.52 8.53 16.28L16.28 8.53Q20.52 4.28 26.52 4.28L37.48 4.28Q43.48 4.28 47.72 8.53L55.47 16.28Q59.72 20.52 59.72 26.52Z');
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(
      135deg,
      var(--my-accent-color),
      color-mix(in srgb, var(--my-accent-color) 45%, #fff)
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
      /* 深色背景下让贪吃蛇背景透明；浅色主题可后续用媒体查询覆盖 */
      mix-blend-mode: screen;
    }
  }
}
</style>
