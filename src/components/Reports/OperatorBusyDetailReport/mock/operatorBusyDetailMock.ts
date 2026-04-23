/**
 * 操作员示忙详情报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { OperatorBusyItem, ReportQueryParams, CallQueryMethodOption } from '../types/operatorBusyDetailReport'

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
 * 计算示忙时长（秒）
 * 计算公式：示忙时长(秒) = 示忙结束时间时间戳 - 示忙开始时间时间戳
 * 未结束时返回null
 */
export const calculateBusyDuration = (busyStartTime: string, busyEndTime: string | null): number | null => {
  if (!busyEndTime) {
    return null
  }
  
  const startTimestamp = new Date(busyStartTime).getTime()
  const endTimestamp = new Date(busyEndTime).getTime()
  
  return Math.floor((endTimestamp - startTimestamp) / 1000)
}

/**
 * 模拟操作员示忙数据 - 复刻原型示例数据
 */
const mockOperatorBusyData: OperatorBusyItem[] = [
  {
    id: '1',
    date: '2026-03-17',
    employeeId: '10001',
    employeeName: '张三',
    busyStartTime: '2026-03-17 09:15:30',
    busyEndTime: '2026-03-17 09:18:45',
    busyDuration: calculateBusyDuration('2026-03-17 09:15:30', '2026-03-17 09:18:45')
  },
  {
    id: '2',
    date: '2026-03-17',
    employeeId: '10001',
    employeeName: '张三',
    busyStartTime: '2026-03-17 14:22:10',
    busyEndTime: '2026-03-17 14:25:30',
    busyDuration: calculateBusyDuration('2026-03-17 14:22:10', '2026-03-17 14:25:30')
  },
  {
    id: '3',
    date: '2026-03-17',
    employeeId: '10002',
    employeeName: '李四',
    busyStartTime: '2026-03-17 10:05:20',
    busyEndTime: '2026-03-17 10:08:15',
    busyDuration: calculateBusyDuration('2026-03-17 10:05:20', '2026-03-17 10:08:15')
  },
  {
    id: '4',
    date: '2026-03-17',
    employeeId: '10002',
    employeeName: '李四',
    busyStartTime: '2026-03-17 15:30:00',
    busyEndTime: null,
    busyDuration: null
  },
  {
    id: '5',
    date: '2026-03-17',
    employeeId: '10003',
    employeeName: '王五',
    busyStartTime: '2026-03-17 11:20:45',
    busyEndTime: '2026-03-17 11:23:30',
    busyDuration: calculateBusyDuration('2026-03-17 11:20:45', '2026-03-17 11:23:30')
  },
  {
    id: '6',
    date: '2026-03-17',
    employeeId: '10003',
    employeeName: '王五',
    busyStartTime: '2026-03-17 16:45:10',
    busyEndTime: '2026-03-17 16:48:25',
    busyDuration: calculateBusyDuration('2026-03-17 16:45:10', '2026-03-17 16:48:25')
  },
  {
    id: '7',
    date: '2026-03-17',
    employeeId: '10004',
    employeeName: '赵六',
    busyStartTime: '2026-03-17 09:45:00',
    busyEndTime: '2026-03-17 09:47:30',
    busyDuration: calculateBusyDuration('2026-03-17 09:45:00', '2026-03-17 09:47:30')
  },
  {
    id: '8',
    date: '2026-03-17',
    employeeId: '10005',
    employeeName: '孙七',
    busyStartTime: '2026-03-17 13:10:20',
    busyEndTime: '2026-03-17 13:15:40',
    busyDuration: calculateBusyDuration('2026-03-17 13:10:20', '2026-03-17 13:15:40')
  }
]

/**
 * 对示忙数据进行归集排序
 * 业务规则：同一天、同一个工号的所有多条示忙流水，自动归集、相邻连续排布展示
 * 排序规则：先按日期排序，再按工号排序，最后按示忙开始时间排序
 */
export const sortAndGroupBusyData = (data: OperatorBusyItem[]): OperatorBusyItem[] => {
  return [...data].sort((a, b) => {
    // 先按日期排序
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date)
    }
    
    // 再按工号排序
    if (a.employeeId !== b.employeeId) {
      return a.employeeId.localeCompare(b.employeeId)
    }
    
    // 最后按示忙开始时间排序
    return a.busyStartTime.localeCompare(b.busyStartTime)
  })
}

/**
 * 模拟获取示忙数据
 * @param params 查询参数
 */
export const fetchOperatorBusyData = async (
  params: ReportQueryParams
): Promise<OperatorBusyItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockOperatorBusyData]

  // 日期范围筛选
  if (params.startDate && params.endDate) {
    filteredData = filteredData.filter(item => {
      return item.date >= params.startDate! && item.date <= params.endDate!
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

  // 归集排序
  return sortAndGroupBusyData(filteredData)
}
