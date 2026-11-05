<template>
  <div class="files-view-container">
    <!-- 注意：将 title 修改为截图中的“本地文件” -->
    <headTitle :title="'本地文件'">
      <!-- 默认插槽内容 -->
      <div style="display: flex; align-items: center; gap: 12px">
        <!-- 提示文字 -->
        <span style="font-size: 13px; color: #909399; user-select: none"
          >图片、视频、音频大小不超过20M</span
        >
        <!-- 上传按钮 -->
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </div>
    </headTitle>
    <files />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import headTitle from '@/components/bar/HeadTitle.vue'
import files from '@/components/filesview/files.vue'

// 处理上传逻辑
const handleUpload = () => {
  ElMessage.success('点击了上传按钮，准备上传...')
}
</script>

<style lang="scss" scoped>
.files-view-container {
  background-color: $my-bg-page;
}
</style>
