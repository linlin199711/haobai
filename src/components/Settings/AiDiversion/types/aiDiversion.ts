/**
 * AI 接话分流管理模块 - 类型定义
 * @description 定义 AI 接话分流规则相关的类型接口
 * @version 1.0.0
 */

// ==================== 枚举类型 ====================

/** 分流类型 */
export enum DiversionTypeEnum {
  /** 全时段生效 */
  ALL_TIME = 'allTime',
  /** 时段性生效 */
  TIME_PERIOD = 'timePeriod'
}

/** 分流类型标签 */
export const DiversionTypeLabels: Record<DiversionTypeEnum, string> = {
  [DiversionTypeEnum.ALL_TIME]: '全时段生效',
  [DiversionTypeEnum.TIME_PERIOD]: '时段性生效'
}

/** 使用状态 */
export enum UseStatusEnum {
  /** 启用 */
  ENABLED = 'enabled',
  /** 禁用 */
  DISABLED = 'disabled'
}

/** 使用状态标签 */
export const UseStatusLabels: Record<UseStatusEnum, string> = {
  [UseStatusEnum.ENABLED]: '启用',
  [UseStatusEnum.DISABLED]: '禁用'
}

/** 地市编码 */
export type CityCode = 
  | 'fujian' // 福建全省
  | 'fuzhou' // 福州
  | 'xiamen' // 厦门
  | 'quanzhou' // 泉州
  | 'zhangzhou' // 漳州
  | 'nanping' // 南平
  | 'sanming' // 三明
  | 'longyan' // 龙岩
  | 'ningde' // 宁德
  | 'putian' // 莆田

/** 地市配置 */
export interface CityConfig {
  code: CityCode
  name: string
}

/** 福建全省地市列表 */
export const FUJIAN_CITIES: CityConfig[] = [
  { code: 'fuzhou', name: '福州' },
  { code: 'xiamen', name: '厦门' },
  { code: 'quanzhou', name: '泉州' },
  { code: 'zhangzhou', name: '漳州' },
  { code: 'nanping', name: '南平' },
  { code: 'sanming', name: '三明' },
  { code: 'longyan', name: '龙岩' },
  { code: 'ningde', name: '宁德' },
  { code: 'putian', name: '莆田' }
]

// ==================== 数据模型 ====================

/** AI 分流规则数据项 */
export interface AiDiversionRule {
  /** 唯一标识 */
  id: string
  /** 接话地市编码 */
  cityCode: CityCode
  /** 接话地市名称 */
  cityName: string
  /** 分流类型 */
  diversionType: DiversionTypeEnum
  /** 分流类型名称 */
  diversionTypeName: string
  /** 生效开始时间（HH:mm 格式，仅时段性生效时有值） */
  startTime?: string
  /** 生效结束时间（HH:mm 格式，仅时段性生效时有值） */
  endTime?: string
  /** 使用状态 */
  useStatus: UseStatusEnum
  /** 创建时间 */
  createTime: string
  /** 创建人ID */
  creatorId: string
  /** 创建人名称 */
  creatorName: string
  /** 最后操作时间 */
  updateTime: string
  /** 操作人ID */
  operatorId: string
  /** 操作人名称 */
  operatorName: string
}

/** 生效情况显示文本 */
export interface EffectInfo {
  /** 是否跨天 */
  isCrossDay: boolean
  /** 显示文本 */
  displayText: string
  /** 跨天说明 */
  crossDayNote?: string
}

// ==================== 查询参数 ====================

/** 查询参数 */
export interface QueryParams {
  /** 接话地市（多选） */
  cityCodes?: CityCode[]
  /** 分流类型（单选） */
  diversionType?: DiversionTypeEnum | ''
  /** 使用状态（单选） */
  useStatus?: UseStatusEnum | ''
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

// ==================== 表单数据 ====================

/** 新增/编辑表单数据 */
export interface FormData {
  /** 唯一标识（编辑时使用） */
  id?: string
  /** 接话地市（单选） */
  cityCode: CityCode | ''
  /** 分流类型 */
  diversionType: DiversionTypeEnum
  /** 生效开始时间 */
  startTime?: string
  /** 生效结束时间 */
  endTime?: string
}

// ==================== 分页结果 ====================

/** 分页结果 */
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ==================== API 响应 ====================

/** API 响应结构 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// ==================== 权限配置 ====================

/** 用户角色 */
export type UserRole = 'admin' | 'cityAdmin' | 'agent'

/** 权限配置 */
export interface PermissionConfig {
  /** 当前用户ID */
  userId: string
  /** 当前用户角色 */
  userRole: UserRole
  /** 是否全省管理员 */
  isAdmin: boolean
  /** 是否地市管理员 */
  isCityAdmin: boolean
  /** 所属地市（地市管理员必填） */
  cityCode?: CityCode
}

// ==================== 组件 Props ====================

/** 主组件 Props */
export interface AiDiversionManageProps {
  /** 权限配置 */
  permission?: PermissionConfig
}

/** 弹窗类型 */
export type ModalType = 'add' | 'edit' | 'view'
