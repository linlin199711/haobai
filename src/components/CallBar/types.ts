/**
 * 呼叫中心话务条 - 类型定义
 * @description 定义话务条组件所需的所有类型接口
 */

/** 坐席状态 */
export type AgentStatus = 'online' | 'offline'

/** 示忙状态 */
export type BusyStatus = 'busy' | 'idle'

/** 通话状态 */
export type CallStatus = 'idle' | 'ringing' | 'talking' | 'holding'

/** 静音状态 */
export type MuteStatus = 'muted' | 'unmuted'

/** 通话信息 */
export interface CallInfo {
  /** 主叫号码 */
  callerNumber: string
  /** 被叫号码 */
  calleeNumber: string
  /** 通话时长（秒） */
  duration: number
  /** 用户等级 */
  userLevel: string
  /** 用户地址 */
  userAddress: string
  /** 来电地市 */
  city: string
  /** 用户姓名 */
  userName?: string
  /** 用户ID */
  userId?: string
}

/** 坐席信息 */
export interface AgentInfo {
  /** 坐席ID */
  agentId: string
  /** 坐席名称 */
  agentName: string
  /** 坐席工号 */
  agentNo: string
  /** 所属部门 */
  department: string
  /** 所属地市 */
  city: string
}

/** 权限配置 */
export interface PermissionConfig {
  /** 不进线权限（开启后默认示忙，不接入来电） */
  noIncomingCall: boolean
  /** 录音查看权限 */
  canViewRecording: boolean
  /** 外呼权限 */
  canOutbound: boolean
  /** 转接权限 */
  canTransfer: boolean
}

/** 转接目标 */
export interface TransferTarget {
  /** 目标ID */
  id: string
  /** 目标名称 */
  name: string
  /** 目标类型 */
  type: 'agent' | 'department'
  /** 部门名称（仅坐席类型） */
  department?: string
  /** 状态（仅坐席类型） */
  status?: 'online' | 'offline' | 'busy'
}

/** 通话记录 */
export interface CallRecord {
  /** 记录ID */
  id: string
  /** 通话类型 */
  type: 'inbound' | 'outbound'
  /** 对方号码 */
  phoneNumber: string
  /** 通话开始时间 */
  startTime: string
  /** 通话时长（秒） */
  duration: number
  /** 通话结果 */
  result: 'completed' | 'missed' | 'rejected'
  /** 录音文件地址 */
  recordingUrl?: string
}

/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: string
  /** 用户姓名 */
  name: string
  /** 电话号码 */
  phoneNumber: string
  /** 用户等级 */
  level: 'VIP' | 'gold' | 'silver' | 'normal'
  /** 用户地址 */
  address: string
  /** 所属地市 */
  city: string
  /** 历史来电次数 */
  callCount: number
  /** 备注 */
  remark?: string
}

/** 话务条组件Props */
export interface CallBarProps {
  /** 坐席信息 */
  agentInfo?: AgentInfo
  /** 初始权限配置 */
  initialPermissions?: Partial<PermissionConfig>
}

/** 话务条组件Emits */
export interface CallBarEmits {
  /** 状态变更事件 */
  (e: 'status-change', status: { agentStatus: AgentStatus; busyStatus: BusyStatus }): void
  /** 通话开始事件 */
  (e: 'call-start', callInfo: CallInfo): void
  /** 通话结束事件 */
  (e: 'call-end', callInfo: CallInfo & { totalDuration: number }): void
  /** 转接事件 */
  (e: 'transfer', target: TransferTarget): void
  /** 外呼事件 */
  (e: 'outbound', phoneNumber: string): void
  /** 录音查看事件 */
  (e: 'view-recording', record: CallRecord): void
  /** 错误事件 */
  (e: 'error', error: Error): void
}

/** API响应格式 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
  /** 是否成功 */
  success: boolean
}

/** 分页参数 */
export interface PaginationParams {
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/** 分页响应 */
export interface PaginationResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
}
