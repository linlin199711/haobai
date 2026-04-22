/**
 * 底部用户信息模块 - Mock接口
 * @description 模拟底部用户信息相关的API接口
 * @version 1.0.0
 */

import type { ApiResponse, AgentInfo, AgentStatus } from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 当前登录用户信息（模拟）
export const currentAgent: AgentInfo = {
  name: '郭诗雨',
  employeeNo: '7154',
  loginTime: '2026-04-08 09:45:57',
  callCount: 11,
  status: 'busy',
  callDuration: 22,
  isInCall: false
}

/**
 * 获取当前坐席信息
 */
export const getAgentInfo = async (): Promise<ApiResponse<AgentInfo>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: { ...currentAgent },
    success: true
  }
}

/**
 * 更新坐席状态
 */
export const updateAgentStatus = async (
  status: AgentStatus
): Promise<ApiResponse<AgentInfo>> => {
  await delay(150)
  currentAgent.status = status
  return {
    code: 200,
    message: 'success',
    data: { ...currentAgent },
    success: true
  }
}

/**
 * 开始通话
 */
export const startCall = async (): Promise<ApiResponse<AgentInfo>> => {
  await delay(100)
  currentAgent.status = 'calling'
  currentAgent.isInCall = true
  return {
    code: 200,
    message: 'success',
    data: { ...currentAgent },
    success: true
  }
}

/**
 * 结束通话
 */
export const endCall = async (): Promise<ApiResponse<AgentInfo>> => {
  await delay(100)
  currentAgent.status = 'idle'
  currentAgent.isInCall = false
  currentAgent.callCount += 1
  currentAgent.callDuration = 0
  return {
    code: 200,
    message: 'success',
    data: { ...currentAgent },
    success: true
  }
}

/**
 * 更新通话时长（模拟后端计时）
 */
export const updateCallDuration = async (
  duration: number
): Promise<ApiResponse<AgentInfo>> => {
  currentAgent.callDuration = duration
  return {
    code: 200,
    message: 'success',
    data: { ...currentAgent },
    success: true
  }
}

/**
 * 模拟状态变更事件（用于测试）
 */
export const mockStatusChange = (
  callback: (status: AgentStatus) => void,
  interval: number = 10000
) => {
  const statuses: AgentStatus[] = ['idle', 'busy', 'calling', 'idle']
  let index = 0
  
  const timer = setInterval(() => {
    index = (index + 1) % statuses.length
    callback(statuses[index])
  }, interval)
  
  return () => clearInterval(timer)
}
