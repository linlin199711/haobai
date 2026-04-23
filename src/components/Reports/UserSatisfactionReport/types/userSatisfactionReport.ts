/**
 * 用户满意度报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 是否实时 */
export type IsRealTime = 'all' | 'yes' | 'no'

/** 组合方式 */
export type CombinationMode = 'day' | 'week' | 'month'

/** 话务查询方式 */
export type CallQueryMethod = 'all' | 'manual' | 'auto'

/** 用户评价等级 */
export type UserEvaluation = 'verySatisfied' | 'satisfied' | 'average' | 'unsatisfied'

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

/** 话务查询方式选项 */
export interface CallQueryMethodOption {
  value: CallQueryMethod
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 是否实时 */
  isRealTime: IsRealTime
  /** 时间范围 [开始时间, 结束时间] */
  timeRange: string[]
  /** 组合方式 */
  combinationMode: CombinationMode
  /** 话务查询方式 */
  callQueryMethod: CallQueryMethod
  /** 班组 */
  team: string
}

/** 用户满意度数据项 */
export interface UserSatisfactionItem {
  /** 唯一标识 */
  id: string
  /** 序号 */
  index: number
  /** 工号 */
  employeeId: string
  /** 姓名 */
  employeeName: string
  /** 主叫号 */
  callerNumber: string
  /** 呼叫时间 */
  callTime: string
  /** 用户评价 */
  evaluation: UserEvaluation
  /** 评价文本 */
  evaluationText: string
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 是否实时 */
  isRealTime?: IsRealTime
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 组合方式 */
  combinationMode?: CombinationMode
  /** 话务查询方式 */
  callQueryMethod?: CallQueryMethod
  /** 班组 */
  team?: string
}
