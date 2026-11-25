<template>
  <div class="guestbook">
    <header class="page-head">
      <p class="label">GUESTBOOK</p>
      <h1 class="title">留言纸条</h1>
    </header>

    <div class="layout">
      <!-- 左边：写留言 -->
      <aside class="form-card">
        <h2 class="form-title">
          <ChatLineSquare />
          写一张小纸条
        </h2>
        <p class="hint">匿名留言，写完立刻公开，请友好发言。</p>

        <label class="field">
          <span class="field-label">怎么称呼你</span>
          <input
            v-model="nickname"
            class="input"
            type="text"
            maxlength="30"
            placeholder="2-30 个字" />
        </label>

        <label class="field">
          <span class="field-label">想说的话</span>
          <textarea
            v-model="content"
            class="input textarea"
            maxlength="500"
            placeholder="写点什么吧…" />
        </label>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="notice" class="notice">{{ notice }}</p>

        <div class="form-foot">
          <span class="count">{{ content.length }} / 500</span>
          <button class="submit" type="button" :disabled="sending" @click="submit">
            {{ sending ? '递出中…' : '递出留言' }}
            <Promotion />
          </button>
        </div>
      </aside>

      <!-- 右边：留言列表 -->
      <section class="list">
        <p v-if="loading" class="empty">加载中…</p>
        <p v-else-if="items.length === 0" class="empty">还没有人留言，来写第一张吧</p>

        <article v-for="item in items" :key="item.id" class="message">
          <div class="message-head">
            <span class="nickname">{{ item.nickname }}</span>
            <time class="date">{{ dateOf(item.created_at) }}</time>
          </div>
          <p class="message-body">{{ item.content }}</p>

          <!-- 作者回复的位置，功能以后再做 -->
          <p v-if="item.reply" class="reply">{{ item.reply }}</p>
        </article>

        <button v-if="items.length < total" class="more" type="button" @click="loadMore">
          加载更多（还有 {{ total - items.length }} 条）
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatLineSquare, Promotion } from '@element-plus/icons-vue'
import { getGuestbooks, getTotalGuestbook, insertGuestbook } from '@/api/guestbook'
import { dateOf } from '@/utils/format'

/** 列表里的一条，先给 reply 占个位（后端还没有这个字段） */
interface MessageItem {
  id: string
  nickname: string
  content: string
  created_at: string
  reply?: string
}

const items = ref<MessageItem[]>([])
const total = ref(0)
const loading = ref(false)
const pageNum = ref(1)

const nickname = ref('')
const content = ref('')
const sending = ref(false)
const error = ref('')
const notice = ref('')

const load = async (page = 1) => {
  loading.value = true
  try {
    const [list, count] = await Promise.all([getGuestbooks(10, page), getTotalGuestbook()])
    items.value = page === 1 ? list.guestbooks : [...items.value, ...list.guestbooks]
    total.value = count.total
    pageNum.value = page
  } catch (err) {
    console.error('获取留言失败', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => load(pageNum.value + 1)

const submit = async () => {
  error.value = ''
  notice.value = ''

  if (!nickname.value.trim()) return (error.value = '请填写你的称呼')
  if (!content.value.trim()) return (error.value = '留言内容不能为空')

  sending.value = true
  try {
    await insertGuestbook(nickname.value.trim(), content.value.trim())
    content.value = ''
    notice.value = '留言成功，谢谢你的小纸条 🎉'
    await load(1)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    sending.value = false
  }
}

onMounted(() => load(1))
</script>

<style scoped lang="scss">
.guestbook {
  max-width: 1180px;
  margin: 0 auto;
  padding-top: 8px;

  /* ---------- 页头 ---------- */
  .page-head {
    margin-bottom: 22px;

    .label {
      font-size: 12px;
      letter-spacing: 4px;
      color: $my-text-light;
    }

    .title {
      margin-top: 10px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 4px;
      color: $my-text-main;
    }
  }

  .layout {
    display: grid;
    grid-template-columns: 420px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }

  /* ---------- 左边表单 ---------- */
  .form-card {
    position: sticky;
    top: 88px;
    padding: 22px 24px 20px;
    border: 1px solid $my-border-color;
    border-radius: 16px;

    .form-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
    }

    .hint {
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.8;
      color: $my-text-light;
    }

    .field {
      display: block;
      margin-top: 18px;

      .field-label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        color: $my-text-sub;
      }
    }

    /* 输入框：透明底 + 一条下划线，跟纸条的感觉配 */
    .input {
      width: 100%;
      padding: 8px 0;
      border: none;
      border-bottom: 1px solid $my-border-color;
      background: transparent;
      font-family: inherit;
      font-size: 14px;
      color: $my-text-main;
      outline: none;
      transition: border-color 0.15s;

      &::placeholder {
        color: $my-text-light;
      }

      &:focus {
        border-bottom-color: $my-accent-color;
      }

      &.textarea {
        min-height: 120px;
        padding: 8px 0;
        resize: vertical;
      }
    }

    .error {
      margin-top: 14px;
      font-size: 12px;
      color: #e45649;
    }

    .notice {
      margin-top: 14px;
      font-size: 12px;
      color: $my-accent-color;
    }

    .form-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;

      .count {
        font-size: 12px;
        color: $my-text-light;
      }

      .submit {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 18px;
        border: 1px solid $my-accent-color;
        border-radius: 10px;
        background-color: transparent;
        font-family: inherit;
        font-size: 13px;
        color: $my-accent-color;
        cursor: pointer;
        transition:
          background-color 0.15s,
          color 0.15s;

        &:hover:not(:disabled) {
          background-color: $my-accent-color;
          color: #fff;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }

  /* ---------- 右边留言 ---------- */
  .list {
    min-width: 0;
  }

  .message {
    padding: 18px 0;
    border-bottom: 1px dashed $my-border-color;

    &:first-child {
      padding-top: 4px;
    }

    .message-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;

      .nickname {
        font-size: 16px;
        font-weight: 600;
        color: $my-text-main;
      }

      .date {
        flex: none;
        font-size: 12px;
        color: $my-text-light;
      }
    }

    .message-body {
      margin-top: 10px;
      font-size: 14px;
      line-height: 1.9;
      color: $my-text-sub;
      /* 超长的留言也换行，不撑破 */
      overflow-wrap: anywhere;
    }

    /* 作者回复（后端字段还没做，先留着样式） */
    .reply {
      margin-top: 12px;
      padding: 10px 14px;
      border-left: 3px solid $my-accent-color;
      border-radius: 0 8px 8px 0;
      background-color: color-mix(in srgb, var(--my-accent-color) 8%, transparent);
      font-size: 13px;
      line-height: 1.8;
      color: $my-text-main;
    }
  }

  .more {
    display: block;
    width: 100%;
    margin-top: 18px;
    padding: 10px;
    border: 1px solid $my-border-color;
    border-radius: 10px;
    background: transparent;
    font-family: inherit;
    font-size: 13px;
    color: $my-text-sub;
    cursor: pointer;

    &:hover {
      color: $my-accent-color;
      border-color: $my-accent-color;
    }
  }

  .empty {
    padding: 40px 0;
    font-size: 13px;
    color: $my-text-light;
  }

  :deep(svg) {
    width: 1em;
    height: 1em;
  }

  /* 窄了就上下排 */
  @media (max-width: 1000px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .form-card {
      position: static;
    }
  }
}
</style>