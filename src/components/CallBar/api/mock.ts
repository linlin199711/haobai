/**
 * 呼叫中心话务条 - 模拟API接口
 * @description 提供模拟数据，用于开发和测试环境
 */

import type {
  ApiResponse,
  AgentInfo,
  PermissionConfig,
  CallInfo,
  TransferTarget,
  CallRecord,
  UserInfo,
  PaginationResponse,
  PaginationParams
} from '../types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 当前坐席信息
const mockAgentInfo: AgentInfo = {
  agentId: 'A1001',
  agentName: '张三',
  agentNo: '1001',
  department: '客服一部',
  city: '福州'
}

// 权限配置
let mockPermissionConfig: PermissionConfig = {
  noIncomingCall: false,
  canViewRecording: true,
  canOutbound: true,
  canTransfer: true
}

// 转接目标列表
const mockTransferTargets: TransferTarget[] = [
  { id: 'A1002', name: '李四', type: 'agent', department: '客服一部', status: 'online' },
  { id: 'A1003', name: '王五', type: 'agent', department: '客服一部', status: 'busy' },
  { id: 'A1004', name: '赵六', type: 'agent', department: '客服二部', status: 'offline' },
  { id: 'A1005', name: '钱七', type: 'agent', department: '售后部', status: 'online' },
  { id: 'D001', name: '客服一部', type: 'department' },
  { id: 'D002', name: '客服二部', type: 'department' },
  { id: 'D003', name: '售后部', type: 'department' },
  { id: 'D004', name: '投诉处理部', type: 'department' }
]

// 通话记录
const mockCallRecords: CallRecord[] = [
  {
    id: 'R001',
    type: 'inbound',
    phoneNumber: '13800138001',
    startTime: '2024-01-15 09:30:00',
    duration: 180,
    result: 'completed',
    recordingUrl: '/recordings/R001.mp3'
  },
  {
    id: 'R002',
    type: 'outbound',
    phoneNumber: '13900139001',
    startTime: '2024-01-15 10:15:00',
    duration: 120,
    result: 'completed',
    recordingUrl: '/recordings/R002.mp3'
  },
  {
    id: 'R003',
    type: 'inbound',
    phoneNumber: '13700137001',
    startTime: '2024-01-15 11:00:00',
    duration: 0,
    result: 'missed'
  },
  {
    id: 'R004',
    type: 'inbound',
    phoneNumber: '13600136001',
    startTime: '2024-01-15 14:20:00',
    duration: 300,
    result: 'completed',
    recordingUrl: '/recordings/R004.mp3'
  },
  {
    id: 'R005',
    type: 'outbound',
    phoneNumber: '13500135001',
    startTime: '2024-01-15 15:45:00',
    duration: 60,
    result: 'rejected'
  }
]

// 用户信息库
const mockUserDatabase: UserInfo[] = [
  {
    id: 'U001',
    name: '陈先生',
    phoneNumber: '13800138001',
    level: 'VIP',
    address: '福建省福州市鼓楼区五四路1号',
    city: '福州',
    callCount: 15,
    remark: '重要客户，优先处理'
  },
  {
    id: 'U002',
    name: '李女士',
    phoneNumber: '13900139001',
    level: 'gold',
    address: '福建省莆田市城厢区文献路2号',
    city: '莆田',
    callCount: 8,
    remark: '经常咨询套餐业务'
  },
  {
    id: 'U003',
    name: '王先生',
    phoneNumber: '13700137001',
    level: 'silver',
    address: '福建省厦门市思明区湖滨南路3号',
    city: '厦门',
    callCount: 5
  },
  {
    id: 'U004',
    name: '张女士',
    phoneNumber: '13800138002',
    level: 'normal',
    address: '福建省泉州市丰泽区刺桐路4号',
    city: '泉州',
    callCount: 2
  },
  {
    id: 'U005',
    name: '刘先生',
    phoneNumber: '13600136001',
    level: 'VIP',
    address: '福建省莆田市涵江区涵华西路5号',
    city: '莆田',
    callCount: 20,
    remark: 'VIP客户，要求快速响应'
  }
]

/**
 * 获取坐席信息
 */
export const getAgentInfo = async (): Promise<ApiResponse<AgentInfo>> => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: mockAgentInfo,
    success: true
  }
}

/**
 * 获取权限配置
 */
export const getPermissionConfig = async (): Promise<ApiResponse<PermissionConfig>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: mockPermissionConfig,
    success: true
  }
}

/**
 * 更新权限配置（用于测试）
 */
export const updatePermissionConfig = async (
  config: Partial<PermissionConfig>
): Promise<ApiResponse<PermissionConfig>> => {
  await delay(200)
  mockPermissionConfig = { ...mockPermissionConfig, ...config }
  return {
    code: 200,
    message: 'success',
    data: mockPermissionConfig,
    success: true
  }
}

/**
 * 签入
 */
export const signIn = async (): Promise<ApiResponse<{ agentStatus: 'online' }>> => {
  await delay(500)
  return {
    code: 200,
    message: '签入成功',
    data: { agentStatus: 'online' },
    success: true
  }
}

/**
 * 签出
 */
export const signOut = async (): Promise<ApiResponse<{ agentStatus: 'offline' }>> => {
  await delay(500)
  return {
    code: 200,
    message: '签出成功',
    data: { agentStatus: 'offline' },
    success: true
  }
}

