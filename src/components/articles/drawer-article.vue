<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑文章' : '发布文章'"
    size="680px"
    class="drawer-article"
    destroy-on-close>
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="formModel"
      :rules="rules"
      label-width="80px"
      class="article-form">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formModel.title"
          maxlength="40"
          show-word-limit
          placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="分组" prop="subset_id">
        <el-select v-model="formModel.subset_id" placeholder="请选择分组" style="width: 100%">
          <el-option v-for="s in subsets" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formModel.state">
          <el-radio-button :value="false">草稿</el-radio-button>
          <el-radio-button :value="true">发布</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="封面">
        <div v-loading="uploading" class="cover-box">
          <el-upload
            class="cover-upload"
            accept="image/*"
            :show-file-list="false"
            :before-upload="beforeCoverUpload"
            :http-request="handleCoverUpload">
            <img v-if="formModel.coverUrl" :src="formModel.coverUrl" class="cover-img" alt="封面" />
            <div v-else class="cover-empty">
              <el-icon><Plus /></el-icon>
              <span>点击上传封面</span>
            </div>
          </el-upload>

          <el-button
            v-if="formModel.coverUrl"
            link
            type="danger"
            class="cover-remove"
            @click="handleRemoveCover">
            移除封面
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="简介" prop="introduce">
        <el-input
          v-model="formModel.introduce"
          type="textarea"
          :rows="3"
          maxlength="400"
          show-word-limit
          placeholder="列表页展示的摘要，最多 400 字" />
      </el-form-item>

      <el-form-item label="正文" prop="content">
        <el-input
          v-model="formModel.content"
          type="textarea"
          :rows="14"
          resize="vertical"
          placeholder="支持 Markdown 语法，例如：# 标题、**加粗**、![](图片地址)"
          class="content-input" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import http, { url as API_BASE } from '@/utils/http'
import { getArticleDetail, insertArticle, updateArticle } from '@/api/blog'
import { getSubset, type SubsetRef } from '@/api/subsets'
import { getCategoryIdByPath } from '@/utils/category'

const emit = defineEmits<{
  (e: 'success'): void
}>()

interface UploadRes {
  code: number
  message: string
  data: { id: string; url: string; file_name: string; size: number; type: string }
}

const visible = ref(false)
const loading = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const formRef = ref<FormInstance>()
const subsets = ref<SubsetRef[]>([])

/** 表单初始值。id 为空 = 新建，有值 = 编辑 */
const createBlankForm = () => ({
  id: '',
  title: '',
  subset_id: '',
  state: false,
  cover_file_id: '',
  coverUrl: '',
  introduce: '',
  content: '',
})

const formModel = ref(createBlankForm())
const isEdit = computed(() => !!formModel.value.id)

const rules: FormRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  subset_id: [{ required: true, message: '请选择分组', trigger: 'change' }],
  introduce: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  content: [{ required: true, message: '请输入正文', trigger: 'blur' }],
}

/** 后端返回 /data/... 相对路径，拼成绝对地址（base 带不带尾斜杠都正确） */
const toAbsoluteUrl = (pathOrUrl: string) => {
  try {
    return new URL(pathOrUrl, API_BASE).href
  } catch {
    return `${API_BASE.replace(/\/+$/, '')}${pathOrUrl}`
  }
}

/** 分组下拉：取"文章"分类下的分组 */
const loadSubsets = async () => {
  const categoryId = await getCategoryIdByPath('/blog')
  if (!categoryId) {
    subsets.value = []
    return
  }
  const res = await getSubset({ category_id: categoryId })
  subsets.value = res.data || []
}

/**
 * 打开抽屉
 * @param id 传 id = 编辑（拉详情回显）；不传 = 新建（清空表单）
 */
const open = async (id?: string) => {
  formModel.value = createBlankForm()
  formRef.value?.clearValidate()
  visible.value = true
  loading.value = true

  try {
    await loadSubsets()
    if (!id) return

    const res = await getArticleDetail(id)
    const d = res.data
    formModel.value = {
      id: d.id,
      title: d.title,
      subset_id: d.subset_id,
      state: !!d.state,
      cover_file_id: d.cover_file_id || '',
      coverUrl: d.url ? toAbsoluteUrl(d.url) : '',
      introduce: d.introduce,
      content: d.content,
    }
  } catch (error) {
    console.error('打开文章抽屉失败', error)
  } finally {
    loading.value = false
  }
}

// ================= 封面上传 =================

const beforeCoverUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('封面只能是图片')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('封面不要超过 5MB')
    return false
  }
  return true
}

/** 自定义上传：先落库拿到 file id，才能写进 cover_file_id */
const handleCoverUpload = async (options: any) => {
  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', options.file)
    const res = await http.post<any, UploadRes>('/files/uploadFile', form, { timeout: 60000 })
    formModel.value.cover_file_id = res.data.id
    formModel.value.coverUrl = toAbsoluteUrl(res.data.url)
    ElMessage.success('封面上传成功')
  } catch (error) {
    console.error('封面上传失败', error)
  } finally {
    uploading.value = false
  }
}

const handleRemoveCover = () => {
  formModel.value.cover_file_id = ''
  formModel.value.coverUrl = ''
}

// ================= 提交 =================

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('请填写完整信息')
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: formModel.value.title.trim(),
      introduce: formModel.value.introduce.trim(),
      content: formModel.value.content,
      subset_id: formModel.value.subset_id,
      cover_file_id: formModel.value.cover_file_id || null,
      state: formModel.value.state,
    }

    if (isEdit.value) {
      await updateArticle({ ...payload, id: formModel.value.id })
      ElMessage.success('保存成功')
    } else {
      await insertArticle(payload)
      ElMessage.success('发布成功')
    }

    visible.value = false
    emit('success') // 通知父组件刷新列表
  } catch (error) {
    console.error('提交文章失败', error)
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.article-form {
  padding-right: 8px;
}

.cover-box {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.cover-upload {
  :deep(.el-upload) {
    border: 1px dashed $my-border-color;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.cover-img {
  display: block;
  width: 200px;
  height: 120px;
  object-fit: cover;
}

.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 200px;
  height: 120px;
  font-size: 12px;
  color: $my-text-sub;
  background-color: $my-bg-hover;

  .el-icon {
    font-size: 22px;
  }
}

.content-input {
  :deep(.el-textarea__inner) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    line-height: 1.7;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
