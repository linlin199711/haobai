/**
 * 话务条设置模块 - Mock接口
 * @description 模拟话务条设置相关的API接口
 * @version 1.0.0
 */

import type {
  ApiResponse,
  CityInfo,
  BusyLimitConfig,
  AgentInfo,
  OperationLog,
  PaginationResult,
  UserInfo,
  UserRole
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 当前用户信息（模拟）
export const currentUser: UserInfo = {
  id: '1001',
  name: '张三',
  employeeNo: 'AG001',
  role: 'supervisor', // admin, supervisor, agent
  cityCode: '350100',
  cityName: '福州'
}

// 地市列表
const cities: CityInfo[] = [
  { code: '350100', name: '福州' },
  { code: '350200', name: '厦门' },
  { code: '350300', name: '莆田' },
  { code: '350400', name: '三明' },
  { code: '350500', name: '泉州' },
  { code: '350600', name: '漳州' },
  { code: '350700', name: '南平' },
  { code: '350800', name: '龙岩' },
  { code: '350900', name: '宁德' }
]

// 示忙人数配置缓存
const busyLimitConfigs: Map<string, BusyLimitConfig> = new Map([
  ['350100', {
    cityCode: '350100',
    cityName: '福州',
    limit: 10,
    lastUpdated: '2024-01-15 10:30:00',
    updatedBy: '张三'
  }],
  ['350200', {
    cityCode: '350200',
    cityName: '厦门',
    limit: 15,
    lastUpdated: '2024-01-14 14:20:00',
    updatedBy: '李四'
  }]
])

// 模拟话务员列表
const mockAgents: AgentInfo[] = [
  {
    id: '1',
    name: '王五',
    employeeNo: 'AG002',
    phoneNumber: '0591-12345678',
    callDuration: 300,
    status: 'talking',
    currentCallNumber: '13800138000'
  },
  {
    id: '2',
    name: '赵六',
    employeeNo: 'AG003',
    phoneNumber: '0591-87654321',
    callDuration: 180,
    status: 'talking',
    currentCallNumber: '13900139000'
  },
  {
    id: '3',
    name: '孙七',
    employeeNo: 'AG004',
    phoneNumber: '0591-11112222',
    callDuration: 600,
    status: 'talking',
    currentCallNumber: '13700137000'
  },
  {
    id: '4',
    name: '周八',
    employeeNo: 'AG005',
    phoneNumber: '0591-33334444',
    callDuration: 0,
    status: 'idle'
  },
  {
    id: '5',
    name: '吴九',
    employeeNo: 'AG006',
    phoneNumber: '0591-55556666',
    callDuration: 0,
    status: 'busy'
  }
]

// 操作日志
const operationLogs: OperationLog[] = []

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserInfo>> => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: currentUser,
    success: true
  }
}

/**
 * 获取地市列表
 */
export const getCities = async (): Promise<ApiResponse<CityInfo[]>> => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: cities,
    success: true
  }
}

/**
 * 获取示忙人数配置
 */
export const getBusyLimitConfig = async (cityCode: string): Promise<ApiResponse<BusyLimitConfig>> => {
  await delay(400)
  const config = busyLimitConfigs.get(cityCode)
  if (config) {
    return {
      code: 200,
      message: 'success',
      data: config,
      success: true
    }
  }
  // 默认配置
  const city = cities.find(c => c.code === cityCode)
  return {
    code: 200,
    message: 'success',
    data: {
      cityCode,
      cityName: city?.name || '未知',
      limit: 10,
      lastUpdated: '-',
      updatedBy: '-'
    },
    success: true
  }
}

/**
 * 保存示忙人数配置
 */
export const saveBusyLimitConfig = async (
  cityCode: string,
  limit: number
): Promise<ApiResponse<BusyLimitConfig>> => {
  await delay(600)
  
  const city = cities.find(c => c.code === cityCode)
  const config: BusyLimitConfig = {
    cityCode,
    cityName: city?.name || '未知',
    limit,
    lastUpdated: new Date().toLocaleString('zh-CN'),
    updatedBy: currentUser.name
  }
  
  busyLimitConfigs.set(cityCode, config)
  
  // 记录操作日志
  operationLogs.push({
    id: Date.now().toString(),
    operator: currentUser.name,
    operationType: 'saveBusyLimit',
    operationContent: `设置${config.cityName}示忙人数上限为${limit}人`,
    result: 'success',
    timestamp: new Date().toLocaleString('zh-CN')
  })
  
  return {
    code: 200,
    message: '示忙人数设置成功，已生效',
    data: config,
    success: true
  }
}

/**
 * 获取通话中话务员列表
 */
export const getTalkingAgents = async (
  cityCode: string,
  keyword?: string
): Promise<ApiResponse<AgentInfo[]>> => {
  await delay(500)
  
  let agents = mockAgents.filter(agent => agent.status === 'talking')
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    agents = agents.filter(agent =>
      agent.name.toLowerCase().includes(lowerKeyword) ||
      agent.employeeNo.toLowerCase().includes(lowerKeyword)
    )
  }
  
  return {
    code: 200,
    message: 'success',
    data: agents,
    success: true
  }
}

/**
 * 强插操作
 */
export const forceInsert = async (
  agentId: string
): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(800)
  
  const agent = mockAgents.find(a => a.id === agentId)
  
  // 记录操作日志
  operationLogs.push({
    id: Date.now().toString(),
    operator: currentUser.name,
    operationType: 'forceInsert',
    operationContent: `强插话务员${agent?.name || agentId}的通话`,
    targetAgent: agent?.name,
    result: 'success',
    timestamp: new Date().toLocaleString('zh-CN')
  })
  
  return {
    code: 200,
    message: `已成功强插话务员${agent?.name || agentId}的通话，已加入三方通话`,
    data: { success: true },
    success: true
  }
}

/**
 * 监听操作
 */
export const monitorCall = async (
  agentId: string
): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(800)
  
  const agent = mockAgents.find(a => a.id === agentId)
  
  // 记录操作日志
  operationLogs.push({
    id: Date.now().toString(),
    operator: currentUser.name,
    operationType: 'monitor',
    operationContent: `监听话务员${agent?.name || agentId}的通话`,
    targetAgent: agent?.name,
    result: 'success',
    timestamp: new Date().toLocaleString('zh-CN')
  })
  
  return {
    code: 200,
    message: `已成功建立对${agent?.name || agentId}通话的单向监听`,
    data: { success: true },
    success: true
  }
}

/**
 * 检查用户是否有权限（强插/监听）
 */
export const checkPermission = async (): Promise<ApiResponse<{ hasPermission: boolean }>> => {
  await delay(200)
  const hasPermission = currentUser.role === 'admin' || currentUser.role === 'supervisor'
  return {
    code: 200,
    message: 'success',
    data: { hasPermission },
    success: true
  }
}

/**
 * 获取操作日志
 */
export const getOperationLogs = async (): Promise<ApiResponse<OperationLog[]>> => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: operationLogs.slice(-20).reverse(), // 返回最近20条
    success: true
  }
}
