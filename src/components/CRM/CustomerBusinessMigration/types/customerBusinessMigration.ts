/**
 * 客户业务迁移模块 - 类型定义
 * 包含所有接口、枚举、类型定义
 */

// ==================== 枚举类型 ====================

/** 业务类型枚举 */
export enum BusinessType {
  ELEGANT = 'elegant',
  BRAND = 'brand',
  REAL_NAME = 'realName',
  TRANSFER = 'transfer',
  SMS = 'sms',
  CARD = 'card',
  DIAL = 'dial'
}

/** 业务类型标签映射 */
export const BusinessTypeLabels: Record<BusinessType, string> = {
  [BusinessType.ELEGANT]: '优推',
  [BusinessType.BRAND]: '广告',
  [BusinessType.REAL_NAME]: '实名',
  [BusinessType.TRANSFER]: '转接',
  [BusinessType.SMS]: '短信',
  [BusinessType.CARD]: '名片',
  [BusinessType.DIAL]: '拍号'
}

/** 客户类型枚举 */
export enum CustomerCategory {
  ENTERPRISE = '企业客户',
  GOVERNMENT = '政府客户',
  INDIVIDUAL = '个人客户'
}

/** 信息来源枚举 */
export enum InfoSource {
  CRM = 'CRM',
  INTERNAL = '内部受理',
  OTHER = '其他'
}

/** 迁移模式枚举 */
export enum MigrationMode {
  BUSINESS_ONLY = 'businessOnly',
  BUSINESS_WITH_NUMBER = 'businessWithNumber'
}

/** 迁移模式标签映射 */
export const MigrationModeLabels: Record<MigrationMode, string> = {
  [MigrationMode.BUSINESS_ONLY]: '迁移业务',
  [MigrationMode.BUSINESS_WITH_NUMBER]: '迁移业务和计费号码'
}

// ==================== 基础实体类型 ====================

/** 客户业务信息 */
export interface CustomerBusiness {
  /** 业务类型 */
  type: BusinessType
  /** 业务名称 */
  name: string
  /** 业务编码 */
  code: string
  /** 生效时间 */
  effectiveTime?: string
  /** 计费号码 */
  billingNumber?: string
}

/** 客户信息 */
export interface CustomerInfo {
  /** 客户ID */
  customerId: string
  /** 客户名称 */
  customerName: string
  /** 电话号码 */
  phoneNumber: string
  /** 客户类型 */
  customerCategory: CustomerCategory
  /** 地区 */
  city: string
  /** 下属地区 */
  district?: string
  /** 行业 */
  industry: string
  /** 信息来源 */
  infoSource: InfoSource
  /** 已受理业务列表 */
  businesses: CustomerBusiness[]
}

// ==================== 筛选条件类型 ====================

/** 源客户筛选条件 */
export interface SourceCustomerQueryParams {
  /** 源客户名称 */
  sourceCustomerName?: string
  /** 源客户ID */
  sourceCustomerId?: string
  /** 源客户号码 */
  sourceCustomerPhone?: string
  /** 地区 */
  city?: string
  /** 是否包含下属地区 */
  includeSubordinate: boolean
}

/** 目标客户筛选条件 */
export interface TargetCustomerQueryParams {
  /** 目标客户名称 */
  targetCustomerName?: string
  /** 目标客户ID */
  targetCustomerId?: string
  /** 目标客户号码 */
  targetCustomerPhone?: string
  /** 地区 */
  city?: string
  /** 是否包含下属地区 */
  includeSubordinate: boolean
}

/** 完整筛选条件 */
export interface MigrationQueryParams extends SourceCustomerQueryParams, TargetCustomerQueryParams {}

// ==================== API请求/响应类型 ====================

/** 业务迁移请求 */
export interface BusinessMigrationRequest {
  /** 源客户ID */
  sourceCustomerId: string
  /** 目标客户ID */
  targetCustomerId: string
  /** 迁移模式 */
  migrationMode: MigrationMode
  /** 要迁移的业务类型列表 */
  businessTypes: BusinessType[]
}

/** 业务冲突检查结果 */
export interface BusinessConflictCheckResult {
  /** 是否存在冲突 */
  hasConflict: boolean
  /** 冲突的业务类型列表 */
  conflictBusinesses: CustomerBusiness[]
  /** 提示信息 */
  message: string
}

/** API通用响应 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// ==================== 组件状态类型 ====================

/** 表格选择状态 */
export interface TableSelectionState {
  /** 当前选中的源客户 */
  selectedSourceCustomer: CustomerInfo | null
  /** 当前选中的目标客户 */
  selectedTargetCustomer: CustomerInfo | null
}

/** 加载状态 */
export interface LoadingState {
  /** 查询加载中 */
  queryLoading: boolean
  /** 迁移加载中 */
  migrationLoading: boolean
  /** 冲突检查加载中 */
  conflictCheckLoading: boolean
}
