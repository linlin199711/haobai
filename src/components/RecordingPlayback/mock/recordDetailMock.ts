/**
 * 录音详情模块 - Mock数据
 * @description 模拟录音详情操作记录数据
 * @version 1.0.0
 */

import type {
  OperationRecord,
  RecordDetail,
  BusinessTypeEnum,
  OperatorActionTypeEnum,
  PlayTypeEnum,
  ApiResponse,
  PermissionConfig
} from '../types/recordDetail'

// 当前模拟用户信息
export const currentUser: PermissionConfig = {
  userRole: 'agent',
  currentAgentNo: 'A001',
  canViewAll: false,
  allowedCities: ['fuzhou']
}

// 管理员用户（用于测试权限）
export const adminUser: PermissionConfig = {
  userRole: 'admin',
  currentAgentNo: 'ADMIN',
  canViewAll: true,
  allowedCities: ['fuzhou', 'xiamen', 'quanzhou']
}

/**
 * 格式化时间戳
 * @param seconds 秒数
 * @returns 格式化时间字符串 MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// 统一业务类型：号码本地搜（包含原号码查询台）
const BUSINESS_TYPE_NUMBER_SEARCH = '号码本地搜'

// 模拟操作记录数据
const mockOperationRecords: OperationRecord[] = [
  {
    id: 'OP001',
    businessType: BUSINESS_TYPE_NUMBER_SEARCH,
    businessContent: '连江 招亮',
    operatorActionType: '查询',
    broadcastNumber: '0591-262345678',
    companyName: '连江县招亮建材有限公司',
    playType: '语音播报',
    operationTime: 15,
    formattedTime: '00:15',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'numberSearch',
      businessId: 'NQ001',
      extraParams: { keyword: '连江 招亮', companyName: '连江县招亮建材有限公司' }
    }
  },
  {
    id: 'OP002',
    businessType: BUSINESS_TYPE_NUMBER_SEARCH,
    businessContent: '连江 招亮',
    operatorActionType: '挂断报号',
    broadcastNumber: '0591-262345678',
    companyName: '连江县招亮建材有限公司',
    playType: '语音播报',
    operationTime: 45,
    formattedTime: '00:45',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'numberSearch',
      businessId: 'NQ001',
      extraParams: { keyword: '连江 招亮', result: '0591-262345678', companyName: '连江县招亮建材有限公司' }
    }
  },
  {
    id: 'OP003',
    businessType: '挪车登记',
    businessContent: '闽A12345 鼓楼区五四路',
    operatorActionType: '登记',
    broadcastNumber: '13800138000',
    companyName: '个人用户',
    playType: '短信通知',
    operationTime: 120,
    formattedTime: '02:00',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'carMove',
      businessId: 'CM001',
      detailUrl: '/car-move/detail/CM001',
      extraParams: { plateNumber: '闽A12345', location: '鼓楼区五四路' }
    }
  },
  {
    id: 'OP004',
    businessType: BUSINESS_TYPE_NUMBER_SEARCH,
    businessContent: '查询：福州饭店',
    operatorActionType: '查询',
    broadcastNumber: '0591-87654321',
    companyName: '福州大饭店有限公司',
    playType: '直拨',
    operationTime: 180,
    formattedTime: '03:00',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'numberSearch',
      businessId: 'NS002',
      extraParams: { keyword: '福州饭店', companyName: '福州大饭店有限公司' }
    }
  },
  {
    id: 'OP005',
    businessType: BUSINESS_TYPE_NUMBER_SEARCH,
    businessContent: '福州饭店',
    operatorActionType: '拍号',
    broadcastNumber: '0591-87654321',
    companyName: '福州大饭店有限公司',
    playType: '直拨',
    operationTime: 195,
    formattedTime: '03:15',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'numberSearch',
      businessId: 'NS002',
      extraParams: { keyword: '福州饭店', action: 'dial', companyName: '福州大饭店有限公司' }
    }
  },
  {
    id: 'OP006',
    businessType: '总机3.0',
    businessContent: '转分机：8088',
    operatorActionType: '转接',
    broadcastNumber: '8088',
    companyName: '福建科技有限公司',
    playType: '直拨',
    operationTime: 240,
    formattedTime: '04:00',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'pbx30',
      businessId: 'PBX001',
      extraParams: { extension: '8088', target: '技术部', companyName: '福建科技有限公司' }
    }
  },
  {
    id: 'OP007',
    businessType: '非号码查询',
    businessContent: '咨询天气',
    operatorActionType: '查询',
    broadcastNumber: '--',
    companyName: '--',
    playType: '语音播报',
    operationTime: 300,
    formattedTime: '05:00',
    serialNo: '2026040112523491651',
    recordId: 'REC001',
    agentNo: 'A001',
    agentName: '张三',
    businessDetail: {
      moduleType: 'nonNumberQuery',
      businessId: 'NNQ001',
      extraParams: { queryType: 'weather', content: '福州今日天气' }
    }
  }
]

// 模拟录音详情数据
const mockRecordDetail: RecordDetail = {
  id: 'REC001',
  serialNo: '2026040112523491651',
  duration: 360,
  fileUrl: '/recordings/2026040112523491651.mp3',
  callerNumber: '13800138000',
  calleeNumber: '10086',
  agentNo: 'A001',
  agentName: '张三',
  callTime: '2026-04-01 12:52:34',
  operationRecords: mockOperationRecords
}

/**
 * 获取操作记录列表（带权限控制）
 * @param recordId 录音ID
 * @param permission 权限配置
 * @returns 操作记录列表
 */
