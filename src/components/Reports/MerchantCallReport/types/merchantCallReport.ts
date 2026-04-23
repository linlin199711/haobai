/**
 * 商家报号明细数据报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 时间范围 [开始时间, 结束时间] */
  dateRange: string[]
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 商家名称 */
  merchantName: string
}

/** 商家报号明细数据项 */
export interface MerchantCallItem {
  /** 唯一标识 */
  id: string
  /** 序号 */
  index: number
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 业务类型 */
  businessType: string
  /** 商家名称 */
  merchantName: string
  /** 播报号码 */
  broadcastNumber: string
  /** 主叫用户号码（原始号码，需脱敏展示） */
  callerNumber: string
  /** 呼入时间 */
  callTime: string
  /** 服务时长（秒） */
  serviceDuration: number
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
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 地市 */
  city?: string
  /** 区县 */
  district?: string
  /** 商家名称 */
  merchantName?: string
}

/** 地市与区县映射类型 */
export interface CityDistrictMap {
  [key: string]: string[]
}

/** 业务类型选项 */
export interface BusinessTypeOption {
  value: string
  label: string
}
