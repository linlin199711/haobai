/**
 * 销售品关键字管理模块 - 入口文件
 * @description 统一导出销售品关键字管理相关组件和类型
 * @version 1.0.0
 */

// 导出页面组件
export { default as KeywordManage } from './KeywordManage.vue'

// 导出弹窗组件
export { default as KeywordFormDialog } from './components/KeywordFormDialog.vue'

// 导出类型
export type {
  KeywordItem,
  KeywordQueryParams,
  KeywordFormData,
  PermissionConfig,
  ModalType
} from './types/keywordManage'

// 导出 mock 数据
export {
  getKeywordList,
  addKeyword,
  updateKeyword,
  deleteKeyword,
  batchDeleteKeyword,
  currentUserPermission,
  adminPermission,
  logOperation
} from './mock/keywordManageMock'
