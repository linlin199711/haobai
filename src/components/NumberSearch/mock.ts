/**
 * 号码本地搜 - Mock数据与API
 * @description 模拟接口数据
 * @version 1.0.0
 */

import type {
  ApiResponse,
  SearchParams,
  SearchResult,
  CustomerInfo,
  CityInfo,
  TransferTarget,
  SmsTemplate,
  DialParams,
  TransferParams,
  SmsParams
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 地市数据
export const cities: CityInfo[] = [
  {
    code: 'fuzhou',
    name: '福州市',
    districts: [
      { code: 'gulou', name: '鼓楼区' },
      { code: 'taijiang', name: '台江区' },
      { code: 'cangshan', name: '仓山区' },
      { code: 'jinan', name: '晋安区' },
      { code: 'mawei', name: '马尾区' },
      { code: 'minhou', name: '闽侯县' },
      { code: 'lianjiang', name: '连江县' },
      { code: 'luoyuan', name: '罗源县' },
      { code: 'minqing', name: '闽清县' },
      { code: 'yongtai', name: '永泰县' },
      { code: 'fuqing', name: '福清市' },
      { code: 'changle', name: '长乐区' }
    ]
  },
  {
    code: 'xiamen',
    name: '厦门市',
    districts: [
      { code: 'siming', name: '思明区' },
      { code: 'haicang', name: '海沧区' },
      { code: 'huli', name: '湖里区' },
      { code: 'jimei', name: '集美区' },
      { code: 'tongan', name: '同安区' },
      { code: 'xiangan', name: '翔安区' }
    ]
  },
  {
    code: 'quanzhou',
    name: '泉州市',
    districts: [
      { code: 'licheng', name: '鲤城区' },
      { code: 'fengze', name: '丰泽区' },
      { code: 'luojiang', name: '洛江区' },
      { code: 'quangang', name: '泉港区' },
      { code: 'jinjiang', name: '晋江市' },
      { code: 'shishi', name: '石狮市' },
      { code: 'nanan', name: '南安市' }
    ]
  },
  {
    code: 'putian',
    name: '莆田市',
    districts: [
      { code: 'chengxiang', name: '城厢区' },
      { code: 'hanjiang', name: '涵江区' },
      { code: 'licheng', name: '荔城区' },
      { code: 'xiuyu', name: '秀屿区' },
      { code: 'xianyou', name: '仙游县' }
    ]
  },
  {
    code: 'zhangzhou',
    name: '漳州市',
    districts: [
      { code: 'xiangcheng', name: '芗城区' },
      { code: 'longwen', name: '龙文区' },
      { code: 'longhai', name: '龙海区' },
      { code: 'changtai', name: '长泰区' },
      { code: 'dongshan', name: '东山县' }
    ]
  },
  {
    code: 'longyan',
    name: '龙岩市',
    districts: [
      { code: 'xinluo', name: '新罗区' },
      { code: 'yongding', name: '永定区' },
      { code: 'changting', name: '长汀县' },
      { code: 'shanghang', name: '上杭县' },
      { code: 'wuping', name: '武平县' }
    ]
  },
  {
    code: 'sanming',
    name: '三明市',
    districts: [
      { code: 'sanyuan', name: '三元区' },
      { code: 'shaxian', name: '沙县区' },
      { code: 'yongan', name: '永安市' },
      { code: 'mingxi', name: '明溪县' },
      { code: 'qingliu', name: '清流县' }
    ]
  },
  {
    code: 'nanping',
    name: '南平市',
    districts: [
      { code: 'yanping', name: '延平区' },
      { code: 'jianyang', name: '建阳区' },
      { code: 'shaowu', name: '邵武市' },
      { code: 'wuyishan', name: '武夷山市' },
      { code: 'jianou', name: '建瓯市' }
    ]
  },
  {
    code: 'ningde',
    name: '宁德市',
    districts: [
      { code: 'jiaocheng', name: '蕉城区' },
      { code: 'fuan', name: '福安市' },
      { code: 'fuding', name: '福鼎市' },
      { code: 'xiapu', name: '霞浦县' },
      { code: 'gutian', name: '古田县' }
    ]
  }
]

// 生成400条模拟数据
const generateMockData = (): CustomerInfo[] => {
  const data: CustomerInfo[] = []
  const industries = ['教育', '医疗', '金融', '餐饮', '零售', '制造', '科技', '其他']
  
  // 福州大学下级单位（下级只展示拍号）
  const fuzhouUniversityChildren = [
    {
      id: '2',
      name: '福州大学保安室',
      phoneNumber: '0591-22866667',
      nameCode: 'fzdxbaxfzdx',
      address: '福建省福州市闽侯县上街镇学府南路2号',
      addressCode: 'fzsmsxsxzfx',
      city: '福州市',
      district: '闽侯县',
      region: '福建省福州市',
      industry: '教育',
      remark: '保卫处',
      relatedWords: '福大 保安 保卫处',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '1',
      services: ['dial']
    },
    {
      id: '2-1',
      name: '福州大学第一食堂',
      phoneNumber: '0591-22866668',
      nameCode: 'fzdxdybst',
      address: '福建省福州市闽侯县上街镇学府南路2号',
      addressCode: 'fzsmsxsxzfx',
      city: '福州市',
      district: '闽侯县',
      region: '福建省福州市',
      industry: '餐饮',
      remark: '学生食堂',
      relatedWords: '福大 食堂 第一食堂',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '1',
      services: ['dial']
    },
    {
      id: '2-2',
      name: '福州大学图书馆',
      phoneNumber: '0591-22866669',
      nameCode: 'fzdxtsg',
      address: '福建省福州市闽侯县上街镇学府南路2号',
      addressCode: 'fzsmsxsxzfx',
      city: '福州市',
      district: '闽侯县',
      region: '福建省福州市',
      industry: '教育',
      remark: '图书馆',
      relatedWords: '福大 图书馆',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '1',
      services: ['dial']
    },
    {
      id: '2-3',
      name: '福州大学校医院',
      phoneNumber: '0591-22866670',
      nameCode: 'fzdxxyy',
      address: '福建省福州市闽侯县上街镇学府南路2号',
      addressCode: 'fzsmsxsxzfx',
      city: '福州市',
      district: '闽侯县',
      region: '福建省福州市',
      industry: '医疗',
      remark: '校医院',
      relatedWords: '福大 医院 校医院',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '1',
      services: ['dial']
    }
  ]
  
  // 福州大学系列（包含下级）- 拥有所有业务
  data.push({
    id: '1',
    name: '福州大学',
    phoneNumber: '0591-22866666',
    nameCode: 'fzdxfzdxfz',
    address: '福建省福州市闽侯县上街镇学府南路2号',
    addressCode: 'fzsmsxsxzfx',
    city: '福州市',
    district: '闽侯县',
    region: '福建省福州市',
    shortName: '福大',
    shortNameCode: 'fd001',
    alias: '福州',
    aliasCode: 'fz01',
    industry: '教育',
    remark: '211工程重点大学',
    relatedWords: '福大 福州大学 学府南路',
    isConfidential: false,
    isOutOfService: false,
    level: 1,
    children: fuzhouUniversityChildren,
    services: ['dial', 'elegant', 'brand', 'realName', 'transfer', 'sms', 'card'],
    elegantBusiness: {
      salesArea: '福州 全市',
      keywords: '空调清洗、空调清洁',
      keywordCode: 'ktqx'
    },
    realNameBusiness: {
      companyName: '福州大学',
      realNameCode: 'RM20240001'
    },
    transferBusiness: {
      transferNumbers: ['0591-22866667', '0591-22866668', '0591-22866669'],
      transferTimeStart: '08:00',
      transferTimeEnd: '22:00'
    },
    brandBusiness: {
      adText: '您好，欢迎致电福州大学'
    }
  })
  
  // 添加福州大学下级到数据列表
  fuzhouUniversityChildren.forEach(child => data.push(child))
  
  // 厦门大学下级单位（下级只展示拍号）
  const xiamenUniversityChildren = [
    {
      id: '4',
      name: '厦门大学保密办公室',
      phoneNumber: '0592-2186****',
      nameCode: 'xmdxbmbgs',
      address: '福建省厦门市思明区思明南路422号',
      addressCode: 'xmsxmqsmm',
      city: '厦门市',
      district: '思明区',
      region: '福建省厦门市',
      industry: '教育',
      remark: '保密单位',
      relatedWords: '厦大 保密 办公室',
      isConfidential: true,
      isOutOfService: false,
      level: 2,
      parentId: '3',
      services: []
    },
    {
      id: '4-1',
      name: '厦门大学图书馆',
      phoneNumber: '0592-2186111',
      nameCode: 'xmdxtsg',
      address: '福建省厦门市思明区思明南路422号',
      addressCode: 'xmsxmqsmm',
      city: '厦门市',
      district: '思明区',
      region: '福建省厦门市',
      industry: '教育',
      remark: '图书馆',
      relatedWords: '厦大 图书馆',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '3',
      services: ['dial']
    },
    {
      id: '4-2',
      name: '厦门大学学生公寓',
      phoneNumber: '0592-2186112',
      nameCode: 'xmdxxsgy',
      address: '福建省厦门市思明区思明南路422号',
      addressCode: 'xmsxmqsmm',
      city: '厦门市',
      district: '思明区',
      region: '福建省厦门市',
      industry: '教育',
      remark: '学生公寓管理中心',
      relatedWords: '厦大 学生公寓 宿舍',
      isConfidential: false,
      isOutOfService: false,
      level: 2,
      parentId: '3',
      services: ['dial']
    }
  ]
  
  // 停机数据 - 第6条（厦门大学改为停机）
  data.push({
    id: '3',
    name: '厦门大学',
    phoneNumber: '0592-2186110',
    nameCode: 'xmdxxmdxxm',
    address: '福建省厦门市思明区思明南路422号',
    addressCode: 'xmsxmqsmm',
    city: '厦门市',
    district: '思明区',
    region: '福建省厦门市',
    industry: '教育',
    remark: '985工程重点大学（已停机）',
    relatedWords: '厦大 厦门大学 思明南路',
    isConfidential: false,
    isOutOfService: true,
    level: 1,
    children: xiamenUniversityChildren,
    services: ['elegant', 'brand', 'realName']
  })
  
  // 添加厦门大学下级到数据列表（第7-8条改为停机，只添加前2个）
  xiamenUniversityChildren.slice(0, 2).forEach((child) => {
    data.push({
      ...child,
      isOutOfService: true,
      services: ['elegant', 'brand', 'realName'],
      remark: `${child.remark}（已停机）`
    })
  })
  
  // 保密数据 - 第9条
  data.push({
    id: '5',
    name: '福建农林大学',
    phoneNumber: '0591-8378****',
    nameCode: 'fjnlfnldxfj',
    address: '福建省福州市仓山区上下店路15号',
    addressCode: 'fzsxmsjxd',
    city: '福州市',
    district: '仓山区',
    region: '福建省福州市',
    industry: '教育',
    remark: '保密单位',
    relatedWords: '农大 农林大学 上下店路',
    isConfidential: true,
    isOutOfService: false,
    level: 1,
    services: []
  })
  
  // 保密数据 - 第10条
  data.push({
    id: '6',
    name: '福建省保密局',
    phoneNumber: '0591-8788****',
    nameCode: 'fjsbmjfjsb',
    address: '福建省福州市鼓楼区华林路80号',
    addressCode: 'fzsglqhll',
    city: '福州市',
    district: '鼓楼区',
    region: '福建省福州市',
    industry: '其他',
    remark: '保密单位',
    relatedWords: '保密局 福建省保密局',
    isConfidential: true,
    isOutOfService: false,
    level: 1,
    services: []
  })
  
  // 生成更多数据
  const names = [
    '服务中心', '营业厅', '分公司', '总部', '办事处', '门店',
    '医院', '诊所', '药店', '银行', '支行', '营业部',
    '餐厅', '酒店', '超市', '商场', '工厂', '公司'
  ]
  
  const streets = [
    '中山路', '解放路', '人民路', '建设路', '文化路', '工业路',
    '五四路', '东街口', '西湖路', '温泉路', '华林路', '六一北路'
  ]
  
  for (let i = 6; i <= 400; i++) {
    const cityIndex = Math.floor(Math.random() * cities.length)
    const city = cities[cityIndex]
    const district = city.districts[Math.floor(Math.random() * city.districts.length)]
    const namePrefix = city.name.replace('市', '')
    const nameSuffix = names[Math.floor(Math.random() * names.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 999) + 1
    const isConfidential = Math.random() > 0.95
    const isOutOfService = Math.random() > 0.97
    
    // 根据状态生成业务类型
    let services: string[] = []
    if (!isConfidential && !isOutOfService) {
      // 正常数据随机拥有部分业务
      const allServices = ['dial', 'elegant', 'brand', 'realName', 'transfer', 'sms', 'card']
      const serviceCount = Math.floor(Math.random() * 4) + 2 // 2-5个业务
      for (let j = 0; j < serviceCount; j++) {
        const svc = allServices[Math.floor(Math.random() * allServices.length)]
        if (!services.includes(svc)) {
          services.push(svc)
        }
      }
      // 确保有dial
      if (!services.includes('dial')) {
        services.unshift('dial')
      }
    } else if (!isConfidential && isOutOfService) {
      // 停机数据不展示拍号
      services = ['elegant', 'brand', 'realName']
    }
    // 保密数据不展示任何业务
    
    // 根据业务类型生成对应的业务信息
    const elegantBusiness = services.includes('elegant') ? {
      salesArea: `${city.name} 全市`,
      keywords: ['空调清洗', '空调清洁', '家电维修', '家政服务', '装修设计'][Math.floor(Math.random() * 5)],
      keywordCode: ['ktqx', 'ktqj', 'jdwx', 'jzfw', 'zxds'][Math.floor(Math.random() * 5)]
    } : undefined
    
    const realNameBusiness = services.includes('realName') ? {
      companyName: `${namePrefix}${nameSuffix}`,
      realNameCode: `RM${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`
    } : undefined
    
    const transferBusiness = services.includes('transfer') ? {
      transferNumbers: [
        `059${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 899999 + 100000)}`,
        Math.random() > 0.5 ? `059${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 899999 + 100000)}` : undefined
      ].filter(Boolean) as string[],
      transferTimeStart: ['08:00', '09:00', '07:30'][Math.floor(Math.random() * 3)],
      transferTimeEnd: ['18:00', '19:00', '20:00', '22:00'][Math.floor(Math.random() * 4)]
    } : undefined
    
    const brandBusiness = services.includes('brand') ? {
      adText: `您好，欢迎致电${namePrefix}${nameSuffix}`
    } : undefined
    
    // 生成简称和别名
    const shortName = `${namePrefix}${nameSuffix}`.substring(0, 6)
    const shortNameCode = `${namePrefix.substring(0, 1)}${nameSuffix.substring(0, 1)}${Math.random().toString(36).substring(2, 5)}`
    const alias = `${namePrefix}${nameSuffix}`.substring(0, 4)
    const aliasCode = `${namePrefix.substring(0, 1)}${nameSuffix.substring(0, 1)}${Math.floor(Math.random() * 1000)}`
    
    data.push({
      id: i.toString(),
      name: `${namePrefix}${nameSuffix}`,
      phoneNumber: `059${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 89999999 + 10000000)}`,
      nameCode: `${namePrefix.substring(0, 2)}${nameSuffix.substring(0, 2)}${Math.random().toString(36).substring(2, 6)}`,
      address: `福建省${city.name}${district.name}${street}${number}号`,
      addressCode: `${city.code.substring(0, 2)}${district.code.substring(0, 2)}${street.substring(0, 2)}`,
      city: city.name,
      district: district.name,
      region: `福建省${city.name}`,
      shortName,
      shortNameCode,
      alias,
      aliasCode,
      industry: industries[Math.floor(Math.random() * industries.length)],
      remark: Math.random() > 0.8 ? '重要客户' : '',
      relatedWords: `${namePrefix} ${nameSuffix} ${street}`,
      isConfidential,
      isOutOfService,
      level: Math.floor(Math.random() * 3) + 1,
      services,
      elegantBusiness,
      realNameBusiness,
      transferBusiness,
      brandBusiness
    })
  }
  
  // 添加固定的停机数据：漳州营业部
  data.push({
    id: 'special-1',
    name: '漳州营业部',
    phoneNumber: '0596-87889999',
    nameCode: 'zzbybzzby',
    address: '福建省漳州市芗城区胜利路123号',
    addressCode: 'zzsxlyl',
    city: '漳州市',
    district: '芗城区',
    region: '福建省漳州市',
    shortName: '漳州部',
    shortNameCode: 'zzb001',
    alias: '漳州',
    aliasCode: 'zz01',
    industry: '金融',
    remark: '已停机',
    relatedWords: '漳州 营业部',
    isConfidential: false,
    isOutOfService: true,
    level: 1,
    services: ['elegant', 'brand', 'realName'],
    elegantBusiness: {
      salesArea: '漳州 全市',
      keywords: '金融服务',
      keywordCode: 'jrfw'
    },
    realNameBusiness: {
      companyName: '漳州营业部',
      realNameCode: 'RM20240002'
    },
    brandBusiness: {
      adText: '您好，欢迎致电漳州营业部'
    }
  })
  
  // 添加固定的停机数据：厦门诊所
  data.push({
    id: 'special-2',
    name: '厦门诊所',
    phoneNumber: '0592-66887777',
    nameCode: 'xmzsxmzs',
    address: '福建省厦门市思明区湖滨北路456号',
    addressCode: 'xmsbhbl',
    city: '厦门市',
    district: '思明区',
    region: '福建省厦门市',
    shortName: '厦诊',
    shortNameCode: 'xz001',
    alias: '厦门',
    aliasCode: 'xm01',
    industry: '医疗',
    remark: '已停机',
    relatedWords: '厦门 诊所',
    isConfidential: false,
    isOutOfService: true,
    level: 1,
    services: ['elegant', 'brand', 'realName'],
    elegantBusiness: {
      salesArea: '厦门 全市',
      keywords: '医疗服务',
      keywordCode: 'ylfw'
    },
    realNameBusiness: {
      companyName: '厦门诊所',
      realNameCode: 'RM20240003'
    },
    brandBusiness: {
      adText: '您好，欢迎致电厦门诊所'
    }
  })
  
  return data
}

const mockData = generateMockData()

// 优推商户轮询计数器（用于记录每个优推商户被拍号的次数）
const elegantDialCounter = new Map<string, number>()

// 初始化优推商户计数器
mockData.forEach(item => {
  if (item.services?.includes('elegant')) {
    elegantDialCounter.set(item.id, item.elegantCount || 0)
  }
})

// 获取地市列表
export const getCities = async (): Promise<ApiResponse<CityInfo[]>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: cities,
    success: true
  }
}

