/**
 * 销售单元信息管理模块 - Mock数据
 * @description 模拟销售单元信息管理数据，支持审核流程和区县级联
 * @version 2.1.0
 */

import type {
  SalesUnitItem,
  SalesUnitQueryParams,
  SalesUnitFormData,
  AuditFormData,
  PaginationResult,
  ApiResponse,
  PermissionConfig,
  RegionType,
  IndustryType,
  SortModeEnum
} from '../types/salesUnitManage'
import { AuditStatusEnum } from '../types/salesUnitManage'
import { crmStore } from '../../store/crmStore'

// 级联地区配置（市级-区县），每个市级下包含"全市"选项
export const regionConfigs = [
  {
    value: 'fuzhou',
    label: '福州市',
    children: [
      { value: 'all', label: '全市' },
      { value: 'gulou', label: '鼓楼区' },
      { value: 'taijiang', label: '台江区' },
      { value: 'cangshan', label: '仓山区' },
      { value: 'mawei', label: '马尾区' },
      { value: 'jinan', label: '晋安区' },
      { value: 'minhou', label: '闽侯县' },
      { value: 'lianjiang', label: '连江县' },
      { value: 'luoyuan', label: '罗源县' },
      { value: 'minqing', label: '闽清县' },
      { value: 'yongtai', label: '永泰县' },
      { value: 'pingtan', label: '平潭县' },
      { value: 'fuqing', label: '福清市' },
      { value: 'changle', label: '长乐市' }
    ]
  },
  {
    value: 'xiamen',
    label: '厦门市',
    children: [
      { value: 'all', label: '全市' },
      { value: 'siming', label: '思明区' },
      { value: 'haicang', label: '海沧区' },
      { value: 'huli', label: '湖里区' },
      { value: 'jimei', label: '集美区' },
      { value: 'tongan', label: '同安区' },
      { value: 'xiangan', label: '翔安区' }
    ]
  },
  {
    value: 'quanzhou',
    label: '泉州市',
    children: [
      { value: 'all', label: '全市' },
      { value: 'licheng', label: '鲤城区' },
      { value: 'fengze', label: '丰泽区' },
      { value: 'luojiang', label: '洛江区' },
      { value: 'quanxianggang', label: '泉港区' },
      { value: 'huian', label: '惠安县' },
      { value: 'anxi', label: '安溪县' },
      { value: 'yongchun', label: '永春县' },
      { value: 'dehua', label: '德化县' },
      { value: 'shishi', label: '石狮市' },
      { value: 'jinjiang', label: '晋江市' },
      { value: 'nanan', label: '南安市' }
    ]
  },
  {
    value: 'zhangzhou',
    label: '漳州市',
    children: [
      { value: 'all', label: '全市' },
      { value: 'xiangcheng', label: '芗城区' },
      { value: 'longwen', label: '龙文区' },
      { value: 'yunxiao', label: '云霄县' },
      { value: 'zhangpu', label: '漳浦县' },
      { value: 'zhaoan', label: '诏安县' },
      { value: 'changtai', label: '长泰县' },
      { value: 'dongshan', label: '东山县' },
      { value: 'nanjing', label: '南靖县' },
      { value: 'pinghe', label: '平和县' },
      { value: 'huaan', label: '华安县' },
      { value: 'longhai', label: '龙海市' }
    ]
  },
  {
    value: 'nanping',
    label: '南平市',
    children: [
      { value: 'all', label: '全市' },
      { value: 'yanping', label: '延平区' },
      { value: 'jianyang', label: '建阳区' },
      { value: 'shunchang', label: '顺昌县' },
      { value: 'pucheng', label: '浦城县' },
      { value: 'guangze', label: '光泽县' },
      { value: 'songxi', label: '松溪县' },
      { value: 'zhenghe', label: '政和县' },
      { value: 'shaowu', label: '邵武市' },
      { value: 'wuyishan', label: '武夷山市' },
      { value: 'jianou', label: '建瓯市' }
    ]
  }
]

// 行业配置
export const industryConfigs = [
  { value: 'catering', label: '餐饮' },
  { value: 'hotel', label: '酒店' },
  { value: 'medical', label: '医疗' },
  { value: 'education', label: '教育' },
  { value: 'finance', label: '金融' },
  { value: 'retail', label: '零售' }
]

// 排序模式配置
export const sortModeConfigs = [
  { value: '固定排名', label: '固定排名' },
  { value: '独家推荐', label: '独家推荐' },
  { value: '轮循排名', label: '轮循排名' }
]

// 当前用户权限配置（模拟）
export const currentUserPermission: PermissionConfig = {
  userId: 'A001',
  userRole: 'operator',
  isAdmin: false
}

