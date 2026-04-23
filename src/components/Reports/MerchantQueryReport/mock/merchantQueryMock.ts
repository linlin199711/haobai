/**
 * 优推商家查询量报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { MerchantQueryItem, ServiceResponse, ReportQueryParams, CityDistrictMap } from '../types/merchantQueryReport'

/**
 * 地市与区县映射关系
 */
export const cityDistrictMap: CityDistrictMap = {
  '广州市': ['天河区', '白云区', '越秀区', '海珠区', '番禺区', '黄埔区'],
  '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区'],
  '东莞市': ['南城区', '东城区', '莞城区', '万江区', '长安镇', '虎门镇'],
  '佛山市': ['禅城区', '南海区', '顺德区', '三水区', '高明区'],
  '福州市': ['鼓楼区', '台江区', '仓山区', '晋安区', '马尾区'],
  '厦门市': ['思明区', '湖里区', '集美区', '海沧区', '同安区', '翔安区'],
  '泉州市': ['丰泽区', '鲤城区', '洛江区', '泉港区', '晋江市', '石狮市'],
  '漳州市': ['芗城区', '龙文区', '龙海区', '漳浦县', '云霄县'],
  '莆田市': ['城厢区', '涵江区', '荔城区', '秀屿区'],
  '龙岩市': ['新罗区', '永定区', '长汀县', '上杭县', '武平县']
}

/**
 * 获取地市列表
 */
export const getCityList = (): string[] => {
  return ['全部地市', ...Object.keys(cityDistrictMap)]
}

/**
 * 根据地市获取区县列表
 * @param city 地市名称
 */
export const getDistrictList = (city: string): string[] => {
  if (!city || city === '全部地市') return []
  return cityDistrictMap[city] || []
}

/**
 * 模拟商家查询数据
 */
