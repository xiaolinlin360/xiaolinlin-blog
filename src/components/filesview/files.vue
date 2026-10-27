<template>
  <div class="files-container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="left-actions">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll">
          全选
        </el-checkbox>
        <span class="selected-text">
          已选择 <span class="highlight">{{ selectedIds.length }}</span> 项内容
        </span>
        <el-button
          v-if="selectedIds.length > 0"
          link
          type="primary"
          class="clear-btn"
          @click="clearSelection">
          取消选择
        </el-button>
      </div>

      <div class="right-actions" v-if="selectedIds.length > 0">
        <el-tooltip content="删除" placement="top">
          <el-icon class="action-icon delete-icon" @click="handleBatchDelete">
            <Delete />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="移动" placement="top">
          <el-icon class="action-icon" @click="handleBatchMove">
            <Switch />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 文件网格列表 -->
    <div class="file-grid">
      <div
        v-for="file in currentPageFiles"
        :key="file.id"
        class="file-card"
        :class="{ 'is-selected': selectedIds.includes(file.id) }"
        @click="toggleSelect(file.id)">
        <!-- 图片/预览区 -->
        <div class="image-wrapper">
          <el-image :src="file.url" fit="contain" class="preview-img">
            <template #error>
              <div class="image-error">加载失败</div>
            </template>
          </el-image>

          <!-- 左上角复选框 (选中时或悬浮时显示) -->
          <div class="checkbox-wrapper" @click.stop>
            <el-checkbox
              :model-value="selectedIds.includes(file.id)"
              @change="toggleSelect(file.id)" />
          </div>

          <!-- 底部悬浮操作栏 -->
          <div class="hover-actions" @click.stop>
            <el-icon class="hover-icon" @click="handleSingleDelete(file)"><Delete /></el-icon>
            <el-icon class="hover-icon" @click="handleSingleMove(file)"><Switch /></el-icon>
          </div>
        </div>

        <!-- 文件名 -->
        <div class="file-name" :title="file.name">
          {{ file.name }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="files.length === 0" description="暂无数据" />

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="files.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="files.length"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next, jumper"
        background />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete, Switch } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface FileItem {
  id: string
  name: string
  url: string
}

// 模拟数据 (实际使用时替换为从后端获取)
const files = ref<FileItem[]>([
  { id: '1', name: '地联传入人石.jpeg', url: 'https://picsum.photos/400/300?random=1' },
  { id: '2', name: '究志以火或看长别想.jpeg', url: 'https://picsum.photos/400/300?random=2' },
  { id: '3', name: '展关张.jpeg', url: 'https://picsum.photos/400/300?random=3' },
  { id: '4', name: '克集起单当况王光.jpeg', url: 'https://picsum.photos/400/300?random=4' },
  { id: '5', name: '青团品器志行海不义观.jpeg', url: 'https://picsum.photos/400/300?random=5' },
  { id: '6', name: '克之定统且五局质各.jpeg', url: 'https://picsum.photos/400/300?random=6' },
  { id: '7', name: '信角低土算.jpeg', url: 'https://picsum.photos/400/300?random=7' },
  { id: '8', name: '水造验可表机.jpeg', url: 'https://picsum.photos/400/300?random=8' },
])

// 选中的 ID 列表
const selectedIds = ref<string[]>([])

// 分页逻辑
const currentPage = ref(1)
const pageSize = ref(14)

// 计算当前页显示的数据
const currentPageFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return files.value.slice(start, end)
})

// 全选相关逻辑
const isAllSelected = computed({
  get: () => {
    return currentPageFiles.value.length > 0 && selectedIds.value.length === files.value.length
  },
  set: () => {
    // 由 handleSelectAll 处理
  },
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < files.value.length
})

// 切换全选
const handleSelectAll = (val: boolean | string | number) => {
  if (val) {
    selectedIds.value = files.value.map((f) => f.id)
  } else {
    selectedIds.value = []
  }
}

// 单个选择/取消选择
const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedIds.value = []
}

// 单个删除 (悬浮按钮触发)
const handleSingleDelete = (file: FileItem) => {
  ElMessageBox.confirm(`确定要删除 "${file.name}" 吗？`, '提示', {
    type: 'warning',
  })
    .then(() => {
      files.value = files.value.filter((f) => f.id !== file.id)
      // 从选中列表中移除
      selectedIds.value = selectedIds.value.filter((id) => id !== file.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个文件吗？`, '提示', {
    type: 'warning',
  })
    .then(() => {
      files.value = files.value.filter((f) => !selectedIds.value.includes(f.id))
      selectedIds.value = []
      ElMessage.success('批量删除成功')
    })
    .catch(() => {})
}

// 单个移动 / 批量移动 (占位方法)
const handleSingleMove = (file: FileItem) => {
  ElMessage.info(`准备移动文件: ${file.name}`)
}
const handleBatchMove = () => {
  ElMessage.info(`准备移动 ${selectedIds.value.length} 个文件`)
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.files-container {
  padding: 20px;
  background-color: $my-bg-card;
  border-radius: 8px;
  min-height: calc(100vh - 100px);
}

/* 顶部操作栏 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: $my-bg-page;
  border-radius: 8px;
  margin-bottom: 20px;

  .left-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .selected-text {
      font-size: 14px;
      color: $my-text-sub;

      .highlight {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }

    .clear-btn {
      font-size: 14px;
    }
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-icon {
      font-size: 18px;
      color: $my-text-sub;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }

      &.delete-icon:hover {
        color: var(--el-color-danger);
      }
    }
  }
}

/* 网格布局 */
.file-grid {
  display: grid;
  /* 自动填充，最小宽度160px，最大占据剩余空间 */
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
  margin-bottom: 30px;

  /* 文件卡片 */
  .file-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    cursor: pointer;

    /* 选中态样式 */
    &.is-selected {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);

      .checkbox-wrapper {
        opacity: 1; /* 选中时强制显示复选框 */
      }
    }

    /* 图片包裹区 */
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 140px; /* 固定高度，防止图片长短不一导致页面跳动 */
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      border-radius: 6px;
      overflow: hidden;

      .preview-img {
        width: 100%;
        height: 100%;
        object-fit: contain; /* 图片完整显示在框内 */
      }

      .image-error {
        font-size: 12px;
        color: $my-text-sub;
      }

      /* 左上角复选框 */
      .checkbox-wrapper {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 2;
        opacity: 0; /* 默认隐藏 */
        transition: opacity 0.2s;
      }

      /* 底部悬浮操作栏 */
      .hover-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 32px;
        background: rgba(0, 0, 0, 0.5); /* 半透明黑底 */
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        opacity: 0; /* 默认隐藏 */
        transition: opacity 0.2s;

        .hover-icon {
          color: #fff;
          font-size: 16px;
          cursor: pointer;

          &:hover {
            color: var(--el-color-primary-light-5);
          }
        }
      }
    }

    /* 鼠标悬浮时显示复选框和操作栏 */
    &:hover {
      background-color: $my-bg-hover;

      .checkbox-wrapper,
      .hover-actions {
        opacity: 1;
      }
    }

    /* 文件名 */
    .file-name {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: $my-text-main;
      line-height: 1.4;
      /* 单行截断 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
