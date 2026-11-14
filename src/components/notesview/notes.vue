<template>
  <div class="notes-page" :class="{ 'is-editing': isEditing }">
    <!-- 左侧：笔记列表 -->
    <div class="notes-list-wrapper" v-loading="loading">
      <div class="notes-list">
        <notes-item v-for="note in notes" :key="note.id" :note="note" @delete="handleDelete" />
        <el-empty v-if="!loading && notes.length === 0" description="暂无随笔数据" />
      </div>
    </div>

    <!-- 右侧：Markdown 编辑与实时预览 -->
    <div class="editor-wrapper">
      <div
        class="editor-container"
        @dragenter="handleDragEnter"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @paste="handlePaste">
        <!-- 输入区 -->
        <div class="editor-pane">
          <!-- 隐藏的文件上传框 -->
          <input
            type="file"
            ref="fileInputRef"
            accept="image/*"
            multiple
            style="display: none"
            @change="handleFileChange" />

          <el-input
            ref="inputRef"
            v-model="draftContent"
            type="textarea"
            placeholder="在此输入 Markdown 内容...（可直接拖拽或粘贴图片）"
            class="markdown-input"
            @focus="handleFocus"
            @blur="handleBlur" />
        </div>

        <!-- 实时渲染区 -->
        <div class="preview-pane">
          <div class="preview-inner" ref="previewInnerRef">
            <MarkdownRender
              :content="draftContent"
              :is-dark="isDark"
              mode="docs"
              :final="true"
              :fade="false"
              custom-id="notes" />
          </div>
        </div>

        <!-- 拖拽提示遮罩：pointer-events:none，不挡住 drop 事件 -->
        <div v-if="isDragging" class="drop-overlay">
          <el-icon><UploadFilled /></el-icon>
          <span>松开鼠标，把图片插入到光标处</span>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="editor-actions">
        <div class="actions-left">
          <!-- 阻止 mousedown 的默认行为，防止输入框失焦 -->
          <el-button @mousedown.prevent @click="triggerUpload" plain>添加图片</el-button>
        </div>
        <div class="actions-right">
          <el-button v-if="isEditing" @click="handleCancel">退出编辑</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">新建笔记</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { ElMessageBox, ElMessage, ElInput } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import NotesItem, { type Note } from './notes-item.vue'
import MarkdownRender, { removeCustomComponents, setCustomComponents } from 'markstream-vue'
import NoteImage from './note-image.vue'
import {
  LOCAL_IMAGE_SCHEME,
  clearLocalImages,
  getLocalImage,
  getLocalImageId,
  registerLocalImage,
} from './local-image'
import { getNotes, insertNotes, deleteNotes } from '@/api/notes'
import http from '@/utils/http'
import { toAbsoluteUrl } from '@/utils/asset'

const props = defineProps<{
  subset_id?: string
}>()

const notes = ref<Note[]>([]) // 笔记列表
const loading = ref(false) // 加载状态
const isEditing = ref(false) // 是否正在编辑
const submitting = ref(false) // 提交状态
const draftContent = ref('') // 草稿内容

const inputRef = ref<InstanceType<typeof ElInput>>() // 输入框实例
const previewInnerRef = ref<HTMLElement | null>(null) // 预览渲染实例
const fileInputRef = ref<HTMLInputElement | null>(null) // 图片上传框实例

// 只在本页把 image 节点换成支持本地 token 的渲染器，避免影响其它页面
const NOTES_RENDER_ID = 'notes'
setCustomComponents(NOTES_RENDER_ID, { image: NoteImage })

const isDark = computed(() => document.documentElement.classList.contains('dark'))

// 图片上传与处理逻辑

// 1. 触发文件选择
const triggerUpload = () => {
  fileInputRef.value?.click()
}

// 2. 在光标位置插入文本
const insertAtCursor = (insertText: string) => {
  const textarea = inputRef.value?.textarea
  if (!textarea) {
    draftContent.value += insertText
    return
  }

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  draftContent.value =
    draftContent.value.substring(0, start) + insertText + draftContent.value.substring(end)

  // 插入后重置光标到新插入内容之后
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + insertText.length, start + insertText.length)
  })
}

// 3. 把一批 File 变成 token 插到光标处。
//    按钮选择 / 拖拽 / 粘贴三条入口都走这里，逻辑只此一份。
const insertImageFiles = (files: File[]) => {
  const images = files.filter((file) => file.type.startsWith('image/'))
  if (images.length === 0) {
    if (files.length > 0) ElMessage.warning('只能插入图片文件')
    return
  }
  if (images.length < files.length) ElMessage.warning('已忽略非图片文件')

  const insertText = images
    .map((file) => {
      const id = registerLocalImage(file)
      // alt 里的 ] ( ) 会破坏 Markdown 语法
      const alt = file.name.replace(/[[\]()\\]/g, '_')
      return `![${alt}](${LOCAL_IMAGE_SCHEME}${id})\n`
    })
    .join('')

  // 拖拽/粘贴时输入框可能还没聚焦，先切编辑态让右侧预览出现
  isEditing.value = true
  insertAtCursor(insertText)
}

