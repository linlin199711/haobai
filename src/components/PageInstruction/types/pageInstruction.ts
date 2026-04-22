/**
 * 页面说明模块类型定义
 * 完全独立，与业务系统无任何关联
 */

/** 页面说明数据结构 */
export interface PageInstruction {
  /** 页面唯一标识 */
  pageId: string
  /** 页面标题 */
  pageTitle: string
  /** 更新时间 */
  updateTime: string
  /** 富文本内容 */
  content: string
}

/** 页面说明保存请求参数 */
export interface SavePageInstructionParams {
  /** 页面唯一标识 */
  pageId: string
  /** 页面标题 */
  pageTitle: string
  /** 富文本内容 */
  content: string
}

/** 图片上传响应 */
export interface ImageUploadResponse {
  /** 图片URL */
  url: string
  /** 图片名称 */
  name: string
}

/** 服务响应结构 */
export interface ServiceResponse<T = unknown> {
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data?: T
  /** 错误信息 */
  message?: string
}

/** 组件Props */
export interface PageInstructionDrawerProps {
  /** 页面唯一标识 */
  pageId: string
  /** 页面标题 */
  pageTitle: string
}

/** 组件事件 */
export interface PageInstructionDrawerEmits {
  /** 抽屉关闭事件 */
  (e: 'close'): void
  /** 保存成功事件 */
  (e: 'saved', data: PageInstruction): void
}
