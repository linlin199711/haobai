/**
 * AI 接话分流管理模块 - Mock 数据与接口
 * @description 模拟 AI 接话分流相关的 API 接口
 * @version 1.0.0
 */

import type {
  AiDiversionRule,
  QueryParams,
  FormData,
  PaginationResult,
  ApiResponse,
  CityCode,
  PermissionConfig,
  UserRole
} from '../types/aiDiversion'
import {
  DiversionTypeEnum,
  UseStatusEnum,
  DiversionTypeLabels,
  UseStatusLabels,
  FUJIAN_CITIES
} from '../types/aiDiversion'

// ==================== 模拟延迟 ====================
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ==================== 当前用户信息 ====================
export const currentUser: PermissionConfig = {
  userId: 'admin001',
  userRole: 'admin' as UserRole,
  isAdmin: true,
  isCityAdmin: false
}

// ==================== Mock 数据存储 ====================
let mockRules: AiDiversionRule[] = [
  {
    id: '1',
    cityCode: 'fuzhou',
    cityName: '福州',
    diversionType: DiversionTypeEnum.ALL_TIME,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.ALL_TIME],
    useStatus: UseStatusEnum.ENABLED,
    createTime: '2024-01-15 09:30:00',
    creatorId: 'admin001',
    creatorName: '系统管理员',
    updateTime: '2024-01-20 14:25:30',
    operatorId: 'admin001',
    operatorName: '系统管理员'
  },
  {
    id: '2',
    cityCode: 'xiamen',
    cityName: '厦门',
    diversionType: DiversionTypeEnum.TIME_PERIOD,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.TIME_PERIOD],
    startTime: '09:00',
    endTime: '18:00',
    useStatus: UseStatusEnum.ENABLED,
    createTime: '2024-01-16 10:15:00',
    creatorId: 'admin001',
    creatorName: '系统管理员',
    updateTime: '2024-01-21 11:20:15',
    operatorId: 'admin002',
    operatorName: '李四'
  },
  {
    id: '3',
    cityCode: 'quanzhou',
    cityName: '泉州',
    diversionType: DiversionTypeEnum.TIME_PERIOD,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.TIME_PERIOD],
    startTime: '23:00',
    endTime: '10:00',
    useStatus: UseStatusEnum.DISABLED,
    createTime: '2024-01-17 14:20:00',
    creatorId: 'admin002',
    creatorName: '李四',
    updateTime: '2024-01-22 16:30:45',
    operatorId: 'admin001',
    operatorName: '系统管理员'
  },
  {
    id: '4',
    cityCode: 'zhangzhou',
    cityName: '漳州',
    diversionType: DiversionTypeEnum.ALL_TIME,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.ALL_TIME],
    useStatus: UseStatusEnum.DISABLED,
    createTime: '2024-01-18 11:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员',
    updateTime: '2024-01-23 09:15:20',
    operatorId: 'admin003',
    operatorName: '王五'
  },
  {
    id: '5',
    cityCode: 'nanping',
    cityName: '南平',
    diversionType: DiversionTypeEnum.TIME_PERIOD,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.TIME_PERIOD],
    startTime: '20:00',
    endTime: '08:00',
    useStatus: UseStatusEnum.ENABLED,
    createTime: '2024-01-19 16:45:00',
    creatorId: 'admin003',
    creatorName: '王五',
    updateTime: '2024-01-24 13:40:10',
    operatorId: 'admin001',
    operatorName: '系统管理员'
  },
  {
    id: '6',
    cityCode: 'sanming',
    cityName: '三明',
    diversionType: DiversionTypeEnum.ALL_TIME,
    diversionTypeName: DiversionTypeLabels[DiversionTypeEnum.ALL_TIME],
    useStatus: UseStatusEnum.ENABLED,
    createTime: '2024-01-20 08:30:00',
    creatorId: 'admin001',
    creatorName: '系统管理员',
    updateTime: '2024-01-25 15:55:25',
    operatorId: 'admin002',
    operatorName: '李四'
  }
]

// ==================== 工具函数 ====================

/**
 * 获取当前时间字符串
 */
const getCurrentTime = (): string => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
}

