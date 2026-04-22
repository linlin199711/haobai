/**
 * 同义关键字管理 - 类型定义
 * @description 同义关键字管理模块所有类型定义
 * @version 1.0.0
 */

/** 状态类型 */
export type SynonymStatus = 'enabled' | 'disabled'

/** 同义关键字项 */
export interface SynonymItem {
  id: string
  name: string
  createTime: string
  status: SynonymStatus
}

/** 销售品关键字与同义关键字关联 */
export interface SynonymKeyword {
  id: string
  mainKeyword: string
  mainKeywordId: string
  synonyms: SynonymItem[]
  status: SynonymStatus
  createTime: string
  updateTime: string
  creator: string
  updater?: string
}

/** 查询参数 */
export interface SynonymKeywordQueryParams {
  mainKeyword?: string
  status?: SynonymStatus
  synonymName?: string
  page: number
  pageSize: number
}

/** 列表响应数据 */
export interface SynonymKeywordListResponse {
  list: SynonymKeyword[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 同义关键字表单数据 */
export interface SynonymKeywordForm {
  id?: string
  mainKeyword: string
  mainKeywordId: string
  synonyms: string[]
  status: SynonymStatus
}

/** 批量添加表单数据 */
export interface BatchSynonymForm {
  mainKeywordIds: string[]
  synonyms: string[]
  status: SynonymStatus
}

/** 导入结果 */
export interface ImportResult {
  success: boolean
  total: number
  successCount: number
  failCount: number
  failReasons?: string[]
}

/** 状态选项 */
export interface StatusOption {
  value: SynonymStatus
  label: string
  type: 'success' | 'danger'
}

/** 销售品关键字选项（用于下拉选择） */
export interface MainKeywordOption {
  id: string
  name: string
  category?: string
}
