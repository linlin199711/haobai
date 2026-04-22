/**
 * 挪车登记模块 - Mock数据与API
 * @description 模拟接口数据
 * @version 1.0.0
 */

import type {
  ApiResponse,
  CarMoveSearchParams,
  CarMoveSearchResult,
  CarMoveRecord,
  SubmitCarMoveParams,
  SyncCarMoveParams,
  CityInfo,
  AgentInfo,
  IncomingCallInfo
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 地市数据（福建省）
export const cities: CityInfo[] = [
  {
    code: 'fuzhou',
    name: '福州市',
    platePrefix: '闽A',
    districts: [
      { code: 'gulou', name: '鼓楼区', platePrefix: 'A' },
      { code: 'taijiang', name: '台江区', platePrefix: 'A' },
      { code: 'cangshan', name: '仓山区', platePrefix: 'A' },
      { code: 'jinan', name: '晋安区', platePrefix: 'A' },
      { code: 'mawei', name: '马尾区', platePrefix: 'A' },
      { code: 'minhou', name: '闽侯县', platePrefix: 'A' },
      { code: 'lianjiang', name: '连江县', platePrefix: 'A' },
      { code: 'luoyuan', name: '罗源县', platePrefix: 'A' },
      { code: 'minqing', name: '闽清县', platePrefix: 'A' },
      { code: 'yongtai', name: '永泰县', platePrefix: 'A' },
      { code: 'fuqing', name: '福清市', platePrefix: 'A' },
      { code: 'changle', name: '长乐区', platePrefix: 'A' }
    ]
  },
  {
    code: 'xiamen',
    name: '厦门市',
    platePrefix: '闽D',
    districts: [
      { code: 'siming', name: '思明区', platePrefix: 'D' },
      { code: 'haicang', name: '海沧区', platePrefix: 'D' },
      { code: 'huli', name: '湖里区', platePrefix: 'D' },
      { code: 'jimei', name: '集美区', platePrefix: 'D' },
      { code: 'tongan', name: '同安区', platePrefix: 'D' },
      { code: 'xiangan', name: '翔安区', platePrefix: 'D' }
    ]
  },
  {
    code: 'quanzhou',
    name: '泉州市',
    platePrefix: '闽C',
    districts: [
      { code: 'licheng', name: '鲤城区', platePrefix: 'C' },
      { code: 'fengze', name: '丰泽区', platePrefix: 'C' },
      { code: 'luojiang', name: '洛江区', platePrefix: 'C' },
      { code: 'quangang', name: '泉港区', platePrefix: 'C' },
      { code: 'jinjiang', name: '晋江市', platePrefix: 'C' },
      { code: 'shishi', name: '石狮市', platePrefix: 'C' },
      { code: 'nanan', name: '南安市', platePrefix: 'C' }
    ]
  },
  {
    code: 'putian',
    name: '莆田市',
    platePrefix: '闽B',
    districts: [
      { code: 'chengxiang', name: '城厢区', platePrefix: 'B' },
      { code: 'hanjiang', name: '涵江区', platePrefix: 'B' },
      { code: 'licheng', name: '荔城区', platePrefix: 'B' },
      { code: 'xiuyu', name: '秀屿区', platePrefix: 'B' },
      { code: 'xianyou', name: '仙游县', platePrefix: 'B' }
    ]
  },
  {
    code: 'zhangzhou',
    name: '漳州市',
    platePrefix: '闽E',
    districts: [
      { code: 'xiangcheng', name: '芗城区', platePrefix: 'E' },
      { code: 'longwen', name: '龙文区', platePrefix: 'E' },
      { code: 'longhai', name: '龙海区', platePrefix: 'E' },
      { code: 'changtai', name: '长泰区', platePrefix: 'E' },
      { code: 'dongshan', name: '东山县', platePrefix: 'E' }
    ]
  },
  {
    code: 'longyan',
    name: '龙岩市',
    platePrefix: '闽F',
    districts: [
      { code: 'xinluo', name: '新罗区', platePrefix: 'F' },
      { code: 'yongding', name: '永定区', platePrefix: 'F' },
      { code: 'changting', name: '长汀县', platePrefix: 'F' },
      { code: 'shanghang', name: '上杭县', platePrefix: 'F' },
      { code: 'wuping', name: '武平县', platePrefix: 'F' }
    ]
  },
  {
    code: 'sanming',
    name: '三明市',
    platePrefix: '闽G',
    districts: [
      { code: 'sanyuan', name: '三元区', platePrefix: 'G' },
      { code: 'shaxian', name: '沙县区', platePrefix: 'G' },
      { code: 'yongan', name: '永安市', platePrefix: 'G' },
      { code: 'mingxi', name: '明溪县', platePrefix: 'G' },
      { code: 'qingliu', name: '清流县', platePrefix: 'G' }
    ]
  },
  {
    code: 'nanping',
    name: '南平市',
    platePrefix: '闽H',
    districts: [
      { code: 'yanping', name: '延平区', platePrefix: 'H' },
      { code: 'jianyang', name: '建阳区', platePrefix: 'H' },
      { code: 'shaowu', name: '邵武市', platePrefix: 'H' },
      { code: 'wuyishan', name: '武夷山市', platePrefix: 'H' },
      { code: 'jianou', name: '建瓯市', platePrefix: 'H' }
    ]
  },
  {
    code: 'ningde',
    name: '宁德市',
    platePrefix: '闽J',
    districts: [
      { code: 'jiaocheng', name: '蕉城区', platePrefix: 'J' },
      { code: 'fuan', name: '福安市', platePrefix: 'J' },
      { code: 'fuding', name: '福鼎市', platePrefix: 'J' },
      { code: 'xiapu', name: '霞浦县', platePrefix: 'J' },
      { code: 'gutian', name: '古田县', platePrefix: 'J' }
    ]
  }
]

// 生成模拟挪车登记记录
const generateMockRecords = (): CarMoveRecord[] => {
  const records: CarMoveRecord[] = []
  const plateColors = [
    { value: 'blue', label: '蓝牌' },
    { value: 'yellow', label: '黄牌' },
    { value: 'green', label: '绿牌' },
    { value: 'white', label: '白牌' },
    { value: 'black', label: '黑牌' }
  ]
  const carColors = ['白色', '黑色', '银色', '红色', '蓝色', '灰色', '金色']
  const carBrands = ['丰田', '本田', '大众', '宝马', '奔驰', '奥迪', '比亚迪', '