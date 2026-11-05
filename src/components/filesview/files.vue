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

      <div class="right-actions">
        <!-- 按 id / id 数组 搜索 -->
        <el-input
          v-model="searchKeyword"
          class="search-input"
          placeholder="输入文件ID，多个用逗号分隔"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>

        <template v-if="selectedIds.length > 0">
          <el-tooltip content="下载" placement="top">
            <el-icon class="action-icon" @click="handleBatchDownload">
              <Download />
            </el-icon>
          </el-tooltip>
        </template>
      </div>
    </div>

    <!-- 分类栏目：全部 / 文章附件 / 其他 -->
    <el-radio-group v-model="activeCategory" class="category-tabs">
      <el-radio-button label="all">全部</el-radio-button>
      <el-radio-button label="article">文章附件</el-radio-button>
      <el-radio-button label="other">其他</el-radio-button>
    </el-radio-group>

    <!-- 文件网格列表 -->
    <div class="file-grid">
      <div
        v-for="file in filteredFiles"
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

          <!-- 左上角复选框 -->
          <div class="checkbox-wrapper" @click.stop>
            <el-checkbox
              :model-value="selectedIds.includes(file.id)"
              @change="toggleSelect(file.id)" />
          </div>

          <!-- 底部悬浮操作栏 -->
          <div class="hover-actions" @click.stop>
            <el-icon class="hover-icon" @click="handleSingleDownload(file)"><Download /></el-icon>
          </div>
        </div>

        <!-- 文件名 -->
        <div class="file-name" :title="file.file_name">
          {{ file.file_name }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="filteredFiles.length === 0" description="暂无数据" />

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next, jumper"
        background />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getFiles, getTotalFile } from '@/api/files'
import type { FileItem } from '@/api/files'

// 数据状态
const files = ref<FileItem[]>([])
const total = ref(0)

// 选中的 ID 列表
const selectedIds = ref<string[]>([])

// 分页逻辑
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索：支持单个 id 或 id 数组
const searchKeyword = ref('')
const searchIds = ref<string[]>([])

// 分类：全部 / 文章附件 / 其他
const activeCategory = ref<'all' | 'article' | 'other'>('all')

// 根据 article_id 分类过滤（后端未提供分类参数，故前端过滤当前页数据）
const filteredFiles = computed(() => {
  switch (activeCategory.value) {
    case 'article':
      // article_id 不为 null / '' 视为文章附件
      return files.value.filter((f) => f.article_id && f.article_id !== '')
    case 'other':
      return files.value.filter((f) => !f.article_id || f.article_id === '')
    default:
      return files.value
  }
})

// 获取数据方法
const fetchFiles = async () => {
  try {
    // 1. 获取文件列表（搜索时通过 file_urls 传 id 数组进行过滤）
    const res = await getFiles({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...(searchIds.value.length ? { file_urls: searchIds.value } : {}),
    })
    files.value = res.data.files || []

    // 清空选择，防止跨页/跨次查询保留
    selectedIds.value = []

    // 2. 获取总数
    const totalRes = await getTotalFile()
    total.value = totalRes.data.total || 0
  } catch (error) {
    console.error('获取文件失败', error)
  }
}

onMounted(() => {
  fetchFiles()
})

watch([currentPage, pageSize], () => {
  fetchFiles()
})

// 搜索（支持单个 id 或逗号/空格分隔的 id 数组）
const handleSearch = () => {
  const raw = searchKeyword.value.trim()
  searchIds.value = raw ? raw.split(/[,，\s]+/).filter(Boolean) : []

  // currentPage 变化会触发 watch；否则手动请求
  if (currentPage.value === 1) {
    fetchFiles()
  } else {
    currentPage.value = 1
  }
}

// 全选相关逻辑（基于当前分类过滤后的数据）
const isAllSelected = computed({
  get: () => {
    return filteredFiles.value.length > 0 && selectedIds.value.length === filteredFiles.value.length
  },
  set: () => {},
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < filteredFiles.value.length
})

const handleSelectAll = (val: boolean | string | number) => {
  if (val) {
    selectedIds.value = filteredFiles.value.map((f) => f.id)
  } else {
    selectedIds.value = []
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

/**
 * 下载（接口暂时写死，后续替换为真实下载接口）
 * TODO: 替换为真实下载 API
 */
const downloadFileApi = (file: FileItem) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.file_name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 单个下载
const handleSingleDownload = (file: FileItem) => {
  downloadFileApi(file)
  ElMessage.success(`开始下载：${file.file_name}`)
}

// 批量下载（间隔触发，避免浏览器拦截）
const handleBatchDownload = () => {
  if (selectedIds.value.length === 0) return
  const targets = files.value.filter((f) => selectedIds.value.includes(f.id))
  targets.forEach((file, index) => {
    setTimeout(() => downloadFileApi(file), index * 300)
  })
  ElMessage.success(`开始下载 ${targets.length} 个文件`)
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
    gap: 12px;

    /* 搜索框 */
    .search-input {
      width: 240px;
    }

    .action-icon {
      font-size: 18px;
      color: $my-text-sub;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

/* 分类栏 */
.category-tabs {
  margin-bottom: 20px;
}

/* 网格布局 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
  margin-bottom: 30px;

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

    &.is-selected {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);

      .checkbox-wrapper {
        opacity: 1;
      }
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      border-radius: 6px;
      overflow: hidden;

      .preview-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .image-error {
        font-size: 12px;
        color: $my-text-sub;
      }

      .checkbox-wrapper {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .hover-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 32px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        opacity: 0;
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

    &:hover {
      background-color: $my-bg-hover;

      .checkbox-wrapper,
      .hover-actions {
        opacity: 1;
      }
    }

    .file-name {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: $my-text-main;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
