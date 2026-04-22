/**
 * 录音详情模块 - 类型定义
 * @description 定义录音详情操作记录相关的类型接口
 * @version 1.0.0
 */

// 用户角色类型
export type UserRole = 'admin' | 'supervisor' | 'agent'

// 业务类型枚举
export enum BusinessTypeEnum {
  NUMBER_SEARCH = '号码本地搜',
  CAR_MOVE = '挪车登记',
  NON_NUMBER_QUERY = '非号码查询',
  PBX_30 = '总机3.0'
}

// 话务员操作类型
export enum OperatorActionTypeEnum {
  QUERY = '查询',
  HANGUP_REPORT = '挂断报号',
  REGISTER = '登记',
  TRANSFER = '转接',
  DIAL_NUMBER = '拍号',
  REPORT_NUMBER = '报号'
}

// 播放类型
export enum PlayTypeEnum {
  VOICE_BROADCAST = '语音播报',
  SMS_NOTIFICATION = '短信通知',
  DIRECT_CALL = '直拨'
}

// 操作记录项
export interface OperationRecord {
  /** 唯一标识 */
  id: string
  /** 业务类型 */
  businessType: BusinessTypeEnum | string
  /** 业务内容 */
  businessContent: string
  /** 话务员操作类型 */
  operatorActionType: OperatorActionTypeEnum | string
  /** 播放号码（完整显示） */
  broadcastNumber: string
  /** 公司名称 */
  companyName: string
  /** 播放类型 */
  playType: PlayTypeEnum | string
  /** 操作时间戳（秒） */
  operationTime: number
  /** 格式化的操作时间 */
  formattedTime: string
  /** 关联的通话流水号 */
  serialNo: string
  /** 关联的录音ID */
  recordId: string
  /** 话务员工号 */
  agentNo: string
  /** 话务员姓名 */
  agentName: string
  /** 业务详情数据（用于跳转） */
  businessDetail?: BusinessDetail
}

// 业务详情数据
export interface BusinessDetail {
  /** 业务模块类型 */
  moduleType: string
  /** 业务ID */
  businessId: string
  /** 跳转URL */
  detailUrl?: string
  /** 额外参数 */
  extraParams?: Record<string, any>
}

// 录音详情数据
export interface RecordDetail {
  /** 录音ID */
  id: string
  /** 通话流水号 */
  serialNo: string
  /** 录音时长（秒） */
  duration: number
  /** 录音文件URL */
  fileUrl: string
  /** 主叫号码 */
  callerNumber: string
  /** 被叫号码 */
  calleeNumber: string
  /** 话务员工号 */
  agentNo: string
  /** 话务员姓名 */
  agentName: string
  /** 通话时间 */
  callTime: string
  /** 操作记录列表 */
  operationRecords: OperationRecord[]
}

// 查询参数
export interface OperationRecordQueryParams {
  /** 录音ID */
  recordId: string
  /** 通话流水号 */
  serialNo?: string
  /** 话务员工号（权限过滤） */
  agentNo?: string
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
}

// 权限控制配置
export interface PermissionConfig {
  /** 当前用户角色 */
  userRole: UserRole
  /** 当前用户工号 */
  currentAgentNo: string
  /** 是否可查看全部数据 */
  canViewAll: boolean
  /** 可查看的地市列表 */
  allowedCities?: string[]
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 录音播放状态
export interface PlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

// 组件Props
export interface RecordDetailModalProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 录音ID */
  recordId: string
  /** 通话流水号 */
  serialNo: string
  /** 录音时长 */
  duration: number
  /** 当前播放时间（用于联动） */
  currentPlayTime?: number
}

// 组件Events
export interface RecordDetailModalEvents {
  /** 关闭弹窗 */
  (e: 'close'): void
  /** 跳转到指定时间播放 */
  (e: 'seek', time: number): void
  /** 查看业务详情 */
  (e: 'viewBusinessDetail', detail: BusinessDetail): void
}