export const getOperationRecords = async (
  recordId: string,
  permission: PermissionConfig = currentUser
): Promise<ApiResponse<OperationRecord[]>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 权限校验：普通坐席只能查看自己的记录
  const records = mockOperationRecords.filter(record => {
    if (permission.canViewAll) {
      return true // 管理员可查看全部
    }
    return record.agentNo === permission.currentAgentNo
  })

  return {
    code: 200,
    message: 'success',
    data: records,
    success: true
  }
}

/**
 * 获取录音详情
 * @param recordId 录音ID
 * @param permission 权限配置
 * @returns 录音详情
 */
export const getRecordDetail = async (
  recordId: string,
  permission: PermissionConfig = currentUser
): Promise<ApiResponse<RecordDetail>> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  // 权限校验
  if (!permission.canViewAll && mockRecordDetail.agentNo !== permission.currentAgentNo) {
    return {
      code: 403,
      message: '无权查看此录音详情',
      data: null as any,
      success: false
    }
  }

  return {
    code: 200,
    message: 'success',
    data: mockRecordDetail,
    success: true
  }
}

/**
 * 根据时间获取操作记录
 * @param recordId 录音ID
 * @param time 时间戳（秒）
 * @returns 该时间点或之前的最近操作记录
 */
export const getOperationRecordByTime = async (
  recordId: string,
  time: number
): Promise<ApiResponse<OperationRecord | null>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  // 找到该时间点或之前的最近操作记录
  const record = mockOperationRecords
    .filter(r => r.operationTime <= time)
    .sort((a, b) => b.operationTime - a.operationTime)[0]

  return {
    code: 200,
    message: 'success',
    data: record || null,
    success: true
  }
}

/**
 * 跳转到业务详情页
 * @param businessDetail 业务详情数据
 * @returns 跳转结果
 */
export const navigateToBusinessDetail = async (
  businessDetail: OperationRecord['businessDetail']
): Promise<ApiResponse<boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  console.log('跳转到业务详情:', businessDetail)

  return {
    code: 200,
    message: 'success',
    data: true,
    success: true
  }
}

/**
 * 记录用户操作日志
 * @param operation 操作类型
 * @param content 操作内容
 */
export const logOperation = (
  operation: string,
  content: string
): void => {
  console.log(`[操作日志] ${new Date().toISOString()} - ${operation}: ${content}`)
}

// 导出所有mock数据
export const mockData = {
  operationRecords: mockOperationRecords,
  recordDetail: mockRecordDetail,
  currentUser,
  adminUser
}
