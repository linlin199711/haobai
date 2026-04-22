/**
 * 话务条设置模块 - 入口文件
 * @description 导出话务条设置模块的所有组件和类型
 * @version 1.0.0
 */

// 导出主组件
export { default as CallBarSettings } from './CallBarSettings.vue'

// 导出子组件
export { default as AgentSelectDialog } from './components/AgentSelectDialog.vue'
export { default as ForceInsertMonitorPanel } from './components/ForceInsertMonitorPanel.vue'

// 导出类型
export * from './types'

// 导出mock接口（开发调试使用）
export * as callBarSettingsApi from './mock'
