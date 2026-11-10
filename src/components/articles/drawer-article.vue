<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑文章' : '发布文章'"
    size="680px"
    class="drawer-article"
    destroy-on-close
    @closed="handleClosed">
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

      <!-- 封面：拖拽 or 点击，仅接受图片，发布时才真正上传 -->
      <el-form-item label="封面">
        <div class="cover-box">
          <el-upload
            ref="coverUploadRef"
            drag
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleCoverChange"
            class="cover-upload">
            <img v-if="coverPreview" :src="coverPreview" class="cover-img" alt="封面" />
            <div v-else class="cover-empty">
              <el-icon><UploadFilled /></el-icon>
              <span>拖拽图片到这里，或点击选择</span>
              <span class="hint">仅支持图片，≤ 5MB</span>
            </div>
          </el-upload>

          <el-button v-if="coverPreview" link type="danger" @click="handleRemoveCover">
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

      <!-- 正文：纯文本（只有随笔用 Markdown） -->
      <el-form-item label="正文" prop="content">
        <el-input
          v-model="formModel.content"
          type="textarea"
          :rows="12"
          resize="vertical"
          placeholder="请输入正文（纯文本）"
          class="content-input" />
      </el-form-item>

      <!-- 附件：放在正文下面，发布时统一上传 -->
      <el-form-item label="附件">
        <div class="attach-box">
          <el-upload
            ref="attachUploadRef"
            drag
            multiple
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAttachChange"
            class="attach-upload">
            <el-icon><UploadFilled /></el-icon>
            <span class="attach-tip">把附件拖到这里，或点击选择（单个 ≤ 50MB）</span>
          </el-upload>

          <ul v-if="attachments.length" class="attach-list">
            <li v-for="(item, index) in attachments" :key="item.key">
              <el-icon class="doc-icon"><Document /></el-icon>
              <span class="name" :title="item.name">{{ item.name }}</span>
              <span v-if="item.isNew" class="badge">待上传</span>
              <el-icon class="remove" title="移除" @click="removeAttachment(index)">
                <Close />
              </el-icon>
            </li>
          </ul>
        </div>
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
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { UploadFilled, Document, Close } from '@element-plus/icons-vue'
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

/** 待提交的附件：要么是已存在的记录（有 id），要么是新选的文件（有 file） */
interface PendingAttachment {
  key: string
  name: string
  file?: File
  id?: string
  isNew?: boolean
}

const visible = ref(false)
const loading = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const coverUploadRef = ref<UploadInstance>()
const attachUploadRef = ref<UploadInstance>()
const subsets = ref<SubsetRef[]>([])

const createBlankForm = () => ({
  id: '',
  title: '',
  subset_id: '',
  state: false,
  introduce: '',
  content: '',
})

const formModel = ref(createBlankForm())
const isEdit = computed(() => !!formModel.value.id)

// 封面：先存在本地，提交时才上传
const coverFile = ref<File | null>(null)
const coverFileId = ref('')
const coverPreview = ref('')
let coverObjectUrl = ''

// 附件：同上
const attachments = ref<PendingAttachment[]>([])

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

const makeKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

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

/** 重置所有本地状态（打开/关闭时都调） */
const resetState = () => {
  formModel.value = createBlankForm()
  coverFile.value = null
  coverFileId.value = ''
  if (coverObjectUrl) {
    URL.revokeObjectURL(coverObjectUrl)
    coverObjectUrl = ''
  }
  coverPreview.value = ''
  attachments.value = []
  coverUploadRef.value?.clearFiles()
  attachUploadRef.value?.clearFiles()
  formRef.value?.clearValidate()
}

/**
 * 打开抽屉
 * @param id 传 id = 编辑（拉详情回显）；不传 = 新建
 */
const open = async (id?: string) => {
  resetState()
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
      introduce: d.introduce,
      content: d.content,
    }
    coverFileId.value = d.cover_file_id || ''
    coverPreview.value = d.url ? toAbsoluteUrl(d.url) : ''
    attachments.value = (d.attachments || []).map((a) => ({
      key: a.id,
      id: a.id,
      name: a.file_name,
    }))
  } catch (error) {
    console.error('打开文章抽屉失败', error)
  } finally {
    loading.value = false
  }
}

// ================= 封面（拖拽 + 校验） =================