// 搜索客户
export const searchCustomers = async (params: SearchParams): Promise<ApiResponse<SearchResult>> => {
  await delay(500)

  let result = [...mockData]

  // 通用搜索（模糊查询所有字段）
  if (params.generalKeyword) {
    const keywords = params.generalKeyword.split(/\s+/).filter(k => k)
    result = result.filter(item => {
      return keywords.some(keyword =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.phoneNumber.includes(keyword) ||
        item.address.toLowerCase().includes(keyword.toLowerCase()) ||
        item.nameCode.toLowerCase().includes(keyword.toLowerCase()) ||
        item.relatedWords.toLowerCase().includes(keyword.toLowerCase()) ||
        item.industry.toLowerCase().includes(keyword.toLowerCase()) ||
        item.remark.toLowerCase().includes(keyword.toLowerCase())
      )
    })
  }

  // 多关键词搜索（支持空格分隔）
  if (params.customerName) {
    const keywords = params.customerName.split(/\s+/).filter(k => k)
    result = result.filter(item => {
      return keywords.some(keyword =>
        item.name.includes(keyword) ||
        item.relatedWords.includes(keyword)
      )
    })
  }

  if (params.phoneNumber) {
    result = result.filter(item => item.phoneNumber.includes(params.phoneNumber!))
  }

  if (params.nameCode) {
    result = result.filter(item => item.nameCode.includes(params.nameCode!))
  }

  if (params.relatedWords) {
    const keywords = params.relatedWords.split(/\s+/).filter(k => k)
    result = result.filter(item => {
      return keywords.some(keyword =>
        item.relatedWords.includes(keyword) ||
        item.name.includes(keyword) ||
        item.address.includes(keyword)
      )
    })
  }
  
  if (params.city) {
    const cityName = cities.find(c => c.code === params.city)?.name
    if (cityName) {
      result = result.filter(item => item.city === cityName)
    }
  }
  
  if (params.district) {
    const city = cities.find(c => c.code === params.city)
    const districtName = city?.districts.find(d => d.code === params.district)?.name
    if (districtName) {
      result = result.filter(item => item.district === districtName)
    }
  }
  
  // 优推商户优先排序（按轮询计数器从小到大排序，实现轮询效果）
  const elegantItems = result.filter(item => item.services?.includes('elegant') && !item.isOutOfService && !item.isConfidential)
  const normalItems = result.filter(item => !item.services?.includes('elegant') || item.isOutOfService || item.isConfidential)
  
  // 对优推商户按计数器排序（计数器小的优先）
  elegantItems.sort((a, b) => {
    const countA = elegantDialCounter.get(a.id) || 0
    const countB = elegantDialCounter.get(b.id) || 0
    return countA - countB
  })
  
  // 将漳州营业部和厦门诊所固定在优推商户之后，确保出现在第一页
  const specialItems = result.filter(item => item.name === '漳州营业部' || item.name === '厦门诊所')
  const otherElegantItems = elegantItems.filter(item => item.name !== '漳州营业部' && item.name !== '厦门诊所')
  const otherNormalItems = normalItems.filter(item => item.name !== '漳州营业部' && item.name !== '厦门诊所')
  
  // 合并结果：优推在前，特殊停机数据紧随其后，普通数据在最后
  result = [...otherElegantItems, ...specialItems, ...otherNormalItems]
  
  // 标记优先播报（前3个优推商户标记为优先）
  result = result.map((item, index) => ({
    ...item,
    isPriority: index < 3 && item.services?.includes('elegant') && !item.isOutOfService && !item.isConfidential
  }))
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const total = result.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = result.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page,
      pageSize,
      totalPages
    },
    success: true
  }
}

