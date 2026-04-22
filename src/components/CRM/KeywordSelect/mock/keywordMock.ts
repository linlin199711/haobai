/**
 * CRM关键词选择模块 - Mock数据
 * @description 模拟关键词选择数据
 * @version 1.0.0
 */

import type {
  KeywordItem,
  KeywordQueryParams,
  PaginationResult,
  ApiResponse,
  RegionConfig,
  PermissionConfig,
  RegionType
} from '../types/keyword'
import { SortModeEnum } from '../types/keyword'

// 市级配置（第一级）
export const cityConfigs = [
  { value: 'quanzhou', label: '泉州市', code: '350500' }
]

// 区县配置（级联数据 - 市-区县结构）
export const districtConfigs: Record<string, { value: string; label: string }[]> = {
  'quanzhou': [
    { value: 'nanan', label: '南安市' },
    { value: 'jinjiang', label: '晋江市' },
    { value: 'shishi', label: '石狮市' },
    { value: 'quangang', label: '泉港区' },
    { value: 'huian', label: '惠安县' },
    { value: 'anxi', label: '安溪县' },
    { value: 'yongchun', label: '永春县' },
    { value: 'dehua', label: '德化县' },
    { value: 'licheng', label: '鲤城区' },
    { value: 'fengze', label: '丰泽区' },
    { value: 'luojiang', label: '洛江区' }
  ]
}

// 地区配置（保留用于兼容性）
export const regionConfigs: RegionConfig[] = [
  { value: 'nanan', label: '南安', code: '350583' },
  { value: 'jinjiang', label: '晋江', code: '350582' },
  { value: 'shishi', label: '石狮', code: '350581' },
  { value: 'quangang', label: '泉港', code: '350505' },
  { value: 'huian', label: '惠安', code: '350521' }
]

// 当前用户权限配置（模拟）
export const currentUserPermission: PermissionConfig = {
  userId: 'A001',
  userRegion: 'nanan',
  allowedRegions: ['nanan'],
  isAdmin: false
}

// 管理员权限配置（模拟）
export const adminPermission: PermissionConfig = {
  userId: 'ADMIN',
  userRegion: 'nanan',
  allowedRegions: ['nanan', 'jinjiang', 'shishi', 'quangang', 'huian'],
  isAdmin: true
}

