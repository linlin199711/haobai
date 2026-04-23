/**
 * 全省综合话务统计报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { ProvinceCallItem, ReportQueryParams, PeriodOption, SummaryRow, QueryPeriod } from '../types/provinceCallReport'

/**
 * 查询方式选项（周期粒度）
 */
export const periodOptions: PeriodOption[] = [
  { value: 'halfHour', label: '半小时' },
  { value: 'hour', label: '小时' },
  { value: 'day', label: '日' },
  { value: 'month', label: '月' }
]

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
 * 接入码列表
 */
export const accessCodeList: string[] = [
  '全部接入码',
  '114',
  '116114',
  '118114'
]

/**
 * 模拟全省综合话务数据 - 复刻原型示例数据
 * 按小时统计粒度
 */
const mockProvinceCallData: ProvinceCallItem[] = [
  {
    id: '1',
    city: '杭州市',
    time: '2026-03-17 08:00:00',
    inboundCount: 5229,
    queueCount: 2744,
    queueSuccessCount: 2524,
    manualAnswerCount: 2221,
    timelyAnswerCount: 1887,
    manualLossCount: 303,
    autoLossCount: 583,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95.08,
    autoTimelyAnswerRate: 84.96,
    answerTimelyRateNoLoss: 84.96,
    answerTimelyRateWithLoss: 74.76,
    totalProcessTime: 4789,
    totalTransferTime: 30917
  },
  {
    id: '2',
    city: '宁波市',
    time: '2026-03-17 09:00:00',
    inboundCount: 5842,
    queueCount: 4795,
    queueSuccessCount: 4411,
    manualAnswerCount: 3881,
    timelyAnswerCount: 3298,
    manualLossCount: 530,
    autoLossCount: 382,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95,
    autoTimelyAnswerRate: 84.99,
    answerTimelyRateNoLoss: 84.98,
    answerTimelyRateWithLoss: 74.77,
    totalProcessTime: 5673,
    totalTransferTime: 15820
  },
  {
    id: '3',
    city: '温州市',
    time: '2026-03-17 10:00:00',
    inboundCount: 3947,
    queueCount: 3304,
    queueSuccessCount: 3088,
    manualAnswerCount: 2714,
    timelyAnswerCount: 2306,
    manualLossCount: 374,
    autoLossCount: 197,
    manualAnswerRate: 80.92,
    autoAnswerRate: 95.07,
    autoTimelyAnswerRate: 84.97,
    answerTimelyRateNoLoss: 84.97,
    answerTimelyRateWithLoss: 74.75,
    totalProcessTime: 2620,
    totalTransferTime: 32563
  },
  {
    id: '4',
    city: '嘉兴市',
    time: '2026-03-17 11:00:00',
    inboundCount: 3019,
    queueCount: 2568,
    queueSuccessCount: 2360,
    manualAnswerCount: 2076,
    timelyAnswerCount: 1764,
    manualLossCount: 284,
    autoLossCount: 128,
    manualAnswerRate: 80.9,
    autoAnswerRate: 95.03,
    autoTimelyAnswerRate: 84.97,
    answerTimelyRateNoLoss: 84.97,
    answerTimelyRateWithLoss: 74.75,
    totalProcessTime: 3314,
    totalTransferTime: 33363
  },
  {
    id: '5',
    city: '湖州市',
    time: '2026-03-17 12:00:00',
    inboundCount: 5951,
    queueCount: 5038,
    queueSuccessCount: 4653,
    manualAnswerCount: 4094,
    timelyAnswerCount: 3479,
    manualLossCount: 559,
    autoLossCount: 387,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95.08,
    autoTimelyAnswerRate: 84.96,
    answerTimelyRateNoLoss: 84.98,
    answerTimelyRateWithLoss: 74.77,
    totalProcessTime: 4970,
    totalTransferTime: 16432
  },
  {
    id: '6',
    city: '绍兴市',
    time: '2026-03-17 13:00:00',
    inboundCount: 5877,
    queueCount: 4965,
    queueSuccessCount: 4595,
    manualAnswerCount: 4043,
    timelyAnswerCount: 3436,
    manualLossCount: 552,
    autoLossCount: 393,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95.08,
    autoTimelyAnswerRate: 84.99,
    answerTimelyRateNoLoss: 84.99,
    answerTimelyRateWithLoss: 74.78,
    totalProcessTime: 5439,
    totalTransferTime: 8430
  },
  {
    id: '7',
    city: '金华市',
    time: '2026-03-17 14:00:00',
    inboundCount: 4291,
    queueCount: 3647,
    queueSuccessCount: 3333,
    manualAnswerCount: 2932,
    timelyAnswerCount: 2492,
    manualLossCount: 401,
    autoLossCount: 216,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95.08,
    autoTimelyAnswerRate: 84.99,
    answerTimelyRateNoLoss: 84.99,
    answerTimelyRateWithLoss: 74.78,
    totalProcessTime: 2261,
    totalTransferTime: 34204
  },
  {
    id: '8',
    city: '衢州市',
    time: '2026-03-17 15:00:00',
    inboundCount: 4776,
    queueCount: 4059,
    queueSuccessCount: 3734,
    manualAnswerCount: 3283,
    timelyAnswerCount: 2790,
    manualLossCount: 451,
    autoLossCount: 288,
    manualAnswerRate: 80.93,
    autoAnswerRate: 95.07,
    autoTimelyAnswerRate: 84.98,
    answerTimelyRateNoLoss: 84.98,
    answerTimelyRateWithLoss: 74.77,
    totalProcessTime: 3380,
    totalTransferTime: 10170
  },
  {
    id: '9',
    city: '舟山市',
    time: '2026-03-17 16:00:00',
    inboundCount: 2950,
    queueCount: 2507,
    queueSuccessCount: 2306,
    manualAnswerCount: 2029,
    timelyAnswerCount: 1724,
    manualLossCount: 277,
    autoLossCount: 147,
    manualAnswerRate: 80.93,
    autoAnswerRate: 95.07,
    autoTimelyAnswerRate: 84.97,
    answerTimelyRateNoLoss: 84.97,
    answerTimelyRateWithLoss: 74.76,
    totalProcessTime: 3519,
    totalTransferTime: 30394
  },
  {
    id: '10',
    city: '台州市',
    time: '2026-03-17 17:00:00',
    inboundCount: 6487,
    queueCount: 5513,
    queueSuccessCount: 5071,
    manualAnswerCount: 4463,
    timelyAnswerCount: 3793,
    manualLossCount: 609,
    autoLossCount: 326,
    manualAnswerRate: 80.94,
    autoAnswerRate: 95.08,
    autoTimelyAnswerRate: 84.98,
    answerTimelyRateNoLoss: 84.98,
    answerTimelyRateWithLoss: 74.78,
    totalProcessTime: 4656,
    totalTransferTime: 6268
  }
]

