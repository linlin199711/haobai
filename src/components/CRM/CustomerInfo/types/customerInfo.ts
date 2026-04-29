/**
 * 客户基础信息模块 - 类型声明文件
 * 包含所有接口、枚举、类型定义
 */

// ==================== 枚举类型 ====================

/** 是否一级客户枚举 */
export enum IsFirstLevel {
  YES = '是',
  NO = '否'
}

/** 客户类别枚举 */
export enum CustomerCategory {
  ENTERPRISE = '企业客户',
  GOVERNMENT = '政府客户',
  INDIVIDUAL = '个人客户'
}

/** 保密性质枚举 */
export enum ConfidentialityLevel {
  YES = '是',
  NO = '否'
}

/** 电话状态/号码状态枚举 */
export enum PhoneStatus {
  IN_USE = '使用',
  DISABLED = '停用'
}

/** 是否有投诉枚举 */
export enum HasComplaint {
  YES = '是',
  NO = '否'
}

/** 客户状态枚举 */
export enum CustomerStatus {
  NORMAL = '正常',
  DISABLED = '已禁用'
}

/** 业务状态枚举 */
export enum BusinessStatus {
  NORMAL = '正常',
  EXPIRED = '已过期',
  CANCELLED = '已注销',
  SUSPENDED = '已暂停'
}

// ==================== 基础实体类型 ====================

/** 地市信息 */
export interface City {
  code: string
  name: string
}

/** 区县信息 */
export interface District {
  code: string
  name: string
  cityCode: string
}

/** 关联意图信息 */
export interface RelatedIntent {
  /** 场景类型 */
  sceneType: string
  /** 意图分类 */
  intentCategory: string
  /** 意图名称 */
  intentName: string
  /** code */
  code: string
}

/** 客户业务信息 */
export interface CustomerBusiness {
  /** 业务ID */
  id: string
  /** 业务类型 */
  productType: string
  /** 业务名称 */
  productName: string
  /** 业务状态 */
  status: string
  /** 提交时间 */
  submitTime: string
  /** 提交人 */
  submitter: string
  /** 业务表单数据 */
  formData?: Record<string, any>
}

/** 完整客户信息（列表展示） */
export interface CustomerInfo {
  /** 序号 */
  index: number
  /** 平台客户编号 */
  platformCustomerNo: string
  /** 客户ID */
  customerId: string
  /** 客户名称 */
  customerName: string
  /** 电话号码 */
  phoneNumber: string
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  /** 保密性质 */
  confidentialityLevel: ConfidentialityLevel
  /** 电话状态 */
  phoneStatus: PhoneStatus
  /** 客户等级 */
  customerLevel: string
  /** 上级客户ID */
  parentCustomerId?: string
  /** 上级客户名称 */
  parentCustomerName?: string
}

/** 客户详情信息 */
export interface CustomerDetail {
  // 第一行
  /** 是否一级客户 */
  isFirstLevel: IsFirstLevel
  /** 上级客户 */
  parentCustomer: string
  /** 客户等级 */
  customerLevel: string
  /** 客户名称 */
  customerName: string
  
  // 第二行
  /** 客户名称编码 */
  customerNameCode: string
  /** 客户ID */
  customerId: string
  /** 平台客户编号 */
  platformCustomerNo: string
  /** 政企组织结构ID */
  govOrgId: string
  
  // 第三行
  /** 区号 */
  areaCode: string
  /** 电话号码 */
  phoneNumber: string
  /** 地市 */
  city: string
  /** 区县 */
  district: string
  
  // 第四行
  /** 电话安装地址 */
  installAddress: string
  /** 简称 */
  shortName: string
  /** 简称编码 */
  shortNameCode: string
  /** 别名 */
  alias: string
  
  // 第五行
  /** 别名编码 */
  aliasCode: string
  /** 客户类别 */
  customerCategory: CustomerCategory
  /** 备注 */
  remark: string
  /** 客户排序 */
  customerSort: string
  
  // 第六行
  /** 保密用户性质 */
  confidentialityLevel: ConfidentialityLevel
  /** 号码状态 */
  numberStatus: PhoneStatus
  /** 是否有投诉 */
  hasComplaint: HasComplaint
  /** 关联词汇 */
  relatedKeywords: string
  
  // 关联信息
  /** 关联意图列表 */
  relatedIntents: RelatedIntent[]
  
  // 业务信息
  /** 客户业务列表 */
  businessList: CustomerBusiness[]
}

// ==================== 查询参数类型 ====================

/** 客户列表查询参数 */
export interface CustomerListQueryParams {
  /** 平台客户编号 */
  platformCustomerNo?: string
  /** 客户ID */
  customerId?: string
  /** 客户名称 */
  customerName?: string
  /** 电话号码 */
  phoneNumber?: string
  /** 地区（地市） */
  city?: string
  /** 保密性质 */
  confidentialityLevel?: string
  /** 电话状态 */
  phoneStatus?: string
  /** 关联词汇 */
  keyword?: string
  /** 是否显示上下级 */
  showHierarchy?: boolean
  /** 页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
}

// ==================== API响应类型 ====================

/** 分页响应数据 */
export interface PageResult<T> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  pages: number
}

/** 通用API响应 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
  /** 是否成功 */
  success: boolean
}

// ==================== 组件Props类型 ====================

/** 客户列表组件Props */
export interface CustomerListProps {
  /** 是否只读模式 - 用于权限控制 */
  readonly?: boolean
}

// ==================== 事件类型 ====================

/** 客户列表事件 */
export interface CustomerListEmits {
  /** 查看客户 */
  (e: 'view', customerId: string): void
  /** 编辑客户 */
  (e: 'edit', customerId: string): void
  /** 删除客户 */
  (e: 'delete', customerId: string): void
  /** 新增客户 */
  (e: 'add'): void
}
