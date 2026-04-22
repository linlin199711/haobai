/**
 * 录音回放模块 - 类型定义
 * @description 定义录音回放相关的类型接口
 * @version 1.0.0
 */

// 用户角色类型
export type UserRole = 'admin' | 'supervisor' | 'agent'

// 录音记录
export interface RecordingRecord {
  id: string
  agentNo: string
  agentName: string
  callTime: string
  callerNumber: string
  calleeNumber: string
  businessKey: string
  duration: number
  voiceDesc: string
  satisfaction: string
  serialNo: string
  seatNumber: string
  fileName: string
  fileUrl: string
  city?: string
  // 业务关联信息
  businessInfo?: BusinessInfo
}

// 业务信息
export interface BusinessInfo {
  businessType: string
  businessContent: string
  operatorActions: string[]
  broadcastNumber?: string
  customerName?: string
  // 挪车业务
  carMoveInfo?: {
    recordNo: string
    plateNumber: string
    location: string
  }
  // 总机业务
  pbxInfo?: {
    searchContent: string
    extensionNumber: string
    transferNumber?: string
  }
  // 优惠券/周边
  couponInfo?: {
    couponType: string
    merchantLevel: string
  }
}

// 查询参数
export interface RecordingQueryParams {
  startTime?: string
  endTime?: string
  agentNo?: string
  businessKey?: string
  phoneNumber?: string
  satisfaction?: string
  includeSubGroup?: boolean
  historyQuery?: boolean
  fuzzyQuery?: boolean
  durationType?: '>' | '<' | '='
  duration?: number
  /** 录音时长范围 - 起始秒数 */
  durationStart?: number
  /** 录音时长范围 - 结束秒数 */
  durationEnd?: number
  city?: string
  keyword?: string
  hasCoupon?: boolean
  merchantLevel?: string
  page: number
  pageSize: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 用户信息
export interface UserInfo {
  id: string
  name: string
  role: UserRole
  agentNo: string
  city?: string
}

// 播放状态
export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

// 操作日志
export interface OperationLog {
  id: string
  operator: string
  operationType: 'view' | 'play' | 'download' | 'query'
  operationContent: string
  recordId?: string
  ipAddress: string
  timestamp: string
}

// API响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 满意度选项
export const SatisfactionOptions = [
  { label: '全部', value: '' },
  { label: '非常满意', value: '5' },
  { label: '满意', value: '4' },
  { label: '一般', value: '3' },
  { label: '不满意', value: '2' },
  { label: '非常不满意', value: '1' }
]

// 时长比较选项
export const DurationTypeOptions = [
  { label: '大于', value: '>' },
  { label: '小于', value: '<' },
  { label: '等于', value: '=' }
]

// 商家级别选项
export const MerchantLevelOptions = [
  { label: '全部', value: '' },
  { label: '金牌', value: 'gold' },
  { label: '银牌', value: 'silver' },
  { label: '铜牌', value: 'bronze' },
  { label: '普通', value: 'normal' }
]
