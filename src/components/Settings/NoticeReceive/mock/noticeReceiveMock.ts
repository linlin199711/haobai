/**
 * 通知接收模块 - Mock数据
 * @description 模拟通知接收相关数据
 * @version 1.0.0
 */

import type {
  ReceivedNotice,
  NoticeQueryParams,
  PaginationResult,
  ApiResponse,
  MarkReadParams,
  DeleteNoticeParams
} from '../types/noticeReceive'
import { NoticeStatusEnum, NoticeTypeEnum } from '../types/noticeReceive'

// 当前用户信息
export const currentUser = {
  id: 'A001',
  agentNo: '1001',
  name: '张三'
}

// 模拟接收到的通知数据
let mockNotices: ReceivedNotice[] = [
  {
    id: 'N001',
    title: '系统维护通知',
    content: '<p>尊敬的用户：</p><p>系统将于<strong>今晚22:00-次日02:00</strong>进行例行维护，期间可能影响部分功能使用，请提前做好准备。</p><p>给您带来的不便，敬请谅解。</p>',
    senderId: 'M001',
    senderName: '班长',
    senderAgentNo: '8001',
    noticeType: NoticeTypeEnum.SYSTEM_NOTICE,
    status: NoticeStatusEnum.UNREAD,
    sendTime: '2024-01-15 10:30:00',
    validDays: 3,
    expireTime: '2024-01-18 10:30:00',
    isSelf: false
  },
  {
    id: 'N002',
    title: '业务规范更新',
    content: '<p>各位同事：</p><p>根据最新业务要求，<u>客户信息录入规范</u>已更新，请大家及时查看并按要求执行。</p><p>主要变更内容：</p><p>1. 客户姓名必须填写全称</p><p>2. 联系电话需验证有效性</p><p>3. 地址信息要求详细完整</p>',
    senderId: 'M001',
    senderName: '班长',
    senderAgentNo: '8001',
    noticeType: NoticeTypeEnum.BUSINESS_NOTICE,
    status: NoticeStatusEnum.UNREAD,
    sendTime: '2024-01-15 09:15:00',
    validDays: 7,
    expireTime: '2024-01-22 09:15:00',
    isSelf: false
  },
  {
    id: 'N003',
    title: '班长公告：今日工作重点',
    content: '<p>今日工作重点安排：</p><p><strong>1. 新客户回访</strong> - 优先级：高</p><p><strong>2. 投诉处理跟进</strong> - 优先级：中</p><p><strong>3. 数据录入整理</strong> - 优先级：低</p><p>请各位同事合理安排时间，按时完成任务。</p>',
    senderId: 'M001',
    senderName: '班长',
    senderAgentNo: '8001',
    noticeType: NoticeTypeEnum.MONITOR_NOTICE,
    status: NoticeStatusEnum.READ,
    sendTime: '2024-01-14 08:00:00',
    validDays: 1,
    expireTime: '2024-01-15 08:00:00',
    isSelf: false
  },
  {
    id: 'N004',
    title: '节假日值班安排',
    content: '<p>春节值班安排已出，请大家查看自己的值班时间。</p><p>值班期间请保持通讯畅通，做好交接班记录。</p>',
    senderId: 'M001',
    senderName: '班长',
    senderAgentNo: '8001',
    noticeType: NoticeTypeEnum.MONITOR_NOTICE,
    status: NoticeStatusEnum.READ,
    sendTime: '2024-01-10 14:20:00',
    validDays: 30,
    expireTime: '2024-02-09 14:20:00',
    isSelf: false
  }
]

// 新通知计数器
let noticeIdCounter = 5

/**
 * 清理过期通知
 */
const cleanExpiredNotices = (): void => {
  const now = new Date().getTime()
  mockNotices = mockNotices.filter(notice => {
    const expireTime = new Date(notice.expireTime).getTime()
    return expireTime > now
  })
}

/**
 * 获取通知列表
 */
export const getNoticeList = async (
  params: NoticeQueryParams
): Promise<ApiResponse<PaginationResult<ReceivedNotice>>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  // 清理过期通知
  cleanExpiredNotices()

  let list = [...mockNotices]

  // 状态筛选
  if (params.status) {
    list = list.filter(notice => notice.status === params.status)
  }

  // 类型筛选
  if (params.noticeType) {
    list = list.filter(notice => notice.noticeType === params.noticeType)
  }

  // 按发送时间倒序排列
  list.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

  // 分页
  const total = list.length
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total,
      page: params.page,
      pageSize: params.pageSize
    },
    success: true
  }
}

