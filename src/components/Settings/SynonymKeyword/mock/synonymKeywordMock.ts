/**
 * 同义关键字管理 - Mock数据
 * @description 同义关键字管理模块模拟数据
 * @version 1.0.0
 */

import type {
  SynonymKeyword,
  SynonymKeywordListResponse,
  SynonymKeywordQueryParams,
  SynonymKeywordForm,
  ImportResult,
  StatusOption,
  MainKeywordOption
} from '../types/synonymKeyword'

// 状态选项
export const statusOptions: StatusOption[] = [
  { value: 'enabled', label: '启用', type: 'success' },
  { value: 'disabled', label: '禁用', type: 'danger' }
]

// 销售品关键字选项
export const mainKeywordOptions: MainKeywordOption[] = [
  { id: 'MK001', name: '宽带', category: '基础业务' },
  { id: 'MK002', name: '光纤宽带', category: '基础业务' },
  { id: 'MK003', name: '手机套餐', category: '移动业务' },
  { id: 'MK004', name: '流量包', category: '移动业务' },
  { id: 'MK005', name: '语音通话', category: '移动业务' },
  { id: 'MK006', name: 'IPTV', category: '增值业务' },
  { id: 'MK007', name: '云存储', category: '增值业务' },
  { id: 'MK008', name: '智能家居', category: '增值业务' },
  { id: 'MK009', name: '企业专线', category: '政企业务' },
  { id: 'MK010', name: '集团彩铃', category: '政企业务' },
  { id: 'MK011', name: '5G套餐', category: '移动业务' },
  { id: 'MK012', name: '固话', category: '基础业务' },
  { id: 'MK013', name: '来电显示', category: '增值业务' },
  { id: 'MK014', name: '彩信', category: '移动业务' },
  { id: 'MK015', name: '短信包', category: '移动业务' }
]

