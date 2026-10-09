// src/mock/data.ts

// ==========================================
// 1. 类型定义 (Interfaces)
// ==========================================

// --- 用户模块 ---
export interface User {
  id: number
  name: string
  mail: string
  password?: string // 模拟返回一般不包含密码，但在 Mock 数据中可以保留
  imgurl: string
  created_at: string
  updated_at: string
}

// --- 分类、标签模块 ---
export interface Subset {
  id: number
  subset_name: string
  classify: number
  created_at: string
  updated_at: string
}

export interface Label {
  id: number
  label_name: string
  user_id: string
  created_at: string
  updated_at: string
}

// --- 文章模块 ---
export interface Article {
  id: number
  title: string
  subset_id: number
  classify: number
  label: string
  introduce: string
  content: string
  cover: string
  views: number
  state: number // 0草稿，1已发布
  created_at: string
  updated_at: string
  // 联查后补充的字段
  author_name?: string
  subset_name?: string
}

// --- 文件模块 ---
export interface FileRecord {
  id: number
  url: string
  file_name: string
  format: string
  subset_id: number
  created_at: string
  updated_at: string
}

// --- 评论与点赞模块 ---
export interface Comment {
  id: number
  article_id: number
  user_id: number
  content: string
  is_complained: number // 0否，1是
  created_at: string
  updated_at: string
  // 联查后补充的字段
  user_name?: string
  user_imgurl?: string
}

export interface Praise {
  id: number
  user_id: string
  user_type: number
  article_id: number
  created_at: string
  updated_at: string
}

// --- 日记与天气模块 ---
export interface Diary {
  id: number
  title: string
  content: string
  picture: string
  weather_id: number
  mood: number
  created_at: string
  updated_at: string
  weather_name?: string
  weather_icon?: string
}

export interface Weather {
  id: number
  weather_name: string
  icon: string
}

// --- 消息与记录模块 ---
export interface Message {
  id: number
  sender_id: number
  user_id: number
  user_type: number // 1=用户私信，0=系统通知
  content: string
  isread: number // 0未读，1已读
  created_at: string
  updated_at: string
  sender_name?: string
  sender_imgurl?: string
}

export interface RecordItem {
  id: number
  user_id: string
  user_type: number
  position: string
  isread: number
  created_at: string
  updated_at: string
}

// ==========================================
// 2. Mock 数据 (Mock Data)
// ==========================================

// --- 用户 Mock ---
export const mockUsers: User[] = [
  {
    id: 1,
    name: '哈举办',
    mail: 'ha@example.com',
    imgurl: 'https://avatars.githubusercontent.com/u/1?v=4',
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    name: '张三',
    mail: 'zhangsan@example.com',
    imgurl: 'https://avatars.githubusercontent.com/u/2?v=4',
    created_at: '2024-01-02 11:00:00',
    updated_at: '2024-01-02 11:00:00',
  },
  {
    id: 3,
    name: '李四',
    mail: 'lisi@example.com',
    imgurl: 'https://avatars.githubusercontent.com/u/3?v=4',
    created_at: '2024-01-03 12:00:00',
    updated_at: '2024-01-03 12:00:00',
  },
  {
    id: 4,
    name: '王五',
    mail: 'wangwu@example.com',
    imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
    created_at: '2024-01-04 13:00:00',
    updated_at: '2024-01-04 13:00:00',
  },
]

