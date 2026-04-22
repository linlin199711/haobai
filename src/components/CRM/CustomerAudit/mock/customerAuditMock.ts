/**
 * 客户业务信息审核模块 - Mock数据
 * @description 模拟客户业务审核数据
 * @version 1.0.0
 */

import type {
  CustomerInfo,
  BusinessOrder,
  CustomerBusinessAggregate,
  CustomerAuditQueryParams,
  PaginationResult,
  ApiResponse,
  PermissionConfig,
  AuditFormData,
  ModifyFormData
} from '../types/customerAudit'
import { AuditStatusEnum, LockStatusEnum, ProductTypeEnum, SourceTypeEnum, OperationTypeEnum, ProductTypeNames, OperationTypeNames } from '../types/customerAudit'

// 当前用户权限配置
export const currentUserPermission: PermissionConfig = {
  userId: 'A001',
  userRole: 'auditor',
  isAdmin: false,
  isAuditor: true
}

// 管理员权限配置
export const adminPermission: PermissionConfig = {
  userId: 'ADMIN',
  userRole: 'admin',
  isAdmin: true,
  isAuditor: true
}

// 模拟客户数据
const mockCustomers: CustomerInfo[] = [
  {
    id: 'C001',
    name: '泉州市公交集团有限责任公司',
    phone: '0595-22284894',
    region: '泉州市',
    industry: '交通运输',
    source: SourceTypeEnum.CRM,
    createTime: '2024-01-15 10:30:00',
    creatorId: 'A001',
    creatorName: '张三'
  },
  {
    id: 'C002',
    name: '晋江市益盛塑胶有限公司',
    phone: '059588182710',
    region: '泉州市',
    industry: '制造业',
    source: SourceTypeEnum.CRM,
    createTime: '2024-01-16 14:20:00',
    creatorId: 'A002',
    creatorName: '李四'
  },
  {
    id: 'C003',
    name: '壳氏(福建)环保科技有限公司',
    phone: '0595-28070758',
    region: '泉州市',
    industry: '环保科技',
    source: SourceTypeEnum.CRM,
    createTime: '2024-01-18 09:15:00',
    creatorId: 'A001',
    creatorName: '张三'
  },
  {
    id: 'C004',
    name: '德化县妇幼保健院',
    phone: '0595-23522428',
    region: '泉州市',
    industry: '医疗卫生',
    source: SourceTypeEnum.CRM,
    createTime: '2024-01-20 16:45:00',
    creatorId: 'A003',
    creatorName: '王五'
  },
  {
    id: 'C005',
    name: '石狮市第三实验幼儿园',
    phone: '0595-88713909',
    region: '泉州市',
    industry: '教育',
    source: SourceTypeEnum.CRM,
    createTime: '2024-01-22 11:30:00',
    creatorId: 'A001',
    creatorName: '张三'
  }
]

