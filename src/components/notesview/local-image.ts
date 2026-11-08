/**
 * 编辑期本地图片注册表。
 *
 * 编辑时 Markdown 里只写短 token：`![name](note-image://<id>)`，
 * 真正的 File / ObjectURL 放在这里。这样 textarea 和 Markdown 解析器
 * 都不需要处理整段 base64，输入和实时预览都不会被大字符串拖慢。
 *
 * token 会在提交时由 processImagesAndReplace 替换成上传后的真实 URL，
 * 不会写入数据库。
 */
export const LOCAL_IMAGE_SCHEME = 'note-image://'

export interface LocalImageEntry {
  file: File
  /** 同一份文件只创建一次，避免预览重渲染时反复解码 */
  objectUrl: string
  /** 上传成功后缓存，重试提交时不会重复上传 */
  remoteUrl?: string
}

const localImages = new Map<string, LocalImageEntry>()

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const registerLocalImage = (file: File): string => {
  const id = createId()
  localImages.set(id, { file, objectUrl: URL.createObjectURL(file) })
  return id
}

export const getLocalImage = (id: string) => localImages.get(id)

export const getLocalImageId = (src: string): string | null =>
  src.startsWith(LOCAL_IMAGE_SCHEME) ? src.slice(LOCAL_IMAGE_SCHEME.length) : null

export const clearLocalImages = () => {
  for (const entry of localImages.values()) {
    URL.revokeObjectURL(entry.objectUrl)
  }
  localImages.clear()
}
