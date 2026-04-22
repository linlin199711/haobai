/**
 * 信息查询模块 - 类型定义
 * @description 定义信息查询相关的类型接口
 * @version 1.0.0
 */

// 坐席统计信息
export interface AgentStatistics {
  /** 当天通话次数 */
  callCount: number
  /** 当天通话时长（秒） */
  callDuration: number
  /** 当天示忙时长（秒） */
  busyDuration: number
  /** 当天示闲时长（秒） */
  idleDuration: number
  /** 最后更新时间 */
  lastUpdateTime: string
}

// 坐席状态
export enum AgentStatusEnum {
  IDLE = 'idle',
  CALLING = 'calling',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

// 组件Props
export interface InfoQueryModalProps {
  /** 是否显示弹窗 */
  modelValue: boolean
  /** 坐席ID */
  agentId?: string
  /** 初始统计数据 */
  initialData?: Partial<AgentStatistics>
}

// 组件Events
export interface InfoQueryModalEvents {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}
