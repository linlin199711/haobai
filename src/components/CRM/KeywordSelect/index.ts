/**
 * CRM关键词选择模块 - 入口文件
 * @description 统一导出关键词选择相关组件和类型
 * @version 1.0.0
 */

// 导出组件
export { default as KeywordSelectModal } from './KeywordSelectModal.vue'

// 导出类型
export type {
  KeywordItem,
  KeywordQueryParams,
  RegionConfig,
  PermissionConfig,
  RegionType
} from './types/keyword'

export { SortModeEnum } from './types/keyword'

// 导出mock数据
export {
  getKeywordList,
  getRegionList,
  regionConfigs,
  currentUserPermission,
  adminPermission,
  logOperation
} from './mock/keywordMock'