// 4. 点"添加图片"按钮 → 隐藏 input
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  target.value = '' // 允许重复选择同一张图
  insertImageFiles(files)
}

// 5. 拖拽 / 粘贴
const isDragging = ref(false)
let dragDepth = 0

/** 拖选中的文字也会触发 drag 事件，只有拖"文件"才处理 */
const isFileDrag = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files')

const handleDragEnter = (e: DragEvent) => {
  if (!isFileDrag(e)) return
  e.preventDefault()
  dragDepth++ // 进出子元素会反复触发，用计数避免遮罩闪烁
  isDragging.value = true
}

const handleDragOver = (e: DragEvent) => {
  if (!isFileDrag(e)) return
  e.preventDefault() // 不阻止默认行为，浏览器不允许 drop
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = (e: DragEvent) => {
  if (!isFileDrag(e)) return
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  if (!isFileDrag(e)) return
  e.preventDefault()
  dragDepth = 0
  isDragging.value = false

  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length === 0) return

  const textarea = inputRef.value?.textarea
  const wasFocused = !!textarea && document.activeElement === textarea
  inputRef.value?.focus() // 先让 textarea 拿到焦点，插入位置才稳定

  // 拖进未聚焦的输入框时，光标的默认位置是 0（会把图插到最前面）。
  // 这种情况统一追加到末尾，符合直觉。
  if (textarea && !wasFocused) {
    const end = draftContent.value.length
    textarea.setSelectionRange(end, end)
  }

  insertImageFiles(files)
}

/** 直接 Ctrl+V 粘贴截图（普通文本粘贴不受影响） */
const handlePaste = (e: ClipboardEvent) => {
  const files = Array.from(e.clipboardData?.items ?? [])
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter((f): f is File => !!f)

  if (files.length === 0) return
  e.preventDefault() // 否则浏览器会把图片当成文件名/路径塞进输入框
  insertImageFiles(files)
}

// 提交与接口替换逻辑

// ================= 图片上传接口 =================

/** 后端 POST /files/uploadFile 的响应体 */
interface UploadFileRes {
  code: number
  message: string
  data: {
    url: string // 形如 /data/<fileId>/<文件名>
    file_name: string
    size: number
    type: string
  }
}

const uploadImageApi = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  // 不要手动设置 Content-Type，交给 axios 自动补 multipart 的 boundary。
  // 图片通常几 MB，这里单独放宽超时（http.ts 里默认只有 5s）。
  const res = await http.post<any, UploadFileRes>('/files/uploadFile', formData, {
    timeout: 60000,
  })

  // 后端返回的是 /data/... 这种相对路径。前端跑在 5173、后端在 3001，
  // 直接写进 markdown 会被浏览器解析成前端域名的路径（5173/data/...）→ 404。
  return toAbsoluteUrl(res.data.url)
}

// 扫描内容中的本地图片 token，依次上传并替换为真实 URL
const LOCAL_IMAGE_RE = /!\[([^\]]*)\]\((note-image:\/\/[^)\s]+)\)/g

const processImagesAndReplace = async (content: string): Promise<string> => {
  const matches = Array.from(content.matchAll(LOCAL_IMAGE_RE))
  if (matches.length === 0) return content

  let newContent = content
  try {
    for (const m of matches) {
      const [fullMatch, alt, src] = m
      const id = getLocalImageId(src)
      const entry = id ? getLocalImage(id) : undefined
      if (!entry) {
        throw new Error('有图片已失效，请重新添加')
      }

      // 上传成功后缓存，重试提交时不会重复上传
      const realUrl = entry.remoteUrl ?? (await uploadImageApi(entry.file))
      entry.remoteUrl = realUrl
      // 用函数替换，避免文件名/URL 里的 $ 被当成 replace 的占位符
      newContent = newContent.replace(fullMatch, () => `![${alt}](${realUrl})`)
    }
    return newContent
  } catch (error: any) {
    console.error('图片上传失败', error)
    throw new Error(error?.message || '图片上传失败，请重试')
  }
}

// 光标控制与自动滚动逻辑

let scrollTimer: ReturnType<typeof setTimeout> | null = null
const doScrollToBottom = () => {
  if (previewInnerRef.value) {
    previewInnerRef.value.scrollTop = previewInnerRef.value.scrollHeight
  }
}
const throttleScrollToBottom = () => {
  if (scrollTimer) return
  scrollTimer = setTimeout(() => {
    scrollTimer = null
    doScrollToBottom()
  }, 80)
}

watch(draftContent, () => {
  if (!isEditing.value) return
  nextTick(() => {
    const textarea = inputRef.value?.textarea
    if (textarea) {
      // 只有当光标在文本最末尾时，才自动滚动到底部，避免修改上方内容时被拉回
      if (textarea.selectionStart >= draftContent.value.length) {
        throttleScrollToBottom()
      }
    }
  })
})

