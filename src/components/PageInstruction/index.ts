/**
 * 页面说明组件模块
 * 完全独立，与业务系统无任何关联
 * 数据存储：/page-instruction/{pageId}.json
 */

// 导出组件
export { default as PageInstructionDrawer } from './PageInstructionDrawer.vue'

// 导出类型
export type {
  PageInstruction,
  SavePageInstructionParams,
  ImageUploadResponse,
  ServiceResponse,
  PageInstructionDrawerProps,
  PageInstructionDrawerEmits
} from './types/pageInstruction'

// 导出服务
export {
  getPageInstruction,
  savePageInstruction,
  uploadImage,
  resetToDefault,
  checkPageInstructionExists
} from './service/pageInstructionService'

// 导出默认内容
export {
  DEFAULT_PAGE_CONTENTS,
  getDefaultPageInstruction,
  getDefaultContent
} from './service/defaultContent'
