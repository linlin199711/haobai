/**
 * 客户业务迁移模块 - Mock数据
 * 提供源客户和目标客户的模拟数据，用于测试业务冲突校验逻辑
 */

import {
  CustomerInfo,
  CustomerBusiness,
  BusinessType,
  CustomerCategory,
  InfoSource,
  BusinessConflictCheckResult
} from '../types/customerBusinessMigration'

// ==================== 模拟业务数据 ====================

/** 创建模拟业务数据 */
const createMockBusiness = (
  type: BusinessType,
  code: string,
  billingNumber?: string
): CustomerBusiness => ({
  type,
  name: getBusinessTypeName(type),
  code,
  effectiveTime: '2024-01-15 10:30:00',
  billingNumber
})

/** 获取业务类型名称 */
const getBusinessTypeName = (type: BusinessType): string => {
  const nameMap: Record<BusinessType, string> = {
    [BusinessType.ELEGANT]: '优推业务',
    [BusinessType.BRAND]: '品牌业务',
    [BusinessType.REAL_NAME]: '实名业务',
    [BusinessType.TRANSFER]: '转接业务',
    [BusinessType.SMS]: '短信业务',
    [BusinessType.CARD]: '名片业务',
    [BusinessType.DIAL]: '拍号业务'
  }
  return nameMap[type]
}

// ==================== 源客户模拟数据 ====================

/** 源客户列表 - 包含不同业务组合，用于测试冲突校验 */
export const mockSourceCustomers: CustomerInfo[] = [
  {
    customerId: 'SRC001',
    customerName: '福州大学',
    phoneNumber: '0591-22866666',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '福州市',
    district: '鼓楼区',
    industry: '教育',
    infoSource: InfoSource.CRM,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024001', '0591-22866666'),
      createMockBusiness(BusinessType.BRAND, 'BRD2024001', '0591-22866666'),
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024001', '0591-22866666')
    ]
  },
  {
    customerId: 'SRC002',
    customerName: '福建医科大学附属第一医院',
    phoneNumber: '0591-87981000',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '福州市',
    district: '台江区',
    industry: '医疗',
    infoSource: InfoSource.INTERNAL,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024002', '0591-87981000'),
      createMockBusiness(BusinessType.TRANSFER, 'TRF2024001', '0591-87981000'),
      createMockBusiness(BusinessType.SMS, 'SMS2024001', '0591-87981000')
    ]
  },
  {
    customerId: 'SRC003',
    customerName: '厦门国贸集团股份有限公司',
    phoneNumber: '0592-5160000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '厦门市',
    district: '思明区',
    industry: '金融',
    infoSource: InfoSource.CRM,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024003', '0592-5160000'),
      createMockBusiness(BusinessType.CARD, 'CRD2024001', '0592-5160000')
    ]
  },
  {
    customerId: 'SRC004',
    customerName: '泉州市商业银行',
    phoneNumber: '0595-22100000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '泉州市',
    district: '丰泽区',
    industry: '金融',
    infoSource: InfoSource.CRM,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024004', '0595-22100000'),
      createMockBusiness(BusinessType.BRAND, 'BRD2024002', '0595-22100000'),
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024002', '0595-22100000'),
      createMockBusiness(BusinessType.TRANSFER, 'TRF2024002', '0595-22100000')
    ]
  },
  {
    customerId: 'SRC005',
    customerName: '漳州片仔癀药业股份有限公司',
    phoneNumber: '0596-2300000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '漳州市',
    district: '芗城区',
    industry: '制造',
    infoSource: InfoSource.INTERNAL,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024005', '0596-2300000'),
      createMockBusiness(BusinessType.BRAND, 'BRD2024003', '0596-2300000')
    ]
  },
  {
    customerId: 'SRC006',
    customerName: '莆田市第一医院',
    phoneNumber: '0594-2290000',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '莆田市',
    district: '城厢区',
    industry: '医疗',
    infoSource: InfoSource.CRM,
    businesses: [
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024006', '0594-2290000'),
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024003', '0594-2290000'),
      createMockBusiness(BusinessType.SMS, 'SMS2024002', '0594-2290000')
    ]
  }
]

