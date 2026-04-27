/**
 * 客户业务信息审核模块 - 类型定义
 * @description 定义客户业务审核相关的类型接口
 * @version 1.0.0
 */

// 审核状态
export enum AuditStatusEnum {
  PENDING = 'pending',      // 未审核
  APPROVED = 'approved',    // 已审核
  CANCELLED = 'cancelled'   // 已注销
}

// 审核状态标签
export const AuditStatusLabels: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.PENDING]: '未审核',
  [AuditStatusEnum.APPROVED]: '已审核',
  [AuditStatusEnum.CANCELLED]: '已注销'
}

// 审核状态颜色
export const AuditStatusColors: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.PENDING]: 'warning',
  [AuditStatusEnum.APPROVED]: 'success',
  [AuditStatusEnum.CANCELLED]: 'info'
}

// 锁定状态
export enum LockStatusEnum {
  UNLOCKED = 'unlocked',    // 未锁定
  LOCKED = 'locked'         // 已锁定
}

// 锁定状态标签
export const LockStatusLabels: Record<LockStatusEnum, string> = {
  [LockStatusEnum.UNLOCKED]: '未锁定',
  [LockStatusEnum.LOCKED]: '已锁定'
}

// 13类销售品类型
export enum ProductTypeEnum {
  PRIORITY_REPORT = 'priority_report',           // 优先报号
  REAL_NAME_QUERY = 'real_name_query',           // 实名查询
  BAISHITONG_A_MONTHLY = 'baishitong_a_monthly', // 百事通加盟（A版）月缴套餐
  BAISHITONG_A = 'baishitong_a',                 // 百事通加盟（A版）
  BAISHITONG_B_MONTHLY = 'baishitong_b_monthly', // 百事通加盟（B版）月缴套餐
  BAISHITONG_B = 'baishitong_b',                 // 百事通加盟（B版）
  QUERY_TRANSFER = 'query_transfer',             // 查询转接
  ENTERPRISE_AD = 'enterprise_ad',               // 企业广告
  WEB_CARD = 'web_card',                         // 网络名片（网百空间）
  SMS_CARD = 'sms_card',                         // 短信名片
  ENTERPRISE_CARD = 'enterprise_card',           // 企业名片
  CALL_CENTER = 'call_center',                   // 呼叫中心
  VOICE_MAIL = 'voice_mail'                      // 语音信箱
}

// 销售品名称映射
export const ProductTypeNames: Record<ProductTypeEnum, string> = {
  [ProductTypeEnum.PRIORITY_REPORT]: '优先报号',
  [ProductTypeEnum.REAL_NAME_QUERY]: '实名查询',
  [ProductTypeEnum.BAISHITONG_A_MONTHLY]: '百事通加盟（A版）月缴套餐',
  [ProductTypeEnum.BAISHITONG_A]: '百事通加盟（A版）',
  [ProductTypeEnum.BAISHITONG_B_MONTHLY]: '百事通加盟（B版）月缴套餐',
  [ProductTypeEnum.BAISHITONG_B]: '百事通加盟（B版）',
  [ProductTypeEnum.QUERY_TRANSFER]: '查询转接',
  [ProductTypeEnum.ENTERPRISE_AD]: '企业广告',
  [ProductTypeEnum.WEB_CARD]: '网络名片（网百空间）',
  [ProductTypeEnum.SMS_CARD]: '短信名片',
  [ProductTypeEnum.ENTERPRISE_CARD]: '企业名片',
  [ProductTypeEnum.CALL_CENTER]: '呼叫中心',
  [ProductTypeEnum.VOICE_MAIL]: '语音信箱'
}

// 信息来源
export enum SourceTypeEnum {
  CRM = 'CRM',
  PF = 'PF',
  MANUAL = 'MANUAL'
}

// 操作类型
export enum OperationTypeEnum {
  CREATE = 'create',
  MODIFY = 'modify',
  CANCEL = 'cancel'
}

// 操作类型名称映射
export const OperationTypeNames: Record<OperationTypeEnum, string> = {
  [OperationTypeEnum.CREATE]: '新增',
  [OperationTypeEnum.MODIFY]: '修改',
  [OperationTypeEnum.CANCEL]: '注销'
}

// 客户基础信息
export interface CustomerInfo {
  id: string
  name: string
  phone: string
  region: string
  industry: string
  source: SourceTypeEnum
  createTime: string
  creatorId: string
  creatorName: string
}

// 业务工单数据
export interface BusinessOrder {
  id: string
  customerId: string
  productType: ProductTypeEnum
  productName: string
  status: AuditStatusEnum
  lockStatus: LockStatusEnum
  operationType: OperationTypeEnum
  formData: Record<string, any>
  createTime: string
  submitter?: string
  submitTime?: string
  auditTime?: string
  auditorId?: string
  auditorName?: string
  auditRemark?: string
}

// 客户业务聚合数据（列表展示用）
export interface CustomerBusinessAggregate {
  customerId: string
  platformCustomerId: string        // 平台客户编号
  customerName: string
  phone: string
  region: string
  industry: string
  source: SourceTypeEnum
  businessTypes: string[]           // 签订业务列表
  lockStatus: LockStatusEnum
  operationType: OperationTypeEnum
  status: AuditStatusEnum
  orderCount: number               // 业务数量
  pendingCount: number             // 待审核数量
  orders: BusinessOrder[]          // 业务工单列表
}

// 查询参数
export interface CustomerAuditQueryParams {
  customerName?: string
  platformCustomerId?: string        // 平台客户编号
  phone?: string
  region?: string
  industry?: string
  auditStatus?: AuditStatusEnum
  lockStatus?: LockStatusEnum
  productType?: ProductTypeEnum
  operationType?: OperationTypeEnum
  source?: SourceTypeEnum
  page: number
  pageSize: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
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
  userId: string
  userRole: 'admin' | 'auditor' | 'operator'
  isAdmin: boolean
  isAuditor: boolean
}

// 表单字段配置
export interface FormFieldConfig {
  key: string
  label: string
  type: 'input' | 'select' | 'radio' | 'time' | 'textarea' | 'number'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  rules?: any[]
}

// 销售品表单配置
export interface ProductFormConfig {
  productType: ProductTypeEnum
  productName: string
  fields: FormFieldConfig[]
}

// 审核表单数据
export interface AuditFormData {
  orderId: string
  result: 'approve' | 'reject'
  remark?: string
}

// 修改表单数据
export interface ModifyFormData {
  orderId: string
  formData: Record<string, any>
}
