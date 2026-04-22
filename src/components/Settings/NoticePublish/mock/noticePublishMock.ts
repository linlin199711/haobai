/**
 * 通知管理发布页 - Mock数据
 * @description 模拟通知发布相关数据
 * @version 1.0.0
 */

import type {
  AgentInfo,
  AgentQueryParams,
  NoticePublishParams,
  ApiResponse,
  AgentStatusEnum
} from '../types/noticePublish'
import { AgentStatusEnum as StatusEnum } from '../types/noticePublish'

// 模拟座席数据
const mockAgents: AgentInfo[] = [
  // 本组座席
  { id: 'A001', agentNo: '1001', name: '张三', group: '客服一组', subGroup: '售前组', status: StatusEnum.ONLINE, isOnline: true },
  { id: 'A002', agentNo: '1002', name: '李四', group: '客服一组', subGroup: '售前组', status: StatusEnum.BUSY, isOnline: true },
  { id: 'A003', agentNo: '1003', name: '王五', group: '客服一组', subGroup: '售后组', status: StatusEnum.IDLE, isOnline: true },
  { id: 'A004', agentNo: '1004', name: '赵六', group: '客服一组', subGroup: '售后组', status: StatusEnum.OFFLINE, isOnline: false },
  { id: 'A005', agentNo: '1005', name: '孙七', group: '客服一组', subGroup: '售前组', status: StatusEnum.ONLINE, isOnline: true },
  
  // 子组座席
  { id: 'A006', agentNo: '1006', name: '周八', group: '客服二组', subGroup: '投诉组', status: StatusEnum.ONLINE, isOnline: true },
  { id: 'A007', agentNo: '1007', name: '吴九', group: '客服二组', subGroup: '投诉组', status: StatusEnum.BUSY, isOnline: true },
  { id: 'A008', agentNo: '1008', name: '郑十', group: '客服二组', subGroup: 'VIP组', status: StatusEnum.IDLE, isOnline: true },
  { id: 'A009', agentNo: '1009', name: '钱十一', group: '客服二组', subGroup: 'VIP组', status: StatusEnum.OFFLINE, isOnline: false },
  
  // 其它组座席
  { id: 'A010', agentNo: '1010', name: '陈十二', group: '客服三组', subGroup: '技术支持', status: StatusEnum.ONLINE, isOnline: true },
  { id: 'A011', agentNo: '1011', name: '刘十三', group: '客服三组', subGroup: '技术支持', status: StatusEnum.BUSY, isOnline: true },
  { id: 'A012', agentNo: '1012', name: '黄十四', group: '客服四组', subGroup: '质检组', status: StatusEnum.IDLE, isOnline: true },
  { id: 'A013', agentNo: '1013', name: '林十五', group: '客服四组', subGroup: '培训组', status: StatusEnum.OFFLINE, isOnline: false },
  
  // 更多座席
  { id: 'A014', agentNo: '1014', name: '杨十六', group: '客服一组', subGroup: '售前组', status: StatusEnum.ONLINE, isOnline: true },
  { id: 'A015', agentNo: '1015', name: '朱十七', group: '客服二组', subGroup: '投诉组', status: StatusEnum.OFFLINE, isOnline: false },
  { id: 'A016', agentNo: '1016', name: '徐十八', group: '客服三组', subGroup: '技术支持', status: StatusEnum.ONLINE, isOnline: true },
  { id: 'A017', agentNo: '1017', name: '马十九', group: '客服四组', subGroup: '质检组', status: StatusEnum.BUSY, isOnline: true },
  { id: 'A018', agentNo: '1018', name: '胡二十', group: '客服一组', subGroup: '售后组', status: StatusEnum.IDLE, isOnline: true }
]

// 当前用户
export const currentUser = {
  id: 'M001',
  agentNo: '8001',
  name: '班长',
  group: '客服一组',
  role: 'monitor'
}

/**
 * 获取座席列表
 */
