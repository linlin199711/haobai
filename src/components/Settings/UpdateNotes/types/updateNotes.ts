/**
 * 更新说明类型定义
 */

/** 更新说明记录项 */
export interface UpdateNoteItem {
  /** 唯一标识 */
  id: string
  /** 更新日期 */
  updateDate: string
  /** 功能模块名称 */
  moduleName: string
  /** 更新内容 */
  content: string
  /** 记录创建时间 */
  createTime: string
  /** 最后更新时间 */
  updateTime: string
}

/** 表单数据 */
export interface FormData {
  updateDate: string
  moduleName: string
  content: string
}

/** 服务响应 */
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  message?: string
  sha?: string
}
