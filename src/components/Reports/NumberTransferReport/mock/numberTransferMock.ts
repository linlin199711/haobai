/**
 * 号码转接报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { NumberTransferItem, ReportQueryParams, QueryMethodOption, StatisticsPeriodOption, CallQueryPartyOption } from '../types/numberTransferReport'

/**
 * 查询方式选项
 */
export const queryMethodOptions: QueryMethodOption[] = [
  { value: 'all', label: '全部' },
  { value: 'team', label: '班组' },
  { value: 'agent', label: '坐席' },
  { value: 'phone', label: '电话号码' }
]

/**
 * 统计方式选项（周期粒度）
 */
export const statisticsPeriodOptions: StatisticsPeriodOption[] = [
  { value: 'day', label: '按日统计' },
  { value: 'week', label: '按周统计' },
  { value: 'month', label: '按月统计' }
]

/**
 * 话务查询方选项
 */
export const callQueryPartyOptions: CallQueryPartyOption[] = [
  { value: 'all', label: '全部' },
  { value: 'team', label: '班组' },
  { value: 'employee', label: '员工' }
]

/**
 * 班组列表
 */
export const teamList: string[] = [
  '全部班组',
  '客服一组',
  '客服二组',
  '客服三组',
  '销售组',
  '技术支持组'
]

/**
 * 模拟号码转接数据 - 复刻原型示例数据
 */
const mockNumberTransferData: NumberTransferItem[] = [
  {
    id: '1',
    transferDate: '2026-03-17',
    phoneNumber: '13918442739',
    transferCount: 88,
    successCount: 76,
    successRate: 86.36,
    callDuration: 162
  },
  {
    id: '2',
    transferDate: '2026-03-16',
    phoneNumber: '18803735501',
    transferCount: 107,
    successCount: 83,
    successRate: 77.57,
    callDuration: 51
  },
  {
    id: '3',
    transferDate: '2026-03-15',
    phoneNumber: '15917881305',
    transferCount: 108,
    successCount: 97,
    successRate: 89.81,
    callDuration: 240
  },
  {
    id: '4',
    transferDate: '2026-03-14',
    phoneNumber: '18362114261',
    transferCount: 56,
    successCount: 47,
    successRate: 83.93,
    callDuration: 101
  },
  {
    id: '5',
    transferDate: '2026-03-13',
    phoneNumber: '13889965516',
    transferCount: 112,
    successCount: 79,
    successRate: 70.54,
    callDuration: 211
  },
  {
    id: '6',
    transferDate: '2026-03-12',
    phoneNumber: '13765432198',
    transferCount: 75,
    successCount: 68,
    successRate: 90.67,
    callDuration: 180
  },
  {
    id: '7',
    transferDate: '2026-03-11',
    phoneNumber: '13612345678',
    transferCount: 92,
    successCount: 82,
    successRate: 89.13,
    callDuration: 145
  },
  {
    id: '8',
    transferDate: '2026-03-10',
    phoneNumber: '13598765432',
    transferCount: 64,
    successCount: 53,
    successRate: 82.81,
    callDuration: 98
  }
]

/**
 * 计算转接成功率
 * 计算公式：转接成功率 = 转接成功次数 / 转接次数 * 100%
 * 防零处理：转接次数为0时，默认展示0%
 */
export const calculateSuccessRate = (successCount: number, transferCount: number): number => {
  if (transferCount === 0) {
    return 0
  }
  return Number(((successCount / transferCount) * 100).toFixed(2))
}

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchNumberTransferData = async (
  params: ReportQueryParams
): Promise<NumberTransferItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockNumberTransferData]

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      return item.transferDate >= params.startDate! && item.transferDate <= params.endDate!
    })
  }

  // 话务查询方筛选（实际应用中根据查询方过滤）
  if (params.callQueryParty && params.callQueryParty !== 'all') {
    // 实际应用中根据话务查询方筛选数据
    // 这里简化处理，返回全部数据
  }

  // 班组筛选（当查询方式为班组时）
  if (params.queryMethod === 'team' && params.team && params.team !== '全部班组') {
    // 实际应用中根据班组筛选数据
    // 这里简化处理，返回全部数据
  }

  // 按统计周期聚合（实际应用中需要按周期聚合数据）
  if (params.statisticsPeriod) {
    // 实际应用中根据statisticsPeriod对数据进行聚合
    // day: 保持原样
    // week: 按周聚合
    // month: 按月聚合
  }

  return filteredData
}
