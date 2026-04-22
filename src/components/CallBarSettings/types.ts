/**
 * 话务条设置模块 - 类型定义
 * @description 定义话务条设置相关的类型接口
 * @version 1.0.0
 */

// 地市信息
export interface CityInfo {
  code: string
  name: string
}

// 示忙人数配置
export interface BusyLimitConfig {
  cityCode: string
  cityName: string
  limit: number
  lastUpdated: string
  updatedBy: string
}

// 话务员信息
export interface AgentInfo {
  id: string
  name: string
  employeeNo: string
  phoneNumber: string
  callDuration: number
  status: 'talking' | 'idle' | 'busy' | 'offline'
  currentCallNumber?: string
}

// 操作类型
export type OperationType = 'forceInsert' | 'monitor'

// 操作日志
export interface OperationLog {
  id: string
  operator: string
  operationType: 'saveBusyLimit' | 'forceInsert' | 'monitor' | 'reset'
  operationContent: string
  targetAgent?: string
  result: 'success' | 'failed'
  timestamp: string
}

// 用户角色
export type UserRole = 'admin' | 'supervisor' | 'agent'

// 用户信息
export interface UserInfo {
  id: string
  name: string
  employeeNo: string
  role: UserRole
  cityCode: string
  cityName: string
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
