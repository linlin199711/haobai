/**
 * CRM关键词选择模块 - 类型定义
 * @description 定义关键词选择相关的类型接口
 * @version 1.0.0
 */

// 地区类型
export type RegionType = 'nanan' | 'jinjiang' | 'shishi' | 'quangang' | 'huian'

// 地区配置
export interface RegionConfig {
  value: RegionType
  label: string
  code: string
}

// 排序模式
export enum SortModeEnum {
  ROTATION = '轮循排名',
  FIXED = '固定排名'
}

// 关键词数据项
export interface KeywordItem {
  /** 唯一标识 */
  id: number
  /** 区域 */
  region: string
  /** 所属商圈 */
  businessDistrict: string
  /** 行业 */
  industry: string
  /** 关键词 */
  keyword: string
  /** 开始时段 */
  startTime: string
  /** 结束时段 */
  endTime: string
  /** 最大销售数量 */
  maxSalesCount: number
  /** 实际销售数量 */
  actualSalesCount: number
  /** 建议售价 */
  suggestedPrice: number
  /** 排序模式 */
  sortMode: SortModeEnum
  /** 是否生效中 */
  isActive: boolean
  /** 是否超售 */
  isOversold: boolean
}

// 查询参数
export interface KeywordQueryParams {
  /** 关键词（模糊查询） */
  keyword?: string
  /** 地区（地市） */
  region?: RegionType
  /** 区县 */
  district?: string
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 排序字段 */
  sortField?: string
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
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
  /** 当前用户地区 */
  userRegion: RegionType
  /** 可查看的地区列表 */
  allowedRegions: RegionType[]
  /** 是否为管理员 */
  isAdmin: boolean
}

// 组件Props
export interface KeywordSelectModalProps {
  /** 是否显示弹窗 */
  modelValue: boolean
  /** 默认选中的关键词ID列表 */
  selectedIds?: number[]
  /** 默认地区 */
  defaultRegion?: RegionType
  /** 权限配置 */
  permission?: PermissionConfig
}

// 组件Events
export interface KeywordSelectModalEvents {
  /** 关闭弹窗 */
  (e: 'update:modelValue', value: boolean): void
  /** 确认选择 */
  (e: 'confirm', selectedItems: KeywordItem[]): void
  /** 取消选择 */
  (e: 'cancel'): void
}
