/**
 * 通知状态管理 Store
 * @description 使用Vue3响应式系统实现轻量级状态管理，实现三大模块联动
 * @version 1.0.0
 */

import { reactive, computed, readonly } from 'vue'
import type { ReceivedNotice } from '@/components/Settings/NoticeReceive/types/noticeReceive'
import { NoticeStatusEnum, NoticeTypeEnum } from '@/components/Settings/NoticeReceive/types/noticeReceive'
import { 
  getNoticeList, 
  getUnreadCount, 
  markNoticeAsRead, 
  markAllAsRead,
  deleteNotice,
  receiveNewNotice,
  currentUser 
} from '@/components/Settings/NoticeReceive/mock/noticeReceiveMock'
import { ElMessage } from 'element-plus'

// 通知发送参数
export interface SendNotificationParams {
  title: string
  content: string
  validDays: number
  noticeType: NoticeTypeEnum
  sendToSelf: boolean
  sendRanges: string[]
}

// 当前用户信息
export interface UserInfo {
  id: string
  agentNo: string
  name: string
  role: 'agent' | 'monitor' | 'admin'
}

// 创建响应式状态
const state = reactive({
  // 通知列表
  noticeList: [] as ReceivedNotice[],
  
  // 未读通知数量
  unreadCount: 0,
  
  // 当前选中的通知
  currentNotice: null as ReceivedNotice | null,
  
  // 新通知到达标记（用于触发弹窗）
  newNotificationArrived: false,
  
  // 最新通知
  latestNotice: null as ReceivedNotice | null,
  
  // 当前用户信息
  currentUserInfo: {
    id: currentUser.id,
    agentNo: currentUser.agentNo,
    name: currentUser.name,
    role: 'agent' as 'agent' | 'monitor' | 'admin'
  },
  
  // 弹窗显示状态
  popupVisible: false,
  
  // 阅读器显示状态
  readerVisible: false,
  
  // 加载状态
  loading: false
})

// 计算属性
const unreadNotices = computed(() => 
  state.noticeList.filter(n => n.status === NoticeStatusEnum.UNREAD)
)

const readNotices = computed(() => 
  state.noticeList.filter(n => n.status === NoticeStatusEnum.READ)
)

const hasUnread = computed(() => state.unreadCount > 0)

const hasManagePermission = computed(() => 
  state.currentUserInfo.role === 'admin' || state.currentUserInfo.role === 'monitor'
)

// Actions
/**
 * 加载通知列表
 */
const loadNotices = async (page: number = 1, pageSize: number = 20) => {
  state.loading = true
  const res = await getNoticeList({ page, pageSize })
  if (res.success) {
    state.noticeList = res.data.list
  }
  state.loading = false
  return res
}

/**
 * 加载未读数量
 */
const loadUnreadCount = async () => {
  const res = await getUnreadCount()
  if (res.success) {
    state.unreadCount = res.data
  }
  return res
}

/**
 * 发送通知
 */
const sendNotification = async (params: SendNotificationParams) => {
  const res = await receiveNewNotice({
    title: params.title,
    content: params.content,
    senderId: state.currentUserInfo.id,
    senderName: state.currentUserInfo.name,
    senderAgentNo: state.currentUserInfo.agentNo,
    noticeType: params.noticeType,
    validDays: params.validDays,
    isSelf: params.sendToSelf
  })
  
  if (res.success) {
    // 添加到列表
    state.noticeList.unshift(res.data)
    
    // 更新未读数量
    state.unreadCount++
    
    // 设置最新通知
    state.latestNotice = res.data
    
    // 触发新通知标记
    state.newNotificationArrived = true
    
    // 显示弹窗
    state.popupVisible = true
    
    ElMessage.success('通知发送成功')
  }
  
  return res
}

/**
 * 标记通知为已读
 */
const markAsRead = async (noticeId: string) => {
  const res = await markNoticeAsRead({ noticeId })
  
  if (res.success) {
    // 更新列表中的状态
    const notice = state.noticeList.find(n => n.id === noticeId)
    if (notice && notice.status === NoticeStatusEnum.UNREAD) {
      notice.status = NoticeStatusEnum.READ
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    }
    
    // 如果当前选中的通知被标记为已读
    if (state.currentNotice?.id === noticeId) {
      state.currentNotice.status = NoticeStatusEnum.READ
    }
  }
  
  return res
}