// 管理员权限配置（模拟）
export const adminPermission: PermissionConfig = {
  userId: 'ADMIN',
  userRole: 'admin',
  isAdmin: true
}

// 模拟销售单元数据（带审核状态和区县）
let mockSalesUnitList: SalesUnitItem[] = [
  {
    id: '1',
    region: 'fuzhou',
    regionName: '福州市',
    district: 'gulou',
    districtName: '鼓楼区',
    industry: 'catering',
    industryName: '餐饮',
    keyword: '福州饭店',
    sortMode: '固定排名' as SortModeEnum,
    maxSalesCount: 5,
    suggestedPrice: 500,
    auditStatus: AuditStatusEnum.APPROVED,
    auditorId: 'ADMIN',
    auditorName: '管理员',
    auditTime: '2024-01-15 11:00:00',
    createTime: '2024-01-15 10:30:00',
    creatorId: 'A001',
    creatorName: '张三'
  },
  {
    id: '2',
    region: 'xiamen',
    regionName: '厦门市',
    district: 'siming',
    districtName: '思明区',
    industry: 'hotel',
    industryName: '酒店',
    keyword: '厦门酒店',
    sortMode: '独家推荐' as SortModeEnum,
    maxSalesCount: 3,
    suggestedPrice: 800,
    auditStatus: AuditStatusEnum.APPROVED,
    auditorId: 'ADMIN',
    auditorName: '管理员',
    auditTime: '2024-01-16 15:00:00',
    createTime: '2024-01-16 14:20:00',
    creatorId: 'A002',
    creatorName: '李四'
  },
  {
    id: '3',
    region: 'quanzhou',
    regionName: '泉州市',
    district: 'licheng',
    districtName: '鲤城区',
    industry: 'medical',
    industryName: '医疗',
    keyword: '泉州医院',
    sortMode: '轮循排名' as SortModeEnum,
    maxSalesCount: 10,
    suggestedPrice: 300,
    auditStatus: AuditStatusEnum.PENDING,
    createTime: '2024-01-18 09:15:00',
    creatorId: 'A001',
    creatorName: '张三'
  },
  {
    id: '4',
    region: 'fuzhou',
    regionName: '福州市',
    district: 'taijiang',
    districtName: '台江区',
    industry: 'education',
    industryName: '教育',
    keyword: '福州培训',
    sortMode: '固定排名' as SortModeEnum,
    maxSalesCount: 8,
    suggestedPrice: 400,
    auditStatus: AuditStatusEnum.APPROVED,
    auditorId: 'ADMIN',
    auditorName: '管理员',
    auditTime: '2024-01-20 17:00:00',
    createTime: '2024-01-20 16:45:00',
    creatorId: 'A003',
    creatorName: '王五'
  },
  {
    id: '5',
    region: 'zhangzhou',
    regionName: '漳州市',
    district: 'xiangcheng',
    districtName: '芗城区',
    industry: 'finance',
    industryName: '金融',
    keyword: '漳州银行',
    sortMode: '轮循排名' as SortModeEnum,
    maxSalesCount: 6,
    suggestedPrice: 600,
    auditStatus: AuditStatusEnum.REJECTED,
    auditorId: 'ADMIN',
    auditorName: '管理员',
    auditTime: '2024-01-22 12:00:00',
    auditRemark: '建议售价不合理，请重新定价',
    createTime: '2024-01-22 11:30:00',
    creatorId: 'A001',
    creatorName: '张三'
  }
]

// ID计数器
let idCounter = 6

/**
 * 根据地区值获取地区配置
 */
export const getRegionConfig = (regionValue: RegionType) => {
  return regionConfigs.find(r => r.value === regionValue)
}

/**
 * 根据地区和区县值获取区县名称
 */
export const getDistrictName = (regionValue: RegionType, districtValue: string): string => {
  const region = getRegionConfig(regionValue)
  if (!region) return districtValue
  const district = region.children.find(d => d.value === districtValue)
  return district?.label || districtValue
}

/**
 * 获取销售单元列表
 * @param params 查询参数
 * @param permission 权限配置
 * @returns 分页结果
 */
