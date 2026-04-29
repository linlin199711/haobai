/**
 * 号码本地搜 - 地区搜索mock数据
 * @description 地区搜索模拟数据
 * @version 1.0.0
 */

import type { CityInfo, DistrictInfo, AreaSearchResult, AreaSearchParams, AreaSearchResponse } from '../types/areaSearch'

// 福建省地市数据
export const mockCities: CityInfo[] = [
  {
    id: '1',
    code: '350100',
    name: '福州市',
    pinyin: 'fuzhou',
    pinyinInitial: 'fz',
    zipCode: '350000',
    areaCode: '0591',
    districts: [
      { id: '101', code: '350102', name: '鼓楼区', pinyin: 'gulou', pinyinInitial: 'gl', zipCode: '350001', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '102', code: '350103', name: '台江区', pinyin: 'taijiang', pinyinInitial: 'tj', zipCode: '350004', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '103', code: '350104', name: '仓山区', pinyin: 'cangshan', pinyinInitial: 'cs', zipCode: '350007', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '104', code: '350105', name: '马尾区', pinyin: 'mawei', pinyinInitial: 'mw', zipCode: '350015', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '105', code: '350111', name: '晋安区', pinyin: 'jinan', pinyinInitial: 'ja', zipCode: '350011', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '106', code: '350112', name: '长乐区', pinyin: 'changle', pinyinInitial: 'cl', zipCode: '350200', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '107', code: '350121', name: '闽侯县', pinyin: 'minhou', pinyinInitial: 'mh', zipCode: '350100', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '108', code: '350122', name: '连江县', pinyin: 'lianjiang', pinyinInitial: 'lj', zipCode: '350500', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '109', code: '350123', name: '罗源县', pinyin: 'luoyuan', pinyinInitial: 'ly', zipCode: '350600', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '110', code: '350124', name: '闽清县', pinyin: 'minqing', pinyinInitial: 'mq', zipCode: '350800', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '111', code: '350125', name: '永泰县', pinyin: 'yongtai', pinyinInitial: 'yt', zipCode: '350700', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '112', code: '350128', name: '平潭县', pinyin: 'pingtan', pinyinInitial: 'pt', zipCode: '350400', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' },
      { id: '113', code: '350181', name: '福清市', pinyin: 'fuqing', pinyinInitial: 'fq', zipCode: '350300', cityCode: '350100', cityName: '福州市', cityZipCode: '350000', cityAreaCode: '0591' }
    ]
  },
  {
    id: '2',
    code: '350200',
    name: '厦门市',
    pinyin: 'xiamen',
    pinyinInitial: 'xm',
    zipCode: '361000',
    areaCode: '0592',
    districts: [
      { id: '201', code: '350203', name: '思明区', pinyin: 'siming', pinyinInitial: 'sm', zipCode: '361001', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' },
      { id: '202', code: '350205', name: '海沧区', pinyin: 'haicang', pinyinInitial: 'hc', zipCode: '361026', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' },
      { id: '203', code: '350206', name: '湖里区', pinyin: 'huli', pinyinInitial: 'hl', zipCode: '361006', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' },
      { id: '204', code: '350211', name: '集美区', pinyin: 'jimei', pinyinInitial: 'jm', zipCode: '361021', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' },
      { id: '205', code: '350212', name: '同安区', pinyin: 'tongan', pinyinInitial: 'ta', zipCode: '361100', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' },
      { id: '206', code: '350213', name: '翔安区', pinyin: 'xiangan', pinyinInitial: 'xa', zipCode: '361101', cityCode: '350200', cityName: '厦门市', cityZipCode: '361000', cityAreaCode: '0592' }
    ]
  },
  {
    id: '3',
    code: '350300',
    name: '莆田市',
    pinyin: 'putian',
    pinyinInitial: 'pt',
    zipCode: '351100',
    areaCode: '0594',
    districts: [
      { id: '301', code: '350302', name: '城厢区', pinyin: 'chengxiang', pinyinInitial: 'cx', zipCode: '351100', cityCode: '350300', cityName: '莆田市', cityZipCode: '351100', cityAreaCode: '0594' },
      { id: '302', code: '350303', name: '涵江区', pinyin: 'hanjiang', pinyinInitial: 'hj', zipCode: '351111', cityCode: '350300', cityName: '莆田市', cityZipCode: '351100', cityAreaCode: '0594' },
      { id: '303', code: '350304', name: '荔城区', pinyin: 'licheng', pinyinInitial: 'lc', zipCode: '351100', cityCode: '350300', cityName: '莆田市', cityZipCode: '351100', cityAreaCode: '0594' },
      { id: '304', code: '350305', name: '秀屿区', pinyin: 'xiuyu', pinyinInitial: 'xy', zipCode: '351152', cityCode: '350300', cityName: '莆田市', cityZipCode: '351100', cityAreaCode: '0594' },
      { id: '305', code: '350322', name: '仙游县', pinyin: 'xianyou', pinyinInitial: 'xy', zipCode: '351200', cityCode: '350300', cityName: '莆田市', cityZipCode: '351100', cityAreaCode: '0594' }
    ]
  },
  {
    id: '4',
    code: '350400',
    name: '三明市',
    pinyin: 'sanming',
    pinyinInitial: 'sm',
    zipCode: '365000',
    areaCode: '0598',
    districts: [
      { id: '401', code: '350402', name: '梅列区', pinyin: 'meilie', pinyinInitial: 'ml', zipCode: '365000', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '402', code: '350403', name: '三元区', pinyin: 'sanyuan', pinyinInitial: 'sy', zipCode: '365001', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '403', code: '350421', name: '明溪县', pinyin: 'mingxi', pinyinInitial: 'mx', zipCode: '365200', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '404', code: '350423', name: '清流县', pinyin: 'qingliu', pinyinInitial: 'ql', zipCode: '365300', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '405', code: '350424', name: '宁化县', pinyin: 'ninghua', pinyinInitial: 'nh', zipCode: '365400', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '406', code: '350425', name: '大田县', pinyin: 'datian', pinyinInitial: 'dt', zipCode: '366100', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '407', code: '350426', name: '尤溪县', pinyin: 'youxi', pinyinInitial: 'yx', zipCode: '365100', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '408', code: '350427', name: '沙县', pinyin: 'shaxian', pinyinInitial: 'sx', zipCode: '365500', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '409', code: '350428', name: '将乐县', pinyin: 'jiangle', pinyinInitial: 'jl', zipCode: '353300', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '410', code: '350429', name: '泰宁县', pinyin: 'taining', pinyinInitial: 'tn', zipCode: '354400', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '411', code: '350430', name: '建宁县', pinyin: 'jianning', pinyinInitial: 'jn', zipCode: '354500', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' },
      { id: '412', code: '350481', name: '永安市', pinyin: 'yongan', pinyinInitial: 'ya', zipCode: '366000', cityCode: '350400', cityName: '三明市', cityZipCode: '365000', cityAreaCode: '0598' }
    ]
  },
  {
    id: '5',
    code: '350500',
    name: '泉州市',
    pinyin: 'quanzhou',
    pinyinInitial: 'qz',
    zipCode: '362000',
    areaCode: '0595',
    districts: [
      { id: '501', code: '350502', name: '鲤城区', pinyin: 'licheng', pinyinInitial: 'lc', zipCode: '362000', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '502', code: '350503', name: '丰泽区', pinyin: 'fengze', pinyinInitial: 'fz', zipCode: '362000', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '503', code: '350504', name: '洛江区', pinyin: 'luojiang', pinyinInitial: 'lj', zipCode: '362011', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '504', code: '350505', name: '泉港区', pinyin: 'quangang', pinyinInitial: 'qg', zipCode: '362114', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '505', code: '350521', name: '惠安县', pinyin: 'huian', pinyinInitial: 'ha', zipCode: '362100', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '506', code: '350524', name: '安溪县', pinyin: 'anxi', pinyinInitial: 'ax', zipCode: '362400', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '507', code: '350525', name: '永春县', pinyin: 'yongchun', pinyinInitial: 'yc', zipCode: '362600', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '508', code: '350526', name: '德化县', pinyin: 'dehua', pinyinInitial: 'dh', zipCode: '362500', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '509', code: '350527', name: '金门县', pinyin: 'jinmen', pinyinInitial: 'jm', zipCode: '362000', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '510', code: '350581', name: '石狮市', pinyin: 'shishi', pinyinInitial: 'ss', zipCode: '362700', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '511', code: '350582', name: '晋江市', pinyin: 'jinjiang', pinyinInitial: 'jj', zipCode: '362200', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' },
      { id: '512', code: '350583', name: '南安市', pinyin: 'nanan', pinyinInitial: 'na', zipCode: '362300', cityCode: '350500', cityName: '泉州市', cityZipCode: '362000', cityAreaCode: '0595' }
    ]
  },
  {
    id: '6',
    code: '350600',
    name: '漳州市',
    pinyin: 'zhangzhou',
    pinyinInitial: 'zz',
    zipCode: '363000',
    areaCode: '0596',
    districts: [
      { id: '601', code: '350602', name: '芗城区', pinyin: 'xiangcheng', pinyinInitial: 'xc', zipCode: '363000', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '602', code: '350603', name: '龙文区', pinyin: 'longwen', pinyinInitial: 'lw', zipCode: '363005', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '603', code: '350622', name: '云霄县', pinyin: 'yunxiao', pinyinInitial: 'yx', zipCode: '363300', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '604', code: '350623', name: '漳浦县', pinyin: 'zhangpu', pinyinInitial: 'zp', zipCode: '363200', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '605', code: '350624', name: '诏安县', pinyin: 'zhaoan', pinyinInitial: 'za', zipCode: '363500', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '606', code: '350625', name: '长泰县', pinyin: 'changtai', pinyinInitial: 'ct', zipCode: '363900', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '607', code: '350626', name: '东山县', pinyin: 'dongshan', pinyinInitial: 'ds', zipCode: '363400', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '608', code: '350627', name: '南靖县', pinyin: 'nanjing', pinyinInitial: 'nj', zipCode: '363600', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '609', code: '350628', name: '平和县', pinyin: 'pinghe', pinyinInitial: 'ph', zipCode: '363700', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '610', code: '350629', name: '华安县', pinyin: 'huaan', pinyinInitial: 'ha', zipCode: '363800', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' },
      { id: '611', code: '350681', name: '龙海市', pinyin: 'longhai', pinyinInitial: 'lh', zipCode: '363100', cityCode: '350600', cityName: '漳州市', cityZipCode: '363000', cityAreaCode: '0596' }
    ]
  },
  {
    id: '7',
    code: '350700',
    name: '南平市',
    pinyin: 'nanping',
    pinyinInitial: 'np',
    zipCode: '353000',
    areaCode: '0599',
    districts: [
      { id: '701', code: '350702', name: '延平区', pinyin: 'yanping', pinyinInitial: 'yp', zipCode: '353000', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '702', code: '350703', name: '建阳区', pinyin: 'jianyang', pinyinInitial: 'jy', zipCode: '354200', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '703', code: '350721', name: '顺昌县', pinyin: 'shunchang', pinyinInitial: 'sc', zipCode: '353200', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '704', code: '350722', name: '浦城县', pinyin: 'pucheng', pinyinInitial: 'pc', zipCode: '353400', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '705', code: '350723', name: '光泽县', pinyin: 'guangze', pinyinInitial: 'gz', zipCode: '354100', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '706', code: '350724', name: '松溪县', pinyin: 'songxi', pinyinInitial: 'sx', zipCode: '353500', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '707', code: '350725', name: '政和县', pinyin: 'zhenghe', pinyinInitial: 'zh', zipCode: '353600', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '708', code: '350781', name: '邵武市', pinyin: 'shaowu', pinyinInitial: 'sw', zipCode: '354000', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '709', code: '350782', name: '武夷山市', pinyin: 'wuyishan', pinyinInitial: 'wys', zipCode: '354300', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' },
      { id: '710', code: '350783', name: '建瓯市', pinyin: 'jianou', pinyinInitial: 'jo', zipCode: '353100', cityCode: '350700', cityName: '南平市', cityZipCode: '353000', cityAreaCode: '0599' }
    ]
  },
  {
    id: '8',
    code: '350800',
    name: '龙岩市',
    pinyin: 'longyan',
    pinyinInitial: 'ly',
    zipCode: '364000',
    areaCode: '0597',
    districts: [
      { id: '801', code: '350802', name: '新罗区', pinyin: 'xinluo', pinyinInitial: 'xl', zipCode: '364000', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '802', code: '350803', name: '永定区', pinyin: 'yongding', pinyinInitial: 'yd', zipCode: '364100', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '803', code: '350821', name: '长汀县', pinyin: 'changting', pinyinInitial: 'ct', zipCode: '366300', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '804', code: '350823', name: '上杭县', pinyin: 'shanghang', pinyinInitial: 'sh', zipCode: '364200', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '805', code: '350824', name: '武平县', pinyin: 'wuping', pinyinInitial: 'wp', zipCode: '364300', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '806', code: '350825', name: '连城县', pinyin: 'liancheng', pinyinInitial: 'lc', zipCode: '366200', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' },
      { id: '807', code: '350881', name: '漳平市', pinyin: 'zhangping', pinyinInitial: 'zp', zipCode: '364400', cityCode: '350800', cityName: '龙岩市', cityZipCode: '364000', cityAreaCode: '0597' }
    ]
  },
  {
    id: '9',
    code: '350900',
    name: '宁德市',
    pinyin: 'ningde',
    pinyinInitial: 'nd',
    zipCode: '352000',
    areaCode: '0593',
    districts: [
      { id: '901', code: '350902', name: '蕉城区', pinyin: 'jiaocheng', pinyinInitial: 'jc', zipCode: '352100', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '902', code: '350921', name: '霞浦县', pinyin: 'xiapu', pinyinInitial: 'xp', zipCode: '355100', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '903', code: '350922', name: '古田县', pinyin: 'gutian', pinyinInitial: 'gt', zipCode: '352200', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '904', code: '350923', name: '屏南县', pinyin: 'pingnan', pinyinInitial: 'pn', zipCode: '352300', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '905', code: '350924', name: '寿宁县', pinyin: 'shouning', pinyinInitial: 'sn', zipCode: '355500', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '906', code: '350925', name: '周宁县', pinyin: 'zhouning', pinyinInitial: 'zn', zipCode: '355400', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '907', code: '350926', name: '柘荣县', pinyin: 'zherong', pinyinInitial: 'zr', zipCode: '355300', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '908', code: '350981', name: '福安市', pinyin: 'fuan', pinyinInitial: 'fa', zipCode: '355000', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' },
      { id: '909', code: '350982', name: '福鼎市', pinyin: 'fuding', pinyinInitial: 'fd', zipCode: '355200', cityCode: '350900', cityName: '宁德市', cityZipCode: '352000', cityAreaCode: '0593' }
    ]
  }
]

// 缓存
const cache = new Map<string, { data: AreaSearchResult[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

/**
 * 搜索地区
 */
export const searchArea = async (params: AreaSearchParams): Promise<AreaSearchResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const cacheKey = `${params.keyword}_${params.type || 'all'}`
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return {
      list: cached.data,
      total: cached.data.length
    }
  }

  const keyword = params.keyword.toLowerCase().trim()
  const results: AreaSearchResult[] = []

  if (!keyword) {
    return { list: [], total: 0 }
  }

  // 搜索地市
  mockCities.forEach(city => {
    const matchName = city.name.toLowerCase().includes(keyword)

    if (matchName) {
      results.push({
        id: `city_${city.id}`,
        type: 'city',
        city: city
      })
    }
  })

  // 搜索区县
  mockCities.forEach(city => {
    city.districts.forEach(district => {
      const matchName = district.name.toLowerCase().includes(keyword)

      if (matchName) {
        results.push({
          id: `district_${district.id}`,
          type: 'district',
          district: district
        })
      }
    })
  })

  // 过滤类型
  if (params.type) {
    const filtered = results.filter(r => r.type === params.type)
    cache.set(cacheKey, { data: filtered, timestamp: Date.now() })
    return {
      list: filtered,
      total: filtered.length
    }
  }

  cache.set(cacheKey, { data: results, timestamp: Date.now() })
  
  return {
    list: results,
    total: results.length
  }
}

/**
 * 获取所有地市
 */
export const getAllCities = async (): Promise<CityInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockCities
}

/**
 * 根据地市编码获取区县
 */
export const getDistrictsByCityCode = async (cityCode: string): Promise<DistrictInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  const city = mockCities.find(c => c.code === cityCode)
  return city?.districts || []
}