/**
 * 检查是否跨天
 * @param startTime 开始时间 HH:mm
 * @param endTime 结束时间 HH:mm
 */
export const isCrossDay = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  return startMinutes > endMinutes
}

/**
 * 生成分流规则显示文本
 */
export const generateEffectInfo = (rule: AiDiversionRule): { displayText: string; crossDayNote?: string } => {
  if (rule.diversionType === DiversionTypeEnum.ALL_TIME) {
    return { displayText: '全时段生效' }
  }
  
  if (!rule.startTime || !rule.endTime) {
    return { displayText: '时段性生效' }
  }
  
  const cross = isCrossDay(rule.startTime, rule.endTime)
  const timeRange = `${rule.startTime}-${rule.endTime}`
  
  if (cross) {
    return {
      displayText: `${timeRange}（跨天）`,
      crossDayNote: `该规则为跨天时段，从当日${rule.startTime}生效至次日${rule.endTime}`
    }
  }
  
  return { displayText: timeRange }
}

// ==================== API 接口 ====================

/**
 * 查询分流规则列表
 * @param params 查询参数
 * @returns 分页结果
 */
export const queryAiDiversionList = async (
  params: QueryParams
): Promise<ApiResponse<PaginationResult<AiDiversionRule>>> => {
  await delay(500)
  
  let filtered = [...mockRules]
  
  // 权限过滤：地市管理员只能查看本地市数据
  if (currentUser.isCityAdmin && currentUser.cityCode) {
    filtered = filtered.filter(r => r.cityCode === currentUser.cityCode)
  }
  
  // 地市筛选（多选）
  if (params.cityCodes && params.cityCodes.length > 0) {
    filtered = filtered.filter(r => params.cityCodes!.includes(r.cityCode))
  }
  
  // 分流类型筛选
  if (params.diversionType) {
    filtered = filtered.filter(r => r.diversionType === params.diversionType)
  }
  
  // 使用状态筛选
  if (params.useStatus) {
    filtered = filtered.filter(r => r.useStatus === params.useStatus)
  }
  
  // 按操作时间降序排列
  filtered.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
  
  // 分页
  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filtered.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize
    },
    success: true
  }
}

/**
 * 新增分流规则
 * @param data 表单数据
 * @returns 新增的规则
 */
export const addAiDiversionRule = async (data: FormData): Promise<ApiResponse<AiDiversionRule>> => {
  await delay(600)
  
  // 唯一性校验：同一个地市仅能创建1条分流规则
  const exists = mockRules.find(r => r.cityCode === data.cityCode)
  if (exists) {
    return {
      code: 400,
      message: '该地市已存在分流规则，不可重复新增',
      data: null as any,
      success: false
    }
  }
  
  const city = FUJIAN_CITIES.find(c => c.code === data.cityCode)
  if (!city) {
    return {
      code: 400,
      message: '所选地市不存在',
      data: null as any,
      success: false
    }
  }
  
  const now = getCurrentTime()
  const newRule: AiDiversionRule = {
    id: Date.now().toString(),
    cityCode: data.cityCode as CityCode,
    cityName: city.name,
    diversionType: data.diversionType,
    diversionTypeName: DiversionTypeLabels[data.diversionType],
    startTime: data.startTime,
    endTime: data.endTime,
    useStatus: UseStatusEnum.DISABLED, // 新增默认禁用
    createTime: now,
    creatorId: currentUser.userId,
    creatorName: currentUser.userId === 'admin001' ? '系统管理员' : '操作员',
    updateTime: now,
    operatorId: currentUser.userId,
    operatorName: currentUser.userId === 'admin001' ? '系统管理员' : '操作员'
  }
  
  mockRules.unshift(newRule)
  
  return {
    code: 200,
    message: '新增成功',
    data: newRule,
    success: true
  }
}

/**
 * 编辑分流规则
 * @param data 表单数据
 * @returns 更新后的规则
 */
