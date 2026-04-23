/**
 * 人工话务员接续报表 - Mock数据
 * @description 提供报表所需的模拟数据
 * @version 1.0.0
 */

import type { OperatorReportItem, ServiceResponse, ReportQueryParams } from '../types/operatorReport'

/**
 * 模拟话务员数据 - 复刻原型示例数据
 */
const mockOperatorData: OperatorReportItem[] = [
  {
    id: '1',
    name: '杨帆1',
    employeeId: '1001',
    city: '福州市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28800,
    idleDuration: 1200,
    connectedCount: 156,
    connectedDuration: 18600,
    outboundCount: 8,
    outboundDuration: 480,
    breakCount: 3,
    breakDuration: 1800,
    evaluatedCount: 120,
    satisfiedCount: 108
  },
  {
    id: '2',
    name: '孙丽2',
    employeeId: '1002',
    city: '福州市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28200,
    idleDuration: 2400,
    connectedCount: 142,
    connectedDuration: 16800,
    outboundCount: 12,
    outboundDuration: 720,
    breakCount: 4,
    breakDuration: 2400,
    evaluatedCount: 110,
    satisfiedCount: 95
  },
  {
    id: '3',
    name: '王芳',
    employeeId: '1003',
    city: '福州市',
    team: '二班组',
    loginCount: 2,
    loginDuration: 27600,
    idleDuration: 1800,
    connectedCount: 138,
    connectedDuration: 16200,
    outboundCount: 6,
    outboundDuration: 360,
    breakCount: 2,
    breakDuration: 1200,
    evaluatedCount: 105,
    satisfiedCount: 98
  },
  {
    id: '4',
    name: '李明',
    employeeId: '1004',
    city: '厦门市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 29000,
    idleDuration: 3600,
    connectedCount: 165,
    connectedDuration: 19200,
    outboundCount: 15,
    outboundDuration: 900,
    breakCount: 5,
    breakDuration: 3000,
    evaluatedCount: 130,
    satisfiedCount: 115
  },
  {
    id: '5',
    name: '张华',
    employeeId: '1005',
    city: '厦门市',
    team: '二班组',
    loginCount: 2,
    loginDuration: 28500,
    idleDuration: 1500,
    connectedCount: 148,
    connectedDuration: 17400,
    outboundCount: 10,
    outboundDuration: 600,
    breakCount: 3,
    breakDuration: 1500,
    evaluatedCount: 115,
    satisfiedCount: 105
  },
  {
    id: '6',
    name: '陈静',
    employeeId: '1006',
    city: '泉州市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28000,
    idleDuration: 4200,
    connectedCount: 132,
    connectedDuration: 15600,
    outboundCount: 5,
    outboundDuration: 300,
    breakCount: 6,
    breakDuration: 3600,
    evaluatedCount: 100,
    satisfiedCount: 88
  },
  {
    id: '7',
    name: '刘洋',
    employeeId: '1007',
    city: '泉州市',
    team: '三班组',
    loginCount: 2,
    loginDuration: 27500,
    idleDuration: 900,
    connectedCount: 145,
    connectedDuration: 17100,
    outboundCount: 9,
    outboundDuration: 540,
    breakCount: 2,
    breakDuration: 900,
    evaluatedCount: 125,
    satisfiedCount: 118
  },
  {
    id: '8',
    name: '赵敏',
    employeeId: '1008',
    city: '漳州市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 29200,
    idleDuration: 2100,
    connectedCount: 158,
    connectedDuration: 18600,
    outboundCount: 11,
    outboundDuration: 660,
    breakCount: 4,
    breakDuration: 2100,
    evaluatedCount: 122,
    satisfiedCount: 110
  },
  {
    id: '9',
    name: '周杰',
    employeeId: '1009',
    city: '漳州市',
    team: '二班组',
    loginCount: 2,
    loginDuration: 27800,
    idleDuration: 3000,
    connectedCount: 140,
    connectedDuration: 16500,
    outboundCount: 7,
    outboundDuration: 420,
    breakCount: 3,
    breakDuration: 1800,
    evaluatedCount: 108,
    satisfiedCount: 95
  },
  {
    id: '10',
    name: '吴倩',
    employeeId: '1010',
    city: '莆田市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28600,
    idleDuration: 1350,
    connectedCount: 152,
    connectedDuration: 18000,
    outboundCount: 14,
    outboundDuration: 840,
    breakCount: 3,
    breakDuration: 1350,
    evaluatedCount: 118,
    satisfiedCount: 106
  },
  {
    id: '11',
    name: '郑强',
    employeeId: '1011',
    city: '莆田市',
    team: '夜班组',
    loginCount: 1,
    loginDuration: 14400,
    idleDuration: 720,
    connectedCount: 78,
    connectedDuration: 9000,
    outboundCount: 4,
    outboundDuration: 240,
    breakCount: 2,
    breakDuration: 720,
    evaluatedCount: 60,
    satisfiedCount: 54
  },
  {
    id: '12',
    name: '黄婷',
    employeeId: '1012',
    city: '龙岩市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28400,
    idleDuration: 1680,
    connectedCount: 149,
    connectedDuration: 17550,
    outboundCount: 13,
    outboundDuration: 780,
    breakCount: 4,
    breakDuration: 1680,
    evaluatedCount: 116,
    satisfiedCount: 104
  },
  {
    id: '13',
    name: '林峰',
    employeeId: '1013',
    city: '三明市',
    team: '二班组',
    loginCount: 2,
    loginDuration: 27900,
    idleDuration: 2520,
    connectedCount: 141,
    connectedDuration: 16650,
    outboundCount: 8,
    outboundDuration: 480,
    breakCount: 5,
    breakDuration: 2520,
    evaluatedCount: 110,
    satisfiedCount: 96
  },
  {
    id: '14',
    name: '徐丽',
    employeeId: '1014',
    city: '南平市',
    team: '一班组',
    loginCount: 2,
    loginDuration: 28700,
    idleDuration: 1140,
    connectedCount: 155,
    connectedDuration: 18300,
    outboundCount: 16,
    outboundDuration: 960,
    breakCount: 2,
    breakDuration: 1140,
    evaluatedCount: 124,
    satisfiedCount: 114
  },
  {
    id: '15',
    name: '谢军',
    employeeId: '1015',
    city: '宁德市',
    team: '三班组',
    loginCount: 2,
    loginDuration: 28100,
    idleDuration: 3360,
    connectedCount: 137,
    connectedDuration: 16140,
    outboundCount: 6,
    outboundDuration: 360,
    breakCount: 6,
    breakDuration: 3360,
    evaluatedCount: 102,
    satisfiedCount: 89
  }
]