// Mock同义关键字数据
const mockSynonymKeywordList: SynonymKeyword[] = [
  {
    id: 'SK001',
    mainKeyword: '宽带',
    mainKeywordId: 'MK001',
    synonyms: [
      { id: 'S001', name: 'ADSL', createTime: '2024-01-15 10:00:00', status: 'enabled' },
      { id: 'S002', name: '网络', createTime: '2024-01-15 10:00:00', status: 'enabled' },
      { id: 'S003', name: '上网', createTime: '2024-01-15 10:00:00', status: 'enabled' },
      { id: 'S004', name: '网线', createTime: '2024-01-16 09:30:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-16 09:30:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK002',
    mainKeyword: '光纤宽带',
    mainKeywordId: 'MK002',
    synonyms: [
      { id: 'S005', name: '光纤', createTime: '2024-01-10 14:00:00', status: 'enabled' },
      { id: 'S006', name: 'FTTH', createTime: '2024-01-10 14:00:00', status: 'enabled' },
      { id: 'S007', name: '光宽', createTime: '2024-01-11 11:00:00', status: 'enabled' },
      { id: 'S008', name: '百兆宽带', createTime: '2024-01-12 16:00:00', status: 'disabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-10 14:00:00',
    updateTime: '2024-01-12 16:00:00',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: 'SK003',
    mainKeyword: '手机套餐',
    mainKeywordId: 'MK003',
    synonyms: [
      { id: 'S009', name: '套餐', createTime: '2024-01-08 09:00:00', status: 'enabled' },
      { id: 'S010', name: '资费', createTime: '2024-01-08 09:00:00', status: 'enabled' },
      { id: 'S011', name: '月租', createTime: '2024-01-09 10:30:00', status: 'enabled' },
      { id: 'S012', name: '话费套餐', createTime: '2024-01-10 14:00:00', status: 'enabled' },
      { id: 'S013', name: '号码套餐', createTime: '2024-01-11 11:00:00', status: 'disabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-08 09:00:00',
    updateTime: '2024-01-11 11:00:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK004',
    mainKeyword: '流量包',
    mainKeywordId: 'MK004',
    synonyms: [
      { id: 'S014', name: '流量', createTime: '2024-01-12 13:00:00', status: 'enabled' },
      { id: 'S015', name: '上网流量', createTime: '2024-01-12 13:00:00', status: 'enabled' },
      { id: 'S016', name: '数据流量', createTime: '2024-01-13 15:00:00', status: 'enabled' },
      { id: 'S017', name: '流量加油包', createTime: '2024-01-14 09:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-12 13:00:00',
    updateTime: '2024-01-14 09:00:00',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: 'SK005',
    mainKeyword: '语音通话',
    mainKeywordId: 'MK005',
    synonyms: [
      { id: 'S018', name: '通话', createTime: '2024-01-15 10:00:00', status: 'enabled' },
      { id: 'S019', name: '打电话', createTime: '2024-01-15 10:00:00', status: 'enabled' },
      { id: 'S020', name: '语音', createTime: '2024-01-16 11:00:00', status: 'enabled' },
      { id: 'S021', name: '分钟数', createTime: '2024-01-17 14:00:00', status: 'disabled' }
    ],
    status: 'disabled',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-17 14:00:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK006',
    mainKeyword: 'IPTV',
    mainKeywordId: 'MK006',
    synonyms: [
      { id: 'S022', name: '电视', createTime: '2024-01-05 09:00:00', status: 'enabled' },
      { id: 'S023', name: '网络电视', createTime: '2024-01-05 09:00:00', status: 'enabled' },
      { id: 'S024', name: '宽带电视', createTime: '2024-01-06 10:00:00', status: 'enabled' },
      { id: 'S025', name: '天翼高清', createTime: '2024-01-07 11:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-05 09:00:00',
    updateTime: '2024-01-07 11:00:00',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: 'SK007',
    mainKeyword: '云存储',
    mainKeywordId: 'MK007',
    synonyms: [
      { id: 'S026', name: '云盘', createTime: '2024-01-18 13:00:00', status: 'enabled' },
      { id: 'S027', name: '网盘', createTime: '2024-01-18 13:00:00', status: 'enabled' },
      { id: 'S028', name: '云空间', createTime: '2024-01-19 09:00:00', status: 'enabled' },
      { id: 'S029', name: '天翼云盘', createTime: '2024-01-20 10:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-18 13:00:00',
    updateTime: '2024-01-20 10:00:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK008',
    mainKeyword: '智能家居',
    mainKeywordId: 'MK008',
    synonyms: [
      { id: 'S030', name: '智能设备', createTime: '2024-01-22 14:00:00', status: 'enabled' },
      { id: 'S031', name: '智能家电', createTime: '2024-01-22 14:00:00', status: 'enabled' },
      { id: 'S032', name: '物联网', createTime: '2024-01-23 16:00:00', status: 'enabled' },
      { id: 'S033', name: '智慧家庭', createTime: '2024-01-24 09:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-22 14:00:00',
    updateTime: '2024-01-24 09:00:00',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: 'SK009',
    mainKeyword: '企业专线',
    mainKeywordId: 'MK009',
    synonyms: [
      { id: 'S034', name: '专线', createTime: '2024-01-25 10:00:00', status: 'enabled' },
      { id: 'S035', name: '企业宽带', createTime: '2024-01-25 10:00:00', status: 'enabled' },
      { id: 'S036', name: '商务专线', createTime: '2024-01-26 11:00:00', status: 'enabled' },
      { id: 'S037', name: '政企专线', createTime: '2024-01-27 14:00:00', status: 'disabled' }
    ],
    status: 'enabled',
    createTime: '2024-01-25 10:00:00',
    updateTime: '2024-01-27 14:00:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK010',
    mainKeyword: '集团彩铃',
    mainKeywordId: 'MK010',
    synonyms: [
      { id: 'S038', name: '彩铃', createTime: '2024-01-28 09:00:00', status: 'enabled' },
      { id: 'S039', name: '企业彩铃', createTime: '2024-01-28 09:00:00', status: 'enabled' },
      { id: 'S040', name: '商务彩铃', createTime: '2024-01-29 10:00:00', status: 'enabled' },
      { id: 'S041', name: '广告彩铃', createTime: '2024-01-30 13:00:00', status: 'enabled' }
    ],
    status: 'disabled',
    createTime: '2024-01-28 09:00:00',
    updateTime: '2024-01-30 13:00:00',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: 'SK011',
    mainKeyword: '5G套餐',
    mainKeywordId: 'MK011',
    synonyms: [
      { id: 'S042', name: '5G', createTime: '2024-02-01 09:00:00', status: 'enabled' },
      { id: 'S043', name: '5G资费', createTime: '2024-02-01 09:00:00', status: 'enabled' },
      { id: 'S044', name: '5G网络', createTime: '2024-02-02 10:00:00', status: 'enabled' },
      { id: 'S045', name: '5G手机卡', createTime: '2024-02-03 11:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-02-01 09:00:00',
    updateTime: '2024-02-03 11:00:00',
    creator: '张三',
    updater: '李四'
  },
  {
    id: 'SK012',
    mainKeyword: '固话',
    mainKeywordId: 'MK012',
    synonyms: [
      { id: 'S046', name: '座机', createTime: '2024-02-04 14:00:00', status: 'enabled' },
      { id: 'S047', name: '固定电话', createTime: '2024-02-04 14:00:00', status: 'enabled' },
      { id: 'S048', name: '家庭电话', createTime: '2024-02-05 09:00:00', status: 'enabled' },
      { id: 'S049', name: '办公电话', createTime: '2024-02-06 10:00:00', status: 'enabled' }
    ],
    status: 'enabled',
    createTime: '2024-02-04 14:00:00',
    updateTime: '2024-02-06 10:00:00',
    creator: '王五',
    updater: '赵六'
  }
]

/**
 * 查询同义关键字列表
 */
export const querySynonymKeywordList = async (
  params: SynonymKeywordQueryParams
): Promise<SynonymKeywordListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredList = [...mockSynonymKeywordList]

  // 销售品关键字筛选
  if (params.mainKeyword) {
    filteredList = filteredList.filter(item =>
      item.mainKeyword.toLowerCase().includes(params.mainKeyword!.toLowerCase())
    )
  }

  // 状态筛选
  if (params.status) {
    filteredList = filteredList.filter(item => item.status === params.status)
  }

  // 同义关键字名称筛选
  if (params.synonymName) {
    filteredList = filteredList.filter(item =>
      item.synonyms.some(s =>
        s.name.toLowerCase().includes(params.synonymName!.toLowerCase())
      )
    )
  }

  // 分页
  const total = filteredList.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagedList = filteredList.slice(start, end)

  return {
    list: pagedList,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

/**
 * 获取同义关键字详情
 */
export const getSynonymKeywordDetail = async (id: string): Promise<SynonymKeyword | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockSynonymKeywordList.find(item => item.id === id) || null
}

/**
 * 保存同义关键字
 */
export const saveSynonymKeyword = async (form: SynonymKeywordForm): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (form.id) {
    // 编辑
    const index = mockSynonymKeywordList.findIndex(item => item.id === form.id)
    if (index > -1) {
      mockSynonymKeywordList[index] = {
        ...mockSynonymKeywordList[index],
        synonyms: form.synonyms.map((name, idx) => ({
          id: mockSynonymKeywordList[index].synonyms[idx]?.id || `S${Date.now()}_${idx}`,
          name,
          createTime: mockSynonymKeywordList[index].synonyms[idx]?.createTime || new Date().toLocaleString(),
          status: form.status
        })),
        status: form.status,
        updateTime: new Date().toLocaleString(),
        updater: '当前用户'
      }
    }
  } else {
    // 新增
    const newItem: SynonymKeyword = {
      id: `SK${String(mockSynonymKeywordList.length + 1).padStart(3, '0')}`,
      mainKeyword: form.mainKeyword,
      mainKeywordId: form.mainKeywordId,
      synonyms: form.synonyms.map((name, idx) => ({
        id: `S${Date.now()}_${idx}`,
        name,
        createTime: new Date().toLocaleString(),
        status: form.status
      })),
      status: form.status,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
      creator: '当前用户',
      updater: '当前用户'
    }
    mockSynonymKeywordList.push(newItem)
  }
  return true
}

/**
 * 删除同义关键字
 */
export const deleteSynonymKeyword = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = mockSynonymKeywordList.findIndex(item => item.id === id)
  if (index > -1) {
    mockSynonymKeywordList.splice(index, 1)
    return true
  }
  return false
}

/**
 * 批量删除同义关键字
 */
export const batchDeleteSynonymKeyword = async (ids: string[]): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  ids.forEach(id => {
    const index = mockSynonymKeywordList.findIndex(item => item.id === id)
    if (index > -1) {
      mockSynonymKeywordList.splice(index, 1)
    }
  })
  return true
}

/**
 * 更新状态
 */
export const updateSynonymKeywordStatus = async (
  id: string,
  status: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const item = mockSynonymKeywordList.find(i => i.id === id)
  if (item) {
    item.status = status as any
    item.updateTime = new Date().toLocaleString()
    item.updater = '当前用户'
    return true
  }
  return false
}

/**
 * 批量更新状态
 */
export const batchUpdateStatus = async (
  ids: string[],
  status: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  ids.forEach(id => {
    const item = mockSynonymKeywordList.find(i => i.id === id)
    if (item) {
      item.status = status as any
      item.updateTime = new Date().toLocaleString()
      item.updater = '当前用户'
    }
  })
  return true
}

/**
 * 导入数据
 */
export const importSynonymKeywords = async (file: File): Promise<ImportResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    success: true,
    total: 10,
    successCount: 8,
    failCount: 2,
    failReasons: ['第3行：销售品关键字不存在', '第7行：同义关键字重复']
  }
}

/**
 * 导出数据
 */
export const exportSynonymKeywords = async (ids?: string[]): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let exportData = mockSynonymKeywordList
  if (ids && ids.length > 0) {
    exportData = mockSynonymKeywordList.filter(item => ids.includes(item.id))
  }

  // 生成CSV内容
  const headers = ['销售品关键字', '同义关键字', '状态', '创建时间', '更新时间', '创建人']
  const rows = exportData.map(item => [
    item.mainKeyword,
    item.synonyms.map(s => s.name).join('、'),
    item.status === 'enabled' ? '启用' : '禁用',
    item.createTime,
    item.updateTime,
    item.creator
  ])

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  return new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
}

/**
 * 删除单个同义关键字
 */
export const deleteSingleSynonym = async (
  keywordId: string,
  synonymId: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const item = mockSynonymKeywordList.find(i => i.id === keywordId)
  if (item) {
    const index = item.synonyms.findIndex(s => s.id === synonymId)
    if (index > -1) {
      item.synonyms.splice(index, 1)
      item.updateTime = new Date().toLocaleString()
      item.updater = '当前用户'
      return true
    }
  }
  return false
}
