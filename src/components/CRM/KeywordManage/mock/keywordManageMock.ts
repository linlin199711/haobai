/**
 * 销售品关键字管理模块 - Mock数据
 * @description 模拟销售品关键字管理数据，支持审核流程
 * @version 2.0.0
 */

import type {
  KeywordItem,
  KeywordQueryParams,
  KeywordFormData,
  AuditFormData,
  PaginationResult,
  ApiResponse,
  PermissionConfig
} from '../types/keywordManage'
import { AuditStatusEnum } from '../types/keywordManage'
import { crmStore } from '../../store/crmStore'

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

// 模拟关键字数据（带审核状态）
let mockKeywordList: KeywordItem[] = [
  {
    id: '1',
    name: '流量包',
    code: 'FLOW_PKG',
    description: '各类流量套餐包，包含日包、月包、季度包等多种类型',
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
    name: '语音包',
    code: 'VOICE_PKG',
    description: '语音通话时长包',
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
    name: '宽带提速',
    code: 'BANDWIDTH_UP',
    description: '家庭宽带提速服务，支持100M/200M/500M/1000M多种速率升级',
    auditStatus: AuditStatusEnum.PENDING,
    createTime: '2024-01-18 09:15:00',
    creatorId: 'A001',
    creatorName: '张三'
  },
  {
    id: '4',
    name: 'IPTV会员',
    code: 'IPTV_VIP',
    description: 'IPTV电视会员服务',
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
    name: '云存储',
    code: 'CLOUD_STORAGE',
    description: '天翼云盘存储空间扩容服务，支持50G/100G/1T等多种容量选择',
    auditStatus: AuditStatusEnum.REJECTED,
    auditorId: 'ADMIN',
    auditorName: '管理员',
    auditTime: '2024-01-22 12:00:00',
    auditRemark: '描述不够详细，请补充说明',
    createTime: '2024-01-22 11:30:00',
    creatorId: 'A001',
    creatorName: '张三'
  }
]

// ID计数器
let idCounter = 6

/**
 * 获取关键字列表
 * @param params 查询参数
 * @param permission 权限配置
 * @returns 分页结果
 */