const mockMerchantData: MerchantQueryItem[] = [
  {
    id: '1',
    city: '广州市',
    district: '天河区',
    allKeywords: ['天河城', '正佳广场', '天河商圈'],
    businessType: '优推',
    salesRegion: '华南区',
    industry: '零售百货',
    companyName: '天河城百货有限公司',
    broadcastNumber: '020-12345678',
    businessNumber: '13800138000',
    queriedKeyword: '天河城',
    openDate: '2025-08-15',
    queryCount: 1258,
    keywordQueryCount: 892,
    fuzzyQueryCount: 366,
    transferCount: 156,
    transferSuccessCount: 142
  },
  {
    id: '2',
    city: '深圳市',
    district: '福田区',
    allKeywords: ['华强北', '电子市场', '华强商圈'],
    businessType: '优推',
    salesRegion: '华南区',
    industry: '电子科技',
    companyName: '华强北电子世界',
    broadcastNumber: '0755-87654321',
    businessNumber: '13900139000',
    queriedKeyword: '华强北',
    openDate: '2025-09-20',
    queryCount: 2345,
    keywordQueryCount: 1802,
    fuzzyQueryCount: 543,
    transferCount: 289,
    transferSuccessCount: 267
  },
  {
    id: '3',
    city: '东莞市',
    district: '南城区',
    allKeywords: ['万达广场', '南城万达', '万达商圈'],
    businessType: '优推',
    salesRegion: '华南区',
    industry: '商业综合体',
    companyName: '东莞万达广场商业管理有限公司',
    broadcastNumber: '0769-22223333',
    businessNumber: '13700137000',
    queriedKeyword: '万达广场',
    openDate: '2025-10-05',
    queryCount: 876,
    keywordQueryCount: 654,
    fuzzyQueryCount: 222,
    transferCount: 98,
    transferSuccessCount: 89
  },
  {
    id: '4',
    city: '佛山市',
    district: '禅城区',
    allKeywords: ['岭南天地', '祖庙商圈', '岭南文化'],
    businessType: '优推',
    salesRegion: '华南区',
    industry: '文化旅游',
    companyName: '岭南天地商业运营公司',
    broadcastNumber: '0757-88889999',
    businessNumber: '13600136000',
    queriedKeyword: '岭南天地',
    openDate: '2025-11-12',
    queryCount: 1567,
    keywordQueryCount: 1123,
    fuzzyQueryCount: 444,
    transferCount: 178,
    transferSuccessCount: 165
  },
  {
    id: '5',
    city: '福州市',
    district: '鼓楼区',
    allKeywords: ['东街口', '三坊七巷', '鼓楼商圈'],
    businessType: '查询转接',
    salesRegion: '华东区',
    industry: '零售百货',
    companyName: '福州东百中心',
    broadcastNumber: '0591-87654321',
    businessNumber: '13500135000',
    queriedKeyword: '东街口',
    openDate: '2025-07-20',
    queryCount: 987,
    keywordQueryCount: 765,
    fuzzyQueryCount: 222,
    transferCount: 123,
    transferSuccessCount: 115
  },
  {
    id: '6',
    city: '厦门市',
    district: '思明区',
    allKeywords: ['中山路', '思明商圈', '鼓浪屿'],
    businessType: '优先报号',
    salesRegion: '华东区',
    industry: '文化旅游',
    companyName: '厦门中山路商业步行街',
    broadcastNumber: '0592-55556666',
    businessNumber: '13400134000',
    queriedKeyword: '中山路',
    openDate: '2025-08-01',
    queryCount: 2134,
    keywordQueryCount: 1654,
    fuzzyQueryCount: 480,
    transferCount: 245,
    transferSuccessCount: 228
  },
  {
    id: '7',
    city: '泉州市',
    district: '丰泽区',
    allKeywords: ['浦西万达', '丰泽商圈', '泉州万达'],
    businessType: '优推',
    salesRegion: '华东区',
    industry: '商业综合体',
    companyName: '泉州浦西万达广场',
    broadcastNumber: '0595-77778888',
    businessNumber: '13300133000',
    queriedKeyword: '浦西万达',
    openDate: '2025-09-10',
    queryCount: 765,
    keywordQueryCount: 543,
    fuzzyQueryCount: 222,
    transferCount: 87,
    transferSuccessCount: 78
  },
  {
    id: '8',
    city: '漳州市',
    district: '芗城区',
    allKeywords: ['漳州古城', '芗城商圈', '明清古街'],
    businessType: '短信名片',
    salesRegion: '华东区',
    industry: '文化旅游',
    companyName: '漳州古城文化旅游区',
    broadcastNumber: '0596-66667777',
    businessNumber: '13200132000',
    queriedKeyword: '漳州古城',
    openDate: '2025-10-20',
    queryCount: 654,
    keywordQueryCount: 432,
    fuzzyQueryCount: 222,
    transferCount: 76,
    transferSuccessCount: 68
  },
  {
    id: '9',
    city: '莆田市',
    district: '城厢区',
    allKeywords: ['正荣时代', '城厢商圈', '莆田中心'],
    businessType: '实名查询',
    salesRegion: '华东区',
    industry: '零售百货',
    companyName: '莆田正荣时代广场',
    broadcastNumber: '0594-33334444',
    businessNumber: '13100131000',
    queriedKeyword: '正荣时代',
    openDate: '2025-11-05',
    queryCount: 543,
    keywordQueryCount: 321,
    fuzzyQueryCount: 222,
    transferCount: 65,
    transferSuccessCount: 58
  },
  {
    id: '10',
    city: '龙岩市',
    district: '新罗区',
    allKeywords: ['万宝广场', '新罗商圈', '龙岩中心'],
    businessType: '优推',
    salesRegion: '华东区',
    industry: '商业综合体',
    companyName: '龙岩万宝广场',
    broadcastNumber: '0597-99990000',
    businessNumber: '13000130000',
    queriedKeyword: '万宝广场',
    openDate: '2025-12-01',
    queryCount: 432,
    keywordQueryCount: 298,
    fuzzyQueryCount: 134,
    transferCount: 54,
    transferSuccessCount: 48
  }
]

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const getMerchantQueryData = async (
  params: ReportQueryParams
): Promise<ServiceResponse<MerchantQueryItem[]>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockMerchantData]

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    filteredData = filteredData.filter(item => item.city === params.city)
  }

  // 区县筛选
  if (params.district && params.district !== '全部区县') {
    filteredData = filteredData.filter(item => item.district === params.district)
  }

  // 关键词筛选
  if (params.keyword) {
    filteredData = filteredData.filter(item => 
      item.allKeywords.some(k => k.includes(params.keyword!)) ||
      item.queriedKeyword.includes(params.keyword)
    )
  }

  // 商家名称筛选
  if (params.merchantName) {
    filteredData = filteredData.filter(item => 
      item.companyName.includes(params.merchantName!)
    )
  }

  // 播报号码筛选
  if (params.broadcastNumber) {
    filteredData = filteredData.filter(item => 
      item.broadcastNumber.includes(params.broadcastNumber!)
    )
  }

  return {
    success: true,
    data: filteredData
  }
}

/**
 * 获取销售区域列表
 */
export const getSalesRegionList = (): string[] => {
  return ['华南区', '华北区', '华东区', '华中区', '西北区', '西南区']
}

/**
 * 获取行业列表
 */
export const getIndustryList = (): string[] => {
  return ['零售百货', '电子科技', '商业综合体', '文化旅游', '餐饮美食', '酒店住宿', '娱乐休闲', '医疗健康', '教育培训', '金融保险']
}