// --- 分类与标签 Mock ---
export const mockSubsets: Subset[] = [
  {
    id: 1,
    subset_name: '前端开发',
    classify: 1,
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    subset_name: '后端开发',
    classify: 1,
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
  {
    id: 3,
    subset_name: 'UI设计',
    classify: 2,
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
]

export const mockLabels: Label[] = [
  {
    id: 1,
    label_name: 'Vue3',
    user_id: '1',
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    label_name: 'TypeScript',
    user_id: '1',
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
  {
    id: 3,
    label_name: 'Node.js',
    user_id: '2',
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00',
  },
]

// --- 文章 Mock ---
export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Vue3 + TypeScript 实战指南',
    subset_id: 1,
    classify: 1,
    label: 'Vue3,TypeScript',
    introduce: '本文将带你从零开始搭建一个 Vue3 + TS 的完整项目。',
    content: '<h1>Vue3 + TS</h1><p>详细内容...</p>',
    cover: 'https://picsum.photos/seed/vue/800/400',
    views: 234,
    state: 1,
    created_at: '2024-01-10 09:00:00',
    updated_at: '2024-01-10 09:00:00',
    author_name: '哈举办',
    subset_name: '前端开发',
  },
  {
    id: 2,
    title: 'Node.js 性能优化最佳实践',
    subset_id: 2,
    classify: 1,
    label: 'Node.js,性能优化',
    introduce: '探讨 Node.js 在高并发场景下的性能瓶颈与优化方案。',
    content: '<h1>Node.js 优化</h1><p>详细内容...</p>',
    cover: 'https://picsum.photos/seed/node/800/400',
    views: 189,
    state: 1,
    created_at: '2024-01-11 10:00:00',
    updated_at: '2024-01-11 10:00:00',
    author_name: '张三',
    subset_name: '后端开发',
  },
  {
    id: 3,
    title: '尚未完成的草稿文章',
    subset_id: 1,
    classify: 1,
    label: '随笔',
    introduce: '这是一篇草稿',
    content: '<p>草稿内容...</p>',
    cover: '',
    views: 0,
    state: 0,
    created_at: '2024-01-12 11:00:00',
    updated_at: '2024-01-12 11:00:00',
    author_name: '哈举办',
    subset_name: '前端开发',
  },
]

// --- 文件 Mock ---
export const mockFiles: FileRecord[] = [
  {
    id: 1,
    url: 'https://picsum.photos/seed/1/800/400',
    file_name: '封面图1.jpg',
    format: 'jpg',
    subset_id: 1,
    created_at: '2024-01-10 09:00:00',
    updated_at: '2024-01-10 09:00:00',
  },
  {
    id: 2,
    url: 'https://picsum.photos/seed/2/800/400',
    file_name: '封面图2.png',
    format: 'png',
    subset_id: 1,
    created_at: '2024-01-10 10:00:00',
    updated_at: '2024-01-10 10:00:00',
  },
  {
    id: 3,
    url: 'https://example.com/doc.pdf',
    file_name: '技术文档.pdf',
    format: 'pdf',
    subset_id: 2,
    created_at: '2024-01-11 11:00:00',
    updated_at: '2024-01-11 11:00:00',
  },
]

// --- 评论与点赞 Mock ---
export const mockComments: Comment[] = [
  {
    id: 1,
    article_id: 1,
    user_id: 1,
    content: '很高兴见到了你，你是那么的美丽动人！',
    is_complained: 0,
    created_at: '2024-01-18 14:32:32',
    updated_at: '2024-01-18 14:32:32',
    user_name: '哈举办',
    user_imgurl: 'https://avatars.githubusercontent.com/u/1?v=4',
  },
  {
    id: 2,
    article_id: 1,
    user_id: 2,
    content: '写得太好了，学到了很多！',
    is_complained: 0,
    created_at: '2024-01-18 15:00:00',
    updated_at: '2024-01-18 15:00:00',
    user_name: '张三',
    user_imgurl: 'https://avatars.githubusercontent.com/u/2?v=4',
  },
  {
    id: 3,
    article_id: 1,
    user_id: 3,
    content: '这个方案有漏洞，建议修改。',
    is_complained: 1,
    created_at: '2024-01-18 16:00:00',
    updated_at: '2024-01-18 16:00:00',
    user_name: '李四',
    user_imgurl: 'https://avatars.githubusercontent.com/u/3?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 4,
    article_id: 2,
    user_id: 4,
    content: '期待后续更新！',
    is_complained: 0,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    user_name: '王五',
    user_imgurl: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
]

export const mockPraises: Praise[] = [
  {
    id: 1,
    user_id: '1',
    user_type: 1,
    article_id: 1,
    created_at: '2024-01-18 14:00:00',
    updated_at: '2024-01-18 14:00:00',
  },
  {
    id: 2,
    user_id: '2',
    user_type: 1,
    article_id: 1,
    created_at: '2024-01-18 14:05:00',
    updated_at: '2024-01-18 14:05:00',
  },
  {
    id: 3,
    user_id: '1',
    user_type: 1,
    article_id: 2,
    created_at: '2024-01-18 14:10:00',
    updated_at: '2024-01-18 14:10:00',
  },
]

// --- 日记与天气 Mock ---
export const mockWeathers: Weather[] = [
  { id: 1, weather_name: '晴天', icon: 'sunny' },
  { id: 2, weather_name: '多云', icon: 'cloudy' },
  { id: 3, weather_name: '雨天', icon: 'rainy' },
]

export const mockDiaries: Diary[] = [
  {
    id: 1,
    title: '今天天气不错',
    content: '去公园散步了，心情很好。',
    picture: 'https://picsum.photos/seed/diary1/400/300',
    weather_id: 1,
    mood: 1,
    created_at: '2024-01-15 20:00:00',
    updated_at: '2024-01-15 20:00:00',
    weather_name: '晴天',
    weather_icon: 'sunny',
  },
  {
    id: 2,
    title: '周末下雨',
    content: '在家里看了一天书。',
    picture: '',
    weather_id: 3,
    mood: 2,
    created_at: '2024-01-16 21:00:00',
    updated_at: '2024-01-16 21:00:00',
    weather_name: '雨天',
    weather_icon: 'rainy',
  },
]

// --- 消息与记录 Mock ---
export const mockMessages: Message[] = [
  {
    id: 1,
    sender_id: 1,
    user_id: 2,
    user_type: 1,
    content: '你好！请问那篇文章可以转载吗？',
    isread: 0,
    created_at: '2024-01-19 10:00:00',
    updated_at: '2024-01-19 10:00:00',
    sender_name: '哈举办',
    sender_imgurl: 'https://avatars.githubusercontent.com/u/1?v=4',
  },
  {
    id: 2,
    sender_id: 0,
    user_id: 1,
    user_type: 0,
    content: '系统通知：您的文章《Vue3...》已被推荐至首页。',
    isread: 1,
    created_at: '2024-01-19 09:00:00',
    updated_at: '2024-01-19 09:00:00',
    sender_name: '系统通知',
    sender_imgurl: '',
  },
]

export const mockRecords: RecordItem[] = [
  {
    id: 1,
    user_id: '1',
    user_type: 1,
    position: '文章：Vue3 + TypeScript 实战指南',
    isread: 0,
    created_at: '2024-01-19 11:00:00',
    updated_at: '2024-01-19 11:00:00',
  },
  {
    id: 2,
    user_id: '1',
    user_type: 1,
    position: '图库：摄影作品展示',
    isread: 1,
    created_at: '2024-01-19 10:30:00',
    updated_at: '2024-01-19 10:30:00',
  },
]

// ==========================================
// 3. 导出汇总对象 (方便统一调用)
// ==========================================
export const mockData = {
  users: mockUsers,
  subsets: mockSubsets,
  labels: mockLabels,
  articles: mockArticles,
  files: mockFiles,
  comments: mockComments,
  praises: mockPraises,
  diaries: mockDiaries,
  weathers: mockWeathers,
  messages: mockMessages,
  records: mockRecords,
}

export default mockData
