/**
 * 优推商家查询量报表 - 类型定义
 * @description 定义优推商家查询量报表相关的数据结构和类型
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
  /** 商家名称 */
  merchantName: string
  /** 播报号码 */
  broadcastNumber: string
}

/** 商家查询数据项 */
export interface MerchantQueryItem {
  /** 唯一标识 */
  id: string
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 所有关键词 */
  allKeywords: string[]
  /** 业务类型 */
  businessType: string
  /** 销售区域 */
  salesRegion: string
  /** 行业 */
  industry: string
  /** 单位名称 */
  companyName: string
  /** 播报号码 */
  broadcastNumber: string
  /** 业务号码 */
  businessNumber: string
  /** 被查关键词（用户进线查询关键字） */
  queriedKeyword: string
  /** 开通日期 */
  openDate: string
  /** 被查询次数 */
  queryCount: number
  /** 关键词查询次数 */
  keywordQueryCount: number
  /** 模糊查询次数 */
  fuzzyQueryCount: number
  /** 转接次数 */
  transferCount: number
  /** 转接成功次数 */
  transferSuccessCount: number
}

/** 计算后的报表数据项 */
export interface CalculatedMerchantItem extends MerchantQueryItem {
  /** 转接成功率(%) */
  transferSuccessRate: number | null
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
  merchantName?: string
  broadcastNumber?: string
}

/** 地市与区县映射 */
export interface CityDistrictMap {
  [city: string]: string[]
}

/** 业务类型枚举 */
export const BusinessTypeEnum = {
  ALL: '全部',
  YOUTUI: '优推',
  QUERY_TRANSFER: '查询转接',
  SMS_CARD: '短信名片',
  PRIORITY_REPORT: '优先报号',
  REAL_NAME: '实名查询'
} as const

/** 销售区域枚举 */
export const SalesRegionEnum = {
  HUANAN: '华南区',
  HUABEI: '华北区',
  HUADONG: '华东区',
  HUAZHONG: '华中区',
  XIBEI: '西北区',
  XINAN: '西南区'
} as const

/** 行业枚举 */
export const IndustryEnum = {
  RETAIL: '零售百货',
  ELECTRONIC: '电子科技',
  COMMERCIAL: '商业综合体',
  CULTURE: '文化旅游',
  CATERING: '餐饮美食',
  HOTEL: '酒店住宿',
  ENTERTAINMENT: '娱乐休闲',
  MEDICAL: '医疗健康',
  EDUCATION: '教育培训',
  FINANCE: '金融保险'
} as const
