/**
 * 班长监控控制台 - 类型定义
 * @description 定义班长监控相关的类型接口
 * @version 1.0.0
 */

// 坐席状态类型
export type AgentStatus = 'online' | 'busy' | 'idle' | 'offline'

// 坐席信息
export interface AgentInfo {
  id: string
  agentNo: string
  name: string
  status: AgentStatus
  queueName: string
  lastUpdateTime: string
  loginTime?: string
  callCount?: number
  isAbnormal?: boolean
  // 新增字段
  employeeNo?: string
  loginTimes?: number
  busyStartTime?: string
  busyDuration?: number
}

// 坐席状态统计
export interface AgentStatusStats {
  total: number
  online: number
  busy: number
  idle: number
  offline: number
}

// 队列信息
export interface QueueInfo {
  id: string
  name: string
  waitingCount: number
  maxWaitTime: number
  maxCapacity: number
}

// 排队监控数据
export interface QueueMonitorData {
  totalWaiting: number
  activeQueues: number
  avgWaitTime: number
  queueList: QueueInfo[]
}

// 排队蓄满耗时
export interface QueueFillTime {
  isFull: boolean
  fillDuration: number
  lastResetTime: string
}

// 用户信息
export interface UserInfo {
  id: string
  name: string
  role: 'supervisor' | 'admin' | 'agent'
}

// API响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页参数
export interface PaginationParams {
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

// 操作日志
export interface OperationLog {
  id: string
  operator: string
  operationType: 'pageView' | 'filter' | 'refresh' | 'expand'
  operationContent: string
  ipAddress: string
  timestamp: string
}
