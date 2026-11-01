<template>
  <div class="article-container">
    <!-- 左侧：文章列表 -->
    <div class="main-list">
      <div v-loading="loading">
        <article-item
          v-for="item in articles"
          :key="item.id"
          :article="item"
          @edit="handleEdit"
          @delete="handleDelete" />
        <el-empty v-if="!loading && articles.length === 0" description="暂无文章数据" />
      </div>

      <!-- 分页器 -->
      <div class="pagination-wrap" v-if="total > 0">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          background
          @current-change="fetchData" />
      </div>
    </div>

    <!-- 右侧：标签侧边栏 (暂用静态数据展示) -->
    <div class="sidebar">
      <div class="sidebar-card">
        <div class="sidebar-header">
          <span class="title">标签</span>
          <el-button link type="primary" size="small">管理标签</el-button>
        </div>
        <div class="tag-list">
          <el-tag
            v-for="label in labels"
            :key="label"
            class="custom-tag"
            type="info"
            effect="plain">
            {{ label.label_name }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ArticleItem from './article-item.vue'
import { getArticle, getTotalArticle, deleteArticle } from '@/api/blog'
import type { Article } from '@/api/blog'
import { getLabels, type Labels } from '@/api/labels'

const props = defineProps<{
  subsetId: string | undefined
}>()

const articles = ref<Article[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(4) // 按照你截图的数量，一页大概4-5个
const total = ref(0)
const labels = ref<Labels[]>([])
//获取标签
const fetchLabels = async () => {
  try {
    const res = await getLabels()
    console.log(res.data)

    labels.value = res.data
    console.log(labels.value)
  } catch (error) {
    console.error('获取标签失败', error)
  }
}

// 获取文章数据
const fetchData = async () => {
  loading.value = true
  try {
    // 如果你要根据分类查，这里可以把 props.subsetId 传给后端
    // 比如: data: { pageNum: pageNum.value, pageSize: pageSize.value, subset_id: props.subsetId }
    const res = await getArticle({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      subset_id: props.subsetId ? props.subsetId : undefined,
    })
    articles.value = res.data.articles || []
  } catch (error) {
    console.error('获取文章列表失败', error)
  } finally {
    loading.value = false
  }
}

// 获取总数
const fetchTotal = async () => {
  try {
    const res = await getTotalArticle()
    total.value = res.data.total
  } catch (error) {
    console.error('获取总数失败', error)
  }
}

// 如果父组件传了分类ID，监听变化重新拉取数据
watch(
  () => props.subsetId,
  () => {
    pageNum.value = 1 // 切换分类回到第一页
    fetchData()
    fetchTotal()
  },
  { immediate: true } // 初始化时也执行一次
)

// 初始化
onMounted(() => {
  if (!props.subsetId || props.subsetId === undefined) {
    fetchData()
    fetchTotal()
    fetchLabels()
  }
})

// 编辑按钮点击
const handleEdit = (article: Article) => {
  ElMessage.info(`准备编辑文章: ${article.title}`)
  // 这里可以跳转到编辑页，或者打开编辑弹窗
  // router.push(`/edit/${article.id}`)
}

// 删除按钮点击
const handleDelete = async (id: string) => {
  // 点击取消时，catch 会吃掉异常并返回 false
  const confirmRes = await ElMessageBox.confirm('确定要删除这篇文章吗？删除后无法恢复。', '警告', {
    type: 'warning',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
  }).catch(() => {
    ElMessage.info('已取消删除')
    return false
  })
  if (!confirmRes) return
  try {
    await deleteArticle(id)
    ElMessage.success('删除成功')
    if (articles.value.length === 1 && pageNum.value > 1) {
      pageNum.value--
    }
    fetchData()
    fetchTotal()
  } catch (error) {
    console.error('删除失败', error)
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: $my-bg-page;
  min-height: calc(100vh - 150px); // 根据你的头部高度调整

  // 左侧主体列表
  .main-list {
    flex: 1;
    min-width: 0; // 防止子元素撑破 flex 容器

    .pagination-wrap {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }
  }

  // 右侧侧边栏
  .sidebar {
    width: 260px;
    flex-shrink: 0;

    .sidebar-card {
      background-color: $my-bg-card;
      border-radius: 8px;
      padding: 16px;

      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .title {
          font-size: 15px;
          font-weight: 600;
          color: $my-text-main;
        }
      }

      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .custom-tag {
          background-color: $my-bg-hover;
          border-color: transparent;
          color: $my-text-sub;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
          }
        }
      }
    }
  }
}
</style>