/**
 * 模拟获取报表数据
 * @param params 查询参数
 */
export const getOperatorReportData = async (
  params: ReportQueryParams
): Promise<ServiceResponse<OperatorReportItem[]>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockOperatorData]

  // 地市筛选
  if (params.city && params.city !== '全部地市') {
    filteredData = filteredData.filter(item => item.city === params.city)
  }

  // 班组筛选
  if (params.team && params.team !== '全部班组') {
    filteredData = filteredData.filter(item => item.team === params.team)
  }

  // 工号筛选
  if (params.employeeId) {
    filteredData = filteredData.filter(item => 
      item.employeeId.includes(params.employeeId) ||
      item.name.includes(params.employeeId)
    )
  }

  return {
    success: true,
    data: filteredData
  }
}

/**
 * 获取地市列表
 */
export const getCityList = (): string[] => {
  return [
    '全部地市',
    '福州市',
    '厦门市',
    '莆田市',
    '泉州市',
    '漳州市',
    '龙岩市',
    '三明市',
    '南平市',
    '宁德市'
  ]
}

/**
 * 获取班组列表
 */
export const getTeamList = (): string[] => {
  return [
    '全部班组',
    '一班组',
    '二班组',
    '三班组',
    '四班组',
    '五班组',
    '六班组',
    '夜班组',
    '周末组'
  ]
}
