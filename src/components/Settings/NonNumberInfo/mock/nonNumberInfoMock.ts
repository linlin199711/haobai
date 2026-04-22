/**
 * 非号码信息管理 - Mock数据
 * @description 非号码信息查询、管理模块模拟数据
 * @version 1.0.0
 */

import type {
  NonNumberInfo,
  NonNumberInfoListResponse,
  NonNumberInfoQueryParams,
  AuditStatusOption,
  InfoSourceOption,
  InfoPrecisionOption,
  QueryTypeOption,
  QueryModeOption,
  IndustryTypeOption,
  InfoTypeOption
} from '../types/nonNumberInfo'

// 审核状态选项
export const auditStatusOptions: AuditStatusOption[] = [
  { value: 'approved', label: '审核通过', color: '#67c23a' },
  { value: 'pending', label: '待审核', color: '#e6a23c' },
  { value: 'rejected', label: '已驳回', color: '#f56c6c' }
]

// 信息来源选项
export const infoSourceOptions: InfoSourceOption[] = [
  { value: 'manual', label: '人工录入' },
  { value: 'import', label: '批量导入' },
  { value: 'sync', label: '系统同步' },
  { value: 'third_party', label: '第三方接入' }
]

// 信息精度选项
export const infoPrecisionOptions: InfoPrecisionOption[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
]

// 查询类型选项
export const queryTypeOptions: QueryTypeOption[] = [
  { value: 'all', label: '全部' },
  { value: 'bus_route', label: '公交路线' },
  { value: 'bus_group', label: '公交集团' }
]

// 查询模式选项
export const queryModeOptions: QueryModeOption[] = [
  { value: 'fuzzy', label: '模糊查询' },
  { value: 'exact', label: '精确查询' }
]

// 行业类型选项
export const industryTypeOptions: IndustryTypeOption[] = [
  { value: 'transport', label: '交通运输' },
  { value: 'medical', label: '医疗卫生' },
  { value: 'education', label: '教育培训' },
  { value: 'government', label: '政府机构' },
  { value: 'finance', label: '金融服务' },
  { value: 'other', label: '其他行业' }
]

// 信息类型选项
export const infoTypeOptions: InfoTypeOption[] = [
  { value: 'route', label: '路线信息' },
  { value: 'station', label: '站点信息' },
  { value: 'schedule', label: '时刻表' },
  { value: 'contact', label: '联系方式' },
  { value: 'other', label: '其他' }
]

// 省份数据
export const provinceOptions = [
  { value: '350000', label: '福建省' }
]

// 城市数据
export const cityOptions = [
  { value: '350500', label: '泉州市', provinceCode: '350000' },
  { value: '350100', label: '福州市', provinceCode: '350000' },
  { value: '350200', label: '厦门市', provinceCode: '350000' },
  { value: '350600', label: '漳州市', provinceCode: '350000' },
  { value: '350700', label: '南平市', provinceCode: '350000' }
]

// 区县数据
export const districtOptions = [
  // 泉州市
  { value: '350502', label: '鲤城区', cityCode: '350500' },
  { value: '350503', label: '丰泽区', cityCode: '350500' },
  { value: '350504', label: '洛江区', cityCode: '350500' },
  { value: '350505', label: '泉港区', cityCode: '350500' },
  { value: '350581', label: '石狮市', cityCode: '350500' },
  { value: '350582', label: '晋江市', cityCode: '350500' },
  { value: '350583', label: '南安市', cityCode: '350500' },
  { value: '350521', label: '惠安县', cityCode: '350500' },
  { value: '350524', label: '安溪县', cityCode: '350500' },
  { value: '350525', label: '永春县', cityCode: '350500' },
  { value: '350526', label: '德化县', cityCode: '350500' },
  // 福州市
  { value: '350102', label: '鼓楼区', cityCode: '350100' },
  { value: '350103', label: '台江区', cityCode: '350100' },
  { value: '350104', label: '仓山区', cityCode: '350100' },
  { value: '350105', label: '马尾区', cityCode: '350100' },
  { value: '350111', label: '晋安区', cityCode: '350100' }
]