// 获取客户详情
export const getCustomerDetail = async (id: string): Promise<ApiResponse<CustomerInfo>> => {
  await delay(300)
  const customer = mockData.find(c => c.id === id)
  if (customer) {
    return {
      code: 200,
      message: 'success',
      data: customer,
      success: true
    }
  }
  return {
    code: 404,
    message: '客户不存在',
    data: null as any,
    success: false
  }
}

// 拍号 - 向客户语音播报号码
export const dialNumber = async (params: DialParams): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(800)

  // 如果是优推商户，增加计数器（实现轮询）
  const customer = mockData.find(c => c.id === params.customerId)
  if (customer && customer.services?.includes('elegant')) {
    const currentCount = elegantDialCounter.get(params.customerId) || 0
    elegantDialCounter.set(params.customerId, currentCount + 1)
    customer.elegantCount = currentCount + 1
  }

  return {
    code: 200,
    message: '拍号成功，正在向客户语音播报号码信息',
    data: { success: true },
    success: true
  }
}

// 转接
export const transferCall = async (params: TransferParams): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(600)
  return {
    code: 200,
    message: `转接成功至 ${params.targetName}`,
    data: { success: true },
    success: true
  }
}

// 转接到客户号码（将来电转接到客户）
export const transferToCustomer = async (params: {
  customerId: string
  customerName: string
  phoneNumber: string
}): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(800)
  return {
    code: 200,
    message: `已将来电转接至客户号码：${params.phoneNumber}`,
    data: { success: true },
    success: true
  }
}

