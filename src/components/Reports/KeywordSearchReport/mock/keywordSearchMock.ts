/**
 * 话务员输入关键词搜索量统计表 - Mock数据
 * @description 提供报表所需的模拟数据，数据来源于【号码本地搜】模块话务员手动输入关键词的搜索行为
 * @version 1.0.0
 */

import type { KeywordSearchItem, ReportQueryParams, PeriodConfig } from '../types/keywordSearchReport'

/**
 * 地市列表
 */
export const cityList: string[] = [
  '全部地市',
  '杭州市',
  '宁波市',
  '温州市',
  '嘉兴市',
  '湖州市',
  '绍兴市',
  '金华市',
  '衢州市',
  '舟山市',
  '台州市',
  '丽水市'
]

/**
 * 统计周期选项
 */
export const periodOptions: PeriodConfig[] = [
  { value: 'halfHour', label: '半小时' },
  { value: 'hour', label: '小时' },
  { value: 'day', label: '日' },
  { value: 'month', label: '月' }
]

/**
 * 行业列表
 */
export const industryList: string[] = [
  '全部行业',
  '金融保险',
  '房产家居',
  '教育培训',
  '医疗健康',
  '电商零售',
  '餐饮服务',
  '汽车服务',
  '旅游酒店',
  '企业服务'
]

/**
 * 模拟话务员关键词搜索数据 - 复刻原型示例数据
 * 数据来源：【号码本地搜】模块话务员手动输入关键词的搜索行为
 */
const mockKeywordSearchData: KeywordSearchItem[] = [
  {
    id: '1',
    city: '杭州市',
    period: '2026-03-01',
    industry: '金融保险',
    keyword: '贷款利率',
    queryCount: 397,
    broadcastCount: 551,
    isPriority: true
  },
  {
    id: '2',
    city: '宁波市',
    period: '2026-03-02',
    industry: '房产家居',
    keyword: '房产过户',
    queryCount: 1058,
    broadcastCount: 354,
    isPriority: false
  },
  {
    id: '3',
    city: '温州市',
    period: '2026-03-03',
    industry: '教育培训',
    keyword: '英语培训',
    queryCount: 336,
    broadcastCount: 659,
    isPriority: false
  },
  {
    id: '4',
    city: '嘉兴市',
    period: '2026-03-04',
    industry: '医疗健康',
    keyword: '挂号预约',
    queryCount: 817,
    broadcastCount: 583,
    isPriority: true
  },
  {
    id: '5',
    city: '湖州市',
    period: '2026-03-05',
    industry: '电商零售',
    keyword: '促销活动',
    queryCount: 647,
    broadcastCount: 753,
    isPriority: false
  },
  {
    id: '6',
    city: '绍兴市',
    period: '2026-03-01',
    industry: '餐饮服务',
    keyword: '外卖订餐',
    queryCount: 1085,
    broadcastCount: 242,
    isPriority: false
  },
  {
    id: '7',
    city: '金华市',
    period: '2026-03-02',
    industry: '金融保险',
    keyword: '保险理赔',
    queryCount: 659,
    broadcastCount: 752,
    isPriority: true
  },
  {
    id: '8',
    city: '衢州市',
    period: '2026-03-03',
    industry: '房产家居',
    keyword: '装修报价',
    queryCount: 243,
    broadcastCount: 285,
    isPriority: false
  },
  {
    id: '9',
    city: '杭州市',
    period: '2026-03-04',
    industry: '教育培训',
    keyword: '考研辅导',
    queryCount: 579,
    broadcastCount: 824,
    isPriority: false
  },
  {
    id: '10',
    city: '宁波市',
    period: '2026-03-05',
    industry: '医疗健康',
    keyword: '体检套餐',
    queryCount: 265,
    broadcastCount: 385,
    isPriority: true
  }
]

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchKeywordSearchData = async (
  params: ReportQueryParams
): Promise<KeywordSearchItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockKeywordSearchData]

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    filteredData = filteredData.filter(item => item.city === params.city)
  }

  // 关键词筛选
  if (params.keyword) {
    filteredData = filteredData.filter(item =>
      item.keyword.includes(params.keyword!)
    )
  }

  // 行业筛选
  if (params.industry && params.industry !== '全部行业') {
    filteredData = filteredData.filter(item => item.industry === params.industry)
  }

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.period)
      const start = new Date(params.startDate!)
      const end = new Date(params.endDate!)
      return itemDate >= start && itemDate <= end
    })
  }

  return filteredData
}