// Mock非号码信息数据
const mockNonNumberInfoList: NonNumberInfo[] = [
  // 公交路线数据
  {
    id: '1',
    infoTitle: '泉州公交1路（清源山-海星小区）',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'high',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-15 09:30:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350502',
      includeSubordinate: true
    },
    createTime: '2024-01-15 09:30:00',
    updateTime: '2024-01-15 09:30:00',
    creator: '张三',
    auditor: '李四',
    auditTime: '2024-01-15 10:00:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R001',
      routeName: '泉州公交1路',
      routeNo: '1路',
      startStation: '清源山风景区',
      endStation: '海星小区',
      operatingTime: '06:00-22:00',
      ticketPrice: '1-3元',
      stationList: [
        { stationId: 'S001', stationName: '清源山风景区', stationOrder: 1, isTransfer: false },
        { stationId: 'S002', stationName: '清源山', stationOrder: 2, isTransfer: false },
        { stationId: 'S003', stationName: '花博园', stationOrder: 3, isTransfer: true, transferLines: ['15路', '30路'] },
        { stationId: 'S004', stationName: '泉州汽车站', stationOrder: 4, isTransfer: true, transferLines: ['2路', '3路', '5路'] },
        { stationId: 'S005', stationName: '钟楼', stationOrder: 5, isTransfer: true, transferLines: ['2路', '10路'] },
        { stationId: 'S006', stationName: '海星小区', stationOrder: 6, isTransfer: false }
      ],
      routeType: '常规线路',
      isNightRoute: false,
      intervalTime: '8-12分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '途经市区主要商圈，节假日适当加密班次'
    },
    extendedInfo: {
      keywords: ['公交', '1路', '清源山', '海星小区'],
      tags: ['热门线路', '市区主干线'],
      extraFields: {
        averageSpeed: '20km/h',
        totalDistance: '12.5km'
      }
    }
  },
  {
    id: '2',
    infoTitle: '泉州公交K1路（泉州站-晋江机场）',
    auditStatus: 'approved',
    infoSource: 'import',
    infoPrecision: 'high',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-10 14:20:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350502',
      includeSubordinate: true
    },
    createTime: '2024-01-10 14:20:00',
    updateTime: '2024-01-12 09:00:00',
    creator: '王五',
    auditor: '李四',
    auditTime: '2024-01-12 10:30:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R002',
      routeName: '泉州公交K1路',
      routeNo: 'K1路',
      startStation: '泉州火车站',
      endStation: '晋江机场',
      operatingTime: '06:30-21:30',
      ticketPrice: '2-5元',
      stationList: [
        { stationId: 'S101', stationName: '泉州火车站', stationOrder: 1, isTransfer: true, transferLines: ['3路', '17路', '33路'] },
        { stationId: 'S102', stationName: '软件园', stationOrder: 2, isTransfer: false },
        { stationId: 'S103', stationName: '华侨大学', stationOrder: 3, isTransfer: true, transferLines: ['7路', '19路'] },
        { stationId: 'S104', stationName: '万达广场', stationOrder: 4, isTransfer: true, transferLines: ['1路', '8路'] },
        { stationId: 'S105', stationName: '晋江机场', stationOrder: 5, isTransfer: false }
      ],
      routeType: '快线',
      isNightRoute: false,
      intervalTime: '15-20分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '连接高铁站与机场的快速公交线路'
    },
    extendedInfo: {
      keywords: ['公交', 'K1路', '高铁站', '机场'],
      tags: ['快线', '交通枢纽线'],
      extraFields: {
        averageSpeed: '35km/h',
        totalDistance: '25.8km'
      }
    }
  },
  {
    id: '3',
    infoTitle: '泉州公交夜1路（浦西万达-东海泰禾）',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'medium',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-08 16:45:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350503',
      includeSubordinate: true
    },
    createTime: '2024-01-08 16:45:00',
    updateTime: '2024-01-08 16:45:00',
    creator: '赵六',
    auditor: '李四',
    auditTime: '2024-01-09 11:00:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R003',
      routeName: '泉州公交夜1路',
      routeNo: '夜1路',
      startStation: '浦西万达广场',
      endStation: '东海泰禾广场',
      operatingTime: '22:00-02:00',
      ticketPrice: '2元',
      stationList: [
        { stationId: 'S201', stationName: '浦西万达广场', stationOrder: 1, isTransfer: false },
        { stationId: 'S202', stationName: '领SHOW天地', stationOrder: 2, isTransfer: false },
        { stationId: 'S203', stationName: '客运中心站', stationOrder: 3, isTransfer: true, transferLines: ['1路', 'K1路'] },
        { stationId: 'S204', stationName: '东海泰禾广场', stationOrder: 4, isTransfer: false }
      ],
      routeType: '夜间线路',
      isNightRoute: true,
      intervalTime: '30分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '夜间服务线路，服务商圈和娱乐场所'
    },
    extendedInfo: {
      keywords: ['公交', '夜1路', '夜间线路'],
      tags: ['夜间线路', '商圈线'],
      extraFields: {
        averageSpeed: '25km/h',
        totalDistance: '8.2km'
      }
    }
  },
  // 公交集团数据
  {
    id: '4',
    infoTitle: '泉州公交集团有限公司',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'high',
    queryType: 'bus_group',
    queryMode: 'exact',
    industryType: 'transport',
    infoType: 'contact',
    collectTime: '2024-01-05 10:00:00',
    validStartTime: '2024-01-01',
    validEndTime: '2025-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350503',
      includeSubordinate: true
    },
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-20 15:30:00',
    creator: '张三',
    auditor: '李四',
    auditTime: '2024-01-05 14:00:00',
    businessType: 'bus_group',
    busGroupInfo: {
      groupId: 'G001',
      groupName: '泉州公交集团有限公司',
      groupCode: 'QZ-GJ-001',
      address: '福建省泉州市丰泽区泉秀街289号',
      contactPhone: '0595-22180001',
      serviceHotline: '0595-968856',
      complaintHotline: '0595-22180002',
      officialWebsite: 'www.qzbus.com',
      businessHours: '06:00-22:00',
      serviceScope: '泉州市区及周边县市的公交客运服务',
      subCompanies: [
        { companyId: 'C001', companyName: '鲤城分公司', address: '鲤城区新华北路123号', contactPhone: '0595-22280001', responsibleArea: '鲤城区' },
        { companyId: 'C002', companyName: '丰泽分公司', address: '丰泽区刺桐路456号', contactPhone: '0595-22280002', responsibleArea: '丰泽区' },
        { companyId: 'C003', companyName: '洛江分公司', address: '洛江区万安路789号', contactPhone: '0595-22280003', responsibleArea: '洛江区' },
        { companyId: 'C004', companyName: '泉港分公司', address: '泉港区山腰街道101号', contactPhone: '0595-22280004', responsibleArea: '泉港区' }
      ],
      remarks: '泉州市主要公交运营企业，服务覆盖全市'
    },
    extendedInfo: {
      keywords: ['公交', '集团', '泉州公交'],
      tags: ['主要运营企业', '国有企业'],
      extraFields: {
        foundedDate: '1958年',
        fleetSize: '1200辆',
        staffCount: '2800人'
      }
    }
  },
  {
    id: '5',
    infoTitle: '晋江公共交通有限公司',
    auditStatus: 'approved',
    infoSource: 'sync',
    infoPrecision: 'high',
    queryType: 'bus_group',
    queryMode: 'exact',
    industryType: 'transport',
    infoType: 'contact',
    collectTime: '2024-01-12 11:30:00',
    validStartTime: '2024-01-01',
    validEndTime: '2025-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350582',
      includeSubordinate: false
    },
    createTime: '2024-01-12 11:30:00',
    updateTime: '2024-01-15 09:00:00',
    creator: '王五',
    auditor: '李四',
    auditTime: '2024-01-15 10:00:00',
    businessType: 'bus_group',
    busGroupInfo: {
      groupId: 'G002',
      groupName: '晋江公共交通有限公司',
      groupCode: 'JJ-GJ-001',
      address: '福建省泉州市晋江市世纪大道111号',
      contactPhone: '0595-85680001',
      serviceHotline: '0595-85680002',
      complaintHotline: '0595-85680003',
      officialWebsite: 'www.jjbus.com',
      businessHours: '06:00-21:30',
      serviceScope: '晋江市全域公交客运服务',
      subCompanies: [
        { companyId: 'C101', companyName: '青阳分公司', address: '晋江市青阳街道阳光路1号', contactPhone: '0595-85680101', responsibleArea: '青阳街道' },
        { companyId: 'C102', companyName: '罗山分公司', address: '晋江市罗山街道福兴路2号', contactPhone: '0595-85680102', responsibleArea: '罗山街道' },
        { companyId: 'C103', companyName: '池店分公司', address: '晋江市池店镇泉安路3号', contactPhone: '0595-85680103', responsibleArea: '池店镇' }
      ],
      remarks: '晋江市公交运营企业，服务覆盖全市各镇街道'
    },
    extendedInfo: {
      keywords: ['公交', '晋江公交', '晋江'],
      tags: ['县级公交', '地方企业'],
      extraFields: {
        foundedDate: '1998年',
        fleetSize: '350辆',
        staffCount: '680人'
      }
    }
  },
  // 待审核数据（不应被查询到）
  {
    id: '6',
    infoTitle: '石狮公交1路（石狮站-永宁古镇）',
    auditStatus: 'pending',
    infoSource: 'manual',
    infoPrecision: 'medium',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-18 09:00:00',
    validStartTime: '2024-02-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350581',
      includeSubordinate: false
    },
    createTime: '2024-01-18 09:00:00',
    updateTime: '2024-01-18 09:00:00',
    creator: '赵六',
    auditor: '',
    auditTime: undefined,
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R004',
      routeName: '石狮公交1路',
      routeNo: '1路',
      startStation: '石狮动车站',
      endStation: '永宁古镇',
      operatingTime: '06:30-20:30',
      ticketPrice: '2元',
      stationList: [],
      routeType: '常规线路',
      isNightRoute: false,
      intervalTime: '15分钟',
      operator: '石狮公交公司',
      contactPhone: '0595-88880001',
      remarks: '待审核'
    },
    extendedInfo: {
      keywords: ['公交', '1路', '石狮'],
      tags: ['待审核'],
      extraFields: {}
    }
  },
  // 已驳回数据（不应被查询到）
  {
    id: '7',
    infoTitle: '南安公交测试线路',
    auditStatus: 'rejected',
    infoSource: 'manual',
    infoPrecision: 'low',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-10 08:00:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350583',
      includeSubordinate: false
    },
    createTime: '2024-01-10 08:00:00',
    updateTime: '2024-01-11 10:00:00',
    creator: '测试用户',
    auditor: '李四',
    auditTime: '2024-01-11 10:30:00',
    auditRemark: '信息不完整，缺少站点数据',
    businessType: 'bus_route',
    busRouteInfo: undefined,
    extendedInfo: {
      keywords: ['测试'],
      tags: ['已驳回'],
      extraFields: {}
    }
  },
  // 更多已审核数据
  {
    id: '8',
    infoTitle: '泉州公交2路（清源山-圣湖小区）',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'high',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-14 13:20:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350502',
      includeSubordinate: true
    },
    createTime: '2024-01-14 13:20:00',
    updateTime: '2024-01-14 13:20:00',
    creator: '张三',
    auditor: '李四',
    auditTime: '2024-01-14 15:00:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R005',
      routeName: '泉州公交2路',
      routeNo: '2路',
      startStation: '清源山风景区',
      endStation: '圣湖小区',
      operatingTime: '06:00-21:30',
      ticketPrice: '1-3元',
      stationList: [
        { stationId: 'S301', stationName: '清源山风景区', stationOrder: 1, isTransfer: false },
        { stationId: 'S302', stationName: '闽台缘博物馆', stationOrder: 2, isTransfer: true, transferLines: ['17路', '22路'] },
        { stationId: 'S303', stationName: '西湖公园', stationOrder: 3, isTransfer: false },
        { stationId: 'S304', stationName: '钟楼', stationOrder: 4, isTransfer: true, transferLines: ['1路', 'K1路'] },
        { stationId: 'S305', stationName: '圣湖小区', stationOrder: 5, isTransfer: false }
      ],
      routeType: '常规线路',
      isNightRoute: false,
      intervalTime: '10-15分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '途经西湖公园、钟楼等景点'
    },
    extendedInfo: {
      keywords: ['公交', '2路', '清源山', '西湖公园'],
      tags: ['旅游线'],
      extraFields: {
        averageSpeed: '18km/h',
        totalDistance: '9.5km'
      }
    }
  },
  {
    id: '9',
    infoTitle: '南安公交集团有限责任公司',
    auditStatus: 'approved',
    infoSource: 'import',
    infoPrecision: 'high',
    queryType: 'bus_group',
    queryMode: 'exact',
    industryType: 'transport',
    infoType: 'contact',
    collectTime: '2024-01-16 10:00:00',
    validStartTime: '2024-01-01',
    validEndTime: '2025-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350583',
      includeSubordinate: false
    },
    createTime: '2024-01-16 10:00:00',
    updateTime: '2024-01-16 10:00:00',
    creator: '王五',
    auditor: '李四',
    auditTime: '2024-01-16 14:00:00',
    businessType: 'bus_group',
    busGroupInfo: {
      groupId: 'G003',
      groupName: '南安公交集团有限责任公司',
      groupCode: 'NA-GJ-001',
      address: '福建省泉州市南安市成功街222号',
      contactPhone: '0595-86380001',
      serviceHotline: '0595-86380002',
      complaintHotline: '0595-86380003',
      officialWebsite: 'www.nabus.com',
      businessHours: '06:00-21:00',
      serviceScope: '南安市全域公交客运服务',
      subCompanies: [
        { companyId: 'C201', companyName: '溪美分公司', address: '南安市溪美街道新华街1号', contactPhone: '0595-86380101', responsibleArea: '溪美街道' },
        { companyId: 'C202', companyName: '柳城分公司', address: '南安市柳城街道成功街2号', contactPhone: '0595-86380102', responsibleArea: '柳城街道' }
      ],
      remarks: '南安市公交运营企业'
    },
    extendedInfo: {
      keywords: ['公交', '南安公交', '南安'],
      tags: ['县级公交'],
      extraFields: {
        foundedDate: '2005年',
        fleetSize: '180辆',
        staffCount: '320人'
      }
    }
  },
  {
    id: '10',
    infoTitle: '泉州公交21路（西湖公园-晋江鞋都）',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'high',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-17 11:00:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350582',
      includeSubordinate: true
    },
    createTime: '2024-01-17 11:00:00',
    updateTime: '2024-01-17 11:00:00',
    creator: '赵六',
    auditor: '李四',
    auditTime: '2024-01-17 16:00:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R006',
      routeName: '泉州公交21路',
      routeNo: '21路',
      startStation: '西湖公园',
      endStation: '晋江鞋都',
      operatingTime: '06:30-20:00',
      ticketPrice: '2-4元',
      stationList: [
        { stationId: 'S401', stationName: '西湖公园', stationOrder: 1, isTransfer: true, transferLines: ['2路', '17路'] },
        { stationId: 'S402', stationName: '清源山', stationOrder: 2, isTransfer: false },
        { stationId: 'S403', stationName: '泉州大桥', stationOrder: 3, isTransfer: false },
        { stationId: 'S404', stationName: '晋江池店', stationOrder: 4, isTransfer: true, transferLines: ['K1路'] },
        { stationId: 'S405', stationName: '晋江鞋都', stationOrder: 5, isTransfer: false }
      ],
      routeType: '跨区线路',
      isNightRoute: false,
      intervalTime: '12-18分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '跨区线路，连接泉州市区与晋江市'
    },
    extendedInfo: {
      keywords: ['公交', '21路', '晋江', '鞋都'],
      tags: ['跨区线', '工业区线'],
      extraFields: {
        averageSpeed: '22km/h',
        totalDistance: '18.5km'
      }
    }
  },
  {
    id: '11',
    infoTitle: '泉州公交17路（清源山-侨乡体育馆）',
    auditStatus: 'approved',
    infoSource: 'manual',
    infoPrecision: 'high',
    queryType: 'bus_route',
    queryMode: 'fuzzy',
    industryType: 'transport',
    infoType: 'route',
    collectTime: '2024-01-13 09:30:00',
    validStartTime: '2024-01-01',
    validEndTime: '2024-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350502',
      includeSubordinate: true
    },
    createTime: '2024-01-13 09:30:00',
    updateTime: '2024-01-13 09:30:00',
    creator: '张三',
    auditor: '李四',
    auditTime: '2024-01-13 11:00:00',
    businessType: 'bus_route',
    busRouteInfo: {
      routeId: 'R007',
      routeName: '泉州公交17路',
      routeNo: '17路',
      startStation: '清源山风景区',
      endStation: '侨乡体育馆',
      operatingTime: '06:00-21:00',
      ticketPrice: '1-3元',
      stationList: [
        { stationId: 'S501', stationName: '清源山风景区', stationOrder: 1, isTransfer: false },
        { stationId: 'S502', stationName: '闽台缘博物馆', stationOrder: 2, isTransfer: true, transferLines: ['2路', '22路'] },
        { stationId: 'S503', stationName: '西湖公园', stationOrder: 3, isTransfer: true, transferLines: ['21路'] },
        { stationId: 'S504', stationName: '泉州一中', stationOrder: 4, isTransfer: false },
        { stationId: 'S505', stationName: '侨乡体育馆', stationOrder: 5, isTransfer: true, transferLines: ['K1路', '3路'] }
      ],
      routeType: '常规线路',
      isNightRoute: false,
      intervalTime: '10-15分钟',
      operator: '泉州公交集团',
      contactPhone: '0595-968856',
      remarks: '途经学校和体育场馆'
    },
    extendedInfo: {
      keywords: ['公交', '17路', '清源山', '体育馆'],
      tags: ['教育线'],
      extraFields: {
        averageSpeed: '20km/h',
        totalDistance: '11.2km'
      }
    }
  },
  {
    id: '12',
    infoTitle: '惠安公交集团',
    auditStatus: 'approved',
    infoSource: 'sync',
    infoPrecision: 'medium',
    queryType: 'bus_group',
    queryMode: 'exact',
    industryType: 'transport',
    infoType: 'contact',
    collectTime: '2024-01-19 14:00:00',
    validStartTime: '2024-01-01',
    validEndTime: '2025-12-31',
    region: {
      province: '350000',
      city: '350500',
      district: '350521',
      includeSubordinate: false
    },
    createTime: '2024-01-19 14:00:00',
    updateTime: '2024-01-19 14:00:00',
    creator: '王五',
    auditor: '李四',
    auditTime: '2024-01-19 16:00:00',
    businessType: 'bus_group',
    busGroupInfo: {
      groupId: 'G004',
      groupName: '惠安公交集团',
      groupCode: 'HA-GJ-001',
      address: '福建省泉州市惠安县螺城镇建设路333号',
      contactPhone: '0595-87380001',
      serviceHotline: '0595-87380002',
      complaintHotline: '0595-87380003',
      officialWebsite: 'www.habus.com',
      businessHours: '06:00-20:30',
      serviceScope: '惠安县全域公交客运服务',
      subCompanies: [
        { companyId: 'C301', companyName: '螺城分公司', address: '惠安县螺城镇中山路1号', contactPhone: '0595-87380101', responsibleArea: '螺城镇' }
      ],
      remarks: '惠安县公交运营企业'
    },
    extendedInfo: {
      keywords: ['公交', '惠安公交', '惠安'],
      tags: ['县级公交'],
      extraFields: {
        foundedDate: '2010年',
        fleetSize: '80辆',
        staffCount: '150人'
      }
    }
  }
]

