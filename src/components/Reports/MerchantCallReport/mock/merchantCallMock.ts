/**
 * 商家报号明细数据报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { MerchantCallItem, ReportQueryParams, BusinessTypeOption, CityDistrictMap } from '../types/merchantCallReport'

/**
 * 地市与区县映射关系
 */
export const cityDistrictMap: CityDistrictMap = {
  '北京市': ['朝阳区', '海淀区', '东城区', '西城区', '丰台区'],
  '上海市': ['浦东新区', '徐汇区', '静安区', '黄浦区', '长宁区'],
  '广州市': ['天河区', '越秀区', '荔湾区', '海珠区', '白云区'],
  '深圳市': ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区'],
  '杭州市': ['西湖区', '上城区', '下城区', '江干区', '拱墅区']
}

/**
 * 地市列表（包含"全部地市"选项）
 */
export const cityList: string[] = ['全部地市', ...Object.keys(cityDistrictMap)]

/**
 * 业务类型选项
 */
export const businessTypeOptions: BusinessTypeOption[] = [
  { value: 'all', label: '全部' },
  { value: '餐饮服务', label: '餐饮服务' },
  { value: '酒店住宿', label: '酒店住宿' },
  { value: '休闲娱乐', label: '休闲娱乐' },
  { value: '购物零售', label: '购物零售' },
  { value: '美容美发', label: '美容美发' },
  { value: '医疗健康', label: '医疗健康' }
]

/**
 * 模拟商家报号明细数据 - 复刻原型示例数据
 */
const mockMerchantCallData: MerchantCallItem[] = [
  {
    id: '1',
    index: 1,
    city: '北京市',
    district: '朝阳区',
    businessType: '餐饮服务',
    merchantName: '海底捞火锅（三里屯店）',
    broadcastNumber: '400-888-8888',
    callerNumber: '13812345678',
    callTime: '2026-03-17 09:15:32',
    serviceDuration: 186
  },
  {
    id: '2',
    index: 2,
    city: '上海市',
    district: '浦东新区',
    businessType: '酒店住宿',
    merchantName: '希尔顿酒店',
    broadcastNumber: '400-666-6666',
    callerNumber: '13987654321',
    callTime: '2026-03-17 09:12:18',
    serviceDuration: 245
  },
  {
    id: '3',
    index: 3,
    city: '广州市',
    district: '天河区',
    businessType: '休闲娱乐',
    merchantName: '万达影城',
    broadcastNumber: '400-999-9999',
    callerNumber: '13711112222',
    callTime: '2026-03-17 09:08:45',
    serviceDuration: 128
  },
  {
    id: '4',
    index: 4,
    city: '深圳市',
    district: '南山区',
    businessType: '购物零售',
    merchantName: '华润万象城',
    broadcastNumber: '400-777-7777',
    callerNumber: '13633334444',
    callTime: '2026-03-17 09:05:22',
    serviceDuration: 312
  },
  {
    id: '5',
    index: 5,
    city: '杭州市',
    district: '西湖区',
    businessType: '美容美发',
    merchantName: '丝域养发馆',
    broadcastNumber: '400-555-5555',
    callerNumber: '13555556666',
    callTime: '2026-03-17 09:01:56',
    serviceDuration: 167
  },
  {
    id: '6',
    index: 6,
    city: '北京市',
    district: '海淀区',
    businessType: '医疗健康',
    merchantName: '协和医院',
    broadcastNumber: '400-333-3333',
    callerNumber: '13477778888',
    callTime: '2026-03-17 08:58:34',
    serviceDuration: 423
  },
  {
    id: '7',
    index: 7,
    city: '上海市',
    district: '徐汇区',
    businessType: '餐饮服务',
    merchantName: '西贝莜面村',
    broadcastNumber: '400-222-2222',
    callerNumber: '13399990000',
    callTime: '2026-03-17 08:55:12',
    serviceDuration: 198
  },
  {
    id: '8',
    index: 8,
    city: '广州市',
    district: '越秀区',
    businessType: '酒店住宿',
    merchantName: '花园酒店',
    broadcastNumber: '400-111-1111',
    callerNumber: '13244445555',
    callTime: '2026-03-17 08:52:48',
    serviceDuration: 156
  },
  {
    id: '9',
    index: 9,
    city: '深圳市',
    district: '福田区',
    businessType: '休闲娱乐',
    merchantName: '欢乐谷',
    broadcastNumber: '400-444-4444',
    callerNumber: '13122223333',
    callTime: '2026-03-17 08:49:25',
    serviceDuration: 289
  },
  {
    id: '10',
    index: 10,
    city: '杭州市',
    district: '上城区',
    businessType: '购物零售',
    merchantName: '银泰百货',
    broadcastNumber: '400-000-0000',
    callerNumber: '13066667777',
    callTime: '2026-03-17 08:46:03',
    serviceDuration: 234
  }
]

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchMerchantCallData = async (
  params: ReportQueryParams
): Promise<MerchantCallItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockMerchantCallData]

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    filteredData = filteredData.filter(item => item.city === params.city)
  }

  // 区县筛选
  if (params.district && params.district !== '全部区县') {
    filteredData = filteredData.filter(item => item.district === params.district)
  }

  // 业务类型筛选
  if (params.businessType && params.businessType !== 'all') {
    filteredData = filteredData.filter(item => item.businessType === params.businessType)
  }

  // 商家名称筛选
  if (params.merchantName) {
    filteredData = filteredData.filter(item =>
      item.merchantName.includes(params.merchantName!)
    )
  }

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      const itemDate = item.callTime.split(' ')[0]
      return itemDate >= params.startDate! && itemDate <= params.endDate!
    })
  }

  // 重新生成序号
  filteredData = filteredData.map((item, index) => ({
    ...item,
    index: index + 1
  }))

  return filteredData
}