// 发送短信
export const sendSms = async (params: SmsParams): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(500)
  return {
    code: 200,
    message: '短信发送成功',
    data: { success: true },
    success: true
  }
}

// 发送短信给来电用户
export const sendSmsToCaller = async (params: {
  customerId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  content: string
}): Promise<ApiResponse<{ success: boolean }>> => {
  await delay(600)
  return {
    code: 200,
    message: '短信已发送给来电用户',
    data: { success: true },
    success: true
  }
}

// 获取转接目标列表
export const getTransferTargets = async (): Promise<ApiResponse<TransferTarget[]>> => {
  await delay(300)
  const targets: TransferTarget[] = [
    { id: 'dept1', name: '客服一部', type: 'department' },
    { id: 'dept2', name: '客服二部', type: 'department' },
    { id: 'dept3', name: '技术支持部', type: 'department' },
    { id: 'agent1', name: '张三', type: 'agent', status: 'online' },
    { id: 'agent2', name: '李四', type: 'agent', status: 'busy' },
    { id: 'agent3', name: '王五', type: 'agent', status: 'online' },
    { id: 'agent4', name: '赵六', type: 'agent', status: 'offline' },
  ]
  return {
    code: 200,
    message: 'success',
    data: targets,
    success: true
  }
}

// 获取短信模板
export const getSmsTemplates = async (): Promise<ApiResponse<SmsTemplate[]>> => {
  await delay(200)
  const templates: SmsTemplate[] = [
    { id: '1', name: '默认模板', content: '您好，这是您查询的号码信息，请查收。' },
    { id: '2', name: '拍号通知', content: '您已成功拍号，号码为{phoneNumber}，请注意接听。' },
    { id: '3', name: '转接通知', content: '您的电话已转接至{targetName}，请稍候。' },
  ]
  return {
    code: 200,
    message: 'success',
    data: templates,
    success: true
  }
}

// 获取当前坐席状态
export const getAgentStatus = async (): Promise<ApiResponse<{
  isOnline: boolean
  isBusy: boolean
  city: string
  noIncomingCall: boolean
}>> => {
  await delay(100)
  return {
    code: 200,
    message: 'success',
    data: {
      isOnline: true,
      isBusy: false,
      city: 'fuzhou',
      noIncomingCall: false
    },
    success: true
  }
}