// 模拟业务工单数据
let mockOrders: BusinessOrder[] = [
  // 泉州市公交集团 - 3个业务
  {
    id: 'O001',
    customerId: 'C001',
    productType: ProductTypeEnum.QUERY_TRANSFER,
    productName: ProductTypeNames[ProductTypeEnum.QUERY_TRANSFER],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      transferNumber1: '0595-22284894',
      transferNumber2: '',
      transferNumber3: '',
      transferTimeStart: '00:00',
      transferTimeEnd: '23:59',
      showCallerId: 'show_customer'
    },
    createTime: '2024-01-15 10:30:00',
    submitter: '张三',
    submitTime: '2024-01-15 10:30:00'
  },
  {
    id: 'O002',
    customerId: 'C001',
    productType: ProductTypeEnum.SMS_CARD,
    productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      smsContent: '欢迎乘坐泉州公交，服务热线：0595-22284894',
      smsType: 'welcome'
    },
    createTime: '2024-01-15 11:00:00',
    submitter: '张三',
    submitTime: '2024-01-15 11:00:00'
  },
  {
    id: 'O003',
    customerId: 'C001',
    productType: ProductTypeEnum.REAL_NAME_QUERY,
    productName: ProductTypeNames[ProductTypeEnum.REAL_NAME_QUERY],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      realName1: '泉州经济技术开发区公交',
      realNameCode1: '',
      realName2: '',
      realNameCode2: '',
      realName3: '',
      realNameCode3: ''
    },
    createTime: '2024-01-15 11:30:00',
    submitter: '张三',
    submitTime: '2024-01-15 11:30:00'
  },
  // 晋江市益盛塑胶 - 1个业务
  {
    id: 'O004',
    customerId: 'C002',
    productType: ProductTypeEnum.SMS_CARD,
    productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      smsContent: '晋江市益盛塑胶有限公司感谢您的来电',
      smsType: 'welcome'
    },
    createTime: '2024-01-16 14:20:00',
    submitter: '李四',
    submitTime: '2024-01-16 14:20:00'
  },
  // 壳氏环保 - 3个业务
  {
    id: 'O005',
    customerId: 'C003',
    productType: ProductTypeEnum.QUERY_TRANSFER,
    productName: ProductTypeNames[ProductTypeEnum.QUERY_TRANSFER],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      transferNumber1: '0595-28070758',
      transferNumber2: '',
      transferNumber3: '',
      transferTimeStart: '08:30',
      transferTimeEnd: '17:30',
      showCallerId: 'show_customer'
    },
    createTime: '2024-01-18 09:15:00',
    submitter: '张三',
    submitTime: '2024-01-18 09:15:00'
  },
  {
    id: 'O006',
    customerId: 'C003',
    productType: ProductTypeEnum.SMS_CARD,
    productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      smsContent: '壳氏环保，让地球更美好',
      smsType: 'welcome'
    },
    createTime: '2024-01-18 09:30:00',
    submitter: '张三',
    submitTime: '2024-01-18 09:30:00'
  },
  {
    id: 'O007',
    customerId: 'C003',
    productType: ProductTypeEnum.REAL_NAME_QUERY,
    productName: ProductTypeNames[ProductTypeEnum.REAL_NAME_QUERY],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      realName1: '壳氏环保科技',
      realNameCode1: '',
      realName2: '',
      realNameCode2: '',
      realName3: '',
      realNameCode3: ''
    },
    createTime: '2024-01-18 10:00:00',
    submitter: '张三',
    submitTime: '2024-01-18 10:00:00'
  },
  // 德化县妇幼保健院 - 1个业务
  {
    id: 'O008',
    customerId: 'C004',
    productType: ProductTypeEnum.SMS_CARD,
    productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      smsContent: '德化县妇幼保健院祝您健康',
      smsType: 'welcome'
    },
    createTime: '2024-01-20 16:45:00',
    submitter: '王五',
    submitTime: '2024-01-20 16:45:00'
  },
  // 石狮市第三实验幼儿园 - 1个业务
  {
    id: 'O009',
    customerId: 'C005',
    productType: ProductTypeEnum.SMS_CARD,
    productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
    status: AuditStatusEnum.PENDING,
    lockStatus: LockStatusEnum.UNLOCKED,
    operationType: OperationTypeEnum.CREATE,
    formData: {
      smsContent: '石狮市第三实验幼儿园欢迎您的咨询',
      smsType: 'welcome'
    },
    createTime: '2024-01-22 11:30:00',
    submitter: '张三',
    submitTime: '2024-01-22 11:30:00'
  }
]

// ID计数器
let orderIdCounter = 10

/**
 * 聚合客户业务数据
 */
const aggregateCustomerBusiness = (): CustomerBusinessAggregate[] => {
  const aggregateMap = new Map<string, CustomerBusinessAggregate>()

  mockCustomers.forEach(customer => {
    const customerOrders = mockOrders.filter(order => order.customerId === customer.id)
    if (customerOrders.length === 0) return

    const pendingCount = customerOrders.filter(o => o.status === AuditStatusEnum.PENDING).length
    const approvedCount = customerOrders.filter(o => o.status === AuditStatusEnum.APPROVED).length
    const cancelledCount = customerOrders.filter(o => o.status === AuditStatusEnum.CANCELLED).length

    // 确定整体状态
    let overallStatus = AuditStatusEnum.APPROVED
    if (pendingCount > 0) {
      overallStatus = AuditStatusEnum.PENDING
    } else if (cancelledCount > 0 && approvedCount === 0) {
      overallStatus = AuditStatusEnum.CANCELLED
    }

    // 确定锁定状态
    const hasLocked = customerOrders.some(o => o.lockStatus === LockStatusEnum.LOCKED)

    aggregateMap.set(customer.id, {
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      region: customer.region,
      industry: customer.industry,
      source: customer.source,
      businessTypes: customerOrders.map(o => o.productName),
      lockStatus: hasLocked ? LockStatusEnum.LOCKED : LockStatusEnum.UNLOCKED,
      operationType: customerOrders[0].operationType,
      status: overallStatus,
      orderCount: customerOrders.length,
      pendingCount,
      orders: customerOrders
    })
  })

  return Array.from(aggregateMap.values())
}

/**
 * 获取客户业务审核列表
 */
