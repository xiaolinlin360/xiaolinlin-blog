import http from '@/utils/http'
//获取消息（私信）
export interface getMessageRef {
  id: number
  sender_id: number
  receiver_id: number
  msg_type: number
  content: string
  is_read: number
  created_at: string
  updated_at: string
  /** 发送者头像（来自 users.imgurl，发送者不存在时为 null） */
  sender_imgurl: string | null
  /** 发送者名字（来自 users.name，发送者不存在时为 null） */
  sender_name: string | null
}
export interface Message {
  data: {
    messages: getMessageRef[]
    pageSize: number
    pageNum: number
  }
  code: number
}
export const getMessage = (data: { pageNum: number; pageSize: number }) => {
  return http.post<any, Message>('/message/getMessage', data)
}

// 获取消息总数
export interface getTotalMessageRef {
  data: {
    total: number
  }
  code: number
}
export const getTotalMessage = () => {
  return http.post<any, getTotalMessageRef>('/message/getTotalMessage')
}

//标记已读
export interface ReadMessageRes {
  code: number
  data: { message: string; is_read: number }
}
export const readMessage = (data: { id: number }) => {
  return http.post<any, ReadMessageRes>('/message/read', data)
}

//删除消息
// export interface DeleteMessageRes {
//   code: number
//   data: { message: string; error: string }
// }
// export const deleteMessage = (id: number) => {
//   return http.post<any, DeleteMessageRes>('/message/delete', { id })
// }
