/**
 * 录音回放模块 - Mock接口
 * @description 模拟录音回放相关的API接口
 * @version 1.0.0
 */

import type {
  ApiResponse,
  RecordingRecord,
  RecordingQueryParams,
  PaginationResult,
  UserInfo,
  OperationLog,
  UserRole
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 当前用户信息
export const currentUser: UserInfo = {
  id: '1001',
  name: '张三',
  role: 'supervisor',
  agentNo: 'AG001',
  city: '北京'
}

// 模拟录音数据
const mockRecordings: RecordingRecord[] = [
  {
    id: '1',
    agentNo: 'AG001',
    agentName: '王芳',
    callTime: '2024-01-15 10:30:25',
    callerNumber: '133****1234',
    calleeNumber: '10086',
    businessKey: '114',
    duration: 185,
    voiceDesc: '挪车业务咨询',
    satisfaction: '5',
    serialNo: 'SN202401150001',
    seatNumber: '8001',
    fileName: 'REC_20240115_103025_AG001.wav',
    fileUrl: '/mock/audio/recording1.wav',
    city: '北京',
    businessInfo: {
      businessType: '挪车业务',
      businessContent: '用户请求挪车服务',
      operatorActions: ['查询车主信息', '发送挪车通知', '记录处理结果'],
      broadcastNumber: '10086',
      customerName: '李先生',
      carMoveInfo: {
        recordNo: 'CM202401150001',
        plateNumber: '京A12345',
        location: '朝阳区建国路88号'
      }
    }
  },
  {
    id: '2',
    agentNo: 'AG002',
    agentName: '李明',
    callTime: '2024-01-15 10:25:18',
    callerNumber: '138****5678',
    calleeNumber: '10086',
    businessKey: '114',
    duration: 320,
    voiceDesc: '总机转分机咨询',
    satisfaction: '4',
    serialNo: 'SN202401150002',
    seatNumber: '8002',
    fileName: 'REC_20240115_102518_AG002.wav',
    fileUrl: '/mock/audio/recording2.wav',
    city: '北京',
    businessInfo: {
      businessType: '总机业务',
      businessContent: '转分机至技术部',
      operatorActions: ['查询分机号', '转分机', '记录通话'],
      broadcastNumber: '10086',
      customerName: '张女士',
      pbxInfo: {
        searchContent: '技术部',
        extensionNumber: '8801',
        transferNumber: '010-12345678'
      }
    }
  },
  {
    id: '3',
    agentNo: 'AG001',
    agentName: '王芳',
    callTime: '2024-01-15 10:15:42',
    callerNumber: '139****9012',
    calleeNumber: '10086',
    businessKey: 'BUS202401150003',
    duration: 95,
    voiceDesc: '优惠券查询',
    satisfaction: '5',
    serialNo: 'SN202401150003',
    seatNumber: '8001',
    fileName: 'REC_20240115_101542_AG001.wav',
    fileUrl: '/mock/audio/recording3.wav',
    city: '北京',
    businessInfo: {
      businessType: '优惠券业务',
      businessContent: '查询周边优惠券',
      operatorActions: ['查询用户位置', '搜索周边商家', '推荐优惠券'],
      broadcastNumber: '10086',
      customerName: '王先生',
      couponInfo: {
        couponType: '餐饮',
        merchantLevel: 'gold'
      }
    }
  },
  {
    id: '4',
    agentNo: 'AG003',
    agentName: '张华',
    callTime: '2024-01-15 10:05:33',
    callerNumber: '136****3456',
    calleeNumber: '10086',
    businessKey: '114',
    duration: 245,
    voiceDesc: '业务咨询',
    satisfaction: '3',
    serialNo: 'SN202401150004',
    seatNumber: '8003',
    fileName: 'REC_20240115_100533_AG003.wav',
    fileUrl: '/mock/audio/recording4.wav',
    city: '上海',
    businessInfo: {
      businessType: '一般咨询',
      businessContent: '套餐资费咨询',
      operatorActions: ['查询套餐信息', '解释资费标准', '记录客户需求'],
      broadcastNumber: '10086',
      customerName: '陈女士'
    }
  },
  {
    id: '5',
    agentNo: 'AG001',
    agentName: '王芳',
    callTime: '2024-01-15 09:55:12',
    callerNumber: '150****7890',
    calleeNumber: '10086',
    businessKey: 'BUS202401150005',
    duration: 150,
    voiceDesc: '投诉处理',
    satisfaction: '2',
    serialNo: 'SN202401150005',
    seatNumber: '8001',
    fileName: 'REC_20240115_095512_AG001.wav',
    fileUrl: '/mock/audio/recording5.wav',
    city: '北京',
    businessInfo: {
      businessType: '投诉处理',
      businessContent: '信号问题投诉',
      operatorActions: ['记录投诉内容', '查询基站状态', '提交工单'],
      broadcastNumber: '10086',
      customerName: '刘先生'
    }
  },
  {
    id: '6',
    agentNo: 'AG004',
    agentName: '刘洋',
    callTime: '2024-01-15 09:45:28',
    callerNumber: '137****2468',
    calleeNumber: '10086',
    businessKey: 'BUS202401150006',
    duration: 420,
    voiceDesc: '挪车紧急处理',
    satisfaction: '5',
    serialNo: 'SN202401150006',
    seatNumber: '8004',
    fileName: 'REC_20240115_094528_AG004.wav',
    fileUrl: '/mock/audio/recording6.wav',
    city: '北京',
    businessInfo: {
      businessType: '挪车业务',
      businessContent: '紧急挪车请求',
      operatorActions: ['优先处理', '联系车主', '跟进结果'],
      broadcastNumber: '10086',
      customerName: '赵先生',
      carMoveInfo: {
        recordNo: 'CM202401150006',
        plateNumber: '京B67890',
        location: '海淀区中关村大街1号'
      }
    }
  },
  {
    id: '7',
    agentNo: 'AG002',
    agentName: '李明',
    callTime: '2024-01-15 09:35:55',
    callerNumber: '151****1357',
    calleeNumber: '10086',
    businessKey: '114',
    duration: 75,
    voiceDesc: '总机查询',
    satisfaction: '4',
    serialNo: 'SN202401150007',
    seatNumber: '8002',
    fileName: 'REC_20240115_093555_AG002.wav',
    fileUrl: '/mock/audio/recording7.wav',
    city: '北京',
    businessInfo: {
      businessType: '总机业务',
      businessContent: '查询部门分机',
      operatorActions: ['搜索部门', '提供分机号'],
      broadcastNumber: '10086',
      customerName: '孙女士',
      pbxInfo: {
        searchContent: '人事部',
        extensionNumber: '8802'
      }
    }
  },
  {
    id: '8',
    agentNo: 'AG005',
    agentName: '陈静',
    callTime: '2024-01-15 09:25:40',
    callerNumber: '152****8642',
    calleeNumber: '10086',
    businessKey: 'BUS202401150008',
    duration: 280,
    voiceDesc: '周边商家推荐',
    satisfaction: '5',
    serialNo: 'SN202401150008',
    seatNumber: '8005',
    fileName: 'REC_20240115_092540_AG005.wav',
    fileUrl: '/mock/audio/recording8.wav',
    city: '上海',
    businessInfo: {
      businessType: '优惠券业务',
      businessContent: '推荐周边餐厅',
      operatorActions: ['定位用户', '搜索商家', '发送优惠券'],
      broadcastNumber: '10086',
      customerName: '周先生',
      couponInfo: {
        couponType: '美食',
        merchantLevel: 'silver'
      }
    }
  },
  {
    id: '9',
    agentNo: 'AG001',
    agentName: '王芳',
    callTime: '2024-01-15 09:15:22',
    callerNumber: '133****9753',
    calleeNumber: '10086',
    businessKey: 'BUS202401150009',
    duration: 135,
    voiceDesc: '业务办理',
    satisfaction: '4',
    serialNo: 'SN202401150009',
    seatNumber: '8001',
    fileName: 'REC_20240115_091522_AG001.wav',
    fileUrl: '/mock/audio/recording9.wav',
    city: '北京',
    businessInfo: {
      businessType: '业务办理',
      businessContent: '套餐变更',
      operatorActions: ['验证身份', '查询套餐', '办理变更'],
      broadcastNumber: '10086',
      customerName: '吴女士'
    }
  },
  {
    id: '10',
    agentNo: 'AG006',
    agentName: '杨帆',
    callTime: '2024-01-15 09:05:18',
    callerNumber: '155****7410',
    calleeNumber: '10086',
    businessKey: '114',
    duration: 200,
    voiceDesc: '挪车服务',
    satisfaction: '5',
    serialNo: 'SN202401150010',
    seatNumber: '8006',
    fileName: 'REC_20240115_090518_AG006.wav',
    fileUrl: '/mock/audio/recording10.wav',
    city: '北京',
    businessInfo: {
      businessType: '挪车业务',
      businessContent: '小区挪车请求',
      operatorActions: ['查询车辆', '联系车主', '确认挪车'],
      broadcastNumber: '10086',
      customerName: '郑先生',
      carMoveInfo: {
        recordNo: 'CM202401150010',
        plateNumber: '京C11111',
        location: '东城区王府井大街'
      }
    }
  }
]

// 操作日志
const operationLogs: OperationLog[] = []

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserInfo>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: currentUser,
    success: true
  }
}

