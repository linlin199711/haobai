/**
 * 人工话务员接续报表 - 类型定义
 * @description 定义话务员接续报表相关的数据结构和类型
 * @version 1.0.0
 */

/** 筛选条件表单 */
export interface FilterForm {
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 地市 */
  city: string
  /** 班组 */
  team: string
  /** 工号 */
  employeeId: string
}

/** 话务员接续数据项 */
export interface OperatorReportItem {
  /** 唯一标识 */
  id: string
  /** 人员名称 */
  name: string
  /** 工号 */
  employeeId: string
  /** 地市 */
  city: string
  /** 班组 */
  team: string
  /** 签入次数 */
  loginCount: number
  /** 签入时长(秒) */
  loginDuration: number
  /** 空闲时长(秒) */
  idleDuration: number
  /** 接通量 */
  connectedCount: number
  /** 接通时长(秒) */
  connectedDuration: number
  /** 呼出次数 */
  outboundCount: number
  /** 呼出时长(秒) */
  outboundDuration: number
  /** 小休次数 */
  breakCount: number
  /** 小休时长(秒) */
  breakDuration: number
  /** 参评量 */
  evaluatedCount: number
  /** 参评满意量 */
  satisfiedCount: number
}

/** 计算后的报表数据项（包含自动计算的字段） */
export interface CalculatedReportItem extends OperatorReportItem {
  /** 空闲率(%) */
  idleRate: number
  /** 平均接通时长(秒) */
  avgConnectedDuration: number | null
  /** 小休率(%) */
  breakRate: number
  /** 参评率(%) */
  evaluateRate: number | null
  /** 参评满意率(%) */
  satisfiedRate: number | null
}

/** 汇总数据 */
export interface SummaryData {
  /** 人员名称 */
  name: string
  /** 工号 */
  employeeId: string
  /** 地市 */
  city: string
  /** 班组 */
  team: string
  /** 签入次数 */
  loginCount: number
  /** 签入时长(秒) */
  loginDuration: number
  /** 空闲时长(秒) */
  idleDuration: number
  /** 空闲率(%) */
  idleRate: number
  /** 接通量 */
  connectedCount: number
  /** 接通时长(秒) */
  connectedDuration: number
  /** 平均接通时长(秒) */
  avgConnectedDuration: number | null
  /** 呼出次数 */
  outboundCount: number
  /** 呼出时长(秒) */
  outboundDuration: number
  /** 小休次数 */
  breakCount: number
  /** 小休时长(秒) */
  breakDuration: number
  /** 小休率(%) */
  breakRate: number
  /** 参评量 */
  evaluatedCount: number
  /** 参评率(%) */
  evaluateRate: number | null
  /** 参评满意量 */
  satisfiedCount: number
  /** 参评满意率(%) */
  satisfiedRate: number | null
}

/** 服务响应 */
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  message?: string
}

/** 报表查询参数 */
export interface ReportQueryParams {
  startTime?: string
  endTime?: string
  city?: string
  team?: string
  employeeId?: string
}

/** 地市枚举 */
export const CityEnum = {
  ALL: '全部地市',
  FUZHOU: '福州市',
  XIAMEN: '厦门市',
  PUTIAN: '莆田市',
  QUANZHOU: '泉州市',
  ZHANGZHOU: '漳州市',
  LONGYAN: '龙岩市',
  SANMING: '三明市',
  NANPING: '南平市',
  NINGDE: '宁德市'
} as const

/** 班组枚举 */
export const TeamEnum = {
  ALL: '全部班组',
  TEAM_A: '一班组',
  TEAM_B: '二班组',
  TEAM_C: '三班组',
  TEAM_D: '四班组',
  TEAM_E: '五班组',
  TEAM_F: '六班组',
  TEAM_NIGHT: '夜班组',
  TEAM_WEEKEND: '周末组'
} as const

/** 计算指标配置 */
export interface CalculateConfig {
  /** 空闲率阈值(%) - 超过此值高亮 */
  idleRateThreshold: number
  /** 小休率阈值(%) - 超过此值高亮 */
  breakRateThreshold: number
  /** 参评满意率阈值(%) - 低于此值高亮 */
  satisfiedRateThreshold: number
}

/** 默认计算配置 */
export const defaultCalculateConfig: CalculateConfig = {
  idleRateThreshold: 80,
  breakRateThreshold: 80,
  satisfiedRateThreshold: 80
}
