<template>
  <div class="guestbook">
    <header class="page-head">
      <p class="label">GUESTBOOK</p>
      <h1 class="title">留言纸条</h1>
    </header>

    <div class="layout">
      <!-- 左边：写留言 -->
      <aside class="form-card">
        <!-- 右上角那颗小闪光 -->
        <span class="sparkle" aria-hidden="true">✦</span>

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
            ref="textareaRef"
            v-model="content"
            class="input textarea"
            maxlength="500"
            placeholder="写点什么吧…" />
        </label>

        <!-- 颜文字：最近用过的 + 精选，点一下插到光标处 -->
        <div class="kaomoji">
          <p class="kaomoji-head" @click="kaomojiOpen = !kaomojiOpen">
            颜文字
            <span class="sign">{{ kaomojiOpen ? '－' : '＋' }}</span>
          </p>

          <!-- 外层负责 0fr → 1fr 的高度过渡，内层 overflow: hidden 把内容裁住 -->
          <div class="kaomoji-body" :class="{ open: kaomojiOpen }">
            <div>
              <template v-if="recent.length">
                <p class="group-title">最近使用</p>
                <div class="chips">
                  <span
                    v-for="item in recent"
                    :key="item"
                    class="chip"
                    @click="insertKaomoji(item)">
                    {{ item }}
                  </span>
                </div>
              </template>

              <p class="group-title">精选</p>
              <div class="chips">
                <span v-for="item in curated" :key="item" class="chip" @click="insertKaomoji(item)">
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <label class="field">
          <span class="field-label">邮箱 · 可选，不公开</span>
          <input
            v-model="email"
            class="input"
            type="email"
            maxlength="100"
            placeholder="填了我也许会给你回信" />
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

          <!-- 博主回复：一条留言配一条，底色淡淡一层，跟他的排版一致 -->
          <div v-if="item.reply" class="reply">
            <span class="reply-name">{{ ownerName }}</span>
            <span class="reply-text">{{ item.reply }}</span>
            <time v-if="item.replied_at" class="reply-date">{{ dateOf(item.replied_at) }}</time>
          </div>
        </article>

        <button v-if="items.length < total" class="more" type="button" @click="loadMore">
          加载更多（还有 {{ total - items.length }} 条）
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ChatLineSquare, Promotion } from '@element-plus/icons-vue'
import { getGuestbooks, getTotalGuestbook, insertGuestbook, type GuestbookItem } from '@/api/guestbook'
import { getProfile } from '@/api/profile'
import { dateOf } from '@/utils/format'

/** 留言列表里的一条（reply / replied_at 由后端带回） */
type MessageItem = GuestbookItem

/** 博主自己的名字，回复块里显示用 */
const ownerName = ref('博主')

const items = ref<MessageItem[]>([])
const total = ref(0)
const loading = ref(false)
const pageNum = ref(1)

const nickname = ref('')
const content = ref('')
const sending = ref(false)
const error = ref('')
const notice = ref('')

/* ---------- 颜文字 ---------- */

const RECENT_KEY = 'kaomoji-recent'
/** 精选：手写常用的这些，够用了 */
const curated = [
  '(｡･ω･｡)ﾉ♡',
  '(つ≧▽≦)つ',
  '(๑•̀ㅂ•́)و✧',
  '(´･ω･`)',
  '(￣▽￣)ノ',
  '(｡•́︿•̀｡)',
  '(≧▽≦)',
  '(。•ω•。)ノ♡',
  '( ﾟ▽ﾟ)/',
  '(⁄ ⁄•⁄ω⁄•⁄ ⁄)',
  '(*/ω＼*)',
  '(｡ì _ í｡)',
  '(・∀・)',
  '(๑>ᴗ<๑)',
  '(*≧ω≦)',
  '(｀・ω・´)',
]

const kaomojiOpen = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
/** 邮箱可选，不公开 */
const email = ref('')

/** 最近用过的，存在本地（最多 8 个，新的在最前） */
const readRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}
const recent = ref<string[]>(readRecent())

/** 插到光标所在位置，插完光标停在颜文字后面 */
const insertKaomoji = (text: string) => {
  const el = textareaRef.value
  const start = el?.selectionStart ?? content.value.length
  const end = el?.selectionEnd ?? start

  content.value = content.value.slice(0, start) + text + content.value.slice(end)

  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(start + text.length, start + text.length)
  })

  // 记进最近使用，去重后放最前，只留 8 个
  recent.value = [text, ...recent.value.filter((item) => item !== text)].slice(0, 8)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value))
}

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
    await insertGuestbook(nickname.value.trim(), content.value.trim(), email.value.trim())
    content.value = ''
    notice.value = '留言成功，谢谢你的小纸条 🎉'
    await load(1)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  await load(1)
  // 回复块里要显示博主名字，顺手拿一下
  try {
    ownerName.value = (await getProfile()).name
  } catch (error) {
    console.error('获取博主信息失败', error)
  }
})
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
    /* sticky 本身就是一个定位元素，右上角的 ✦ 可以相对它绝对定位 */
    position: sticky;
    top: 88px;
    padding: 22px 24px 20px;
    border: 1px solid $my-border-color;
    border-radius: 16px;

    /* 右上角那颗 ✦，轻轻一闪一闪 */
    .sparkle {
      position: absolute;
      top: 14px;
      right: 16px;
      font-size: 14px;
      line-height: 1;
      color: $my-accent-color;
      pointer-events: none;
      animation: twinkle 2.6s ease-in-out infinite;
    }

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

    /* ---------- 颜文字 ---------- */
    .kaomoji {
      margin-top: 16px;

      .kaomoji-head {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: $my-text-sub;
        cursor: pointer;
        user-select: none;

        .sign {
          color: $my-text-light;
        }

        &:hover {
          color: $my-text-main;
        }
      }

      /* 高度过渡：外层 0fr → 1fr，内层 overflow: hidden 把内容裁住，
         这样展开是“长出来”，不是“啪一下跳出来” */
      .kaomoji-body {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.28s ease;

        > div {
          overflow: hidden;
        }

        &.open {
          grid-template-rows: 1fr;
        }
      }

      .group-title {
        margin-top: 14px;
        font-size: 12px;
        color: $my-text-light;
      }

      /* 纯文字，不带底，跟他的排版一样 */
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin-top: 8px;

        .chip {
          font-size: 13px;
          line-height: 1.6;
          color: $my-text-sub;
          cursor: pointer;
          transition: color 0.15s;

          &:hover {
            color: $my-accent-color;
          }
        }
      }
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

    /* 博主回复：一块淡淡的底色，前面挂博主的名字，跟他的排版一样 */
    .reply {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      margin-top: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      background-color: color-mix(in srgb, var(--my-accent-color) 8%, transparent);
      font-size: 13px;
      line-height: 1.8;
      color: $my-text-main;

      .reply-name {
        flex: none;
        font-weight: 600;
        color: $my-accent-color;
      }

      .reply-text {
        overflow-wrap: anywhere;
      }

      /* 回复时间缩到最右上角，淡一点 */
      .reply-date {
        margin-left: auto;
        font-size: 11px;
        color: $my-text-light;
      }
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

/* 右上角那颗 ✦ 的呼吸感 */
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.9) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.15) rotate(15deg);
  }
}
</style>