export const getCustomerAuditList = async (
  params: CustomerAuditQueryParams,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<PaginationResult<CustomerBusinessAggregate>>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let list = aggregateCustomerBusiness()

  // 客户名称筛选
  if (params.customerName) {
    const keyword = params.customerName.toLowerCase()
    list = list.filter(item => item.customerName.toLowerCase().includes(keyword))
  }

  // 电话筛选
  if (params.phone) {
    list = list.filter(item => item.phone.includes(params.phone!))
  }

  // 地区筛选
  if (params.region) {
    list = list.filter(item => item.region === params.region)
  }

  // 行业筛选
  if (params.industry) {
    list = list.filter(item => item.industry === params.industry)
  }

  // 审核状态筛选
  if (params.auditStatus) {
    list = list.filter(item => item.status === params.auditStatus)
  }

  // 锁定状态筛选
  if (params.lockStatus) {
    list = list.filter(item => item.lockStatus === params.lockStatus)
  }

  // 业务类型筛选
  if (params.productType) {
    const productName = ProductTypeNames[params.productType]
    list = list.filter(item => item.businessTypes.includes(productName))
  }

  // 分页
  const total = list.length
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total,
      page: params.page,
      pageSize: params.pageSize
    },
    success: true
  }
}

/**
 * 获取客户详情
 */
export const getCustomerDetail = async (
  customerId: string
): Promise<ApiResponse<{ customer: CustomerInfo; orders: BusinessOrder[] }>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const customer = mockCustomers.find(c => c.id === customerId)
  if (!customer) {
    return {
      code: 404,
      message: '客户不存在',
      data: null as any,
      success: false
    }
  }

  const orders = mockOrders.filter(o => o.customerId === customerId)

  return {
    code: 200,
    message: 'success',
    data: { customer, orders },
    success: true
  }
}

/**
 * 获取业务工单详情
 */
export const getOrderDetail = async (
  orderId: string
): Promise<ApiResponse<BusinessOrder>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const order = mockOrders.find(o => o.id === orderId)
  if (!order) {
    return {
      code: 404,
      message: '工单不存在',
      data: null as any,
      success: false
    }
  }

  return {
    code: 200,
    message: 'success',
    data: order,
    success: true
  }
}

/**
 * 审核业务工单
 */
export const auditOrder = async (
  data: AuditFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<BusinessOrder>> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!permission.isAdmin && !permission.isAuditor) {
    return {
      code: 403,
      message: '无权审核',
      data: null as any,
      success: false
    }
  }

  const index = mockOrders.findIndex(o => o.id === data.orderId)
  if (index === -1) {
    return {
      code: 404,
      message: '工单不存在',
      data: null as any,
      success: false
    }
  }

  mockOrders[index] = {
    ...mockOrders[index],
    status: data.result === 'approve' ? AuditStatusEnum.APPROVED : AuditStatusEnum.CANCELLED,
    auditTime: new Date().toLocaleString('zh-CN'),
    auditorId: permission.userId,
    auditorName: permission.isAdmin ? '管理员' : '审核员',
    auditRemark: data.remark
  }

  return {
    code: 200,
    message: data.result === 'approve' ? '审核通过' : '审核驳回',
    data: mockOrders[index],
    success: true
  }
}

/**
 * 修改业务工单
 */
export const modifyOrder = async (
  data: ModifyFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<BusinessOrder>> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const index = mockOrders.findIndex(o => o.id === data.orderId)
  if (index === -1) {
    return {
      code: 404,
      message: '工单不存在',
      data: null as any,
      success: false
    }
  }

  mockOrders[index] = {
    ...mockOrders[index],
    formData: data.formData,
    status: AuditStatusEnum.PENDING,
    operationType: OperationTypeEnum.MODIFY
  }

  return {
    code: 200,
    message: '修改成功',
    data: mockOrders[index],
    success: true
  }
}

/**
 * 注销业务工单
 */
export const cancelOrder = async (
  orderId: string,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const index = mockOrders.findIndex(o => o.id === orderId)
  if (index === -1) {
    return {
      code: 404,
      message: '工单不存在',
      data: false,
      success: false
    }
  }

  mockOrders[index] = {
    ...mockOrders[index],
    status: AuditStatusEnum.CANCELLED,
    operationType: OperationTypeEnum.CANCEL
  }

  return {
    code: 200,
    message: '注销成功',
    data: true,
    success: true
  }
}

/**
 * 记录操作日志
 */
export const logOperation = (operation: string, content: string): void => {
  console.log(`[客户业务审核日志] ${new Date().toISOString()} - ${operation}: ${content}`)
}

// 导出所有mock数据
export const mockData = {
  mockCustomers,
  mockOrders,
  currentUserPermission,
  adminPermission,
  getCustomerAuditList,
  getCustomerDetail,
  getOrderDetail,
  auditOrder,
  modifyOrder,
  cancelOrder,
  logOperation
}
