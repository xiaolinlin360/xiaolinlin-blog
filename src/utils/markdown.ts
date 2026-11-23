import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'

export interface Heading {
  /** 1 = 一级标题（对应 md 的单个 #） */
  level: number
  text: string
  id: string
}

/** 没有语言、或者语言不认识时，原样转义输出 */
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 允许换行成 <br>，链接自动识别，禁掉裸 HTML（防止内容里塞脚本） */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  /** 代码块交给 highlight.js 上色；返回值以 <pre 开头就是整段替换 */
  highlight: (code, lang) => {
    const body =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        : escapeHtml(code)
    return `<pre class="hljs" data-lang="${lang || ''}"><code>${body}</code></pre>`
  },
})

/**
 * 渲染 markdown，同时把标题抽出来给右侧目录用。
 *
 * 标题 id 用 h-1、h-2… 顺序编号：中文标题转 slug 会出重复和怪字符，
 * 顺序编号最稳，而且目录和正文一定对得上。
 */
export const renderMarkdown = (source: string) => {
  const tokens = md.parse(source, {})
  const headings: Heading[] = []

  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return

    const id = `h-${headings.length + 1}`
    token.attrSet('id', id)
    headings.push({
      level: Number(token.tag.slice(1)),
      text: tokens[index + 1]?.content ?? '',
      id,
    })
  })

  return { html: md.renderer.render(tokens, md.options, {}), headings }
}
