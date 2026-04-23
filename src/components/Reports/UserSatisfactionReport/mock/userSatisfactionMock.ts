/**
 * 用户满意度报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { UserSatisfactionItem, ReportQueryParams, IsRealTimeOption, CombinationModeOption, CallQueryMethodOption, UserEvaluation } from '../types/userSatisfactionReport'

/**
 * 是否实时选项
 */
export const isRealTimeOptions: IsRealTimeOption[] = [
  { value: 'all', label: '全部' },
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
 * 话务查询方式选项
 */
export const callQueryMethodOptions: CallQueryMethodOption[] = [
  { value: 'all', label: '全部' },
  { value: 'manual', label: '人工' },
  { value: 'auto', label: '自动' }
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
 * 评价等级映射
 */
export const evaluationMap: Record<UserEvaluation, string> = {
  verySatisfied: '非常满意',
  satisfied: '满意',
  average: '一般',
  unsatisfied: '不满意'
}

/**
 * 评价等级颜色
 */
export const evaluationColor: Record<UserEvaluation, string> = {
  verySatisfied: '#67c23a',
  satisfied: '#409eff',
  average: '#e6a23c',
  unsatisfied: '#f56c6c'
}

/**
 * 隐私脱敏处理
 * 手机号中间位数用*号隐藏，仅展示首尾号段
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 11) {
    return phone
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 模拟用户满意度数据 - 复刻原型示例数据
 */
const mockUserSatisfactionData: UserSatisfactionItem[] = [
  {
    id: '1',
    index: 1,
    employeeId: 'OP001',
    employeeName: '张三',
    callerNumber: '138001234',
    callTime: '2026-03-17 09:23:15',
    evaluation: 'satisfied',
    evaluationText: '满意'
  },
  {
    id: '2',
    index: 2,
    employeeId: 'OP002',
    employeeName: '李四',
    callerNumber: '139005678',
    callTime: '2026-03-17 09:45:32',
    evaluation: 'verySatisfied',
    evaluationText: '非常满意'
  },
  {
    id: '3',
    index: 3,
    employeeId: 'OP003',
    employeeName: '王五',
    callerNumber: '137009912',
    callTime: '2026-03-17 10:12:08',
    evaluation: 'average',
    evaluationText: '一般'
  },
  {
    id: '4',
    index: 4,
    employeeId: 'OP004',
    employeeName: '赵六',
    callerNumber: '136003456',
    callTime: '2026-03-17 10:34:51',
    evaluation: 'satisfied',
    evaluationText: '满意'
  },
  {
    id: '5',
    index: 5,
    employeeId: 'OP005',
    employeeName: '孙七',
    callerNumber: '135007890',
    callTime: '2026-03-17 11:05:27',
    evaluation: 'unsatisfied',
    evaluationText: '不满意'
  },
  {
    id: '6',
    index: 6,
    employeeId: 'OP006',
    employeeName: '周八',
    callerNumber: '134002468',
    callTime: '2026-03-17 11:28:43',
    evaluation: 'satisfied',
    evaluationText: '满意'
  },
  {
    id: '7',
    index: 7,
    employeeId: 'OP007',
    employeeName: '吴九',
    callerNumber: '133001357',
    callTime: '2026-03-17 13:15:19',
    evaluation: 'verySatisfied',
    evaluationText: '非常满意'
  }
]

/**
 * 模拟获取用户满意度数据
 * @param params 查询参数
 */
export const fetchUserSatisfactionData = async (
  params: ReportQueryParams
): Promise<UserSatisfactionItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockUserSatisfactionData]

  // 时间范围筛选
  if (params.startTime && params.endTime) {
    filteredData = filteredData.filter(item => {
      return item.callTime >= params.startTime! && item.callTime <= params.endTime!
    })
  }

  // 话务查询方式筛选
  if (params.callQueryMethod && params.callQueryMethod !== 'all') {
    // 实际应用中根据话务查询方式筛选数据
    // 这里简化处理，返回全部数据
  }

  // 班组筛选
  if (params.team && params.team !== '全部班组') {
    // 实际应用中根据班组筛选数据
    // 这里简化处理，返回全部数据
  }

  // 重新计算序号
  return filteredData.map((item, index) => ({
    ...item,
    index: index + 1
  }))
}
