/**
 * 话务员输入关键词搜索量统计表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 时间范围 [开始日期, 结束日期] */
  dateRange: string[]
  /** 地市 */
  city: string
  /** 统计周期 */
  period: string
  /** 关键词 */
  keyword: string
  /** 行业 */
  industry: string
}

/** 话务员关键词搜索数据项 */
export interface KeywordSearchItem {
  /** 唯一标识 */
  id: string
  /** 地市 */
  city: string
  /** 时段 (YYYY-MM-DD) */
  period: string
  /** 一级行业 */
  industry: string
  /** 关键词 */
  keyword: string
  /** 查询量 */
  queryCount: number
  /** 播报量 */
  broadcastCount: number
  /** 是否优推关键词 */
  isPriority: boolean
}

/** 服务响应包装类型 */
export interface ServiceResponse<T> {
  /** 请求是否成功 */
  success: boolean
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message?: string
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 地市 */
  city?: string
  /** 统计周期 */
  period?: string
  /** 关键词 */
  keyword?: string
  /** 行业 */
  industry?: string
}

/** 地市与区县映射类型 */
export interface CityDistrictMap {
  [key: string]: string[]
}

/** 统计周期选项 */
export type PeriodOption = 'halfHour' | 'hour' | 'day' | 'month'

/** 周期选项配置 */
export interface PeriodConfig {
  value: PeriodOption
  label: string
}
