import http from '@/utils/http'
export interface Labels {
  id: string
  label_name: string
  created_at: string
}
interface getLabelsRef {
  data: {
    labels: Labels[]
  }
  code: number
}
export const getLabels = () => {
  return http.post<any, getLabelsRef>('/label/getLabels')
}
