/**
 * 挪车登记模块 - 类型定义
 * @description 挪车登记模块所有类型定义
 * @version 1.0.0
 */

/** 车牌颜色选项 */
export const PLATE_COLOR_OPTIONS = [
  { label: '蓝牌', value: 'blue' },
  { label: '黄牌', value: 'yellow' },
  { label: '绿牌', value: 'green' },
  { label: '白牌', value: 'white' },
  { label: '黑牌', value: 'black' }
] as const

/** 移车原因选项 */
export const MOVE_REASON_OPTIONS = [
  { label: '移车通知', value: 'move_notice' },
  { label: '友情提示', value: 'friendly_reminder' }
] as const

/** 同步状态 */
export type SyncStatus = 'synced' | 'unsynced' | 'syncing'

/** 登记地区信息 */
export interface DistrictInfo {
  code: string
  name: string
  platePrefix: string  // 车牌前缀，如：A、D
}

/** 地市信息 */
export interface CityInfo {
  code: string
  name: string
  platePrefix: string  // 车牌前缀，如：闽A、闽D
  districts: DistrictInfo[]
}

/** 挪车登记表单数据 */
export interface CarMoveFormData {
  /** 登记ID（编辑时使用） */
  id?: string
  /** 登记地区 */
  district: string
  /** 详细地址 */
  address: string
  /** 来电号码 */
  phoneNumber: string
  /** 车牌颜色 */
  plateColor: string
  /** 车牌号（不含前缀） */
  plateNumber: string
  /** 完整车牌号（前缀+号码） */
  fullPlateNumber: string
  /** 车身颜色 */
  carColor: string
  /** 车辆品牌 */
  carBrand: string
  /** 短信通知号码 */
  smsPhoneNumber: string
  /** 移车原因 */
  moveReason: string
  /** 登记工号 */
  agentId: string
  /** 备注信息 */
  remark: string
}

/** 挪车登记记录 */
export interface CarMoveRecord {
  id: string
  phoneNumber: string
  fullPlateNumber: string
  plateColor: string
  plateColorLabel: string
  registerTime: string
  district: string
  address: string
  carColor: string
  carBrand: string
  syncStatus: SyncStatus
  agentId: string
  isSuspectedClone: boolean
  smsPhoneNumber: string
  remark: string
}

/** 挪车登记查询参数 */
export interface CarMoveSearchParams {
  phoneNumber?: string
  plateNumber?: string
  startTime?: string
  endTime?: string
  page?: number
  pageSize?: number
}

/** 挪车登记查询结果 */
export interface CarMoveSearchResult {
  list: CarMoveRecord[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 提交登记参数 */
export interface SubmitCarMoveParams {
  district: string
  address: string
  phoneNumber: string
  plateColor: string
  fullPlateNumber: string
  carColor: string
  carBrand: string
  smsPhoneNumber: string
  moveReason: string
  agentId: string
  remark: string
}

/** 同步参数 */
export interface SyncCarMoveParams {
  id: string
}

/** API响应 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

/** 当前坐席信息 */
export interface AgentInfo {
  agentId: string
  agentName: string
  city: string
  cityName: string
}

/** 来电信息 */
export interface IncomingCallInfo {
  phoneNumber: string
  callTime: string
}
