/**
 * 号码查询明细报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { NumberQueryItem, ReportQueryParams, QueryMethodOption } from '../types/numberQueryDetailReport'

/**
 * 查询方式选项
 * 硬约束：固定包含2个选项：查询号码、主叫号码
 */
export const queryMethodOptions: QueryMethodOption[] = [
  { value: 'queryNumber', label: '查询号码' },
  { value: 'callerNumber', label: '主叫号码' }
]

/**
 * 固定枚举值
 */
export const FIXED_ENUM = {
  /** 查询类型 - 固定为：信息查询 */
  QUERY_TYPE: '信息查询',
  /** 播放模式 - 固定为：语音报号 */
  PLAY_MODE: '语音报号'
}

/**
 * 模拟号码查询明细数据 - 复刻原型示例数据
 * 硬约束：
 * 1. 查询类型全量数据仅展示「信息查询」
 * 2. 播放模式全量数据仅展示「语音报号」
 */
const mockNumberQueryData: NumberQueryItem[] = [
  {
    id: '1',
    employeeId: 'OP001',
    callTime: '2026-03-17 09:23:15',
    callerNumber: '13800138000',
    merchantName: '北京科技有限公司',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '010-12345678'
  },
  {
    id: '2',
    employeeId: 'OP002',
    callTime: '2026-03-17 09:45:32',
    callerNumber: '13900139000',
    merchantName: '上海贸易有限公司',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '021-87654321'
  },
  {
    id: '3',
    employeeId: 'OP003',
    callTime: '2026-03-17 10:12:08',
    callerNumber: '13700137000',
    merchantName: '广州实业有限公司',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '020-11223344'
  },
  {
    id: '4',
    employeeId: 'OP004',
    callTime: '2026-03-17 10:28:45',
    callerNumber: '13600136000',
    merchantName: '深圳网络科技',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '0755-99887766'
  },
  {
    id: '5',
    employeeId: 'OP004',
    callTime: '2026-03-17 10:35:22',
    callerNumber: '13500135000',
    merchantName: '杭州电子商务',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '0571-55667788'
  },
  {
    id: '6',
    employeeId: 'OP005',
    callTime: '2026-03-17 11:05:18',
    callerNumber: '13400134000',
    merchantName: '成都软件公司',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '028-33445566'
  },
  {
    id: '7',
    employeeId: 'OP006',
    callTime: '2026-03-17 11:18:40',
    callerNumber: '13300133000',
    merchantName: '武汉信息服务',
    queryType: FIXED_ENUM.QUERY_TYPE,
    playMode: FIXED_ENUM.PLAY_MODE,
    playNumber: '027-77889900'
  }
]

/**
 * 模拟获取号码查询明细数据
 * @param params 查询参数
 */
export const fetchNumberQueryData = async (
  params: ReportQueryParams
): Promise<NumberQueryItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockNumberQueryData]

  // 时间范围筛选
  if (params.startTime && params.endTime) {
    filteredData = filteredData.filter(item => {
      return item.callTime >= params.startTime! && item.callTime <= params.endTime!
    })
  }

  // 查询方式筛选
  if (params.queryMethod && params.inputNumber) {
    if (params.queryMethod === 'callerNumber') {
      // 主叫号码匹配
      filteredData = filteredData.filter(item => {
        return item.callerNumber.includes(params.inputNumber!)
      })
    } else if (params.queryMethod === 'queryNumber') {
      // 播报号码匹配
      filteredData = filteredData.filter(item => {
        return item.playNumber.includes(params.inputNumber!)
      })
    }
  }

  return filteredData
}
