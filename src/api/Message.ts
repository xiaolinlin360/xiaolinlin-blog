import http from '@/utils/http'
//获取消息（私信）
export interface getMessageRef {
  id: string
  send_user_id: string
  receiver_user_id: string
  content: string
  created_at: string
  is_read: boolean
  msg_type: number
  sender_imgurl: string
  sender_name: string
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
  return http.post<any, Message>('/messages/getMessage', data)
}

// 获取消息总数
export interface getTotalMessageRef {
  data: {
    total: number
  }
  code: number
}
export const getTotalMessage = () => {
  return http.post<any, getTotalMessageRef>('/messages/getTotalMessage')
}

//标记已读
export interface ReadMessageRes {
  code: number
  data: { message: string; is_read: boolean }
}
export const readMessage = (data: { id: string }) => {
  return http.post<any, ReadMessageRes>('/messages/read', data)
}

//删除消息
// export interface DeleteMessageRes {
//   code: number
//   data: { message: string; error: string }
// }
// export const deleteMessage = (id: number) => {
//   return http.post<any, DeleteMessageRes>('/message/delete', { id })
// }