/**
 * 标记所有通知为已读
 */
const markAllAsRead = async () => {
  const res = await markAllAsRead()
  
  if (res.success) {
    // 更新所有通知状态
    state.noticeList.forEach(n => {
      if (n.status === NoticeStatusEnum.UNREAD) {
        n.status = NoticeStatusEnum.READ
      }
    })
    
    state.unreadCount = 0
    ElMessage.success(`已将 ${res.data} 条通知标记为已读`)
  }
  
  return res
}

/**
 * 删除通知
 */
const deleteNotification = async (noticeId: string) => {
  const res = await deleteNotice({ noticeId })
  
  if (res.success) {
    // 从列表中移除
    const index = state.noticeList.findIndex(n => n.id === noticeId)
    if (index > -1) {
      const notice = state.noticeList[index]
      if (notice.status === NoticeStatusEnum.UNREAD) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.noticeList.splice(index, 1)
    }
    
    // 如果删除的是当前选中的通知
    if (state.currentNotice?.id === noticeId) {
      state.currentNotice = null
    }
    
    ElMessage.success('删除成功')
  }
  
  return res
}

/**
 * 批量删除通知
 */
const batchDeleteNotifications = async (noticeIds: string[]) => {
  let successCount = 0
  
  for (const id of noticeIds) {
    const res = await deleteNotice({ noticeId: id })
    if (res.success) {
      successCount++
      const index = state.noticeList.findIndex(n => n.id === id)
      if (index > -1) {
        const notice = state.noticeList[index]
        if (notice.status === NoticeStatusEnum.UNREAD) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.noticeList.splice(index, 1)
      }
    }
  }
  
  ElMessage.success(`成功删除 ${successCount} 条通知`)
  return successCount
}

/**
 * 设置当前选中的通知
 */
const setCurrentNotice = (notice: ReceivedNotice | null) => {
  state.currentNotice = notice
}

/**
 * 显示弹窗
 */
const showPopup = () => {
  state.popupVisible = true
}

/**
 * 关闭弹窗
 */
const closePopup = () => {
  state.popupVisible = false
  state.newNotificationArrived = false
}

/**
 * 显示阅读器
 */
const showReader = () => {
  state.readerVisible = true
}

/**
 * 关闭阅读器
 */
const closeReader = () => {
  state.readerVisible = false
}

/**
 * 检查并显示弹窗（如果有未读通知）
 */
const checkAndShowPopup = async () => {
  await loadUnreadCount()
  if (state.unreadCount > 0 && !state.popupVisible && !state.readerVisible) {
    // 获取最新未读通知
    const unreadList = state.noticeList
      .filter(n => n.status === NoticeStatusEnum.UNREAD)
      .sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())
    
    if (unreadList.length > 0) {
      state.latestNotice = unreadList[0]
      state.popupVisible = true
    }
  }
}

/**
 * 更新用户信息
 */
const setUserInfo = (userInfo: UserInfo) => {
  state.currentUserInfo = userInfo
}

/**
 * 初始化Store
 */
const initStore = async () => {
  await loadNotices()
  await loadUnreadCount()
  
  // 如果有未读通知，准备显示弹窗
  if (state.unreadCount > 0) {
    const unreadList = state.noticeList
      .filter(n => n.status === NoticeStatusEnum.UNREAD)
      .sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())
    
    if (unreadList.length > 0) {
      state.latestNotice = unreadList[0]
    }
  }
}

// 导出Store
export const useNotificationStore = () => {
  return {
    // State (readonly)
    noticeList: readonly(state.noticeList),
    unreadCount: readonly(state.unreadCount),
    currentNotice: readonly(state.currentNotice),
    newNotificationArrived: readonly(state.newNotificationArrived),
    latestNotice: readonly(state.latestNotice),
    currentUserInfo: readonly(state.currentUserInfo),
    popupVisible: readonly(state.popupVisible),
    readerVisible: readonly(state.readerVisible),
    loading: readonly(state.loading),
    
    // Computed
    unreadNotices,
    readNotices,
    hasUnread,
    hasManagePermission,
    
    // Actions
    loadNotices,
    loadUnreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    batchDeleteNotifications,
    setCurrentNotice,
    showPopup,
    closePopup,
    showReader,
    closeReader,
    checkAndShowPopup,
    setUserInfo,
    initStore
  }
}
