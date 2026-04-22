/**
 * 班长监控控制台 - Mock接口
 * @description 模拟班长监控相关的API接口
 * @version 1.0.0
 */

import type {
  ApiResponse,
  AgentInfo,
  AgentStatusStats,
  QueueMonitorData,
  QueueFillTime,
  UserInfo,
  OperationLog
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 当前用户信息
export const currentUser: UserInfo = {
  id: '1001',
  name: '张三',
  role: 'supervisor'
}

// 模拟坐席数据
const mockAgents: AgentInfo[] = [
  { id: '1', agentNo: 'AG001', name: '王芳', status: 'online', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:30:00', loginTime: '2024-01-15 08:00:00', callCount: 15, employeeNo: 'EMP001', loginTimes: 3, busyStartTime: '', busyDuration: 0 },
  { id: '2', agentNo: 'AG002', name: '李明', status: 'busy', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:29:30', loginTime: '2024-01-15 08:30:00', callCount: 23, employeeNo: 'EMP002', loginTimes: 5, busyStartTime: '2024-01-15 10:20:00', busyDuration: 600 },
  { id: '3', agentNo: 'AG003', name: '张华', status: 'idle', queueName: '投诉处理队列', lastUpdateTime: '2024-01-15 10:30:15', loginTime: '2024-01-15 09:00:00', callCount: 8, employeeNo: 'EMP003', loginTimes: 2, busyStartTime: '', busyDuration: 0 },
  { id: '4', agentNo: 'AG004', name: '刘洋', status: 'offline', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 09:45:00', loginTime: '2024-01-15 08:15:00', callCount: 12, isAbnormal: true, employeeNo: 'EMP004', loginTimes: 4, busyStartTime: '', busyDuration: 0 },
  { id: '5', agentNo: 'AG005', name: '陈静', status: 'online', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:30:05', loginTime: '2024-01-15 08:00:00', callCount: 31, employeeNo: 'EMP005', loginTimes: 6, busyStartTime: '', busyDuration: 0 },
  { id: '6', agentNo: 'AG006', name: '杨帆', status: 'busy', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:28:00', loginTime: '2024-01-15 08:30:00', callCount: 19, employeeNo: 'EMP006', loginTimes: 3, busyStartTime: '2024-01-15 10:15:00', busyDuration: 780 },
  { id: '7', agentNo: 'AG007', name: '赵敏', status: 'idle', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:30:20', loginTime: '2024-01-15 09:00:00', callCount: 6, employeeNo: 'EMP007', loginTimes: 2, busyStartTime: '', busyDuration: 0 },
  { id: '8', agentNo: 'AG008', name: '孙伟', status: 'online', queueName: '投诉处理队列', lastUpdateTime: '2024-01-15 10:29:50', loginTime: '2024-01-15 08:00:00', callCount: 27, employeeNo: 'EMP008', loginTimes: 7, busyStartTime: '', busyDuration: 0 },
  { id: '9', agentNo: 'AG009', name: '周婷', status: 'busy', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:27:30', loginTime: '2024-01-15 08:30:00', callCount: 14, employeeNo: 'EMP009', loginTimes: 4, busyStartTime: '2024-01-15 10:10:00', busyDuration: 1050 },
  { id: '10', agentNo: 'AG010', name: '吴强', status: 'offline', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:00:00', loginTime: '2024-01-15 08:15:00', callCount: 9, employeeNo: 'EMP010', loginTimes: 3, busyStartTime: '', busyDuration: 0 },
  { id: '11', agentNo: 'AG011', name: '郑丽', status: 'online', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:30:10', loginTime: '2024-01-15 08:00:00', callCount: 22, employeeNo: 'EMP011', loginTimes: 5, busyStartTime: '', busyDuration: 0 },
  { id: '12', agentNo: 'AG012', name: '黄磊', status: 'idle', queueName: '投诉处理队列', lastUpdateTime: '2024-01-15 10:30:25', loginTime: '2024-01-15 09:00:00', callCount: 11, employeeNo: 'EMP012', loginTimes: 2, busyStartTime: '', busyDuration: 0 },
  { id: '13', agentNo: 'AG013', name: '林峰', status: 'busy', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:26:00', loginTime: '2024-01-15 08:30:00', callCount: 28, employeeNo: 'EMP013', loginTimes: 6, busyStartTime: '2024-01-15 10:05:00', busyDuration: 1260 },
  { id: '14', agentNo: 'AG014', name: '徐雪', status: 'online', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:29:40', loginTime: '2024-01-15 08:00:00', callCount: 17, employeeNo: 'EMP014', loginTimes: 4, busyStartTime: '', busyDuration: 0 },
  { id: '15', agentNo: 'AG015', name: '谢军', status: 'idle', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:30:30', loginTime: '2024-01-15 09:00:00', callCount: 5, employeeNo: 'EMP015', loginTimes: 2, busyStartTime: '', busyDuration: 0 },
  { id: '16', agentNo: 'AG016', name: '马丽', status: 'busy', queueName: '投诉处理队列', lastUpdateTime: '2024-01-15 10:25:30', loginTime: '2024-01-15 08:30:00', callCount: 20, employeeNo: 'EMP016', loginTimes: 5, busyStartTime: '2024-01-15 10:00:00', busyDuration: 1530 },
  { id: '17', agentNo: 'AG017', name: '胡波', status: 'online', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:29:20', loginTime: '2024-01-15 08:00:00', callCount: 33, employeeNo: 'EMP017', loginTimes: 8, busyStartTime: '', busyDuration: 0 },
  { id: '18', agentNo: 'AG018', name: '郭燕', status: 'offline', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 09:30:00', loginTime: '2024-01-15 08:15:00', callCount: 13, employeeNo: 'EMP018', loginTimes: 3, busyStartTime: '', busyDuration: 0 },
  { id: '19', agentNo: 'AG019', name: '何平', status: 'idle', queueName: 'VIP客户队列', lastUpdateTime: '2024-01-15 10:30:35', loginTime: '2024-01-15 09:00:00', callCount: 7, employeeNo: 'EMP019', loginTimes: 2, busyStartTime: '', busyDuration: 0 },
  { id: '20', agentNo: 'AG020', name: '高健', status: 'online', queueName: '普通咨询队列', lastUpdateTime: '2024-01-15 10:28:50', loginTime: '2024-01-15 08:00:00', callCount: 25, employeeNo: 'EMP020', loginTimes: 6, busyStartTime: '', busyDuration: 0 }
]

// 模拟队列数据
const mockQueues = [
  { id: '1', name: '普通咨询队列', waitingCount: 5, maxWaitTime: 180, maxCapacity: 50 },
  { id: '2', name: 'VIP客户队列', waitingCount: 2, maxWaitTime: 60, maxCapacity: 20 },
  { id: '3', name: '投诉处理队列', waitingCount: 3, maxWaitTime: 120, maxCapacity: 30 },
  { id: '4', name: '技术支持队列', waitingCount: 0, maxWaitTime: 0, maxCapacity: 40 },
  { id: '5', name: '售后服务队列', waitingCount: 1, maxWaitTime: 90, maxCapacity: 25 }
]

// 操作日志
const operationLogs: OperationLog[] = []

// 队列蓄满时间统计
let queueFillStartTime: number | null = null
let queueFillDuration = 0
let isQueueFull = false

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserInfo>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: currentUser,
    success: true
  }
}

/**
 * 获取坐席列表
 */
export const getAgentList = async (): Promise<ApiResponse<AgentInfo[]>> => {
  await delay(300)
  
  // 模拟状态随机变化
  const agents = mockAgents.map(agent => {
    const random = Math.random()
    let newStatus = agent.status
    
    if (random < 0.1) {
      const statuses: Array<AgentInfo['status']> = ['online', 'busy', 'idle', 'offline']
      newStatus = statuses[Math.floor(Math.random() * statuses.length)]
    }
    
    return {
      ...agent,
      status: newStatus,
      lastUpdateTime: new Date().toLocaleString('zh-CN')
    }
  })
  
  return {
    code: 200,
    message: 'success',
    data: agents,
    success: true
  }
}

/**
 * 获取坐席状态统计
 */
export const getAgentStats = async (): Promise<ApiResponse<AgentStatusStats>> => {
  await delay(200)
  
  const stats = {
    total: mockAgents.length,
    online: mockAgents.filter(a => a.status === 'online').length,
    busy: mockAgents.filter(a => a.status === 'busy').length,
    idle: mockAgents.filter(a => a.status === 'idle').length,
    offline: mockAgents.filter(a => a.status === 'offline').length
  }
  
  return {
    code: 200,
    message: 'success',
    data: stats,
    success: true
  }
}

/**
 * 获取排队监控数据
 */
export const getQueueMonitorData = async (): Promise<ApiResponse<QueueMonitorData>> => {
  await delay(300)
  
  // 模拟排队人数动态变化
  const queues = mockQueues.map(queue => ({
    ...queue,
    waitingCount: Math.max(0, queue.waitingCount + Math.floor(Math.random() * 3) - 1),
    maxWaitTime: queue.waitingCount > 0 ? queue.maxWaitTime + Math.floor(Math.random() * 10) : 0
  }))
  
  const totalWaiting = queues.reduce((sum, q) => sum + q.waitingCount, 0)
  const activeQueues = queues.filter(q => q.waitingCount > 0).length
  const avgWaitTime = activeQueues > 0 
    ? Math.floor(queues.filter(q => q.waitingCount > 0).reduce((sum, q) => sum + q.maxWaitTime, 0) / activeQueues)
    : 0
  
  // 更新队列蓄满状态
  if (totalWaiting > 0 && !isQueueFull) {
    if (!queueFillStartTime) {
      queueFillStartTime = Date.now()
    }
    queueFillDuration = Math.floor((Date.now() - queueFillStartTime) / 1000)
    if (totalWaiting >= 50) {
      isQueueFull = true
    }
  } else if (totalWaiting === 0) {
    queueFillStartTime = null
    queueFillDuration = 0
    isQueueFull = false
  }
  
  return {
    code: 200,
    message: 'success',
    data: {
      totalWaiting,
      activeQueues,
      avgWaitTime,
      queueList: queues
    },
    success: true
  }
}

/**
 * 获取排队蓄满耗时
 */
export const getQueueFillTime = async (): Promise<ApiResponse<QueueFillTime>> => {
  await delay(200)
  
  return {
    code: 200,
    message: 'success',
    data: {
      isFull: isQueueFull,
      fillDuration: queueFillDuration,
      lastResetTime: queueFillStartTime ? new Date(queueFillStartTime).toLocaleString('zh-CN') : '-'
    },
    success: true
  }
}

/**
 * 检查权限
 */
export const checkPermission = async (): Promise<ApiResponse<{ hasPermission: boolean }>> => {
  await delay(200)
  const hasPermission = currentUser.role === 'supervisor' || currentUser.role === 'admin'
  return {
    code: 200,
    message: 'success',
    data: { hasPermission },
    success: true
  }
}

/**
 * 记录操作日志
 */
export const logOperation = async (log: Omit<OperationLog, 'id' | 'timestamp'>): Promise<void> => {
  operationLogs.push({
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString('zh-CN')
  })
}

/**
 * 获取操作日志
 */
export const getOperationLogs = async (): Promise<ApiResponse<OperationLog[]>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: operationLogs.slice(-20).reverse(),
    success: true
  }
}
