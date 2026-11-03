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

    <!-- 右侧：标签侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-card">
        <div class="sidebar-header">
          <span class="title">标签</span>
          <!-- 1. 点击打开抽屉 -->
          <div>
            <el-button link type="primary" size="small" @click="drawerVisible = true"
              >管理标签</el-button
            >
            <el-button link type="primary" size="small" @click="dialogVisible = true"
              >添加标签</el-button
            >
          </div>
        </div>
        <div class="tag-list">
          <el-tag
            v-for="label in labels"
            :key="label.id"
            class="custom-tag"
            type="info"
            effect="plain"
            @click="handleCopyLabelId(label.id)"
            @keyup.enter="handleCopyLabelId(label.id)">
            {{ label.label_name }}
          </el-tag>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="添加标签"
      width="380px"
      class="custom-create-dialog"
      align-center
      :show-close="false"
      destroy-on-close>
      <div class="dialog-content">
        <el-input
          v-model="inputValue"
          placeholder="请输入"
          :maxlength="16"
          show-word-limit
          class="custom-input" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="btn-cancel" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" class="btn-confirm" @click="confirmAddLabel">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <DrawerLabel v-model="drawerVisible" @refresh="fetchLabels" :originalLabels="labels" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ArticleItem from './article-item.vue'
import { getArticle, getTotalArticle, deleteArticle } from '@/api/blog'
import type { Article } from '@/api/blog'
import { getLabels, type Labels, insertLabels } from '@/api/labels'
import DrawerLabel from './drawer-label.vue'
const drawerVisible = ref(false)

const props = defineProps<{
  subsetId: string | undefined
}>()

const articles = ref<Article[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(4) // 按照你截图的数量，一页大概4-5个
const total = ref(0)
const labels = ref<Labels[]>([])
const dialogVisible = ref(false)
const inputValue = ref('')

//获取标签
const fetchLabels = async () => {
  try {
    const res = await getLabels()
    labels.value = res.data
  } catch (error) {
    console.error('获取标签失败', error)
  }
}

// 获取文章数据
const fetchData = async () => {
  loading.value = true
  try {
    // 如果你要根据分类查，这里可以把 props.subsetId 传给后端
    const res = await getArticle({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      subset_id: props.subsetId ? props.subsetId : undefined,
    })
    console.log(res.data.articles)

    articles.value = res.data.articles || []
    console.log(articles.value)
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

// 新增：确认添加标签
const confirmAddLabel = async () => {
  if (!inputValue.value) {
    ElMessage.error('请输入标签名称')
    return
  }
  try {
    await insertLabels({
      label_name: inputValue.value,
    })
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchLabels()
  } catch (error) {
    console.error('添加标签失败', error)
  } finally {
    inputValue.value = ''
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

// 新增：点击标签复制 ID
const handleCopyLabelId = async (id: string) => {
  if (!id) return
  try {
    await navigator.clipboard.writeText(id)
    ElMessage.success('已复制标签 ID')
  } catch {
    ElMessage.error('复制失败，请检查浏览器权限')
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
