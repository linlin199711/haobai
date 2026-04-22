/**
 * 通知接收模块 - 类型定义
 * @description 定义通知接收相关的类型接口
 * @version 1.0.0
 */

// 通知状态
export enum NoticeStatusEnum {
  UNREAD = 'unread',    // 未读
  READ = 'read'         // 已读
}

// 通知状态标签
export const NoticeStatusLabels: Record<NoticeStatusEnum, string> = {
  [NoticeStatusEnum.UNREAD]: '未读',
  [NoticeStatusEnum.READ]: '已读'
}

// 通知状态颜色
export const NoticeStatusColors: Record<NoticeStatusEnum, string> = {
  [NoticeStatusEnum.UNREAD]: 'danger',
  [NoticeStatusEnum.READ]: 'success'
}

// 通知类型
export enum NoticeTypeEnum {
  MONITOR_NOTICE = 'monitor_notice',     // 班长公告
  SYSTEM_NOTICE = 'system_notice',       // 系统通知
  BUSINESS_NOTICE = 'business_notice'    // 业务通知
}

// 通知类型名称
export const NoticeTypeNames: Record<NoticeTypeEnum, string> = {
  [NoticeTypeEnum.MONITOR_NOTICE]: '班长公告',
  [NoticeTypeEnum.SYSTEM_NOTICE]: '系统通知',
  [NoticeTypeEnum.BUSINESS_NOTICE]: '业务通知'
}

// 通知类型颜色
export const NoticeTypeColors: Record<NoticeTypeEnum, string> = {
  [NoticeTypeEnum.MONITOR_NOTICE]: 'warning',
  [NoticeTypeEnum.SYSTEM_NOTICE]: 'primary',
  [NoticeTypeEnum.BUSINESS_NOTICE]: 'success'
}

// 接收通知数据
export interface ReceivedNotice {
  id: string                    // 通知ID
  title: string                 // 通知标题
  content: string               // 通知内容（富文本）
  senderId: string              // 发送人ID
  senderName: string            // 发送人姓名
  senderAgentNo: string         // 发送人工号
  noticeType: NoticeTypeEnum    // 通知类型
  status: NoticeStatusEnum      // 阅读状态
  sendTime: string              // 发送时间
  validDays: number             // 有效天数
  expireTime: string            // 过期时间
  isSelf: boolean               // 是否是自己发的
}

// 通知查询参数
export interface NoticeQueryParams {
  status?: NoticeStatusEnum     // 状态筛选
  noticeType?: NoticeTypeEnum   // 类型筛选
  page: number
  pageSize: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 标记已读参数
export interface MarkReadParams {
  noticeId: string
}

// 删除通知参数
export interface DeleteNoticeParams {
  noticeId: string
}

// 弹窗配置
export interface PopupConfig {
  title: string
  icon: string
  showMinimize: boolean
  showMaximize: boolean
  showClose: boolean
  alwaysOnTop: boolean
}

// 默认弹窗配置
export const defaultPopupConfig: PopupConfig = {
  title: '号码百事通',
  icon: '/favicon.ico',
  showMinimize: true,
  showMaximize: true,
  showClose: true,
  alwaysOnTop: true
}