export const getSalesUnitList = async (
  params: SalesUnitQueryParams,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<PaginationResult<SalesUnitItem>>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 权限过滤
  let list = permission.isAdmin
    ? [...mockSalesUnitList]
    : mockSalesUnitList.filter(item => item.creatorId === permission.userId)

  // 地区筛选（市级）
  if (params.region) {
    list = list.filter(item => item.region === params.region)
  }

  // 区县筛选
  if (params.district) {
    list = list.filter(item => item.district === params.district)
  }

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.keyword.toLowerCase().includes(keyword) ||
      item.industryName.toLowerCase().includes(keyword) ||
      item.districtName.toLowerCase().includes(keyword)
    )
  }

  // 审核状态筛选
  if (params.auditStatus) {
    list = list.filter(item => item.auditStatus === params.auditStatus)
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
 * 检查销售单元是否重复
 * @param region 地区
 * @param district 区县
 * @param keyword 关键字
 * @param excludeId 排除的ID（编辑时使用）
 * @returns 是否重复
 */
export const checkDuplicate = async (
  region: RegionType,
  district: string,
  keyword: string,
  excludeId?: string
): Promise<ApiResponse<boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  // 获取该地区的区县列表（用于全市判断）
  const regionConfig = getRegionConfig(region)
  const districtList = regionConfig?.children.map(d => d.value) || []

  let isDuplicate = false

  if (district === 'all') {
    // 如果选择"全市"，检查该市是否已存在相同关键字的销售单元
    // （无论是全市还是具体区县）
    isDuplicate = mockSalesUnitList.some(
      item => item.region === region &&
              item.keyword === keyword &&
              item.id !== excludeId
    )
  } else {
    // 如果选择具体区县，检查：
    // 1. 该区县是否已存在相同关键字的销售单元
    // 2. 该市是否已存在"全市"范围的相同关键字销售单元
    isDuplicate = mockSalesUnitList.some(
      item => item.region === region &&
              item.keyword === keyword &&
              item.id !== excludeId &&
              (item.district === district || item.district === 'all')
    )
  }

  return {
    code: 200,
    message: 'success',
    data: isDuplicate,
    success: true
  }
}

/**
 * 新增销售单元
 * @param data 表单数据
 * @param permission 权限配置
 * @returns 新增结果
 */
export const addSalesUnit = async (
  data: SalesUnitFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<SalesUnitItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 判重校验
  const duplicateCheck = await checkDuplicate(data.region, data.district, data.keyword)
  if (duplicateCheck.data) {
    return {
      code: 400,
      message: '该区域已存在该关键词的销售单元，不可重复新增',
      data: null as any,
      success: false
    }
  }

  // 创建新记录（默认待审核状态）
  const regionConfig = getRegionConfig(data.region)
  const districtName = getDistrictName(data.region, data.district)
  const industryConfig = industryConfigs.find(i => i.value === data.industry)

  const newItem: SalesUnitItem = {
    id: String(idCounter++),
    region: data.region,
    regionName: regionConfig?.label || data.region,
    district: data.district,
    districtName: districtName,
    industry: data.industry,
    industryName: industryConfig?.label || data.industry,
    keyword: data.keyword,
    sortMode: data.sortMode,
    maxSalesCount: data.maxSalesCount,
    suggestedPrice: data.suggestedPrice,
    auditStatus: AuditStatusEnum.PENDING,
    createTime: new Date().toLocaleString('zh-CN'),
    creatorId: permission.userId,
    creatorName: permission.isAdmin ? '管理员' : '运营人员'
  }

  mockSalesUnitList.unshift(newItem)

  return {
    code: 200,
    message: '新增成功，等待审核',
    data: newItem,
    success: true
  }
}

/**
 * 编辑销售单元
 * @param data 表单数据
 * @param permission 权限配置
 * @returns 编辑结果
 */
export const updateSalesUnit = async (
  data: SalesUnitFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<SalesUnitItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 查找记录
  const index = mockSalesUnitList.findIndex(item => item.id === data.id)
  if (index === -1) {
    return {
      code: 404,
      message: '销售单元不存在',
      data: null as any,
      success: false
    }
  }

  // 权限校验
  if (!permission.isAdmin && mockSalesUnitList[index].creatorId !== permission.userId) {
    return {
      code: 403,
      message: '无权编辑该销售单元',
      data: null as any,
      success: false
    }
  }

  const industryConfig = industryConfigs.find(i => i.value === data.industry)

  // 更新记录（编辑后重置为待审核状态）
  mockSalesUnitList[index] = {
    ...mockSalesUnitList[index],
    industry: data.industry,
    industryName: industryConfig?.label || data.industry,
    sortMode: data.sortMode,
    maxSalesCount: data.maxSalesCount,
    suggestedPrice: data.suggestedPrice,
    auditStatus: AuditStatusEnum.PENDING,
    auditorId: undefined,
    auditorName: undefined,
    auditTime: undefined,
    auditRemark: undefined
  }

  return {
    code: 200,
    message: '编辑成功，等待审核',
    data: mockSalesUnitList[index],
    success: true
  }
}

/**
 * 审核销售单元
 * @param data 审核表单数据
 * @param permission 权限配置
 * @returns 审核结果
 */