const handleFocus = () => {
  isEditing.value = true
  // 刚聚焦时，默认置底展示最新内容
  setTimeout(() => doScrollToBottom(), 50)
}

const handleBlur = (event: FocusEvent) => {
  const related = event.relatedTarget as HTMLElement | null
  // 点击操作栏或图片选择框时不触发退出
  if (related && typeof related.closest === 'function' && related.closest('.editor-actions')) {
    return
  }
  isEditing.value = false
}

// 生命周期与基础操作逻辑

const fetchNotes = async () => {
  loading.value = true
  try {
    const { data } = await getNotes({ pageNum: 1, pageSize: 10, subset_id: props.subset_id })
    notes.value = data.notes
  } catch (error) {
    console.error('获取随笔失败', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!draftContent.value.trim()) {
    ElMessage.warning('内容不能为空')
    return
  }
  submitting.value = true
  try {
    // 1. 处理并上传所有本地临时图片
    let finalContent = draftContent.value
    if (draftContent.value.includes(LOCAL_IMAGE_SCHEME)) {
      ElMessage.info('正在上传图片...')
      finalContent = await processImagesAndReplace(draftContent.value)
    }

    // 2. 调用新建笔记接口
    await insertNotes({
      title: '无标题随笔',
      content: finalContent,
      subset_id: props.subset_id || null,
    })

    ElMessage.success('新建成功')

    // 3. 清理状态
    draftContent.value = ''
    clearLocalImages()
    isEditing.value = false
    inputRef.value?.blur()
    await fetchNotes()
  } catch (error: any) {
    console.error('新建失败', error)
    if (error.message) ElMessage.error(error.message)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  isEditing.value = false
  inputRef.value?.blur()
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条随笔吗？', '警告', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  try {
    await deleteNotes(id)
    ElMessage.success('删除成功')
    notes.value = notes.value.filter((n) => n.id !== id)
  } catch (error) {
    console.error('删除随笔失败', error)
  }
}

onMounted(fetchNotes)
watch(() => props.subset_id, fetchNotes)

onBeforeUnmount(() => {
  clearLocalImages()
  removeCustomComponents(NOTES_RENDER_ID)
})
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.notes-page {
  display: flex;
  height: calc(100vh - 150px);
  gap: 20px;
  padding: 20px;
  background-color: $my-bg-page;
  overflow: hidden;
}

/* ---------- 左侧列表：未聚焦 70% → 聚焦 30% ---------- */
.notes-list-wrapper {
  flex: 0 0 70%;
  min-width: 0;
  background-color: $my-bg-card;
  border-radius: 8px;
  border: 1px solid $my-border-color;
  box-shadow: 0 2px 8px $my-shadow-color;
  overflow-y: auto;
  transition: flex-basis 0.35s ease;
}

.notes-page.is-editing .notes-list-wrapper {
  flex-basis: 30%;
}

/* ---------- 右侧编辑区 ---------- */
.editor-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: $my-bg-card;
  border-radius: 8px;
  border: 1px solid $my-border-color;
  box-shadow: 0 2px 8px $my-shadow-color;
  overflow: hidden;
}

.editor-container {
  position: relative; /* 拖拽遮罩的定位基准 */
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 拖拽提示遮罩 */
.drop-overlay {
  position: absolute;
  inset: 8px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed var(--el-color-primary);
  border-radius: 8px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 14px;
  /* 关键：不拦截鼠标事件，否则遮罩会挡住 dragleave/drop，导致闪烁 */
  pointer-events: none;

  .el-icon {
    font-size: 32px;
  }
}

/* 输入区 */
.editor-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.markdown-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  :deep(.el-textarea__inner) {
    flex: 1;
    height: 100% !important;
    min-height: 100% !important;
    resize: none;
    background-color: transparent;
    border: none;
    color: $my-text-main;
    font-family: inherit;
    line-height: 1.6;
    overflow-y: auto;

    &:focus {
      box-shadow: none;
    }
  }
}

/* 预览区 */
.preview-pane {
  flex: 0 0 0%;
  padding: 0;
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  border-left: 1px solid transparent;
  display: flex;
  flex-direction: column;
  transition:
    flex-basis 0.35s ease,
    padding 0.35s ease,
    opacity 0.35s ease,
    border-color 0.35s ease;
}

.notes-page.is-editing .preview-pane {
  flex-basis: 50%;
  padding: 16px;
  opacity: 1;
  border-left-color: $my-border-color;
}

.preview-inner {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 底部操作栏 */
.editor-actions {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid $my-border-color;
  background-color: $my-bg-card;

  .actions-left {
    display: flex;
    gap: 12px;
  }
  .actions-right {
    display: flex;
    gap: 12px;
  }
}
</style>