export const getKeywordList = async (
  params: KeywordQueryParams,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<PaginationResult<KeywordItem>>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 权限过滤
  let list = permission.isAdmin
    ? [...mockKeywordList]
    : mockKeywordList.filter(item => item.creatorId === permission.userId)

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
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
 * 新增关键字
 * @param data 表单数据
 * @param permission 权限配置
 * @returns 新增结果
 */
export const addKeyword = async (
  data: KeywordFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<KeywordItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 校验名称重复
  const isDuplicate = mockKeywordList.some(
    item => item.name === data.name
  )
  if (isDuplicate) {
    return {
      code: 400,
      message: '关键字名称已存在',
      data: null as any,
      success: false
    }
  }

  // 创建新记录（默认待审核状态）
  const newItem: KeywordItem = {
    id: String(idCounter++),
    name: data.name,
    code: data.code,
    description: data.description,
    auditStatus: AuditStatusEnum.PENDING,
    createTime: new Date().toLocaleString('zh-CN'),
    creatorId: permission.userId,
    creatorName: permission.isAdmin ? '管理员' : '运营人员'
  }

  mockKeywordList.unshift(newItem)

  return {
    code: 200,
    message: '新增成功，等待审核',
    data: newItem,
    success: true
  }
}

/**
 * 编辑关键字
 * @param data 表单数据
 * @param permission 权限配置
 * @returns 编辑结果
 */
export const updateKeyword = async (
  data: KeywordFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<KeywordItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 查找记录
  const index = mockKeywordList.findIndex(item => item.id === data.id)
  if (index === -1) {
    return {
      code: 404,
      message: '关键字不存在',
      data: null as any,
      success: false
    }
  }

  // 权限校验
  if (!permission.isAdmin && mockKeywordList[index].creatorId !== permission.userId) {
    return {
      code: 403,
      message: '无权编辑该关键字',
      data: null as any,
      success: false
    }
  }

  // 校验名称重复（排除自己）
  const isDuplicate = mockKeywordList.some(
    item => item.name === data.name && item.id !== data.id
  )
  if (isDuplicate) {
    return {
      code: 400,
      message: '关键字名称已存在',
      data: null as any,
      success: false
    }
  }

  // 更新记录（编辑后重置为待审核状态）
  mockKeywordList[index] = {
    ...mockKeywordList[index],
    name: data.name,
    description: data.description,
    auditStatus: AuditStatusEnum.PENDING,
    auditorId: undefined,
    auditorName: undefined,
    auditTime: undefined,
    auditRemark: undefined
  }

  return {
    code: 200,
    message: '编辑成功，等待审核',
    data: mockKeywordList[index],
    success: true
  }
}

/**
 * 审核关键字
 * @param data 审核表单数据
 * @param permission 权限配置
 * @returns 审核结果
 */
export const auditKeyword = async (
  data: AuditFormData,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<KeywordItem>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 权限校验（仅管理员可审核）
  if (!permission.isAdmin) {
    return {
      code: 403,
      message: '无权审核关键字',
      data: null as any,
      success: false
    }
  }

  // 查找记录
  const index = mockKeywordList.findIndex(item => item.id === data.id)
  if (index === -1) {
    return {
      code: 404,
      message: '关键字不存在',
      data: null as any,
      success: false
    }
  }

  // 更新审核状态
  mockKeywordList[index] = {
    ...mockKeywordList[index],
    auditStatus: data.result === 'approve' ? AuditStatusEnum.APPROVED : AuditStatusEnum.REJECTED,
    auditorId: permission.userId,
    auditorName: permission.isAdmin ? '管理员' : '审核员',
    auditTime: new Date().toLocaleString('zh-CN'),
    auditRemark: data.remark
  }

  // 如果审核通过，同步到全局store
  if (data.result === 'approve') {
    crmStore.addKeyword(mockKeywordList[index])
  }

  return {
    code: 200,
    message: data.result === 'approve' ? '审核通过' : '审核驳回',
    data: mockKeywordList[index],
    success: true
  }
}

/**
 * 检查关键字是否被销售单元关联
 * @param keywordName 关键字名称
 * @returns 是否被关联
 */
export const isKeywordLinked = async (keywordName: string): Promise<boolean> => {
  // 从全局store检查是否有销售单元使用该关键字
  const { salesUnitList } = crmStore.state
  return salesUnitList.some(unit => unit.keyword === keywordName)
}

/**
 * 删除关键字
 * @param id 关键字ID
 * @param permission 权限配置
 * @returns 删除结果
 */
export const deleteKeyword = async (
  id: string,
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<boolean>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 查找记录
  const index = mockKeywordList.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '关键字不存在',
      data: false,
      success: false
    }
  }

  // 权限校验
  if (!permission.isAdmin && mockKeywordList[index].creatorId !== permission.userId) {
    return {
      code: 403,
      message: '无权删除该关键字',
      data: false,
      success: false
    }
  }

  // 关联校验：检查是否被销售单元使用
  const keywordName = mockKeywordList[index].name
  const isLinked = await isKeywordLinked(keywordName)
  if (isLinked) {
    return {
      code: 400,
      message: '该关键字已被销售单元关联，不可删除',
      data: false,
      success: false
    }
  }

  // 删除记录
  mockKeywordList.splice(index, 1)
  
  // 同步更新全局store
  crmStore.removeKeyword(id)

  return {
    code: 200,
    message: '删除成功',
    data: true,
    success: true
  }
}

/**
 * 批量删除关键字
 * @param ids 关键字ID列表
 * @param permission 权限配置
 * @returns 删除结果
 */
export const batchDeleteKeyword = async (
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
    const keyword = mockKeywordList.find(item => item.id === id)
    if (keyword) {
      const isLinked = await isKeywordLinked(keyword.name)
      if (isLinked) {
        return {
          code: 400,
          message: `关键字"${keyword.name}"已被销售单元关联，不可删除`,
          data: false,
          success: false
        }
      }
    }
  }

  // 批量删除
  mockKeywordList = mockKeywordList.filter(item => !ids.includes(item.id))
  
  // 同步更新全局store
  ids.forEach(id => crmStore.removeKeyword(id))

  return {
    code: 200,
    message: '批量删除成功',
    data: true,
    success: true
  }
}

/**
 * 获取已审核通过的关键字列表（用于下拉选择）
 * @returns 关键字列表
 */
export const getApprovedKeywords = async (): Promise<KeywordItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockKeywordList.filter(item => item.auditStatus === AuditStatusEnum.APPROVED)
}

/**
 * 记录操作日志
 * @param operation 操作类型
 * @param content 操作内容
 */
export const logOperation = (operation: string, content: string): void => {
  console.log(`[关键字管理日志] ${new Date().toISOString()} - ${operation}: ${content}`)
}

// 导出所有mock数据
export const mockData = {
  mockKeywordList,
  currentUserPermission,
  adminPermission,
  AuditStatusEnum,
  getKeywordList,
  addKeyword,
  updateKeyword,
  auditKeyword,
  deleteKeyword,
  batchDeleteKeyword,
  getApprovedKeywords,
  logOperation
}
