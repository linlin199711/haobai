/**
 * 114推广/百事通加盟商家数据报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { MerchantDataItem, ReportQueryParams, BusinessTypeConfig } from '../types/merchantDataReport'

/**
 * 业务类型选项
 */
export const businessTypeOptions: BusinessTypeConfig[] = [
  { value: 'all', label: '全部' },
  { value: 'crm', label: 'CRM' },
  { value: 'internal', label: '内部受理' }
]

/**
 * 模拟商家数据 - 复刻原型示例数据
 * 包含：优推业务、品牌业务、实名业务、转接业务、短信业务
 */
const mockMerchantData: MerchantDataItem[] = [
  {
    id: '1',
    city: '北京市',
    promotion: { weeklyNew: 135, monthlyNew: 326, arrival: 946 },
    brand: { weeklyNew: 42, monthlyNew: 219, arrival: 1074 },
    realname: { weeklyNew: 58, monthlyNew: 204, arrival: 878 },
    transfer: { weeklyNew: 65, monthlyNew: 321, arrival: 839 },
    sms: { weeklyNew: 71, monthlyNew: 443, arrival: 552 },
    total: { weeklyNew: 371, monthlyNew: 1513, arrival: 4289 }
  },
  {
    id: '2',
    city: '上海市',
    promotion: { weeklyNew: 56, monthlyNew: 484, arrival: 1429 },
    brand: { weeklyNew: 45, monthlyNew: 233, arrival: 510 },
    realname: { weeklyNew: 27, monthlyNew: 103, arrival: 712 },
    transfer: { weeklyNew: 69, monthlyNew: 256, arrival: 528 },
    sms: { weeklyNew: 127, monthlyNew: 301, arrival: 807 },
    total: { weeklyNew: 324, monthlyNew: 1377, arrival: 3986 }
  },
  {
    id: '3',
    city: '广州市',
    promotion: { weeklyNew: 111, monthlyNew: 283, arrival: 882 },
    brand: { weeklyNew: 45, monthlyNew: 275, arrival: 469 },
    realname: { weeklyNew: 62, monthlyNew: 218, arrival: 561 },
    transfer: { weeklyNew: 85, monthlyNew: 156, arrival: 798 },
    sms: { weeklyNew: 92, monthlyNew: 320, arrival: 864 },
    total: { weeklyNew: 395, monthlyNew: 1252, arrival: 3574 }
  },
  {
    id: '4',
    city: '深圳市',
    promotion: { weeklyNew: 123, monthlyNew: 256, arrival: 1412 },
    brand: { weeklyNew: 34, monthlyNew: 174, arrival: 1185 },
    realname: { weeklyNew: 71, monthlyNew: 229, arrival: 883 },
    transfer: { weeklyNew: 78, monthlyNew: 301, arrival: 1048 },
    sms: { weeklyNew: 63, monthlyNew: 213, arrival: 1232 },
    total: { weeklyNew: 369, monthlyNew: 1173, arrival: 5760 }
  },
  {
    id: '5',
    city: '杭州市',
    promotion: { weeklyNew: 89, monthlyNew: 342, arrival: 992 },
    brand: { weeklyNew: 35, monthlyNew: 179, arrival: 576 },
    realname: { weeklyNew: 41, monthlyNew: 125, arrival: 410 },
    transfer: { weeklyNew: 55, monthlyNew: 122, arrival: 465 },
    sms: { weeklyNew: 85, monthlyNew: 199, arrival: 774 },
    total: { weeklyNew: 305, monthlyNew: 967, arrival: 3217 }
  },
  {
    id: '6',
    city: '南京市',
    promotion: { weeklyNew: 74, monthlyNew: 394, arrival: 823 },
    brand: { weeklyNew: 39, monthlyNew: 236, arrival: 874 },
    realname: { weeklyNew: 37, monthlyNew: 193, arrival: 637 },
    transfer: { weeklyNew: 74, monthlyNew: 246, arrival: 609 },
    sms: { weeklyNew: 65, monthlyNew: 450, arrival: 663 },
    total: { weeklyNew: 289, monthlyNew: 1519, arrival: 3606 }
  },
  {
    id: '7',
    city: '成都市',
    promotion: { weeklyNew: 64, monthlyNew: 382, arrival: 1053 },
    brand: { weeklyNew: 57, monthlyNew: 304, arrival: 795 },
    realname: { weeklyNew: 21, monthlyNew: 159, arrival: 583 },
    transfer: { weeklyNew: 48, monthlyNew: 153, arrival: 447 },
    sms: { weeklyNew: 49, monthlyNew: 369, arrival: 507 },
    total: { weeklyNew: 239, monthlyNew: 1367, arrival: 3385 }
  },
  {
    id: '8',
    city: '武汉市',
    promotion: { weeklyNew: 140, monthlyNew: 221, arrival: 1207 },
    brand: { weeklyNew: 34, monthlyNew: 336, arrival: 657 },
    realname: { weeklyNew: 58, monthlyNew: 264, arrival: 654 },
    transfer: { weeklyNew: 93, monthlyNew: 314, arrival: 448 },
    sms: { weeklyNew: 88, monthlyNew: 407, arrival: 953 },
    total: { weeklyNew: 413, monthlyNew: 1542, arrival: 3919 }
  },
  {
    id: '9',
    city: '西安市',
    promotion: { weeklyNew: 55, monthlyNew: 447, arrival: 1055 },
    brand: { weeklyNew: 97, monthlyNew: 336, arrival: 1067 },
    realname: { weeklyNew: 32, monthlyNew: 282, arrival: 574 },
    transfer: { weeklyNew: 80, monthlyNew: 152, arrival: 1010 },
    sms: { weeklyNew: 57, monthlyNew: 221, arrival: 1295 },
    total: { weeklyNew: 321, monthlyNew: 1438, arrival: 4001 }
  },
  {
    id: '10',
    city: '重庆市',
    promotion: { weeklyNew: 138, monthlyNew: 288, arrival: 860 },
    brand: { weeklyNew: 69, monthlyNew: 238, arrival: 864 },
    realname: { weeklyNew: 60, monthlyNew: 190, arrival: 395 },
    transfer: { weeklyNew: 93, monthlyNew: 196, arrival: 365 },
    sms: { weeklyNew: 77, monthlyNew: 354, arrival: 748 },
    total: { weeklyNew: 437, monthlyNew: 1266, arrival: 3232 }
  }
]

