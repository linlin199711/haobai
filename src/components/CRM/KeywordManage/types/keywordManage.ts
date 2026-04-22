/**
 * 销售品关键字管理模块 - 类型定义
 * @description 定义销售品关键字管理相关的类型接口
 * @version 2.0.0
 */

// 用户角色类型
export type UserRole = 'admin' | 'operator'

// 审核状态
export enum AuditStatusEnum {
  PENDING = 'pending',      // 待审核
  APPROVED = 'approved',    // 已通过
  REJECTED = 'rejected'     // 已驳回
}

// 审核状态标签
export const AuditStatusLabels: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.PENDING]: '待审核',
  [AuditStatusEnum.APPROVED]: '已通过',
  [AuditStatusEnum.REJECTED]: '已驳回'
}

// 审核状态颜色
export const AuditStatusColors: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.PENDING]: 'warning',
  [AuditStatusEnum.APPROVED]: 'success',
  [AuditStatusEnum.REJECTED]: 'danger'
}

// 关键字数据项
export interface KeywordItem {
  /** 唯一标识 */
  id: string
  /** 关键字名称 */
  name: string
  /** 关键字编码 */
  code: string
  /** 关键字说明 */
  description: string
  /** 审核状态 */
  auditStatus: AuditStatusEnum
  /** 审核人ID */
  auditorId?: string
  /** 审核人名称 */
  auditorName?: string
  /** 审核时间 */
  auditTime?: string
  /** 审核备注 */
  auditRemark?: string
  /** 创建时间 */
  createTime: string
  /** 创建人ID */
  creatorId: string
  /** 创建人名称 */
  creatorName: string
}

// 查询参数
export interface KeywordQueryParams {
  /** 搜索关键词（名称/编码） */
  keyword?: string
  /** 审核状态筛选 */
  auditStatus?: AuditStatusEnum
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 新增/编辑表单数据
export interface KeywordFormData {
  /** 唯一标识（编辑时使用） */
  id?: string
  /** 关键字名称 */
  name: string
  /** 关键字编码 */
  code: string
  /** 关键字说明 */
  description: string
}

// 审核表单数据
export interface AuditFormData {
  /** 记录ID */
  id: string
  /** 审核结果：通过/驳回 */
  result: 'approve' | 'reject'
  /** 审核备注 */
  remark?: string
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 权限配置
export interface PermissionConfig {
  /** 当前用户ID */
  userId: string
  /** 当前用户角色 */
  userRole: UserRole
  /** 是否为管理员 */
  isAdmin: boolean
}

// 组件Props
export interface KeywordManageProps {
  /** 权限配置 */
  permission?: PermissionConfig
}

// 弹窗类型
export type ModalType = 'add' | 'edit'

// 审核弹窗类型
export type AuditModalType = 'audit' | 'view'