/**
 * 获取未读通知数量
 */
export const getUnreadCount = async (): Promise<ApiResponse<number>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  // 清理过期通知
  cleanExpiredNotices()

  const count = mockNotices.filter(n => n.status === NoticeStatusEnum.UNREAD).length

  return {
    code: 200,
    message: 'success',
    data: count,
    success: true
  }
}

/**
 * 获取最新未读通知（用于弹窗）
 */
export const getLatestUnreadNotice = async (): Promise<ApiResponse<ReceivedNotice | null>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  // 清理过期通知
  cleanExpiredNotices()

  const unreadNotices = mockNotices
    .filter(n => n.status === NoticeStatusEnum.UNREAD)
    .sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

  const latestNotice = unreadNotices.length > 0 ? unreadNotices[0] : null

  return {
    code: 200,
    message: 'success',
    data: latestNotice,
    success: true
  }
}

/**
 * 标记通知为已读
 */
export const markNoticeAsRead = async (
  params: MarkReadParams
): Promise<ApiResponse<boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const index = mockNotices.findIndex(n => n.id === params.noticeId)
  if (index === -1) {
    return {
      code: 404,
      message: '通知不存在',
      data: false,
      success: false
    }
  }

  mockNotices[index] = {
    ...mockNotices[index],
    status: NoticeStatusEnum.READ
  }

  return {
    code: 200,
    message: '标记已读成功',
    data: true,
    success: true
  }
}

/**
 * 标记所有通知为已读
 */
export const markAllAsRead = async (): Promise<ApiResponse<number>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let count = 0
  mockNotices = mockNotices.map(notice => {
    if (notice.status === NoticeStatusEnum.UNREAD) {
      count++
      return { ...notice, status: NoticeStatusEnum.READ }
    }
    return notice
  })

  return {
    code: 200,
    message: '全部标记已读成功',
    data: count,
    success: true
  }
}

/**
 * 删除通知
 */
export const deleteNotice = async (
  params: DeleteNoticeParams
): Promise<ApiResponse<boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const index = mockNotices.findIndex(n => n.id === params.noticeId)
  if (index === -1) {
    return {
      code: 404,
      message: '通知不存在',
      data: false,
      success: false
    }
  }

  // 只允许删除已读通知
  if (mockNotices[index].status === NoticeStatusEnum.UNREAD) {
    return {
      code: 403,
      message: '未读通知不能删除',
      data: false,
      success: false
    }
  }

  mockNotices.splice(index, 1)

  return {
    code: 200,
    message: '删除成功',
    data: true,
    success: true
  }
}

/**
 * 接收新通知（模拟推送）
 */
export const receiveNewNotice = async (
  notice: Omit<ReceivedNotice, 'id' | 'status' | 'sendTime' | 'expireTime'>
): Promise<ApiResponse<ReceivedNotice>> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  const now = new Date()
  const expireTime = new Date(now.getTime() + notice.validDays * 24 * 60 * 60 * 1000)

  const newNotice: ReceivedNotice = {
    ...notice,
    id: `N${String(noticeIdCounter++).padStart(3, '0')}`,
    status: NoticeStatusEnum.UNREAD,
    sendTime: now.toLocaleString('zh-CN'),
    expireTime: expireTime.toLocaleString('zh-CN')
  }

  mockNotices.unshift(newNotice)

  console.log('[新通知到达]', newNotice.title)

  return {
    code: 200,
    message: '接收成功',
    data: newNotice,
    success: true
  }
}

/**
 * 模拟接收新通知（用于测试）
 */
export const simulateNewNotice = async (): Promise<ApiResponse<ReceivedNotice>> => {
  const testNotice = {
    title: '测试通知 - ' + new Date().toLocaleTimeString(),
    content: '<p>这是一条测试通知内容。</p><p>发送时间：' + new Date().toLocaleString() + '</p>',
    senderId: 'M001',
    senderName: '班长',
    senderAgentNo: '8001',
    noticeType: NoticeTypeEnum.SYSTEM_NOTICE,
    validDays: 3,
    isSelf: false
  }

  return receiveNewNotice(testNotice)
}

// 导出所有mock数据
export const mockData = {
  mockNotices,
  currentUser,
  getNoticeList,
  getUnreadCount,
  getLatestUnreadNotice,
  markNoticeAsRead,
  markAllAsRead,
  deleteNotice,
  receiveNewNotice,
  simulateNewNotice
}
