/**
 * 通知接收模块 - 入口文件
 * @description 导出通知接收相关组件和类型
 * @version 1.0.0
 */

// 导出组件
export { default as NoticePopup } from './components/NoticePopup.vue'
export { default as NoticeReader } from './components/NoticeReader.vue'

// 导出类型
export * from './types/noticeReceive'

// 导出mock数据
export * from './mock/noticeReceiveMock'