/**
 * 计算合计行数据
 * 自动累加所有地市的对应业务指标
 */
export const calculateSummaryRow = (data: MerchantDataItem[]) => {
  const summary = {
    city: '合计',
    promotion: { weeklyNew: 0, monthlyNew: 0, arrival: 0 },
    brand: { weeklyNew: 0, monthlyNew: 0, arrival: 0 },
    realname: { weeklyNew: 0, monthlyNew: 0, arrival: 0 },
    transfer: { weeklyNew: 0, monthlyNew: 0, arrival: 0 },
    sms: { weeklyNew: 0, monthlyNew: 0, arrival: 0 },
    total: { weeklyNew: 0, monthlyNew: 0, arrival: 0 }
  }

  data.forEach(item => {
    // 优推业务合计
    summary.promotion.weeklyNew += item.promotion.weeklyNew
    summary.promotion.monthlyNew += item.promotion.monthlyNew
    summary.promotion.arrival += item.promotion.arrival

    // 品牌业务合计
    summary.brand.weeklyNew += item.brand.weeklyNew
    summary.brand.monthlyNew += item.brand.monthlyNew
    summary.brand.arrival += item.brand.arrival

    // 实名业务合计
    summary.realname.weeklyNew += item.realname.weeklyNew
    summary.realname.monthlyNew += item.realname.monthlyNew
    summary.realname.arrival += item.realname.arrival

    // 转接业务合计
    summary.transfer.weeklyNew += item.transfer.weeklyNew
    summary.transfer.monthlyNew += item.transfer.monthlyNew
    summary.transfer.arrival += item.transfer.arrival

    // 短信业务合计
    summary.sms.weeklyNew += item.sms.weeklyNew
    summary.sms.monthlyNew += item.sms.monthlyNew
    summary.sms.arrival += item.sms.arrival

    // 总计合计
    summary.total.weeklyNew += item.total.weeklyNew
    summary.total.monthlyNew += item.total.monthlyNew
    summary.total.arrival += item.total.arrival
  })

  return summary
}

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchMerchantData = async (
  params: ReportQueryParams
): Promise<MerchantDataItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockMerchantData]

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    // 实际应用中根据日期筛选数据
    // 这里简化处理，返回全部数据
  }

  // 业务类型筛选
  if (params.type && params.type !== 'all') {
    // 实际应用中根据类型筛选数据
    // 这里简化处理，返回全部数据
  }

  return filteredData
}
