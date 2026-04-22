/**
 * 呼叫中心话务条组件 - 入口文件
 * @description 现代化、高易用性的呼叫中心坐席系统话务条
 * @version 1.0.0
 */

import CallBar from './CallBar.vue'

// 导出组件
export { default as CallBar } from './CallBar.vue'
export { default as TransferDialog } from './components/TransferDialog.vue'
export { default as OutboundDialog } from './components/OutboundDialog.vue'
export { default as IncomingCallDialog } from './components/IncomingCallDialog.vue'
export { default as ConsultDialog } from './components/ConsultDialog.vue'

// 导出类型
export type {
  AgentStatus,
  BusyStatus,
  CallStatus,
  CallInfo,
  AgentInfo,
  PermissionConfig,
  TransferTarget,
  CallRecord,
  UserInfo,
  CallBarProps,
  CallBarEmits,
  ApiResponse,
  PaginationParams,
  PaginationResponse
} from './types'

// 导出组合式函数
export { useCallBar } from './composables/useCallBar'

// 导出API（用于替换为真实接口）
export * as callBarApi from './api/mock'

// 默认导出
export { default } from './CallBar.vue'