export const getAgentList = async (
  params?: AgentQueryParams
): Promise<ApiResponse<AgentInfo[]>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let list = [...mockAgents]

  // 工号筛选
  if (params?.agentNo) {
    list = list.filter(agent => agent.agentNo.includes(params.agentNo!))
  }

  // 姓名筛选
  if (params?.name) {
    list = list.filter(agent => agent.name.includes(params.name!))
  }

  // 组筛选
  if (params?.group) {
    list = list.filter(agent => agent.group === params.group)
  }

  // 状态筛选
  if (params?.status) {
    list = list.filter(agent => agent.status === params.status)
  }

  return {
    code: 200,
    message: 'success',
    data: list,
    success: true
  }
}

/**
 * 根据发送范围获取座席
 */
export const getAgentsByRange = async (
  rangeType: string,
  queryParams?: AgentQueryParams
): Promise<ApiResponse<AgentInfo[]>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  let list = [...mockAgents]

  // 根据范围类型筛选
  switch (rangeType) {
    case 'group_agent':
      // 本组座席
      list = list.filter(agent => agent.group === currentUser.group)
      break
    case 'sub_group_agent':
      // 子组座席（非本组但属于子组）
      list = list.filter(agent => agent.group !== currentUser.group && agent.subGroup)
      break
    case 'other_agent':
      // 其它座席（完全不同的组）
      list = list.filter(agent => agent.group !== currentUser.group)
      break
    case 'group_select':
      // 组选择 - 返回所有组
      break
    case 'custom_group':
      // 自定义组 - 返回所有
      break
    default:
      break
  }

  // 应用查询参数
  if (queryParams?.agentNo) {
    list = list.filter(agent => agent.agentNo.includes(queryParams.agentNo!))
  }
  if (queryParams?.name) {
    list = list.filter(agent => agent.name.includes(queryParams.name!))
  }

  return {
    code: 200,
    message: 'success',
    data: list,
    success: true
  }
}

/**
 * 刷新座席状态
 */
export const refreshAgentStatus = async (): Promise<ApiResponse<AgentInfo[]>> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  // 模拟状态变化
  mockAgents.forEach(agent => {
    const random = Math.random()
    if (random > 0.7) {
      // 30%概率状态变化
      const statuses = [StatusEnum.ONLINE, StatusEnum.BUSY, StatusEnum.IDLE, StatusEnum.OFFLINE]
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
      agent.status = newStatus
      agent.isOnline = newStatus !== StatusEnum.OFFLINE
    }
  })

  return {
    code: 200,
    message: '状态已刷新',
    data: mockAgents,
    success: true
  }
}

/**
 * 发布通知
 */
export const publishNotice = async (
  params: NoticePublishParams
): Promise<ApiResponse<{ noticeId: string; sendCount: number }>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  // 模拟发送
  const sendCount = params.targetAgents.length || Math.floor(Math.random() * 10) + 1

  console.log('[通知发布]', {
    title: params.title,
    type: params.noticeType,
    validDays: params.validDays,
    sendToSelf: params.sendToSelf,
    sendRanges: params.sendRanges,
    targetCount: params.targetAgents.length
  })

  return {
    code: 200,
    message: '通知发送成功',
    data: {
      noticeId: 'N' + Date.now(),
      sendCount: params.sendToSelf ? sendCount + 1 : sendCount
    },
    success: true
  }
}

/**
 * 获取组列表
 */
export const getGroupList = async (): Promise<ApiResponse<string[]>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const groups = [...new Set(mockAgents.map(agent => agent.group))]

  return {
    code: 200,
    message: 'success',
    data: groups,
    success: true
  }
}

/**
 * 获取子组列表
 */
export const getSubGroupList = async (): Promise<ApiResponse<string[]>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const subGroups = [...new Set(mockAgents.map(agent => agent.subGroup).filter(Boolean))]

  return {
    code: 200,
    message: 'success',
    data: subGroups as string[],
    success: true
  }
}

// 导出所有mock数据
export const mockData = {
  mockAgents,
  currentUser,
  getAgentList,
  getAgentsByRange,
  refreshAgentStatus,
  publishNotice,
  getGroupList,
  getSubGroupList
}