/**
 * 查询非号码信息列表
 */
export const queryNonNumberInfoList = async (
  params: NonNumberInfoQueryParams
): Promise<NonNumberInfoListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  // 只返回审核通过的数据
  let filteredList = mockNonNumberInfoList.filter(
    item => item.auditStatus === 'approved'
  )

  // 信息标题筛选
  if (params.infoTitle) {
    filteredList = filteredList.filter(item =>
      item.infoTitle.toLowerCase().includes(params.infoTitle!.toLowerCase())
    )
  }

  // 审核状态筛选
  if (params.auditStatus) {
    filteredList = filteredList.filter(
      item => item.auditStatus === params.auditStatus
    )
  }

  // 信息来源筛选
  if (params.infoSource) {
    filteredList = filteredList.filter(
      item => item.infoSource === params.infoSource
    )
  }

  // 信息精度筛选
  if (params.infoPrecision) {
    filteredList = filteredList.filter(
      item => item.infoPrecision === params.infoPrecision
    )
  }

  // 查询类型筛选
  if (params.queryType && params.queryType !== 'all') {
    filteredList = filteredList.filter(
      item => item.queryType === params.queryType
    )
  }

  // 查询模式筛选
  if (params.queryMode) {
    filteredList = filteredList.filter(
      item => item.queryMode === params.queryMode
    )
  }

  // 行业类型筛选
  if (params.industryType) {
    filteredList = filteredList.filter(
      item => item.industryType === params.industryType
    )
  }

  // 信息类型筛选
  if (params.infoType) {
    filteredList = filteredList.filter(
      item => item.infoType === params.infoType
    )
  }

  // 采编时间范围筛选
  if (params.collectTimeStart) {
    filteredList = filteredList.filter(
      item => item.collectTime >= params.collectTimeStart!
    )
  }
  if (params.collectTimeEnd) {
    filteredList = filteredList.filter(
      item => item.collectTime <= params.collectTimeEnd!
    )
  }

  // 有效时间范围筛选
  if (params.validTimeStart) {
    filteredList = filteredList.filter(
      item => item.validStartTime >= params.validTimeStart!
    )
  }
  if (params.validTimeEnd) {
    filteredList = filteredList.filter(
      item => item.validEndTime <= params.validTimeEnd!
    )
  }

  // 地区筛选
  if (params.province) {
    filteredList = filteredList.filter(
      item => item.region.province === params.province
    )
  }
  if (params.city) {
    filteredList = filteredList.filter(
      item => item.region.city === params.city
    )
  }
  if (params.district) {
    filteredList = filteredList.filter(item => {
      if (item.region.includeSubordinate) {
        // 如果包含下属地区，需要匹配该市下的所有区县
        const cityDistricts = districtOptions.filter(
          d => d.cityCode === item.region.city
        )
        return cityDistricts.some(d => d.value === params.district)
      }
      return item.region.district === params.district
    })
  }

  // 排序（默认按采编时间倒序）
  const sortField = params.sortField || 'collectTime'
  const sortOrder = params.sortOrder || 'desc'
  filteredList.sort((a, b) => {
    const aVal = a[sortField as keyof NonNumberInfo]
    const bVal = b[sortField as keyof NonNumberInfo]
    if (aVal === undefined || bVal === undefined) return 0
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

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
 * 获取非号码信息详情
 */
export const getNonNumberInfoDetail = async (
  id: string
): Promise<NonNumberInfo | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const info = mockNonNumberInfoList.find(item => item.id === id)
  // 只有审核通过的才能查看
  if (info && info.auditStatus === 'approved') {
    return info
  }
  return null
}

/**
 * 获取选项数据
 */
export const getOptionData = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    auditStatusOptions,
    infoSourceOptions,
    infoPrecisionOptions,
    queryTypeOptions,
    queryModeOptions,
    industryTypeOptions,
    infoTypeOptions,
    provinceOptions,
    cityOptions,
    districtOptions
  }
}
