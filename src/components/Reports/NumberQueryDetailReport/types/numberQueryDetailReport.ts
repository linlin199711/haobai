/**
 * 号码查询明细报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 查询方式 */
export type QueryMethod = 'all' | 'queryNumber' | 'callerNumber'

/** 查询方式选项 */
export interface QueryMethodOption {
  value: QueryMethod
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 时间范围 [开始时间, 结束时间] */
  timeRange: string[]
  /** 查询方式 */
  queryMethod: QueryMethod
  /** 输入号码 */
  inputNumber: string
}

/** 号码查询明细数据项 */
export interface NumberQueryItem {
  /** 唯一标识 */
  id: string
  /** 工号 */
  employeeId: string
  /** 呼入时间 */
  callTime: string
  /** 主叫号码 */
  callerNumber: string
  /** 商家名称 */
  merchantName: string
  /** 查询类型（固定为：信息查询） */
  queryType: string
  /** 播放模式（固定为：语音报号） */
  playMode: string
  /** 播放号码 */
  playNumber: string
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 查询方式 */
  queryMethod?: QueryMethod
  /** 输入号码 */
  inputNumber?: string
}