export const updateAiDiversionRule = async (data: FormData): Promise<ApiResponse<AiDiversionRule>> => {
  await delay(600)
  
  if (!data.id) {
    return {
      code: 400,
      message: '规则ID不能为空',
      data: null as any,
      success: false
    }
  }
  
  const index = mockRules.findIndex(r => r.id === data.id)
  if (index === -1) {
    return {
      code: 404,
      message: '规则不存在',
      data: null as any,
      success: false
    }
  }
  
  const rule = mockRules[index]
  
  // 更新字段（地市不允许修改）
  rule.diversionType = data.diversionType
  rule.diversionTypeName = DiversionTypeLabels[data.diversionType]
  rule.startTime = data.startTime
  rule.endTime = data.endTime
  rule.updateTime = getCurrentTime()
  rule.operatorId = currentUser.userId
  rule.operatorName = currentUser.userId === 'admin001' ? '系统管理员' : '操作员'
  
  mockRules[index] = rule
  
  return {
    code: 200,
    message: '修改成功',
    data: rule,
    success: true
  }
}

/**
 * 删除分流规则
 * @param id 规则ID
 * @returns 删除结果
 */
export const deleteAiDiversionRule = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay(500)
  
  const index = mockRules.findIndex(r => r.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '规则不存在',
      data: false,
      success: false
    }
  }
  
  const rule = mockRules[index]
  
  // 风控拦截：启用状态的规则禁止删除
  if (rule.useStatus === UseStatusEnum.ENABLED) {
    return {
      code: 403,
      message: '当前规则为启用状态，不允许删除，请先禁用后再操作删除',
      data: false,
      success: false
    }
  }
  
  mockRules.splice(index, 1)
  
  return {
    code: 200,
    message: '删除成功',
    data: true,
    success: true
  }
}

/**
 * 更新使用状态
 * @param id 规则ID
 * @param useStatus 使用状态
 * @returns 更新结果
 */
export const updateUseStatus = async (
  id: string,
  useStatus: UseStatusEnum
): Promise<ApiResponse<boolean>> => {
  await delay(400)
  
  const index = mockRules.findIndex(r => r.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '规则不存在',
      data: false,
      success: false
    }
  }
  
  mockRules[index].useStatus = useStatus
  mockRules[index].updateTime = getCurrentTime()
  mockRules[index].operatorId = currentUser.userId
  mockRules[index].operatorName = currentUser.userId === 'admin001' ? '系统管理员' : '操作员'
  
  return {
    code: 200,
    message: useStatus === UseStatusEnum.ENABLED ? '启用成功' : '禁用成功',
    data: true,
    success: true
  }
}

/**
 * 获取规则详情
 * @param id 规则ID
 * @returns 规则详情
 */
export const getAiDiversionDetail = async (id: string): Promise<ApiResponse<AiDiversionRule>> => {
  await delay(300)
  
  const rule = mockRules.find(r => r.id === id)
  if (!rule) {
    return {
      code: 404,
      message: '规则不存在',
      data: null as any,
      success: false
    }
  }
  
  return {
    code: 200,
    message: 'success',
    data: rule,
    success: true
  }
}

/**
 * 检查地市是否已存在规则
 * @param cityCode 地市编码
 * @returns 是否存在
 */
export const checkCityExists = async (cityCode: CityCode): Promise<ApiResponse<boolean>> => {
  await delay(200)
  
  const exists = mockRules.some(r => r.cityCode === cityCode)
  
  return {
    code: 200,
    message: 'success',
    data: exists,
    success: true
  }
}

// ==================== 系统兜底逻辑 ====================
/**
 * 检查地市是否有有效的分流规则
 * @param cityCode 地市编码
 * @returns 是否有有效规则
 * 
 * 系统全局兜底规则：
 * 当地市无有效分流规则（无配置、全部禁用、全部删除）时，
 * 无条件转接所有来电至人工坐席，保障话务接入不中断
 */
export const hasEffectiveRule = (cityCode: CityCode): boolean => {
  const effectiveRule = mockRules.find(
    r => r.cityCode === cityCode && r.useStatus === UseStatusEnum.ENABLED
  )
  return !!effectiveRule
}

/**
 * 获取所有有效分流规则的地市列表
 * @returns 地市编码列表
 */
export const getEffectiveCityCodes = (): CityCode[] => {
  return mockRules
    .filter(r => r.useStatus === UseStatusEnum.ENABLED)
    .map(r => r.cityCode)
}
