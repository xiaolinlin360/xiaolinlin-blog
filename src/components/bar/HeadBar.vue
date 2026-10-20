<template>
  <header class="head-bar">
    <!-- 左侧区域：Logo 和 标题 -->
    <div class="head-bar-left">
      <div class="logo-placeholder">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="logo-img" />
        <div v-else class="logo-empty"></div>
      </div>
      <span class="title">{{ title }}</span>
    </div>
    <!-- 操作图标与按钮 -->
    <div class="head-bar-right">
      <el-badge is-dot class="action-item badge-item" @click="drawerVisible = true">
        <el-icon :size="20" class="action-icon"><Message /></el-icon>
      </el-badge>

      <div class="action-item">
        <el-avatar :size="32" :src="avatarUrl" class="user-avatar">
          <el-icon><UserFilled /></el-icon>
        </el-avatar>
      </div>

      <!-- 太阳图标 -->
      <div class="action-item sun-icon-wrapper" @click="toggleDark()">
        <el-icon :size="20" class="sun-icon" v-if="!isDark"><Sunny /></el-icon>
        <el-icon :size="20" class="sun-icon" v-else><Moon /></el-icon>
      </div>

      <!-- 退出按钮 -->
      <el-button type="primary" class="logout-btn" @click="handleLogout"> 退出 </el-button>
    </div>
  </header>
  <!-- 私信抽屉 -->
  <MessageDrawer v-model="drawerVisible" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message, UserFilled, Sunny, Moon } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import MessageDrawer from '@/components/MessageDrawer/MessageDrawer.vue'
// --- Props 定义 (可通过父组件传入) ---
interface Props {
  title?: string
  initialLogoUrl?: string
  initialAvatarUrl?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '逸刻博客后台',
  initialLogoUrl: '',
  initialAvatarUrl: '',
})
// --- 响应式数据区 ---
// 使用 TS 泛型声明 ref 类型
const logoUrl = ref<string>(props.initialLogoUrl)
const avatarUrl = ref<string>(props.initialAvatarUrl)
const isDark = useDark() // 当前主题是否为暗黑
const toggleDark = useToggle(isDark) // 切换主题
const drawerVisible = ref(false) // 私信抽屉是否可见
// const messageDrawerRef = ref<MessageDrawer>() // 私信抽屉实例引用
// --- 事件处理 ---
// 显式声明函数返回类型
const handleLogout = (): void => {
  // 退出逻辑，例如清空 token 并跳转
  console.log('执行退出登录')
}
</script>

<style scoped lang="scss">
.head-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background-color: $my-bg-card;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  /* 如果希望有图中那种底部蓝色边线，可以加下面这行 */
  /* border-bottom: 2px solid #409eff; */

  /* 左侧样式 */
  &-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;

      .logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      /* 用于预览的灰色占位块，替换真实logo后可删除 */
      .logo-empty {
        width: 32px;
        height: 32px;
        background-color: $my-bg-page;
        border-radius: 4px;
      }
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: $my-text-main;
      letter-spacing: 1px;
    }
  }

  /* 右侧样式 */
  &-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .action-item {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .action-icon {
      color: $my-text-main;
    }

    /* 调整红点位置 */
    .badge-item {
      margin-top: 4px;
    }

    /* 太阳图标样式（图中是红色的） */
    .sun-icon-wrapper {
      .sun-icon {
        color: #f56c6c;
      }
    }

    /* 退出按钮样式 */
    .logout-btn {
      padding: 8px 20px;
      border-radius: 4px;
      font-weight: 500;
    }
  }
}
</style>
