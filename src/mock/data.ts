import Mock from 'mockjs'
const Random = Mock.Random

// 定义接口返回类型
export interface OverviewData {
  code: number
  data: {
    file: string
    article: number
    gallery: number
    diary: number
    project: number
    resource: number
  }
}

// 使用泛型声明
export const overview: OverviewData = Mock.mock({
  code: 200,
  data: {
    file: Random.float(60, 100, 3, 3) + 'M',
    'article|0-50': 0,
    'gallery|0-50': 0,
    'diary|0-50': 0,
    'project|0-50': 0,
    'resource|0-50': 0,
  },
})
