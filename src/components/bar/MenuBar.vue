<template>
  <aside class="menu-bar">
    <ul class="menu-list">
      <li
        v-for="item in menuList"
        :key="item.path"
        class="menu-item"
        :class="{ active: currentPath === item.path }"
        @click="handleMenuClick(item.path)">
        <el-icon class="menu-icon" :size="18">
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-title">{{ item.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  Folder,
  Document,
  Camera,
  EditPen,
  Grid,
  Setting,
} from '@element-plus/icons-vue'

// 定义菜单数据结构
interface MenuItem {
  name: string
  path: string
  icon: any
}

// 菜单配置
const menuList: MenuItem[] = [
  { name: '总览', path: '/', icon: HomeFilled },
  { name: '本地文件', path: '/files', icon: Folder },
  { name: '博客文章', path: '/blog', icon: Document },
  { name: '摄影图库', path: '/gallery', icon: Camera },
  { name: '随笔随记', path: '/notes', icon: EditPen },
  { name: '资源分享', path: '/resources', icon: Grid },
  { name: '设置', path: '/settings', icon: Setting },
]

const route = useRoute()
const router = useRouter()

// 当前激活的路由路径
const currentPath = computed(() => route.path)

// 点击跳转
const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.menu-bar {
  width: 220px;
  height: 100%;
  // 替换为：全局卡片背景（白天白/夜间深蓝），或使用 $my-bg-page
  background-color: $my-bg-card;
  // 补充一根右边框，让侧边栏在视觉上和右侧主内容区有分隔感
  border-right: 1px solid $my-border-color;
  padding: 16px 12px;
  box-sizing: border-box;
  overflow-y: auto;
  transition:
    background-color 0.3s,
    border-color 0.3s;

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  // 替换为：全局次要文字颜色
  color: $my-text-sub;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  // 悬停效果
  &:hover:not(.active) {
    // 替换为：全局悬停背景色
    background-color: $my-bg-hover;
    // 替换为：全局主文字颜色（让悬停时文字变深/变亮）
    color: $my-text-main;
    // 替换为：全局阴影变量
    box-shadow: 0 2px 8px $my-shadow-color;
  }

  // 激活效果（蓝色品牌色和白色文字保留不变，因为任何主题下这都是高亮状态）
  &.active {
    background-color: #2b5cff;
    color: #ffffff;

    .menu-icon {
      color: #ffffff;
    }
  }

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-title {
    flex: 1;
    line-height: 1;
  }
}
</style>
