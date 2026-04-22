/**
 * 底部用户信息模块 - 类型定义
 * @description 定义底部用户信息展示相关的类型接口
 * @version 1.0.0
 */

// 坐席状态类型
export type AgentStatus = 'idle' | 'busy' | 'calling' | 'offline'

// 坐席状态显示配置
export interface StatusConfig {
  label: string
  color: string
  className: string
}

// 坐席信息
export interface AgentInfo {
  // 姓名
  name: string
  // 工号
  employeeNo: string
  // 登录时间
  loginTime: string
  // 本次登录通话次数
  callCount: number
  // 座席状态
  status: AgentStatus
  // 通话时长（秒）
  callDuration: number
  // 是否正在通话中
  isInCall: boolean
}

// 状态配置映射
export const StatusConfigMap: Record<AgentStatus, StatusConfig> = {
  idle: {
    label: '示闲中',
    color: '#67c23a',
    className: 'status-idle'
  },
  busy: {
    label: '示忙中',
    color: '#f56c6c',
    className: 'status-busy'
  },
  calling: {
    label: '通话中',
    color: '#e6a23c',
    className: 'status-calling'
  },
  offline: {
    label: '离线',
    color: '#909399',
    className: 'status-offline'
  }
}

// API响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}