/**
 * 检查权限
 */
export const checkPermission = async (): Promise<ApiResponse<{ hasPermission: boolean; role: UserRole }>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: { 
      hasPermission: true, 
      role: currentUser.role 
    },
    success: true
  }
}

/**
 * 查询录音列表
 */
export const queryRecordings = async (
  params: RecordingQueryParams
): Promise<ApiResponse<PaginationResult<RecordingRecord>>> => {
  await delay(500)
  
  let filtered = [...mockRecordings]
  
  // 普通坐席只能查看自己的录音
  if (currentUser.role === 'agent') {
    filtered = filtered.filter(r => r.agentNo === currentUser.agentNo)
  }
  
  // 城市筛选（仅管理员/班长）
  if (params.city && currentUser.role !== 'agent') {
    filtered = filtered.filter(r => r.city === params.city)
  }
  
  // 工号筛选
  if (params.agentNo) {
    filtered = filtered.filter(r => r.agentNo === params.agentNo)
  }
  
  // 业务键筛选
  if (params.businessKey) {
    filtered = filtered.filter(r => r.businessKey.includes(params.businessKey))
  }
  
  // 号码筛选
  if (params.phoneNumber) {
    if (params.fuzzyQuery) {
      filtered = filtered.filter(r => 
        r.callerNumber.includes(params.phoneNumber!) || 
        r.calleeNumber.includes(params.phoneNumber!)
      )
    } else {
      filtered = filtered.filter(r => 
        r.callerNumber === params.phoneNumber || 
        r.calleeNumber === params.phoneNumber
      )
    }
  }
  
  // 满意度筛选
  if (params.satisfaction) {
    filtered = filtered.filter(r => r.satisfaction === params.satisfaction)
  }
  
  // 时长筛选
  if (params.duration !== undefined && params.durationType) {
    filtered = filtered.filter(r => {
      switch (params.durationType) {
        case '>': return r.duration > params.duration!
        case '<': return r.duration < params.duration!
        case '=': return r.duration === params.duration!
        default: return true
      }
    })
  }
  
  // 关键词筛选
  if (params.keyword) {
    filtered = filtered.filter(r => 
      r.voiceDesc.includes(params.keyword!) ||
      (r.businessInfo?.businessContent.includes(params.keyword!))
    )
  }
  
  // 商家级别筛选
  if (params.merchantLevel) {
    filtered = filtered.filter(r => 
      r.businessInfo?.couponInfo?.merchantLevel === params.merchantLevel
    )
  }
  
  // 分页
  const total = filtered.length
  const totalPages = Math.ceil(total / params.pageSize)
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filtered.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages
    },
    success: true
  }
}

