/**
 * 销售单元信息管理模块 - 类型定义
 * @description 定义销售单元信息管理相关的类型接口
 * @version 2.1.0
 */

// 地区类型（市级）
export type RegionType = 'fuzhou' | 'xiamen' | 'quanzhou' | 'zhangzhou' | 'nanping'

// 区县类型
export type DistrictType = string

// 行业类型
export type IndustryType = 'catering' | 'hotel' | 'medical' | 'education' | 'finance' | 'retail'

// 排序模式
export enum SortModeEnum {
  FIXED = '固定排名',
  EXCLUSIVE = '独家推荐',
  ROTATION = '轮循排名'
}

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

// 级联地区配置项
export interface RegionConfig {
  value: RegionType
  label: string
  children: {
    value: string
    label: string
  }[]
}

// 销售单元数据项
export interface SalesUnitItem {
  /** 唯一标识 */
  id: string
  /** 所属地区（市级） */
  region: RegionType
  /** 所属地区名称（市级） */
  regionName: string
  /** 所属区县 */
  district: string
  /** 所属区县名称 */
  districtName: string
  /** 所属行业 */
  industry: IndustryType
  /** 所属行业名称 */
  industryName: string
  /** 所属关键字 */
  keyword: string
  /** 排序模式 */
  sortMode: SortModeEnum
  /** 最大销售数量 */
  maxSalesCount: number
  /** 建议售价 */
  suggestedPrice: number
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
export interface SalesUnitQueryParams {
  /** 搜索关键词（名称/编码） */
  keyword?: string
  /** 所属地区（市级） */
  region?: RegionType
  /** 所属区县 */
  district?: string
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
export interface SalesUnitFormData {
  /** 唯一标识（编辑时使用） */
  id?: string
  /** 所属地区（市级） */
  region: RegionType
  /** 所属区县 */
  district: string
  /** 所属行业 */
  industry: IndustryType
  /** 所属关键字 */
  keyword: string
  /** 排序模式 */
  sortMode: SortModeEnum
  /** 最大销售数量 */
  maxSalesCount: number
  /** 建议售价 */
  suggestedPrice: number
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
  userRole: 'admin' | 'operator'
  /** 是否为管理员 */
  isAdmin: boolean
}

// 组件Props
export interface SalesUnitManageProps {
  /** 权限配置 */
  permission?: PermissionConfig
}

// 弹窗类型
export type ModalType = 'add' | 'edit'

// 审核弹窗类型
export type AuditModalType = 'audit' | 'view'
