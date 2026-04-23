/**
 * 关键词查询量及资源统计报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { KeywordQueryItem, ServiceResponse, ReportQueryParams, CityDistrictMap } from '../types/keywordQueryReport'

/**
 * 地市与区县映射关系
 */
export const cityDistrictMap: CityDistrictMap = {
  '北京市': ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区'],
  '上海市': ['浦东新区', '静安区', '黄浦区', '徐汇区', '长宁区', '普陀区'],
  '广州市': ['天河区', '越秀区', '荔湾区', '海珠区', '白云区', '番禺区'],
  '深圳市': ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区', '龙华区'],
  '杭州市': ['西湖区', '上城区', '下城区', '江干区', '拱墅区', '滨江区'],
  '成都市': ['高新区', '锦江区', '青羊区', '金牛区', '武侯区', '成华区'],
  '福州市': ['鼓楼区', '台江区', '仓山区', '晋安区', '马尾区'],
  '厦门市': ['思明区', '湖里区', '集美区', '海沧区', '同安区'],
  '泉州市': ['丰泽区', '鲤城区', '洛江区', '泉港区'],
  '漳州市': ['芗城区', '龙文区', '龙海区']
}

/**
 * 地市列表（包含"全部地市"选项）
 */
export const cityList: string[] = ['全部地市', ...Object.keys(cityDistrictMap)]

/**
 * 获取地市列表
 */
export const getCityList = (): string[] => {
  return cityList
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
 * 模拟关键词查询数据 - 复刻原型示例数据
 */
const mockKeywordData: KeywordQueryItem[] = [
  {
    id: '1',
    index: 1,
    city: '北京市',
    district: '朝阳区',
    keyword: '智能家居控制系统',
    businessType: '搜索推广',
    industry: '科技电子',
    maxSalesCount: 5000,
    soldCount: 3250,
    queryCount: 15820
  },
  {
    id: '2',
    index: 2,
    city: '上海市',
    district: '浦东新区',
    keyword: '新能源汽车充电桩',
    businessType: '信息流推广',
    industry: '汽车服务',
    maxSalesCount: 3000,
    soldCount: 2100,
    queryCount: 12350
  },
  {
    id: '3',
    index: 3,
    city: '广州市',
    district: '天河区',
    keyword: '企业数字化转型',
    businessType: '品牌推广',
    industry: '企业服务',
    maxSalesCount: 2000,
    soldCount: 1680,
    queryCount: 9870
  },
  {
    id: '4',
    index: 4,
    city: '深圳市',
    district: '南山区',
    keyword: '人工智能芯片',
    businessType: '搜索推广',
    industry: '科技电子',
    maxSalesCount: 4500,
    soldCount: 3890,
    queryCount: 21560
  },
  {
    id: '5',
    index: 5,
    city: '杭州市',
    district: '西湖区',
    keyword: '跨境电商物流',
    businessType: '应用推广',
    industry: '物流运输',
    maxSalesCount: 3500,
    soldCount: 2450,
    queryCount: 11200
  },
  {
    id: '6',
    index: 6,
    city: '成都市',
    district: '高新区',
    keyword: '医美整形服务',
    businessType: '信息流推广',
    industry: '医疗美容',
    maxSalesCount: 2800,
    soldCount: 1960,
    queryCount: 14530
  },
  {
    id: '7',
    index: 7,
    city: '北京市',
    district: '海淀区',
    keyword: '在线教育平台',
    businessType: '品牌推广',
    industry: '教育培训',
    maxSalesCount: 6000,
    soldCount: 4200,
    queryCount: 28900
  },
  {
    id: '8',
    index: 8,
    city: '上海市',
    district: '静安区',
    keyword: '高端写字楼租赁',
    businessType: '搜索推广',
    industry: '房产服务',
    maxSalesCount: 1500,
    soldCount: 1200,
    queryCount: 7650
  },
  {
    id: '9',
    index: 9,
    city: '广州市',
    district: '越秀区',
    keyword: '餐饮加盟连锁',
    businessType: '应用推广',
    industry: '餐饮服务',
    maxSalesCount: 4000,
    soldCount: 2800,
    queryCount: 15680
  },
  {
    id: '10',
    index: 10,
    city: '深圳市',
    district: '福田区',
    keyword: '金融科技解决方案',
    businessType: '信息流推广',
    industry: '金融保险',
    maxSalesCount: 2500,
    soldCount: 1750,
    queryCount: 13200
  }
]

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const fetchKeywordQueryData = async (
  params: ReportQueryParams
): Promise<KeywordQueryItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockKeywordData]

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
      item.keyword.includes(params.keyword!)
    )
  }

  // 客户名称筛选（实际应用中可能需要根据客户名称关联查询）
  if (params.customerName) {
    filteredData = filteredData.filter(item => 
      item.keyword.includes(params.customerName!) ||
      item.industry.includes(params.customerName!)
    )
  }

  return filteredData
}