/**
 * 获取录音详情
 */
export const getRecordingDetail = async (id: string): Promise<ApiResponse<RecordingRecord>> => {
  await delay(300)
  const record = mockRecordings.find(r => r.id === id)
  
  if (!record) {
    return {
      code: 404,
      message: '录音不存在',
      data: null as any,
      success: false
    }
  }
  
  // 权限检查
  if (currentUser.role === 'agent' && record.agentNo !== currentUser.agentNo) {
    return {
      code: 403,
      message: '无权查看此录音',
      data: null as any,
      success: false
    }
  }
  
  return {
    code: 200,
    message: 'success',
    data: record,
    success: true
  }
}

/**
 * 下载录音
 */
export const downloadRecording = async (ids: string[]): Promise<ApiResponse<{ url: string; fileName: string }>> => {
  await delay(1000)
  
  // 权限检查
  if (currentUser.role === 'agent') {
    const records = mockRecordings.filter(r => ids.includes(r.id))
    const hasOthers = records.some(r => r.agentNo !== currentUser.agentNo)
    if (hasOthers) {
      return {
        code: 403,
        message: '无权下载他人录音',
        data: null as any,
        success: false
      }
    }
  }
  
  return {
    code: 200,
    message: 'success',
    data: {
      url: `/mock/download/recordings_${Date.now()}.zip`,
      fileName: `recordings_${Date.now()}.zip`
    },
    success: true
  }
}

/**
 * 记录操作日志
 */
export const logOperation = async (log: Omit<OperationLog, 'id' | 'timestamp'>): Promise<void> => {
  operationLogs.push({
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString('zh-CN')
  })
}

/**
 * 获取操作日志
 */
export const getOperationLogs = async (): Promise<ApiResponse<OperationLog[]>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: operationLogs.slice(-50).reverse(),
    success: true
  }
}

/**
 * 获取工号列表
 */
export const getAgentList = async (): Promise<ApiResponse<{ agentNo: string; agentName: string }[]>> => {
  await delay(200)
  
  // 普通坐席只能看到自己的工号
  if (currentUser.role === 'agent') {
    return {
      code: 200,
      message: 'success',
      data: [{ agentNo: currentUser.agentNo, agentName: currentUser.name }],
      success: true
    }
  }
  
  // 管理员/班长看到所有工号
  const agents = [...new Set(mockRecordings.map(r => r.agentNo))].map(agentNo => {
    const record = mockRecordings.find(r => r.agentNo === agentNo)
    return { agentNo, agentName: record?.agentName || agentNo }
  })
  
  return {
    code: 200,
    message: 'success',
    data: agents,
    success: true
  }
}

/**
 * 获取城市列表
 */
export const getCityList = async (): Promise<ApiResponse<{ code: string; name: string }[]>> => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: [
      { code: 'beijing', name: '北京' },
      { code: 'shanghai', name: '上海' },
      { code: 'guangzhou', name: '广州' },
      { code: 'shenzhen', name: '深圳' }
    ],
    success: true
  }
}