const handleCoverChange = (uploadFile: UploadFile) => {
  const raw = uploadFile.raw
  // 每次只保留一张，清掉 el-upload 内部列表，方便重复选择同一张
  coverUploadRef.value?.clearFiles()
  if (!raw) return

  if (!raw.type.startsWith('image/')) {
    ElMessage.error('封面必须是图片（jpg / png / webp / gif）')
    return
  }
  if (raw.size > 5 * 1024 * 1024) {
    ElMessage.error('封面不要超过 5MB')
    return
  }

  if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl)
  coverObjectUrl = URL.createObjectURL(raw)
  coverFile.value = raw
  coverPreview.value = coverObjectUrl
  coverFileId.value = '' // 换了新封面，旧 id 作废
}

const handleRemoveCover = () => {
  if (coverObjectUrl) {
    URL.revokeObjectURL(coverObjectUrl)
    coverObjectUrl = ''
  }
  coverFile.value = null
  coverPreview.value = ''
  coverFileId.value = ''
}

// ================= 附件 =================

const handleAttachChange = (uploadFile: UploadFile) => {
  const raw = uploadFile.raw
  attachUploadRef.value?.clearFiles()
  if (!raw) return

  if (raw.size > 50 * 1024 * 1024) {
    ElMessage.error(`「${raw.name}」超过 50MB`)
    return
  }
  const duplicated = attachments.value.some(
    (a) => (a.file && a.file.name === raw.name && a.file.size === raw.size) || a.name === raw.name
  )
  if (duplicated) {
    ElMessage.warning('该附件已添加')
    return
  }

  attachments.value.push({ key: makeKey(), name: raw.name, file: raw, isNew: true })
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

// ================= 提交：先补传封面与附件，再一次性提交表单 =================

const uploadToServer = async (file: File) => {
  const form = new FormData()
  form.append('file', file)
  const res = await http.post<any, UploadRes>('/files/uploadFile', form, { timeout: 120000 })
  return res.data
}

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
    const needUpload =
      !!coverFile.value || attachments.value.some((a) => !a.id && a.file)
    if (needUpload) ElMessage.info('正在上传封面与附件...')

    // 1. 封面
    let coverId: string | null = coverFileId.value || null
    if (coverFile.value) {
      const r = await uploadToServer(coverFile.value)
      coverId = r.id
      coverFileId.value = r.id
      coverFile.value = null
    }

    // 2. 附件（新传的补 id；已有的直接带上）
    const attachmentIds: string[] = []
    for (const item of attachments.value) {
      if (item.id) {
        attachmentIds.push(item.id)
        continue
      }
      if (!item.file) continue
      const r = await uploadToServer(item.file)
      item.id = r.id
      item.name = r.file_name || item.name
      item.file = undefined
      item.isNew = false
      attachmentIds.push(r.id)
    }

    // 3. 正文 + 封面 + 附件一起提交
    const payload = {
      title: formModel.value.title.trim(),
      introduce: formModel.value.introduce.trim(),
      content: formModel.value.content,
      subset_id: formModel.value.subset_id,
      cover_file_id: coverId,
      attachment_ids: attachmentIds,
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
    emit('success')
  } catch (error) {
    console.error('提交文章失败', error)
  } finally {
    submitting.value = false
  }
}

const handleClosed = () => {
  resetState()
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.article-form {
  padding-right: 8px;
}

/* ---------- 封面 ---------- */
.cover-box {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.cover-upload {
  :deep(.el-upload-dragger) {
    width: 220px;
    height: 130px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    background-color: $my-bg-hover;
  }
}

.cover-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: $my-text-sub;
  padding: 0 12px;
  text-align: center;

  .el-icon {
    font-size: 24px;
  }

  .hint {
    font-size: 11px;
    opacity: 0.7;
  }
}

/* ---------- 附件 ---------- */
.attach-box {
  width: 100%;
}

.attach-upload {
  :deep(.el-upload-dragger) {
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    background-color: $my-bg-hover;

    .el-icon {
      font-size: 18px;
    }
  }

  .attach-tip {
    font-size: 12px;
    color: $my-text-sub;
  }
}

.attach-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 6px;
    background-color: $my-bg-hover;
    font-size: 13px;

    & + li {
      margin-top: 6px;
    }

    .doc-icon {
      color: $my-text-sub;
      flex-shrink: 0;
    }

    .name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $my-text-main;
    }

    .badge {
      flex-shrink: 0;
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 4px;
      color: var(--el-color-warning);
      background-color: var(--el-color-warning-light-9);
    }

    .remove {
      flex-shrink: 0;
      cursor: pointer;
      color: $my-text-sub;

      &:hover {
        color: var(--el-color-danger);
      }
    }
  }
}

.content-input {
  :deep(.el-textarea__inner) {
    line-height: 1.7;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
