<template>
  <div class="home-layout">
    <!-- ① 左栏 -->
    <aside class="side side-left">
      <SideCard title="博客统计">
        <div class="stat-row card-content">
          <div v-for="item in stats" :key="item.label" class="stat">
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
      </SideCard>

      <SideCard title="技术信息">
        <div class="card-content">
          <ul class="info-list">
            <li v-for="item in infos" :key="item.label">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.value }}</span>
            </li>
          </ul>
          <!-- 用原生 details，不需要写折叠逻辑 -->
          <details class="build-info">
            <summary>展开构建信息</summary>
            <div class="build-grid">
              <div v-for="item in builds" :key="item.name" class="build">
                <span class="name">{{ item.name }}</span>
                <span class="version">{{ item.version }}</span>
              </div>
            </div>
          </details>
        </div>
      </SideCard>

      <SideCard title="一言">
        <div class="card-content">
          <p class="quote">{{ quote.text }}</p>
          <p class="from">—— {{ quote.from }}</p>
        </div>
      </SideCard>

      <SideCard title="欢迎">
        <div class="card-content">
          <p class="welcome">{{ welcome }}</p>
        </div>
      </SideCard>

      <SideCard title="广告">
        <div class="card-content">
          <div class="ad-slot">广告位</div>
        </div>
      </SideCard>
    </aside>

    <!-- ② 中栏 -->
    <main class="middle">
      <div class="middle-placeholder">首页主体（待做）</div>
    </main>

    <!-- ③ 右栏 -->
    <aside class="side side-right">
      <TechWall />
    </aside>
  </div>
</template>

<script setup lang="ts">
import SideCard from '@/components/home/SideCard.vue'
import TechWall from '@/components/home/TechWall.vue'

// 先写死，以后接接口再换
const stats = [
  { label: '运营时长', value: '2年2个月' },
  { label: '上次更新', value: '9 天前' },
  { label: '总字数', value: '1.06 万' },
]

const infos = [
  { label: '图片存储', value: '自建 /data 目录' },
  { label: '软件协议', value: 'MIT' },
  { label: '文章许可', value: 'CC BY-NC-SA 4.0' },
  { label: '规范域名', value: '待填写' },
]

// 这里放你自己的栈，不是他的（他的是 Nuxt / Content）
const builds = [
  { name: 'Vue', version: '3.5' },
  { name: 'Vite', version: '8.3' },
  { name: 'TypeScript', version: '6.0' },
  { name: 'Express', version: '5.2' },
  { name: 'PostgreSQL', version: '16' },
  { name: 'giscus', version: '3.1' },
]

const quote = {
  text: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
  from: '苏轼《定风波》',
}

const welcome = '欢迎来自地球的朋友 🌏'
</script>

<style scoped lang="scss">
/* 三栏：左 300 / 中间自适应 / 右 300 */
.home-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 300px;
  gap: 40px;
  align-items: start;
}

/* 左栏里的卡片竖着排 */
.side-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-content {
  border: 1px solid $my-border-color;
  box-shadow: 0 3px 8px $my-shadow-color;
  padding: 16px;
  border-radius: 20px;
}
/* ---------- 博客统计 ---------- */
.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  text-align: center;

  .stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label {
    font-size: 12px;
    color: $my-text-light;
  }

  .value {
    font-size: 15px;
    font-weight: 600;
    color: $my-text-main;
  }
}

/* ---------- 技术信息 ---------- */
.info-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 13px;
    line-height: 2;

    .label {
      color: $my-text-sub;
    }

    .value {
      color: $my-text-main;
      text-align: right;
    }
  }
}

.build-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed $my-border-color;

  summary {
    font-size: 12px;
    color: $my-text-light;
    text-align: center;
    cursor: pointer;
    list-style: none;

    /* 去掉默认三角，用 css 画一个小箭头 */
    &::before {
      content: '▾ ';
    }

    &::-webkit-details-marker {
      display: none;
    }
  }
}

.build-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 8px;
  margin-top: 12px;
  text-align: center;

  .build {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-size: 12px;
    color: $my-text-light;
  }

  .version {
    font-size: 13px;
    font-weight: 600;
    color: $my-text-main;
  }
}

/* ---------- 一言 ---------- */
.quote {
  font-size: 13px;
  line-height: 1.9;
  color: $my-text-main;
}

.from {
  margin-top: 8px;
  font-size: 12px;
  text-align: right;
  color: $my-text-light;
}

/* ---------- 欢迎 ---------- */
.welcome {
  font-size: 13px;
  color: $my-text-main;
}

/* ---------- 广告 ---------- */
.ad-slot {
  padding: 28px 12px;
  border: 1px dashed $my-border-color;
  border-radius: 12px;
  text-align: center;
  font-size: 13px;
  color: $my-text-light;
}

/* ---------- 中栏 / 右栏 ---------- */
.middle {
  min-height: 90vh;
}

.middle-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  border: 1px dashed $my-border-color;
  border-radius: 20px;
  background-color: $my-bg-card;
  font-size: 13px;
  color: $my-text-light;
}

/* 右栏图标墙跟随滚动 */
.side-right {
  position: sticky;
  top: 88px;
}

/* ---------- 响应式：窄了就先丢右栏，再丢左栏 ---------- */
@media (max-width: 1340px) {
  .home-layout {
    grid-template-columns: 300px minmax(0, 1fr);
  }

  .side-right {
    display: none;
  }
}

@media (max-width: 1000px) {
  .home-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .side-left {
    display: none;
  }
}
</style>