// 模拟关键词数据生成
const generateMockKeywords = (region: RegionType, count: number): KeywordItem[] => {
  const keywords: KeywordItem[] = []
  const industries = ['物流(新)', '快递', '摩托车专卖店', '心理医疗', '二手车交易', '建筑、装潢材料生产', '医院', '广告媒介', '汽车及零部件零售', '4S店']
  const businessDistricts = ['南安市区', '水头镇', '石井镇', '官桥镇', '诗山镇', '码头镇', '梅山镇', '洪濑镇']
  const sortModes = [SortModeEnum.ROTATION, SortModeEnum.FIXED]

  for (let i = 0; i < count; i++) {
    const id = 165000 + i
    const maxSalesCount = Math.floor(Math.random() * 5) + 1
    const actualSalesCount = Math.floor(Math.random() * (maxSalesCount + 2))
    const isOversold = actualSalesCount >= maxSalesCount

    // 随机生成时段，部分数据为非生效时段
    const hour = Math.floor(Math.random() * 24)
    const isActive = Math.random() > 0.1 // 90%为生效中

    keywords.push({
      id,
      region: regionConfigs.find(r => r.value === region)?.label || '南安',
      businessDistrict: businessDistricts[Math.floor(Math.random() * businessDistricts.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      keyword: generateKeywordText(i),
      startTime: '00:00:00',
      endTime: `${String(23).padStart(2, '0')}:${String(59).padStart(2, '0')}:${String(59).padStart(2, '0')}`,
      maxSalesCount,
      actualSalesCount,
      suggestedPrice: Math.floor(Math.random() * 20) * 50,
      sortMode: sortModes[Math.floor(Math.random() * sortModes.length)],
      isActive,
      isOversold
    })
  }

  return keywords
}

// 生成关键词文本
const generateKeywordText = (index: number): string => {
  const keywords = [
    '国内物流', '奥迪', '二手汽车', '心理治疗', '二手车', '卫浴洁具制造', '心理咨询',
    '二手汽车买卖', '预约门诊', '妇科', '电子广告', '整形', '男科', '奥迪汽车',
    '东风本田汽车', '丰田汽车', '本田汽车', '日产汽车', '大众汽车', '宝马汽车',
    '奔驰汽车', '别克汽车', '福特汽车', '雪佛兰汽车', '现代汽车', '起亚汽车',
    '比亚迪汽车', '吉利汽车', '长安汽车', '奇瑞汽车', '长城汽车', '广汽传祺',
    '五菱汽车', '宝骏汽车', '江淮汽车', '海马汽车', '东南汽车', '众泰汽车',
    '力帆汽车', '陆风汽车', '奔腾汽车', '红旗汽车', '荣威汽车', '名爵汽车',
    '斯柯达汽车', '雪铁龙汽车', '标致汽车', '雷诺汽车', '三菱汽车', '斯巴鲁汽车',
    '铃木汽车', '马自达汽车', '英菲尼迪汽车', '雷克萨斯汽车', '讴歌汽车', '凯迪拉克汽车',
    '林肯汽车', '捷豹汽车', '路虎汽车', '保时捷汽车', '法拉利汽车', '兰博基尼汽车',
    '玛莎拉蒂汽车', '宾利汽车', '劳斯莱斯汽车', '迈巴赫汽车', '阿斯顿马丁汽车', '布加迪汽车'
  ]
  return keywords[index % keywords.length] + (index >= keywords.length ? `_${Math.floor(index / keywords.length)}` : '')
}

// 模拟数据存储
const mockDataStore: Map<RegionType, KeywordItem[]> = new Map()

// 初始化数据（南安地区4790条）
const initMockData = () => {
  regionConfigs.forEach(region => {
    const count = region.value === 'nanan' ? 4790 : Math.floor(Math.random() * 1000) + 500
    mockDataStore.set(region.value, generateMockKeywords(region.value, count))
  })
}

initMockData()

/**
 * 获取关键词列表
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

  // 权限校验
  const region = params.region || permission.userRegion
  if (!permission.isAdmin && !permission.allowedRegions.includes(region)) {
    return {
      code: 403,
      message: '无权查看该地区数据',
      data: null as any,
      success: false
    }
  }

  // 获取数据
  let list = mockDataStore.get(region) || []

  // 关键词模糊查询
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.keyword.toLowerCase().includes(keyword) ||
      item.industry.toLowerCase().includes(keyword) ||
      item.businessDistrict.toLowerCase().includes(keyword)
    )
  }

  // 排序
  if (params.sortField) {
    list = [...list].sort((a, b) => {
      const aVal = a[params.sortField as keyof KeywordItem]
      const bVal = b[params.sortField as keyof KeywordItem]
      if (params.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
  }

  // 分页
  const total = list.length
  const totalPages = Math.ceil(total / params.pageSize)
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
      pageSize: params.pageSize,
      totalPages
    },
    success: true
  }
}

/**
 * 获取地区列表（根据权限）
 * @param permission 权限配置
 * @returns 地区列表
 */
export const getRegionList = async (
  permission: PermissionConfig = currentUserPermission
): Promise<ApiResponse<RegionConfig[]>> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  const regions = permission.isAdmin
    ? regionConfigs
    : regionConfigs.filter(r => permission.allowedRegions.includes(r.value))

  return {
    code: 200,
    message: 'success',
    data: regions,
    success: true
  }
}

/**
 * 记录操作日志
 * @param operation 操作类型
 * @param content 操作内容
 */
export const logOperation = (operation: string, content: string): void => {
  console.log(`[CRM操作日志] ${new Date().toISOString()} - ${operation}: ${content}`)
}

// 导出所有mock数据
export const mockData = {
  regionConfigs,
  currentUserPermission,
  adminPermission,
  getKeywordList,
  getRegionList,
  logOperation
}
