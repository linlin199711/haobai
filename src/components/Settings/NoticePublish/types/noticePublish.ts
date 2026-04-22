/**
 * 通知管理发布页 - 类型定义
 * @description 定义通知发布相关的类型接口
 * @version 1.0.0
 */

// 发送范围标签类型
export enum SendRangeTabEnum {
  GROUP_AGENT = 'group_agent',           // 本组座席
  SUB_GROUP_AGENT = 'sub_group_agent',   // 子组座席
  OTHER_AGENT = 'other_agent',           // 其它座席
  GROUP_SELECT = 'group_select',         // 组选择
  CUSTOM_GROUP = 'custom_group',         // 自定义组
  NOTICE_CONTENT = 'notice_content'      // 通知内容
}

// 发送范围标签名称
export const SendRangeTabNames: Record<SendRangeTabEnum, string> = {
  [SendRangeTabEnum.GROUP_AGENT]: '本组座席',
  [SendRangeTabEnum.SUB_GROUP_AGENT]: '子组座席',
  [SendRangeTabEnum.OTHER_AGENT]: '其它座席',
  [SendRangeTabEnum.GROUP_SELECT]: '组选择',
  [SendRangeTabEnum.CUSTOM_GROUP]: '自定义组',
  [SendRangeTabEnum.NOTICE_CONTENT]: '通知内容'
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

// 座席状态
export enum AgentStatusEnum {
  ONLINE = 'online',       // 在线
  OFFLINE = 'offline',     // 离线
  BUSY = 'busy',           // 示忙
  IDLE = 'idle'            // 示闲
}

// 座席状态标签
export const AgentStatusLabels: Record<AgentStatusEnum, string> = {
  [AgentStatusEnum.ONLINE]: '在线',
  [AgentStatusEnum.OFFLINE]: '离线',
  [AgentStatusEnum.BUSY]: '示忙',
  [AgentStatusEnum.IDLE]: '示闲'
}

// 座席信息
export interface AgentInfo {
  id: string
  agentNo: string          // 工号
  name: string             // 姓名
  group: string            // 所属组
  subGroup?: string        // 子组
  status: AgentStatusEnum  // 状态
  isOnline: boolean        // 是否在线
}

// 发送范围选项
export interface SendRangeOption {
  key: string
  label: string
  checked: boolean
}

// 通知表单数据
export interface NoticeFormData {
  title: string            // 通知标题
  validDays: number        // 有效天数
  noticeType: NoticeTypeEnum  // 通知类型
  content: string          // 通知内容（富文本）
  sendToSelf: boolean      // 同时发给自己
  sendRanges: string[]     // 发送范围选项
  selectedAgents: string[] // 选中的座席ID列表
}

// 通知发布参数
export interface NoticePublishParams {
  title: string
  content: string
  validDays: number
  noticeType: NoticeTypeEnum
  sendToSelf: boolean
  sendRanges: string[]
  targetAgents: string[]
}

// 查询参数
export interface AgentQueryParams {
  agentNo?: string         // 工号
  name?: string            // 姓名
  group?: string           // 组
  status?: AgentStatusEnum // 状态
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 富文本编辑器配置
export interface EditorConfig {
  placeholder?: string
  maxLength?: number
  toolbar: string[]
}

// 默认编辑器配置
export const defaultEditorConfig: EditorConfig = {
  placeholder: '请输入通知内容...',
  maxLength: 2000,
  toolbar: [
    'bold',          // 加粗
    'italic',        // 斜体
    'underline',     // 下划线
    '|',
    'alignLeft',     // 左对齐
    'alignCenter',   // 居中对齐
    'alignRight',    // 右对齐
    '|',
    'foreColor',     // 字体颜色
    'backColor',     // 背景颜色
    '|',
    'undo',          // 撤销
    'redo'           // 重做
  ]
}

// 发送范围复选框选项
export const sendRangeOptions: SendRangeOption[] = [
  { key: 'online_all', label: '发给所有在线座席', checked: false },
  { key: 'group_offline', label: '本组非在线', checked: false },
  { key: 'subgroup_offline', label: '子组非在线', checked: false },
  { key: 'other_offline', label: '其它组非在线', checked: false }
]
