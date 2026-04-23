/**
 * 全省综合话务统计报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 查询方式（周期粒度） */
export type QueryPeriod = 'halfHour' | 'hour' | 'day' | 'month'

/** 查询方式选项 */
export interface PeriodOption {
  value: QueryPeriod
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 时间范围 [开始时间, 结束时间] */
  dateRange: string[]
  /** 查询方式（周期粒度） */
  period: QueryPeriod
  /** 地市 */
  city: string
  /** 接入码 */
  accessCode: string
}

/** 话务统计数据项 */
export interface ProvinceCallItem {
  /** 唯一标识 */
  id: string
  /** 地市 */
  city: string
  /** 时间（根据周期粒度显示不同格式） */
  time: string
  /** 呼入次数 */
  inboundCount: number
  /** 排队次数 */
  queueCount: number
  /** 排队成功次数 */
  queueSuccessCount: number
  /** 人工接通数 */
  manualAnswerCount: number
  /** 及时接通数(20秒内) */
  timelyAnswerCount: number
  /** 人工呼损 */
  manualLossCount: number
  /** 自动呼损 */
  autoLossCount: number
  /** 人工接通率 */
  manualAnswerRate: number
  /** 自动接通率 */
  autoAnswerRate: number
  /** 自动及时接通率(20秒内) */
  autoTimelyAnswerRate: number
  /** 应答及时率(未含人工呼损) */
  answerTimelyRateNoLoss: number
  /** 应答及时率(含人工呼损) */
  answerTimelyRateWithLoss: number
  /** 处理总时长(分钟) */
  totalProcessTime: number
  /** 转接总时长(分钟) */
  totalTransferTime: number
}

/** 汇总行数据类型 */
export interface SummaryRow {
  /** 地市名称 */
  city: string
  /** 时间 */
  time: string
  /** 呼入次数 */
  inboundCount: number
  /** 排队次数 */
  queueCount: number
  /** 排队成功次数 */
  queueSuccessCount: number
  /** 人工接通数 */
  manualAnswerCount: number
  /** 及时接通数(20秒内) */
  timelyAnswerCount: number
  /** 人工呼损 */
  manualLossCount: number
  /** 自动呼损 */
  autoLossCount: number
  /** 人工接通率（按全省汇总计算） */
  manualAnswerRate: number
  /** 自动接通率（按全省汇总计算） */
  autoAnswerRate: number
  /** 自动及时接通率(20秒内)（按全省汇总计算） */
  autoTimelyAnswerRate: number
  /** 应答及时率(未含人工呼损)（按全省汇总计算） */
  answerTimelyRateNoLoss: number
  /** 应答及时率(含人工呼损)（按全省汇总计算） */
  answerTimelyRateWithLoss: number
  /** 处理总时长(分钟) */
  totalProcessTime: number
  /** 转接总时长(分钟) */
  totalTransferTime: number
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 查询周期 */
  period?: QueryPeriod
  /** 地市 */
  city?: string
  /** 接入码 */
  accessCode?: string
}
