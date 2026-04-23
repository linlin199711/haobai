/**
 * 操作员考勤统计报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { OperatorAttendanceItem, ReportQueryParams, CallQueryMethodOption } from '../types/operatorAttendanceReport'

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
 * 计算工作时长（秒）
 * 计算公式：工作时长(秒) = 签出时间时间戳 - 签入时间时间戳
 * 未签出时返回null
 */
export const calculateWorkDuration = (checkInTime: string, checkOutTime: string | null): number | null => {
  if (!checkOutTime) {
    return null
  }
  
  const checkInTimestamp = new Date(checkInTime).getTime()
  const checkOutTimestamp = new Date(checkOutTime).getTime()
  
  return Math.floor((checkOutTimestamp - checkInTimestamp) / 1000)
}

/**
 * 模拟操作员考勤数据 - 复刻原型示例数据
 */
const mockOperatorAttendanceData: OperatorAttendanceItem[] = [
  {
    id: '1',
    date: '2026-03-17',
    employeeId: 'E001',
    employeeName: '张伟',
    smallNumber: '84547',
    checkInTime: '2026-03-17 08:33:00',
    checkOutTime: '2026-03-17 13:30:00',
    workDuration: calculateWorkDuration('2026-03-17 08:33:00', '2026-03-17 13:30:00')
  },
  {
    id: '2',
    date: '2026-03-17',
    employeeId: 'E001',
    employeeName: '张伟',
    smallNumber: '85028',
    checkInTime: '2026-03-17 12:43:00',
    checkOutTime: '2026-03-17 15:54:00',
    workDuration: calculateWorkDuration('2026-03-17 12:43:00', '2026-03-17 15:54:00')
  },
  {
    id: '3',
    date: '2026-03-17',
    employeeId: 'E002',
    employeeName: '李娜',
    smallNumber: '81023',
    checkInTime: '2026-03-17 08:50:00',
    checkOutTime: '2026-03-17 10:09:00',
    workDuration: calculateWorkDuration('2026-03-17 08:50:00', '2026-03-17 10:09:00')
  },
  {
    id: '4',
    date: '2026-03-17',
    employeeId: 'E003',
    employeeName: '王芳',
    smallNumber: '84233',
    checkInTime: '2026-03-17 06:42:00',
    checkOutTime: '2026-03-17 11:11:00',
    workDuration: calculateWorkDuration('2026-03-17 06:42:00', '2026-03-17 11:11:00')
  },
  {
    id: '5',
    date: '2026-03-17',
    employeeId: 'E003',
    employeeName: '王芳',
    smallNumber: '85236',
    checkInTime: '2026-03-17 12:47:00',
    checkOutTime: '2026-03-17 15:05:00',
    workDuration: calculateWorkDuration('2026-03-17 12:47:00', '2026-03-17 15:05:00')
  },
  {
    id: '6',
    date: '2026-03-17',
    employeeId: 'E004',
    employeeName: '刘洋',
    smallNumber: '87284',
    checkInTime: '2026-03-17 08:37:00',
    checkOutTime: '2026-03-17 13:09:00',
    workDuration: calculateWorkDuration('2026-03-17 08:37:00', '2026-03-17 13:09:00')
  },
  {
    id: '7',
    date: '2026-03-17',
    employeeId: 'E005',
    employeeName: '陈静',
    smallNumber: '85555',
    checkInTime: '2026-03-17 08:31:00',
    checkOutTime: '2026-03-17 13:40:00',
    workDuration: calculateWorkDuration('2026-03-17 08:31:00', '2026-03-17 13:40:00')
  },
  {
    id: '8',
    date: '2026-03-17',
    employeeId: 'E005',
    employeeName: '陈静',
    smallNumber: '82994',
    checkInTime: '2026-03-17 12:48:00',
    checkOutTime: null,
    workDuration: null
  },
  {
    id: '9',
    date: '2026-03-17',
    employeeId: 'E006',
    employeeName: '杨敏',
    smallNumber: '88955',
    checkInTime: '2026-03-17 08:47:00',
    checkOutTime: '2026-03-17 11:21:00',
    workDuration: calculateWorkDuration('2026-03-17 08:47:00', '2026-03-17 11:21:00')
  }
]

/**
 * 对考勤数据进行归集排序
 * 业务规则：同一天、同一个工号的所有多条考勤流水，自动归集、相邻连续排布展示
 * 排序规则：先按日期排序，再按工号排序，最后按签入时间排序
 */
export const sortAndGroupAttendanceData = (data: OperatorAttendanceItem[]): OperatorAttendanceItem[] => {
  return [...data].sort((a, b) => {
    // 先按日期排序
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date)
    }
    
    // 再按工号排序
    if (a.employeeId !== b.employeeId) {
      return a.employeeId.localeCompare(b.employeeId)
    }
    
    // 最后按签入时间排序
    return a.checkInTime.localeCompare(b.checkInTime)
  })
}

/**
 * 模拟获取考勤数据
 * @param params 查询参数
 */
export const fetchOperatorAttendanceData = async (
  params: ReportQueryParams
): Promise<OperatorAttendanceItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockOperatorAttendanceData]

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
  return sortAndGroupAttendanceData(filteredData)
}
