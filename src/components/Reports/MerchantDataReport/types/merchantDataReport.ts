/**
 * 114推广/百事通加盟商家数据报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 开始时间 */
  startDate: string
  /** 结束时间 */
  endDate: string
  /** 类型 */
  type: string
}

/** 业务数据项（单个业务的三个指标） */
export interface BusinessMetrics {
  /** 周新增 */
  weeklyNew: number
  /** 月新增 */
  monthlyNew: number
  /** 到达量 */
  arrival: number
}

/** 商家数据项（单行数据） */
export interface MerchantDataItem {
  /** 唯一标识 */
  id: string
  /** 地区/地市 */
  city: string
  /** 优推业务数据 */
  promotion: BusinessMetrics
  /** 品牌业务数据 */
  brand: BusinessMetrics
  /** 实名业务数据 */
  realname: BusinessMetrics
  /** 转接业务数据 */
  transfer: BusinessMetrics
  /** 短信业务数据 */
  sms: BusinessMetrics
  /** 合计数据（自动计算） */
  total: BusinessMetrics
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
  /** 类型 */
  type?: string
}

/** 业务类型配置 */
export interface BusinessTypeConfig {
  value: string
  label: string
}

/** 汇总行数据类型 */
export interface SummaryRow {
  /** 地区名称 */
  city: string
  /** 优推业务数据 */
  promotion: BusinessMetrics
  /** 品牌业务数据 */
  brand: BusinessMetrics
  /** 实名业务数据 */
  realname: BusinessMetrics
  /** 转接业务数据 */
  transfer: BusinessMetrics
  /** 短信业务数据 */
  sms: BusinessMetrics
  /** 合计数据 */
  total: BusinessMetrics
}
