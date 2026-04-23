/**
 * 操作员工作情况报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { OperatorWorkItem, ReportQueryParams, IsRealTimeOption, CombinationModeOption, CallTypeOption, CallQueryPartyOption, SummaryRow } from '../types/operatorWorkReport'

/**
 * 是否实时选项
 */
export const isRealTimeOptions: IsRealTimeOption[] = [
  { value: 'yes', label: '是' },
  { value: 'no', label: '否' }
]

/**
 * 组合方式选项
 */
export const combinationModeOptions: CombinationModeOption[] = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' }
]

/**
 * 话务类型选项
 */
export const callTypeOptions: CallTypeOption[] = [
  { value: 'all', label: '全部' },
  { value: 'inbound', label: '呼入' },
  { value: 'outbound', label: '呼出' },
  { value: 'transfer', label: '转接' }
]

/**
 * 话务查询方选项
 */
export const callQueryPartyOptions: CallQueryPartyOption[] = [
  { value: 'all', label: '全部' },
  { value: 'manual', label: '人工' },
  { value: 'auto', label: '自动' }
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
 * 模拟操作员工作情况数据 - 复刻原型示例数据
 */
const mockOperatorWorkData: OperatorWorkItem[] = [
  {
    id: '1',
    time: '2026-03-14',
    employeeId: 'OP001',
    employeeName: '吴丽',
    workDuration: 289,
    ringDuration: 398,
    manageDuration: 75,
    successCallDuration: 80,
    callDuration: 206,
    manualBusyDuration: 36,
    organizeDuration: 37,
    nonServiceDuration: 68,
    waitingDuration: 30,
    answerCount: 40,
    avgAnswerDuration: 8,
    idleSuccessCount: 24,
    avgIdleSuccessDuration: 51,
    callCount: 66,
    avgCallDuration: 29,
    workTimeUtilization: 75.2
  },
  {
    id: '2',
    time: '2026-03-09',
    employeeId: 'OP002',
    employeeName: '吴丰',
    workDuration: 339,
    ringDuration: 311,
    manageDuration: 93,
    successCallDuration: 33,
    callDuration: 128,
    manualBusyDuration: 14,
    organizeDuration: 25,
    nonServiceDuration: 27,
    waitingDuration: 22,
    answerCount: 20,
    avgAnswerDuration: 28,
    idleSuccessCount: 5,
    avgIdleSuccessDuration: 12,
    callCount: 44,
    avgCallDuration: 13,
    workTimeUtilization: 71.9
  },
  {
    id: '3',
    time: '2026-02-16',
    employeeId: 'OP003',
    employeeName: '周杰',
    workDuration: 296,
    ringDuration: 307,
    manageDuration: 125,
    successCallDuration: 26,
    callDuration: 259,
    manualBusyDuration: 27,
    organizeDuration: 19,
    nonServiceDuration: 49,
    waitingDuration: 13,
    answerCount: 27,
    avgAnswerDuration: 20,
    idleSuccessCount: 16,
    avgIdleSuccessDuration: 14,
    callCount: 33,
    avgCallDuration: 35,
    workTimeUtilization: 76.3
  },
  {
    id: '4',
    time: '2026-03-18',
    employeeId: 'OP004',
    employeeName: '郑浩',
    workDuration: 456,
    ringDuration: 218,
    manageDuration: 56,
    successCallDuration: 50,
    callDuration: 173,
    manualBusyDuration: 26,
    organizeDuration: 24,
    nonServiceDuration: 39,
    waitingDuration: 23,
    answerCount: 44,
    avgAnswerDuration: 11,
    idleSuccessCount: 22,
    avgIdleSuccessDuration: 21,
    callCount: 52,
    avgCallDuration: 38,
    workTimeUtilization: 76.1
  },
  {
    id: '5',
    time: '2026-03-12',
    employeeId: 'OP005',
    employeeName: '郑蕾',
    workDuration: 316,
    ringDuration: 209,
    manageDuration: 79,
    successCallDuration: 63,
    callDuration: 174,
    manualBusyDuration: 34,
    organizeDuration: 23,
    nonServiceDuration: 24,
    waitingDuration: 22,
    answerCount: 46,
    avgAnswerDuration: 25,
    idleSuccessCount: 6,
    avgIdleSuccessDuration: 16,
    callCount: 57,
    avgCallDuration: 13,
    workTimeUtilization: 81.8
  },
  {
    id: '6',
    time: '2026-03-14',
    employeeId: 'OP006',
    employeeName: '画像',
    workDuration: 494,
    ringDuration: 598,
    manageDuration: 144,
    successCallDuration: 79,
    callDuration: 207,
    manualBusyDuration: 37,
    organizeDuration: 23,
    nonServiceDuration: 10,
    waitingDuration: 31,
    answerCount: 33,
    avgAnswerDuration: 20,
    idleSuccessCount: 12,
    avgIdleSuccessDuration: 20,
    callCount: 36,
    avgCallDuration: 32,
    workTimeUtilization: 76.9
  },
  {
    id: '7',
    time: '2026-02-19',
    employeeId: 'OP007',
    employeeName: '周鑫',
    workDuration: 395,
    ringDuration: 238,
    manageDuration: 157,
    successCallDuration: 56,
    callDuration: 185,
    manualBusyDuration: 12,
    organizeDuration: 11,
    nonServiceDuration: 20,
    waitingDuration: 10,
    answerCount: 45,
    avgAnswerDuration: 10,
    idleSuccessCount: 24,
    avgIdleSuccessDuration: 59,
    callCount: 77,
    avgCallDuration: 31,
    workTimeUtilization: 77.9
  },
  {
    id: '8',
    time: '2026-03-14',
    employeeId: 'OP008',
    employeeName: '王雷',
    workDuration: 322,
    ringDuration: 598,
    manageDuration: 77,
    successCallDuration: 58,
    callDuration: 131,
    manualBusyDuration: 20,
    organizeDuration: 14,
    nonServiceDuration: 30,
    waitingDuration: 7,
    answerCount: 23,
    avgAnswerDuration: 7,
    idleSuccessCount: 15,
    avgIdleSuccessDuration: 24,
    callCount: 68,
    avgCallDuration: 44,
    workTimeUtilization: 74.4
  },
  {
    id: '9',
    time: '2026-03-10',
    employeeId: 'OP009',
    employeeName: '钱蕾',
    workDuration: 370,
    ringDuration: 338,
    manageDuration: 85,
    successCallDuration: 54,
    callDuration: 143,
    manualBusyDuration: 48,
    organizeDuration: 13,
    nonServiceDuration: 60,
    waitingDuration: 11,
    answerCount: 35,
    avgAnswerDuration: 16,
    idleSuccessCount: 7,
    avgIdleSuccessDuration: 48,
    callCount: 36,
    avgCallDuration: 35,
    workTimeUtilization: 60.0
  },
  {
    id: '10',
    time: '2026-02-23',
    employeeId: 'OP010',
    employeeName: '吴蕾',
    workDuration: 451,
    ringDuration: 278,
    manageDuration: 89,
    successCallDuration: 54,
    callDuration: 267,
    manualBusyDuration: 52,
    organizeDuration: 24,
    nonServiceDuration: 40,
    waitingDuration: 29,
    answerCount: 24,
    avgAnswerDuration: 28,
    idleSuccessCount: 12,
    avgIdleSuccessDuration: 44,
    callCount: 42,
    avgCallDuration: 29,
    workTimeUtilization: 78.3
  }
]

/**
 * 计算汇总行
 * 自动累加所有操作员明细行数值，百分比指标按全员总基数重算
 */
export const calculateSummaryRow = (data: OperatorWorkItem[]): SummaryRow => {
  const summary: SummaryRow = {
    time: '',
    employeeId: '',
    employeeName: '合计',
    workDuration: 0,
    ringDuration: 0,
    manageDuration: 0,
    successCallDuration: 0,
    callDuration: 0,
    manualBusyDuration: 0,
    organizeDuration: 0,
    nonServiceDuration: 0,
    waitingDuration: 0,
    answerCount: 0,
    avgAnswerDuration: 0,
    idleSuccessCount: 0,
    avgIdleSuccessDuration: 0,
    callCount: 0,
    avgCallDuration: 0,
    workTimeUtilization: 0
  }

  // 累加基础数值指标
  data.forEach(item => {
    summary.workDuration += item.workDuration
    summary.ringDuration += item.ringDuration
    summary.manageDuration += item.manageDuration
    summary.successCallDuration += item.successCallDuration
    summary.callDuration += item.callDuration
    summary.manualBusyDuration += item.manualBusyDuration
    summary.organizeDuration += item.organizeDuration
    summary.nonServiceDuration += item.nonServiceDuration
    summary.waitingDuration += item.waitingDuration
    summary.answerCount += item.answerCount
    summary.avgAnswerDuration += item.avgAnswerDuration
    summary.idleSuccessCount += item.idleSuccessCount
    summary.avgIdleSuccessDuration += item.avgIdleSuccessDuration
    summary.callCount += item.callCount
    summary.avgCallDuration += item.avgCallDuration
  })

  // 计算平均指标
  const employeeCount = data.length
  if (employeeCount > 0) {
    summary.avgAnswerDuration = Number((summary.avgAnswerDuration / employeeCount).toFixed(1))
    summary.avgIdleSuccessDuration = Number((summary.avgIdleSuccessDuration / employeeCount).toFixed(1))
    summary.avgCallDuration = Number((summary.avgCallDuration / employeeCount).toFixed(1))
  }

  // 计算工时利用率（按全员总基数）
  const totalWorkTime = summary.workDuration
  const totalEffectiveTime = summary.callDuration + summary.manageDuration + summary.successCallDuration
  summary.workTimeUtilization = totalWorkTime > 0
    ? Number(((totalEffectiveTime / totalWorkTime) * 100).toFixed(1))
    : 0

  return summary
}

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchOperatorWorkData = async (
  params: ReportQueryParams
): Promise<OperatorWorkItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockOperatorWorkData]

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      return item.time >= params.startDate! && item.time <= params.endDate!
    })
  }

  // 话务类型筛选
  if (params.callType && params.callType !== 'all') {
    // 实际应用中根据话务类型筛选数据
    // 这里简化处理，返回全部数据
  }

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    // 实际应用中根据地市筛选数据
    // 这里简化处理，返回全部数据
  }

  // 班组筛选
  if (params.team && params.team !== '全部班组') {
    // 实际应用中根据班组筛选数据
    // 这里简化处理，返回全部数据
  }

  // 话务查询方筛选
  if (params.callQueryParty && params.callQueryParty !== 'all') {
    // 实际应用中根据话务查询方筛选数据
    // 这里简化处理，返回全部数据
  }

  return filteredData
}
