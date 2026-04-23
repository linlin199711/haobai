/**
 * 操作员工作情况报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 是否实时 */
export type IsRealTime = 'yes' | 'no'

/** 组合方式 */
export type CombinationMode = 'day' | 'week' | 'month'

/** 话务类型 */
export type CallType = 'all' | 'inbound' | 'outbound' | 'transfer'

/** 话务查询方 */
export type CallQueryParty = 'all' | 'manual' | 'auto'

/** 是否实时选项 */
export interface IsRealTimeOption {
  value: IsRealTime
  label: string
}

/** 组合方式选项 */
export interface CombinationModeOption {
  value: CombinationMode
  label: string
}

/** 话务类型选项 */
export interface CallTypeOption {
  value: CallType
  label: string
}

/** 话务查询方选项 */
export interface CallQueryPartyOption {
  value: CallQueryParty
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 是否实时 */
  isRealTime: IsRealTime
  /** 时间范围 [开始时间, 结束时间] */
  dateRange: string[]
  /** 组合方式 */
  combinationMode: CombinationMode
  /** 话务类型 */
  callType: CallType
  /** 地市 */
  city: string
  /** 班组 */
  team: string
  /** 话务查询方 */
  callQueryParty: CallQueryParty
}

/** 操作员工作情况数据项 */
export interface OperatorWorkItem {
  /** 唯一标识 */
  id: string
  /** 时间 */
  time: string
  /** 工号 */
  employeeId: string
  /** 姓名 */
  employeeName: string
  /** 工作时长（分钟） */
  workDuration: number
  /** 振铃时长（秒） */
  ringDuration: number
  /** 应管时长（分钟） */
  manageDuration: number
  /** 时间成功呼出时长（分钟） */
  successCallDuration: number
  /** 通话时长（分钟） */
  callDuration: number
  /** 手工示忙时长（分钟） */
  manualBusyDuration: number
  /** 整理时长（分钟） */
  organizeDuration: number
  /** 非服务时长（分钟） */
  nonServiceDuration: number
  /** 待话时长（分钟） */
  waitingDuration: number
  /** 应答次数 */
  answerCount: number
  /** 应答均长（秒） */
  avgAnswerDuration: number
  /** 闲时呼出成功次数 */
  idleSuccessCount: number
  /** 闲时呼出成功均长（秒） */
  avgIdleSuccessDuration: number
  /** 通话次数 */
  callCount: number
  /** 通话均长（秒） */
  avgCallDuration: number
  /** 工时利用率（%） */
  workTimeUtilization: number
}

/** 汇总行数据类型 */
export interface SummaryRow {
  /** 时间 */
  time: string
  /** 工号 */
  employeeId: string
  /** 姓名 */
  employeeName: string
  /** 工作时长（分钟） */
  workDuration: number
  /** 振铃时长（秒） */
  ringDuration: number
  /** 应管时长（分钟） */
  manageDuration: number
  /** 时间成功呼出时长（分钟） */
  successCallDuration: number
  /** 通话时长（分钟） */
  callDuration: number
  /** 手工示忙时长（分钟） */
  manualBusyDuration: number
  /** 整理时长（分钟） */
  organizeDuration: number
  /** 非服务时长（分钟） */
  nonServiceDuration: number
  /** 待话时长（分钟） */
  waitingDuration: number
  /** 应答次数 */
  answerCount: number
  /** 应答均长（秒） */
  avgAnswerDuration: number
  /** 闲时呼出成功次数 */
  idleSuccessCount: number
  /** 闲时呼出成功均长（秒） */
  avgIdleSuccessDuration: number
  /** 通话次数 */
  callCount: number
  /** 通话均长（秒） */
  avgCallDuration: number
  /** 工时利用率（%） */
  workTimeUtilization: number
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 是否实时 */
  isRealTime?: IsRealTime
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 组合方式 */
  combinationMode?: CombinationMode
  /** 话务类型 */
  callType?: CallType
  /** 地市 */
  city?: string
  /** 班组 */
  team?: string
  /** 话务查询方 */
  callQueryParty?: CallQueryParty
}
