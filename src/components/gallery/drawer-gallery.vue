<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑图库' : '新建图库'"
    size="680px"
    class="drawer-gallery"
    destroy-on-close
    @closed="handleClosed">
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="formModel"
      :rules="rules"
      label-width="80px"
      class="gallery-form">
      <el-form-item label="名称" prop="title">
        <el-input
          v-model="formModel.title"
          maxlength="40"
          show-word-limit
          placeholder="给这个图库起个名字" />
      </el-form-item>

      <el-form-item label="分组" prop="subset_id">
        <el-select v-model="formModel.subset_id" placeholder="请选择分组" style="width: 100%">
          <el-option v-for="s in subsets" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="照片">
        <div class="photo-box">
          <!-- 已选照片网格 -->
          <div v-if="photos.length" class="photo-grid">
            <div v-for="(item, index) in photos" :key="item.key" class="photo-item">
              <img :src="item.preview" :alt="item.name" />
              <div class="photo-mask">
                <el-icon class="remove" title="移除" @click="removePhoto(index)">
                  <Close />
                </el-icon>
              </div>
              <span v-if="item.isNew" class="badge">待上传</span>
            </div>
          </div>

          <!-- 拖拽 / 点击添加 -->
          <el-upload
            ref="uploadRef"
            drag
            multiple
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePhotoChange"
            class="photo-upload">
            <el-icon><UploadFilled /></el-icon>
            <div class="tip">
              把照片拖到这里，或点击选择
              <span class="hint">仅支持图片，单张 ≤ 10MB</span>
            </div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { UploadFilled, Close } from '@element-plus/icons-vue'
import http from '@/utils/http'
import { toAbsoluteUrl } from '@/utils/asset'
import { getGalleryDetail, insertGallery, updateGallery } from '@/api/gallerys'
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

/** 待提交的照片：要么是已存在的记录（有 id），要么是新选的文件（有 file） */
interface PendingPhoto {
  key: string
  name: string
  preview: string
  file?: File
  id?: string
  isNew?: boolean
}

const visible = ref(false)
const loading = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()
const subsets = ref<SubsetRef[]>([])

const createBlankForm = () => ({ id: '', title: '', subset_id: '' })
const formModel = ref(createBlankForm())
const isEdit = computed(() => !!formModel.value.id)

const photos = ref<PendingPhoto[]>([])
/** 新选照片的 ObjectURL，关闭时要逐个释放 */
const objectUrls = new Set<string>()

const rules: FormRules = {
  title: [{ required: true, message: '请输入图库名称', trigger: 'blur' }],
  subset_id: [{ required: true, message: '请选择分组', trigger: 'change' }],
}

const makeKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** 分组下拉：取"摄影"分类下的分组 */
const loadSubsets = async () => {
  const categoryId = await getCategoryIdByPath('/gallery')
  if (!categoryId) {
    subsets.value = []
    return
  }
  const res = await getSubset({ category_id: categoryId })
  subsets.value = res.data || []
}

const releaseObjectUrls = () => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
  objectUrls.clear()
}

const resetState = () => {
  formModel.value = createBlankForm()
  photos.value = []
  releaseObjectUrls()
  uploadRef.value?.clearFiles()
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

    const res = await getGalleryDetail(id)
    const d = res.data

    formModel.value = { id: d.id, title: d.title, subset_id: d.subset_id || '' }
    photos.value = (d.photos || []).map((p) => ({
      key: p.id,
      id: p.id,
      name: p.file_name,
      preview: toAbsoluteUrl(p.url),
    }))
  } catch (error) {
    console.error('打开图库抽屉失败', error)
  } finally {
    loading.value = false
  }
}

// ================= 照片选择（拖拽 / 点击） =================

const handlePhotoChange = (uploadFile: UploadFile) => {
  const raw = uploadFile.raw
  // 清掉 el-upload 内部列表，方便重复选择同一张
  uploadRef.value?.clearFiles()
  if (!raw) return

  if (!raw.type.startsWith('image/')) {
    ElMessage.error('图库只能放图片（jpg / png / webp / gif）')
    return
  }
  if (raw.size > 10 * 1024 * 1024) {
    ElMessage.error(`「${raw.name}」超过 10MB`)
    return
  }
  const duplicated = photos.value.some(
    (p) => (p.file && p.file.name === raw.name && p.file.size === raw.size) || p.name === raw.name
  )
  if (duplicated) {
    ElMessage.warning('这张照片已添加')
    return
  }

  const objectUrl = URL.createObjectURL(raw)
  objectUrls.add(objectUrl)
  photos.value.push({
    key: makeKey(),
    name: raw.name,
    preview: objectUrl,
    file: raw,
    isNew: true,
  })
}

const removePhoto = (index: number) => {
  const target = photos.value[index]
  // 只释放自己创建的 ObjectURL，已存在的网络地址不要动
  if (target?.isNew && target.preview.startsWith('blob:')) {
    URL.revokeObjectURL(target.preview)
    objectUrls.delete(target.preview)
  }
  photos.value.splice(index, 1)
}

// ================= 提交：先补传照片，再一次性提交表单 =================

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
    if (photos.value.some((p) => !p.id && p.file)) {
      ElMessage.info('正在上传照片...')
    }

    const photoIds: string[] = []
    for (const item of photos.value) {
      if (item.id) {
        photoIds.push(item.id)
        continue
      }
      if (!item.file) continue
      const r = await uploadToServer(item.file)
      item.id = r.id
      item.name = r.file_name || item.name
      item.file = undefined
      item.isNew = false
      photoIds.push(r.id)
    }

    const payload = {
      title: formModel.value.title.trim(),
      subset_id: formModel.value.subset_id,
      photo_ids: photoIds,
    }

    if (isEdit.value) {
      await updateGallery({ ...payload, id: formModel.value.id })
      ElMessage.success('保存成功')
    } else {
      await insertGallery(payload)
      ElMessage.success('创建成功')
    }

    visible.value = false
    emit('success')
  } catch (error) {
    console.error('提交图库失败', error)
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

.gallery-form {
  padding-right: 8px;
}

.photo-box {
  width: 100%;
}

/* 已选照片网格 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: $my-bg-hover;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photo-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 6px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), transparent 45%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .photo-mask {
    opacity: 1;
  }

  .remove {
    cursor: pointer;
    color: #fff;
    font-size: 15px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50%;
    padding: 3px;

    &:hover {
      background-color: var(--el-color-danger);
    }
  }

  .badge {
    position: absolute;
    left: 6px;
    bottom: 6px;
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 4px;
    color: #fff;
    background-color: rgba(230, 162, 60, 0.9);
  }
}

/* 上传区 */
.photo-upload {
  :deep(.el-upload-dragger) {
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    background-color: $my-bg-hover;

    .el-icon {
      font-size: 26px;
      color: $my-text-sub;
    }
  }

  .tip {
    font-size: 13px;
    color: $my-text-main;
    text-align: center;
    line-height: 1.6;

    .hint {
      display: block;
      font-size: 11px;
      color: $my-text-sub;
      margin-top: 2px;
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
