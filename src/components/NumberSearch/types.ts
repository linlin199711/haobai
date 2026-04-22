/**
 * 号码本地搜 - 类型定义
 * @description 号码本地搜模块所有类型定义
 * @version 1.0.0
 */

/** 搜索参数 */
export interface SearchParams {
  /** 通用搜索关键词（模糊查询名称、号码、地址、简称编码等） */
  generalKeyword?: string
  customerName?: string
  phoneNumber?: string
  nameCode?: string
  relatedWords?: string
  city?: string
  district?: string
  page?: number
  pageSize?: number
}

/** 客户信息 */
export interface CustomerInfo {
  id: string
  name: string
  phoneNumber: string
  nameCode: string
  address: string
  addressCode: string
  city: string
  district: string
  region: string
  industry: string
  remark: string
  relatedWords: string
  isConfidential: boolean
  isOutOfService: boolean
  level: number
  parentId?: string
  children?: CustomerInfo[]
  /** 业务类型：dial-拍号, elegant-优推, brand-品牌, realName-实名, transfer-转接, sms-短信 */
  services?: string[]
  /** 是否优先播报 */
  isPriority?: boolean
  /** 优推轮询计数器（用于记录该商户被拍号次数） */
  elegantCount?: number
}

/** 搜索结果 */
export interface SearchResult {
  list: CustomerInfo[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 地市信息 */
export interface CityInfo {
  code: string
  name: string
  districts: DistrictInfo[]
}

/** 区县信息 */
export interface DistrictInfo {
  code: string
  name: string
}

/** 拍号参数 */
export interface DialParams {
  customerId: string
  phoneNumber: string
  customerName: string
}

/** 转接参数 */
export interface TransferParams {
  customerId: string
  targetId: string
  targetName: string
  targetType: 'agent' | 'department'
}

/** 短信参数 */
export interface SmsParams {
  customerId: string
  phoneNumber: string
  content: string
  templateId?: string
}

/** 操作按钮状态 */
export interface OperationStatus {
  dial: boolean
  elegant: boolean
  brand: boolean
  realName: boolean
  transfer: boolean
  sms: boolean
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** API响应 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

/** 坐席状态 */
export interface AgentStatus {
  isOnline: boolean
  isBusy: boolean
  city: string
  noIncomingCall: boolean
}

/** 短信模板 */
export interface SmsTemplate {
  id: string
  name: string
  content: string
}

/** 转接目标 */
export interface TransferTarget {
  id: string
  name: string
  type: 'agent' | 'department'
  status?: 'online' | 'busy' | 'offline'
}