// ==================== 目标客户模拟数据 ====================

/** 目标客户列表 - 部分包含与源客户冲突的业务，用于测试校验逻辑 */
export const mockTargetCustomers: CustomerInfo[] = [
  {
    customerId: 'TGT001',
    customerName: '福州大学（新校区）',
    phoneNumber: '0591-22888888',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '福州市',
    district: '闽侯县',
    industry: '教育',
    infoSource: InfoSource.CRM,
    businesses: [
      // 与SRC001冲突的业务：BRAND、REAL_NAME
      createMockBusiness(BusinessType.BRAND, 'BRD2024101', '0591-22888888'),
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024101', '0591-22888888')
    ]
  },
  {
    customerId: 'TGT002',
    customerName: '福建医科大学附属协和医院',
    phoneNumber: '0591-87557768',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '福州市',
    district: '鼓楼区',
    industry: '医疗',
    infoSource: InfoSource.INTERNAL,
    businesses: [
      // 与SRC002冲突的业务：TRANSFER
      createMockBusiness(BusinessType.TRANSFER, 'TRF2024101', '0591-87557768')
    ]
  },
  {
    customerId: 'TGT003',
    customerName: '厦门建发集团有限公司',
    phoneNumber: '0592-2260000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '厦门市',
    district: '思明区',
    industry: '金融',
    infoSource: InfoSource.CRM,
    businesses: [
      // 与SRC003冲突的业务：CARD
      createMockBusiness(BusinessType.CARD, 'CRD2024101', '0592-2260000')
    ]
  },
  {
    customerId: 'TGT004',
    customerName: '兴业银行股份有限公司',
    phoneNumber: '0591-87800000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '福州市',
    district: '鼓楼区',
    industry: '金融',
    infoSource: InfoSource.CRM,
    businesses: [
      // 与SRC004冲突的业务：BRAND、REAL_NAME、TRANSFER
      createMockBusiness(BusinessType.BRAND, 'BRD2024102', '0591-87800000'),
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024102', '0591-87800000'),
      createMockBusiness(BusinessType.TRANSFER, 'TRF2024102', '0591-87800000')
    ]
  },
  {
    customerId: 'TGT005',
    customerName: '漳州天福茶业有限公司',
    phoneNumber: '0596-2020000',
    customerCategory: CustomerCategory.ENTERPRISE,
    city: '漳州市',
    district: '漳浦县',
    industry: '餐饮',
    infoSource: InfoSource.INTERNAL,
    businesses: [
      // 无冲突业务 - 仅ELEGANT业务（源客户也有ELEGANT但不冲突，因为ELEGANT是允许重复的）
      createMockBusiness(BusinessType.ELEGANT, 'ELG2024105', '0596-2020000')
    ]
  },
  {
    customerId: 'TGT006',
    customerName: '莆田学院附属医院',
    phoneNumber: '0594-2291111',
    customerCategory: CustomerCategory.GOVERNMENT,
    city: '莆田市',
    district: '荔城区',
    industry: '医疗',
    infoSource: InfoSource.CRM,
    businesses: [
      // 与SRC006冲突的业务：REAL_NAME、SMS
      createMockBusiness(BusinessType.REAL_NAME, 'RLN2024103', '0594-2291111'),
      createMockBusiness(BusinessType.SMS, 'SMS2024102', '0594-2291111')
    ]
  }
]

// ==================== 模拟API函数 ====================

/** 模拟查询源客户 */
export const mockQuerySourceCustomers = async (
  params: {
    sourceCustomerName?: string
    sourceCustomerId?: string
    sourceCustomerPhone?: string
    city?: string
    includeSubordinate: boolean
  }
): Promise<CustomerInfo[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  return mockSourceCustomers.filter(customer => {
    // 名称筛选
    if (params.sourceCustomerName && !customer.customerName.includes(params.sourceCustomerName)) {
      return false
    }
    // ID筛选
    if (params.sourceCustomerId && !customer.customerId.includes(params.sourceCustomerId)) {
      return false
    }
    // 号码筛选
    if (params.sourceCustomerPhone && !customer.phoneNumber.includes(params.sourceCustomerPhone)) {
      return false
    }
    // 地区筛选（包含下属地区逻辑）
    if (params.city && params.city !== '全部') {
      if (params.includeSubordinate) {
        // 包含下属地区：只要地区前缀匹配即可
        return customer.city.startsWith(params.city.replace('市', ''))
      } else {
        // 不包含下属地区：精确匹配
        return customer.city === params.city
      }
    }
    return true
  })
}