/**
 * 计算全省汇总行
 * 自动累加所有地市对应列数值，百分比指标按全省总基数重算
 */
export const calculateSummaryRow = (data: ProvinceCallItem[]): SummaryRow => {
  const summary: SummaryRow = {
    city: '合计',
    time: '',
    inboundCount: 0,
    queueCount: 0,
    queueSuccessCount: 0,
    manualAnswerCount: 0,
    timelyAnswerCount: 0,
    manualLossCount: 0,
    autoLossCount: 0,
    manualAnswerRate: 0,
    autoAnswerRate: 0,
    autoTimelyAnswerRate: 0,
    answerTimelyRateNoLoss: 0,
    answerTimelyRateWithLoss: 0,
    totalProcessTime: 0,
    totalTransferTime: 0
  }

  // 累加基础数值指标
  data.forEach(item => {
    summary.inboundCount += item.inboundCount
    summary.queueCount += item.queueCount
    summary.queueSuccessCount += item.queueSuccessCount
    summary.manualAnswerCount += item.manualAnswerCount
    summary.timelyAnswerCount += item.timelyAnswerCount
    summary.manualLossCount += item.manualLossCount
    summary.autoLossCount += item.autoLossCount
    summary.totalProcessTime += item.totalProcessTime
    summary.totalTransferTime += item.totalTransferTime
  })

  // 按全省总基数重算百分比指标
  // 人工接通率 = 人工接通数 / 呼入次数
  summary.manualAnswerRate = summary.inboundCount > 0 
    ? Number(((summary.manualAnswerCount / summary.inboundCount) * 100).toFixed(2))
    : 0

  // 自动接通率 = (呼入次数 - 自动呼损) / 呼入次数
  summary.autoAnswerRate = summary.inboundCount > 0
    ? Number((((summary.inboundCount - summary.autoLossCount) / summary.inboundCount) * 100).toFixed(2))
    : 0

  // 自动及时接通率(20秒内) = 及时接通数 / 人工接通数
  summary.autoTimelyAnswerRate = summary.manualAnswerCount > 0
    ? Number(((summary.timelyAnswerCount / summary.manualAnswerCount) * 100).toFixed(2))
    : 0

  // 应答及时率(未含人工呼损) = 及时接通数 / 人工接通数
  summary.answerTimelyRateNoLoss = summary.manualAnswerCount > 0
    ? Number(((summary.timelyAnswerCount / summary.manualAnswerCount) * 100).toFixed(2))
    : 0

  // 应答及时率(含人工呼损) = 及时接通数 / (人工接通数 + 人工呼损)
  const totalAttempt = summary.manualAnswerCount + summary.manualLossCount
  summary.answerTimelyRateWithLoss = totalAttempt > 0
    ? Number(((summary.timelyAnswerCount / totalAttempt) * 100).toFixed(2))
    : 0

  return summary
}

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchProvinceCallData = async (
  params: ReportQueryParams
): Promise<ProvinceCallItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockProvinceCallData]

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    filteredData = filteredData.filter(item => item.city === params.city)
  }

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      return item.time >= params.startDate! && item.time <= params.endDate!
    })
  }

  // 接入码筛选（实际应用中根据接入码过滤）
  if (params.accessCode && params.accessCode !== '全部接入码') {
    // 实际应用中根据接入码筛选数据
    // 这里简化处理，返回全部数据
  }

  // 根据周期粒度处理数据（实际应用中需要按周期聚合数据）
  if (params.period) {
    // 实际应用中根据period对数据进行聚合
    // hour: 保持原样
    // day: 按天聚合
    // week: 按周聚合
    // month: 按月聚合
  }

  return filteredData
}
