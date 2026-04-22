/**
 * 录音回放模块 - 入口文件
 * @description 导出录音回放模块的所有组件和类型
 * @version 1.0.0
 */

// 导出主组件
export { default as RecordingPlaybackModule } from './RecordingPlaybackModule.vue'

// 导出子组件
export { default as RecordQueryPanel } from './components/RecordQueryPanel.vue'
export { default as RecordList } from './components/RecordList.vue'
export { default as RecordPlayer } from './components/RecordPlayer.vue'
export { default as RecordDetailDialog } from './components/RecordDetailDialog.vue'

// 导出类型
export * from './types'

// 导出mock接口
export * as recordingMock from './mock'