export const auditSalesUnit = async (
  data: AuditFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<SalesUnitItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 权限校验（仅管理员可审核）
  if (!permission.isAdmin) {
    return {
      code: 403,
      message: '无权审核销售单元',
      data: null as any,
      success: false
    }
  }

  // 查找记录
  const index = mockSalesUnitList.findIndex(item => item.id === data.id)
  if (index === -1) {
    return {
      code: 404,
      message: '销售单元不存在',
      data: null as any,
      success: false
    }
  }

  // 更新审核状态
  mockSalesUnitList[index] = {
    ...mockSalesUnitList[index],
    auditStatus: data.result === 'approve' ? AuditStatusEnum.APPROVED : AuditStatusEnum.REJECTED,
    auditorId: permission.userId,
    auditorName: permission.isAdmin ? '管理员' : '审核员',
    auditTime: new Date().toLocaleString('zh-CN'),
    auditRemark: data.remark
  }

  // 如果审核通过，同步到全局store
  if (data.result === 'approve') {
    crmStore.addSalesUnit(mockSalesUnitList[index])
  }

  return {
    code: 200,
    message: data.result === 'approve' ? '审核通过' : '审核驳回',
    data: mockSalesUnitList[index],
    success: true
  }
}

/**
 * 检查销售单元是否被CRM关联
 * @param salesUnitId 销售单元ID
 * @returns 是否被关联
 */
export const isSalesUnitLinked = async (salesUnitId: string): Promise<boolean> => {
  // 从全局store检查是否有CRM记录使用该销售单元
  const { selectedSalesUnits } = crmStore.state
  return selectedSalesUnits.some(unit => unit.id === salesUnitId)
}

/**
 * 删除销售单元
 * @param id 销售单元ID
 * @param permission 权限配置
 * @returns 删除结果
 */
export const deleteSalesUnit = async (
  id: string,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<boolean>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 查找记录
  const index = mockSalesUnitList.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '销售单元不存在',
      data: false,
      success: false
    }
  }

  // 权限校验
  if (!permission.isAdmin && mockSalesUnitList[index].creatorId !== permission.userId) {
    return {
      code: 403,
      message: '无权删除该销售单元',
      data: false,
      success: false
    }
  }

  // 关联校验：检查是否被CRM使用
  const isLinked = await isSalesUnitLinked(id)
  if (isLinked) {
    return {
      code: 400,
      message: '该销售单元已被CRM业务关联，不可删除',
      data: false,
      success: false
    }
  }

  // 删除记录
  mockSalesUnitList.splice(index, 1)
  
  // 同步更新全局store
  crmStore.removeSalesUnit(id)

  return {
    code: 200,
    message: '删除成功',
    data: true,
    success: true
  }
}

/**
 * 批量删除销售单元
 * @param ids 销售单元ID列表
 * @param permission 权限配置
 * @returns 删除结果
 */
export const batchDeleteSalesUnit = async (
  ids: string[],
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<boolean>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!permission.isAdmin) {
    return {
      code: 403,
      message: '无权批量删除',
      data: false,
      success: false
    }
  }

  // 批量删除前检查关联
  for (const id of ids) {
    const isLinked = await isSalesUnitLinked(id)
    if (isLinked) {
      const salesUnit = mockSalesUnitList.find(item => item.id === id)
      return {
        code: 400,
        message: `销售单元"${salesUnit?.keyword || id}"已被CRM业务关联，不可删除`,
        data: false,
        success: false
      }
    }
  }

  // 批量删除
  mockSalesUnitList = mockSalesUnitList.filter(item => !ids.includes(item.id))
  
  // 同步更新全局store
  ids.forEach(id => crmStore.removeSalesUnit(id))

  return {
    code: 200,
    message: '批量删除成功',
    data: true,
    success: true
  }
}

/**
 * 获取已审核通过的销售单元列表（用于CRM选择）
 * @returns 销售单元列表
 */
export const getApprovedSalesUnits = async (): Promise<SalesUnitItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockSalesUnitList.filter(item => item.auditStatus === AuditStatusEnum.APPROVED)
}

/**
 * 记录操作日志
 * @param operation 操作类型
 * @param content 操作内容
 */
export const logOperation = (operation: string, content: string): void => {
  console.log(`[销售单元管理日志] ${new Date().toISOString()} - ${operation}: ${content}`)
}

// 导出所有mock数据
export const mockData = {
  mockSalesUnitList,
  regionConfigs,
  industryConfigs,
  sortModeConfigs,
  currentUserPermission,
  adminPermission,
  AuditStatusEnum,
  getRegionConfig,
  getDistrictName,
  getSalesUnitList,
  checkDuplicate,
  addSalesUnit,
  updateSalesUnit,
  auditSalesUnit,
  deleteSalesUnit,
  batchDeleteSalesUnit,
  getApprovedSalesUnits,
  logOperation
}
