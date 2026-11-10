<template>
  <div class="gallery-container">
    <div v-loading="loading" class="gallery-grid">
      <gallery-item
        v-for="item in galleries"
        :key="item.id"
        :gallery="item"
        @edit="openDrawer"
        @delete="handleDelete" />
    </div>

    <el-empty v-if="!loading && galleries.length === 0" description="暂无画廊数据" />

    <!-- 分页器 -->
    <div class="pagination-wrap" v-if="total > 0">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
        @current-change="fetchData" />
    </div>

    <!-- 新建 / 编辑图库抽屉 -->
    <drawer-gallery ref="drawerRef" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import GalleryItem from './gallery-item.vue'
import DrawerGallery from './drawer-gallery.vue'
import { type Gallery, getGallery, getTotalGallery, deleteGallery } from '@/api/gallerys'

const props = defineProps<{
  subsetId?: string
}>()

const galleries = ref<Gallery[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(12) // 网格布局一页可以放12个左右
const total = ref(0)

// 抽屉实例
const drawerRef = ref<InstanceType<typeof DrawerGallery>>()

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getGallery({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      subset_id: props.subsetId,
    })
    galleries.value = res.data.gallerys || []
    const totalRes = await getTotalGallery(props.subsetId)

    total.value = totalRes.data.total
  } catch (error) {
    console.error('获取列表失败', error)
  } finally {
    loading.value = false
  }
}

// 编辑：带上 id 打开抽屉回显
const openDrawer = (item: Gallery) => {
  drawerRef.value?.open(item.id)
}

// 新建（由 GalleryView 的"新建图库"按钮调用）
const openCreate = () => {
  drawerRef.value?.open()
}

defineExpose({ openCreate, refresh: fetchData })

// 删除逻辑
const handleDelete = async (id: string) => {
  const confirmRes = await ElMessageBox.confirm('确定要删除这个画廊吗？删除后无法恢复。', '警告', {
    type: 'warning',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
  }).catch(() => {
    ElMessage.info('已取消删除')
    return false
  })
  if (!confirmRes) return
  try {
    await deleteGallery({ id })
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error('删除失败', error)
  }
}

watch(
  () => props.subsetId,
  () => {
    pageNum.value = 1
    fetchData()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.gallery-container {
  padding: 20px;
  background-color: $my-bg-page;
  min-height: calc(100vh - 150px);

  .gallery-grid {
    display: grid;
    // 响应式网格，最小宽度 240px，自动填充
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
}
</style>
