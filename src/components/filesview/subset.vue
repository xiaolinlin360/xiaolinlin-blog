<template>
  <div class="category-tabs-container">
    <!-- 左侧：可滚动的标签列表 -->
    <div class="tabs-scroll">
      <div
        v-for="item in subsets"
        :key="item.name"
        class="tab-item"
        :class="{ active: subset_active === item.id }"
        @click="handleSelect(item.id)">
        {{ item.name }}
      </div>
    </div>

    <!-- 右侧：固定操作按钮 -->
    <div class="action-area">
      <el-button link type="primary" class="action-btn" @click="create">
        <el-icon><CirclePlus /></el-icon>新建
      </el-button>
      <el-button link type="primary" class="action-btn" @click="manage">
        <el-icon><Setting /></el-icon>管理分组
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getCategoryIdByPath } from '@/utils/category'
import { type SubsetRef, getSubset } from '@/api/subsets'
import { useRouter } from 'vue-router'
const router = useRouter()
const subsets = ref<SubsetRef[]>([])
const subset_active = ref<string | undefined>()
const a = async () => {
  const category = await getCategoryIdByPath(router.currentRoute.value.path)
  if (category) {
    const res = await getSubset({ category_id: category })
    subsets.value = res.data
    console.log(category)
  }
}
a()
// Props & Emits
const emit = defineEmits<{
  (e: 'subset_id', value: string | undefined): void
}>()

// 切换标签
const handleSelect = (id: string | undefined) => {
  subset_active.value = id
  emit('subset_id', id)
}

// 新建分组
const create = () => {
  console.log('create')
  //新建分组后，刷新当前分类下的分组列表
  a()
}

// 管理分组
const manage = () => {
  console.log('manage')
  //管理分组后，刷新当前分类下的分组列表
  a()
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.category-tabs-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-radius: 8px;
  gap: 20px;

  // 左侧滚动区域
  .tabs-scroll {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    overflow-x: auto;

    // 隐藏滚动条（保持界面清爽）
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .tab-item {
      display: flex;
      align-items: center;
      padding: 6px 16px;
      border-radius: 20px; // 胶囊形状
      font-size: 14px;
      color: $my-text-sub; // 次要文字颜色
      background-color: $my-bg-page; // 亮色灰底/暗色深底，刚好作为未选中背景
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        // 悬浮时稍微加深一点背景，适配亮暗色
        background-color: rgba(144, 147, 153, 0.15);
      }

      .count {
        margin-left: 4px;
        font-size: 13px;
        opacity: 0.9;
      }

      // 选中状态
      &.active {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
        font-weight: 500;

        // 根据 ElementPlus 变量，暗黑模式下会自动变为深蓝半透明底
        :deep(.el-icon) {
          color: var(--el-color-primary);
        }
      }
    }
  }

  // 右侧操作区域（保证不被挤压）
  .action-area {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;

    .action-btn {
      font-size: 14px;

      .el-icon {
        margin-right: 4px;
        font-size: 16px; // 图标稍微大一点更精致
      }
    }
  }
}
</style>