/** 模拟查询目标客户 */
export const mockQueryTargetCustomers = async (
  params: {
    targetCustomerName?: string
    targetCustomerId?: string
    targetCustomerPhone?: string
    city?: string
    includeSubordinate: boolean
  }
): Promise<CustomerInfo[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  return mockTargetCustomers.filter(customer => {
    // 名称筛选
    if (params.targetCustomerName && !customer.customerName.includes(params.targetCustomerName)) {
      return false
    }
    // ID筛选
    if (params.targetCustomerId && !customer.customerId.includes(params.targetCustomerId)) {
      return false
    }
    // 号码筛选
    if (params.targetCustomerPhone && !customer.phoneNumber.includes(params.targetCustomerPhone)) {
      return false
    }
    // 地区筛选（包含下属地区逻辑）
    if (params.city && params.city !== '全部') {
      if (params.includeSubordinate) {
        // 包含下属地区：只要地区前缀匹配即可
        return customer.city.startsWith(params.city.replace('市', ''))
      } else {
        // 不包含下属地区：精确匹配
        return customer.city === params.city
      }
    }
    return true
  })
}

/** 模拟检查业务冲突
 * 核心业务规则：
 * 1. 源客户仅含优推业务：直接通过校验，不提示
 * 2. 源客户含非优推业务，且目标客户存在相同业务：提示冲突，禁止迁移
 */
export const mockCheckBusinessConflict = async (
  sourceCustomerId: string,
  targetCustomerId: string
): Promise<BusinessConflictCheckResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const sourceCustomer = mockSourceCustomers.find(c => c.customerId === sourceCustomerId)
  const targetCustomer = mockTargetCustomers.find(c => c.customerId === targetCustomerId)

  if (!sourceCustomer || !targetCustomer) {
    return {
      hasConflict: true,
      conflictBusinesses: [],
      message: '客户信息不存在'
    }
  }

  // 获取源客户的非优推业务
  const sourceNonElegantBusinesses = sourceCustomer.businesses.filter(
    b => b.type !== BusinessType.ELEGANT
  )

  // 规则1：源客户仅含优推业务，直接通过校验
  if (sourceNonElegantBusinesses.length === 0) {
    return {
      hasConflict: false,
      conflictBusinesses: [],
      message: '校验通过，可以迁移'
    }
  }

  // 规则2：检查源客户的非优推业务是否与目标客户冲突
  const conflictBusinesses: CustomerBusiness[] = []

  for (const sourceBiz of sourceNonElegantBusinesses) {
    const hasConflict = targetCustomer.businesses.some(
      targetBiz => targetBiz.type === sourceBiz.type
    )
    if (hasConflict) {
      conflictBusinesses.push(sourceBiz)
    }
  }

  if (conflictBusinesses.length > 0) {
    const conflictNames = conflictBusinesses.map(b => b.name).join('、')
    return {
      hasConflict: true,
      conflictBusinesses,
      message: `目标客户已存在【${conflictNames}】，请先处理冲突业务后再发起迁移`
    }
  }

  return {
    hasConflict: false,
    conflictBusinesses: [],
    message: '校验通过，可以迁移'
  }
}

/** 模拟执行业务迁移 */
export const mockMigrateBusiness = async (
  sourceCustomerId: string,
  targetCustomerId: string,
  migrateBillingNumber: boolean
): Promise<{ success: boolean; message: string }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟成功
  return {
    success: true,
    message: migrateBillingNumber
      ? '业务及计费号码迁移成功'
      : '业务迁移成功'
  }
}
