/**
 * 关键词查询量及资源统计报表 - 类型定义
 * @description 定义关键词查询量及资源统计报表相关的数据结构和类型
 * @version 1.0.0
 */

/** 筛选条件表单 */
export interface FilterForm {
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 关键词 */
  keyword: string
  /** 客户名称 */
  customerName: string
}

/** 关键词查询数据项 */
export interface KeywordQueryItem {
  /** 唯一标识 */
  id: string
  /** 序号 */
  index: number
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 关键词 */
  keyword: string
  /** 业务类型 */
  businessType: string
  /** 行业 */
  industry: string
  /** 最大销售数量 */
  maxSalesCount: number
  /** 已销售数量 */
  soldCount: number
  /** 查询次数 */
  queryCount: number
}

/** 计算后的报表数据项（包含自动计算的未销售数量） */
export interface CalculatedKeywordItem extends KeywordQueryItem {
  /** 未销售数量（自动计算：最大销售数量 - 已销售数量） */
  unsoldCount: number
}

/** 服务响应 */
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  message?: string
}

/** 报表查询参数 */
export interface ReportQueryParams {
  startTime?: string
  endTime?: string
  city?: string
  district?: string
  keyword?: string
  customerName?: string
}

/** 地市与区县映射 */
export interface CityDistrictMap {
  [city: string]: string[]
}
