<template>
  <!-- 编辑期的本地图片：自己渲染 img，才能使用 ObjectURL 做懒加载 + 占位 -->
  <span
    v-if="localEntry"
    class="note-local-image"
    :class="{ 'is-loaded': loaded, 'is-error': failed }"
    @click="handleClick">
    <img
      v-if="!failed"
      :src="localEntry.objectUrl"
      :alt="node.alt || ''"
      :title="node.title || node.alt || ''"
      loading="lazy"
      decoding="async"
      @load="handleLoad"
      @error="handleError" />
    <span v-if="!loaded || failed" class="note-local-image__placeholder" aria-hidden="true">
      <span v-if="!failed" class="note-local-image__shimmer"></span>
      <span v-else class="note-local-image__error">图片加载失败</span>
    </span>
  </span>

  <!-- 服务端图片继续使用 markstream 内置 ImageNode（懒加载 / 占位 / 错误态） -->
  <ImageNode
    v-else
    :node="node"
    lazy
    @load="emit('load', $event)"
    @error="emit('error', $event)"
    @click="emit('click', $event)" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ImageNode, type ImageNodeProps } from 'markstream-vue'
import { getLocalImage, getLocalImageId } from './local-image'

const props = defineProps<
  ImageNodeProps & {
    loading?: boolean
    indexKey?: string | number
    customId?: string
    isDark?: boolean
  }
>()

const emit = defineEmits<{
  load: [src: string]
  error: [src: string]
  click: [payload: [Event, string]]
}>()

const loaded = ref(false)
const failed = ref(false)

/** 只有 `note-image://<id>` 才走本地 ObjectURL 分支 */
const localEntry = computed(() => {
  const id = getLocalImageId(props.node.src)
  return id ? getLocalImage(id) : undefined
})

watch(
  () => props.node.src,
  () => {
    loaded.value = false
    failed.value = false
  }
)

const handleLoad = () => {
  loaded.value = true
  if (localEntry.value) emit('load', localEntry.value.objectUrl)
}

const handleError = () => {
  failed.value = true
  if (localEntry.value) emit('error', localEntry.value.objectUrl)
}

const handleClick = (e: MouseEvent) => {
  if (!loaded.value || !localEntry.value) return
  e.preventDefault()
  emit('click', [e, localEntry.value.objectUrl])
}
</script>

<style scoped lang="scss">
.note-local-image {
  position: relative;
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;

  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &.is-loaded img {
    opacity: 1;
  }

  &.is-error {
    cursor: default;
  }
}

.note-local-image__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 8rem;
  min-height: 8rem;
  overflow: hidden;
  border-radius: 6px;
  background: var(--el-fill-color-light, #f2f3f5);
}

.note-local-image__shimmer {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 8rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset-block: 0;
    left: -200%;
    width: 300%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.45),
      transparent
    );
    animation: note-image-shimmer 1.4s ease-in-out infinite;
  }
}

.note-local-image__error {
  padding: 1rem 1.5rem;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}

@keyframes note-image-shimmer {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
