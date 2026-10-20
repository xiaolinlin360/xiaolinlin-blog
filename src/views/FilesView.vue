<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import headTitle from '@/components/bar/HeadTitle.vue'

// 处理上传逻辑
const handleUpload = () => {
  // 这里可以触发一个隐藏的 input[type=file] 点击，或者打开上传弹窗
  // 示例：这里仅做提示，实际业务请替换为真实逻辑
  ElMessage.success('点击了上传按钮，准备上传...')
}
</script>

<style lang="scss" scoped></style>
