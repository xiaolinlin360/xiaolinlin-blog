import http from '@/utils/http'
//获取评论列表
export interface Comment {
  id: number // 主键
  article_id: number // 文章ID
  user_id: number // 用户ID
  content: string // 评论内容 (varchar 1000)
  is_complained: number // 是否被投诉 (0: 否, 1: 是)
  created_at: string // 创建时间 (后端一般会返回字符串格式的日期)
  updated_at: string // 更新时间
  name: string // 用户昵称
  imgurl: string // 用户头像URL
}
interface CommentRes {
  code: number
  data: {
    comments: Comment[]
    pageNum: number
    pageSize: number
  }
}
export const getComments = (data: { pageNum: number; pageSize: number }) => {
  return http.post<any, CommentRes>('/getComment', data)
}

//获取评论总数
interface TotalCommentRes {
  code: number
  data: { total: number }
}
export const getTotalComment = () => {
  return http.post<any, TotalCommentRes>('/getTotalComment')
}

// 删除评论
interface DeleteCommentReq {
  code: number
  data: { message: string; error: string }
}
export const deleteComment = (id: number) => {
  return http.post<any, DeleteCommentReq>('/deleteComment', { id })
}
