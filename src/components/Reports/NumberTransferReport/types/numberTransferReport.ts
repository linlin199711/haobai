/**
 * 号码转接报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 查询方式 */
export type QueryMethod = 'all' | 'team' | 'agent' | 'phone'

/** 统计方式（周期粒度） */
export type StatisticsPeriod = 'day' | 'week' | 'month'

/** 话务查询方 */
export type CallQueryParty = 'all' | 'team' | 'employee'

/** 查询方式选项 */
export interface QueryMethodOption {
  value: QueryMethod
  label: string
}

/** 统计方式选项 */
export interface StatisticsPeriodOption {
  value: StatisticsPeriod
  label: string
}

/** 话务查询方选项 */
export interface CallQueryPartyOption {
  value: CallQueryParty
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 查询方式 */
  queryMethod: QueryMethod
  /** 统计方式（周期粒度） */
  statisticsPeriod: StatisticsPeriod
  /** 时间范围 [开始时间, 结束时间] */
  dateRange: string[]
  /** 话务查询方 */
  callQueryParty: CallQueryParty
  /** 班组（当话务查询方为班组时显示） */
  team?: string
  /** 员工（当话务查询方为员工时显示） */
  employee?: string
}

/** 号码转接数据项 */
export interface NumberTransferItem {
  /** 唯一标识 */
  id: string
  /** 转接日期 */
  transferDate: string
  /** 电话号码 */
  phoneNumber: string
  /** 转接次数 */
  transferCount: number
  /** 转接成功次数 */
  successCount: number
  /** 转接成功率 */
  successRate: number
  /** 转接通话时长（秒） */
  callDuration: number
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 查询方式 */
  queryMethod?: QueryMethod
  /** 统计方式 */
  statisticsPeriod?: StatisticsPeriod
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 话务查询方 */
  callQueryParty?: CallQueryParty
  /** 班组 */
  team?: string
  /** 员工 */
  employee?: string
}
