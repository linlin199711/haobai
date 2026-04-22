/**
 * CRM模块全局状态管理
 * @description 管理销售品关键字、销售单元、CRM选择的数据共享和实时同步
 * @version 1.0.0
 */

import { reactive, readonly } from 'vue'
import type { KeywordItem } from '../KeywordManage/types/keywordManage'
import { AuditStatusEnum as KeywordAuditStatus } from '../KeywordManage/types/keywordManage'
import type { SalesUnitItem, RegionType, IndustryType } from '../SalesUnitManage/types/salesUnitManage'
import { AuditStatusEnum as SalesUnitAuditStatus, SortModeEnum } from '../SalesUnitManage/types/salesUnitManage'

// ==================== 状态定义 ====================

interface CrmState {
  // 销售品关键字列表
  keywordList: KeywordItem[]
  // 销售单元列表
  salesUnitList: SalesUnitItem[]
  // CRM已选销售单元
  selectedSalesUnits: SalesUnitItem[]
  // 最后更新时间
  lastUpdateTime: number
}

// ==================== 默认模拟数据 ====================

// 默认关键字列表
const defaultKeywordList: KeywordItem[] = [
  {
    id: 'KW001',
    name: '宽带',
    code: 'BD001',
    description: '家庭宽带业务办理与咨询',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-15 10:30:00',
    createTime: '2024-01-10 09:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW002',
    name: '流量包',
    code: 'LLB001',
    description: '手机流量套餐办理',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-15 10:35:00',
    createTime: '2024-01-11 14:20:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW003',
    name: '5G套餐',
    code: '5G001',
    description: '5G套餐升级与办理',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-16 09:00:00',
    createTime: '2024-01-12 11:30:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW004',
    name: 'IPTV',
    code: 'IPTV001',
    description: '互联网电视业务',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-16 09:30:00',
    createTime: '2024-01-13 16:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW005',
    name: '固话',
    code: 'GH001',
    description: '固定电话业务办理',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-17 10:00:00',
    createTime: '2024-01-14 10:15:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW006',
    name: '天翼云盘',
    code: 'TYYP001',
    description: '云存储服务办理',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-17 11:00:00',
    createTime: '2024-01-15 09:30:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW007',
    name: '视频彩铃',
    code: 'SPCL001',
    description: '个性化视频彩铃设置',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-18 14:00:00',
    createTime: '2024-01-16 13:20:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'KW008',
    name: '千兆宽带',
    code: 'QZBD001',
    description: '千兆光纤宽带业务',
    auditStatus: 'approved' as KeywordAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-18 15:30:00',
    createTime: '2024-01-17 11:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  }
]

// 默认销售单元列表
const defaultSalesUnitList: SalesUnitItem[] = [
  {
    id: 'SU001',
    region: 'fuzhou' as RegionType,
    regionName: '福州',
    district: 'gulou',
    districtName: '鼓楼区',
    industry: 'catering' as IndustryType,
    industryName: '餐饮',
    keyword: '宽带',
    sortMode: SortModeEnum.FIXED,
    maxSalesCount: 100,
    suggestedPrice: 99,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-20 10:00:00',
    createTime: '2024-01-18 09:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU002',
    region: 'fuzhou' as RegionType,
    regionName: '福州',
    district: 'taijiang',
    districtName: '台江区',
    industry: 'hotel' as IndustryType,
    industryName: '酒店',
    keyword: '流量包',
    sortMode: SortModeEnum.ROTATION,
    maxSalesCount: 50,
    suggestedPrice: 29,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-20 10:30:00',
    createTime: '2024-01-18 10:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU003',
    region: 'xiamen' as RegionType,
    regionName: '厦门',
    district: 'siming',
    districtName: '思明区',
    industry: 'finance' as IndustryType,
    industryName: '金融',
    keyword: '5G套餐',
    sortMode: SortModeEnum.EXCLUSIVE,
    maxSalesCount: 30,
    suggestedPrice: 129,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-21 09:00:00',
    createTime: '2024-01-19 14:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU004',
    region: 'xiamen' as RegionType,
    regionName: '厦门',
    district: 'huli',
    districtName: '湖里区',
    industry: 'retail' as IndustryType,
    industryName: '零售',
    keyword: 'IPTV',
    sortMode: SortModeEnum.FIXED,
    maxSalesCount: 80,
    suggestedPrice: 19,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-21 09:30:00',
    createTime: '2024-01-19 15:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU005',
    region: 'quanzhou' as RegionType,
    regionName: '泉州',
    district: 'licheng',
    districtName: '鲤城区',
    industry: 'education' as IndustryType,
    industryName: '教育',
    keyword: '固话',
    sortMode: SortModeEnum.ROTATION,
    maxSalesCount: 60,
    suggestedPrice: 39,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-22 10:00:00',
    createTime: '2024-01-20 11:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU006',
    region: 'quanzhou' as RegionType,
    regionName: '泉州',
    district: 'fengze',
    districtName: '丰泽区',
    industry: 'medical' as IndustryType,
    industryName: '医疗',
    keyword: '天翼云盘',
    sortMode: SortModeEnum.FIXED,
    maxSalesCount: 40,
    suggestedPrice: 15,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-22 10:30:00',
    createTime: '2024-01-20 13:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU007',
    region: 'zhangzhou' as RegionType,
    regionName: '漳州',
    district: 'xiangcheng',
    districtName: '芗城区',
    industry: 'catering' as IndustryType,
    industryName: '餐饮',
    keyword: '视频彩铃',
    sortMode: SortModeEnum.EXCLUSIVE,
    maxSalesCount: 25,
    suggestedPrice: 9,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-23 09:00:00',
    createTime: '2024-01-21 10:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU008',
    region: 'zhangzhou' as RegionType,
    regionName: '漳州',
    district: 'longwen',
    districtName: '龙文区',
    industry: 'hotel' as IndustryType,
    industryName: '酒店',
    keyword: '千兆宽带',
    sortMode: SortModeEnum.FIXED,
    maxSalesCount: 20,
    suggestedPrice: 199,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-23 09:30:00',
    createTime: '2024-01-21 11:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU009',
    region: 'nanping' as RegionType,
    regionName: '南平',
    district: 'yanping',
    districtName: '延平区',
    industry: 'retail' as IndustryType,
    industryName: '零售',
    keyword: '宽带',
    sortMode: SortModeEnum.ROTATION,
    maxSalesCount: 70,
    suggestedPrice: 79,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-24 10:00:00',
    createTime: '2024-01-22 09:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  },
  {
    id: 'SU010',
    region: 'nanping' as RegionType,
    regionName: '南平',
    district: 'jianyang',
    districtName: '建阳区',
    industry: 'education' as IndustryType,
    industryName: '教育',
    keyword: '5G套餐',
    sortMode: SortModeEnum.FIXED,
    maxSalesCount: 35,
    suggestedPrice: 99,
    auditStatus: 'approved' as SalesUnitAuditStatus,
    auditorId: 'admin001',
    auditorName: '系统管理员',
    auditTime: '2024-01-24 10:30:00',
    createTime: '2024-01-22 10:00:00',
    creatorId: 'admin001',
    creatorName: '系统管理员'
  }
]

// 创建响应式状态
const state = reactive<CrmState>({
  keywordList: [...defaultKeywordList],
  salesUnitList: [...defaultSalesUnitList],
  selectedSalesUnits: [],
  lastUpdateTime: Date.now()
})

// ==================== 操作方法 ====================

/**
 * 设置关键字列表
 */
export const setKeywordList = (list: KeywordItem[]) => {
  state.keywordList = list
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 关键字列表已更新:', list.length)
}

/**
 * 添加关键字
 */
export const addKeyword = (keyword: KeywordItem) => {
  state.keywordList.unshift(keyword)
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 关键字已添加:', keyword.name)
}

/**
 * 更新关键字
 */
export const updateKeyword = (keyword: KeywordItem) => {
  const index = state.keywordList.findIndex(item => item.id === keyword.id)
  if (index !== -1) {
    state.keywordList[index] = keyword
    state.lastUpdateTime = Date.now()
    console.log('[CRM Store] 关键字已更新:', keyword.name)
  }
}

/**
 * 删除关键字
 */
export const removeKeyword = (id: string) => {
  state.keywordList = state.keywordList.filter(item => item.id !== id)
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 关键字已删除:', id)
}

/**
 * 设置销售单元列表
 */
export const setSalesUnitList = (list: SalesUnitItem[]) => {
  state.salesUnitList = list
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 销售单元列表已更新:', list.length)
}

/**
 * 添加销售单元
 */
export const addSalesUnit = (salesUnit: SalesUnitItem) => {
  state.salesUnitList.unshift(salesUnit)
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 销售单元已添加:', salesUnit.keyword)
}

/**
 * 更新销售单元
 */
export const updateSalesUnit = (salesUnit: SalesUnitItem) => {
  const index = state.salesUnitList.findIndex(item => item.id === salesUnit.id)
  if (index !== -1) {
    state.salesUnitList[index] = salesUnit
    state.lastUpdateTime = Date.now()
    console.log('[CRM Store] 销售单元已更新:', salesUnit.keyword)
  }
}

/**
 * 删除销售单元
 */
export const removeSalesUnit = (id: string) => {
  state.salesUnitList = state.salesUnitList.filter(item => item.id !== id)
  state.lastUpdateTime = Date.now()
  console.log('[CRM Store] 销售单元已删除:', id)
}

/**
 * 添加CRM选择
 */
export const addToCrmQueue = (salesUnit: SalesUnitItem) => {
  if (!state.selectedSalesUnits.find(item => item.id === salesUnit.id)) {
    state.selectedSalesUnits.push(salesUnit)
    console.log('[CRM Store] 已加入CRM队列:', salesUnit.keyword)
  }
}

/**
 * 从CRM队列移除
 */
export const removeFromCrmQueue = (id: string) => {
  state.selectedSalesUnits = state.selectedSalesUnits.filter(item => item.id !== id)
  console.log('[CRM Store] 已从CRM队列移除:', id)
}

/**
 * 清空CRM队列
 */
export const clearCrmQueue = () => {
  state.selectedSalesUnits = []
  console.log('[CRM Store] CRM队列已清空')
}

/**
 * 调整CRM队列顺序
 */
export const reorderCrmQueue = (newOrder: SalesUnitItem[]) => {
  state.selectedSalesUnits = newOrder
  console.log('[CRM Store] CRM队列已重新排序')
}

// ==================== 查询方法 ====================

/**
 * 检查关键字是否被销售单元关联
 */
export const isKeywordInUse = (keywordId: string): boolean => {
  const keyword = state.keywordList.find(k => k.id === keywordId)
  if (!keyword) return false
  
  return state.salesUnitList.some(
    unit => unit.keyword === keyword.name
  )
}

/**
 * 检查销售单元是否被CRM关联
 */
export const isSalesUnitInUse = (salesUnitId: string): boolean => {
  return state.selectedSalesUnits.some(unit => unit.id === salesUnitId)
}

/**
 * 获取关键字名称列表（用于下拉框）
 */
export const getKeywordNames = (): string[] => {
  return state.keywordList.map(item => item.name)
}

/**
 * 获取可用的销售单元列表
 */
export const getAvailableSalesUnits = (): SalesUnitItem[] => {
  return state.salesUnitList
}

// ==================== 导出 ====================

// 导出只读状态
export const crmState = readonly(state)

// 导出所有方法
export const crmStore = {
  state: crmState,
  setKeywordList,
  addKeyword,
  updateKeyword,
  removeKeyword,
  setSalesUnitList,
  addSalesUnit,
  updateSalesUnit,
  removeSalesUnit,
  addToCrmQueue,
  removeFromCrmQueue,
  clearCrmQueue,
  reorderCrmQueue,
  isKeywordInUse,
  isSalesUnitInUse,
  getKeywordNames,
  getAvailableSalesUnits
}

export default crmStore