/**
 * 示忙
 */
export const setBusy = async (): Promise<ApiResponse<{ busyStatus: 'busy' }>> => {
  await delay(300)
  return {
    code: 200,
    message: '已示忙',
    data: { busyStatus: 'busy' },
    success: true
  }
}

/**
 * 示闲
 */
export const setIdle = async (): Promise<ApiResponse<{ busyStatus: 'idle' }>> => {
  await delay(300)
  return {
    code: 200,
    message: '已示闲',
    data: { busyStatus: 'idle' },
    success: true
  }
}

/**
 * 静音
 */
export const mute = async (): Promise<ApiResponse<{ muted: true }>> => {
  await delay(200)
  return {
    code: 200,
    message: '已静音',
    data: { muted: true },
    success: true
  }
}

/**
 * 取消静音
 */
export const unmute = async (): Promise<ApiResponse<{ muted: false }>> => {
  await delay(200)
  return {
    code: 200,
    message: '已取消静音',
    data: { muted: false },
    success: true
  }
}

/**
 * 挂断电话
 */
export const hangUp = async (): Promise<ApiResponse<{ success: true }>> => {
  await delay(300)
  return {
    code: 200,
    message: '已挂断',
    data: { success: true },
    success: true
  }
}

/**
 * 接听电话
 */
export const answerCall = async (): Promise<ApiResponse<CallInfo>> => {
  await delay(300)
  return {
    code: 200,
    message: '接听成功',
    data: {
      callerNumber: '13800138001',
      calleeNumber: '1001',
      duration: 0,
      userLevel: 'VIP',
      userAddress: '福建省福州市鼓楼区',
      city: '福州'
    },
    success: true
  }
}

/**
 * 获取转接目标列表
 */
export const getTransferTargets = async (): Promise<ApiResponse<TransferTarget[]>> => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: mockTransferTargets,
    success: true
  }
}

/**
 * 转接电话
 */
export const transferCall = async (
  targetId: string
): Promise<ApiResponse<{ success: true }>> => {
  await delay(500)
  const target = mockTransferTargets.find(t => t.id === targetId)
  if (!target) {
    return {
      code: 404,
      message: '转接目标不存在',
      data: { success: false },
      success: false
    }
  }
  return {
    code: 200,
    message: '转接成功',
    data: { success: true },
    success: true
  }
}

/**
 * 外呼
 */
export const outboundCall = async (
  phoneNumber: string,
  businessCode?: string
): Promise<ApiResponse<CallInfo>> => {
  await delay(800)
  return {
    code: 200,
    message: '外呼成功',
    data: {
      callerNumber: '1001',
      calleeNumber: phoneNumber,
      duration: 0,
      userLevel: 'normal',
      userAddress: '未知地址',
      city: '未知',
      businessCode: businessCode || '118114'
    },
    success: true
  }
}

/**
 * 保持
 */
export const hold = async (): Promise<ApiResponse<{ holding: true }>> => {
  await delay(300)
  return {
    code: 200,
    message: '已保持',
    data: { holding: true },
    success: true
  }
}

/**
 * 接回
 */
export const unhold = async (): Promise<ApiResponse<{ holding: false }>> => {
  await delay(300)
  return {
    code: 200,
    message: '已接回',
    data: { holding: false },
    success: true
  }
}

/**
 * 咨询
 */
export const consultCall = async (
  targetId: string
): Promise<ApiResponse<{ success: true }>> => {
  await delay(500)
  return {
    code: 200,
    message: '咨询成功',
    data: { success: true },
    success: true
  }
}

/**
 * 获取通话记录
 */
export const getCallRecords = async (
  params: PaginationParams
): Promise<ApiResponse<PaginationResponse<CallRecord>>> => {
  await delay(400)
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    code: 200,
    message: 'success',
    data: {
      list: mockCallRecords.slice(start, end),
      total: mockCallRecords.length,
      page,
      pageSize
    },
    success: true
  }
}

/**
 * 获取用户信息
 */
export const getUserInfo = async (
  phoneNumber: string
): Promise<ApiResponse<UserInfo | null>> => {
  await delay(300)
  const user = mockUserDatabase.find(u => u.phoneNumber === phoneNumber)
  return {
    code: 200,
    message: 'success',
    data: user || null,
    success: true
  }
}

/**
 * 模拟来电（用于测试）
 */
export const simulateIncomingCall = async (): Promise<ApiResponse<CallInfo & { userInfo: UserInfo }>> => {
  await delay(100)
  const randomUser = mockUserDatabase[Math.floor(Math.random() * mockUserDatabase.length)]
  return {
    code: 200,
    message: 'incoming call',
    data: {
      callerNumber: randomUser.phoneNumber,
      calleeNumber: '1001',
      duration: 0,
      userLevel: randomUser.level,
      userAddress: randomUser.address,
      city: randomUser.city,
      userName: randomUser.name,
      userInfo: randomUser
    },
    success: true
  }
}

/**
 * 查询信息（模拟）
 */
export const queryInfo = async (
  keyword: string
): Promise<ApiResponse<unknown[]>> => {
  await delay(500)
  const results = mockUserDatabase.filter(
    u =>
      u.name.includes(keyword) ||
      u.phoneNumber.includes(keyword) ||
      u.address.includes(keyword)
  )
  return {
    code: 200,
    message: 'success',
    data: results,
    success: true
  }
}
