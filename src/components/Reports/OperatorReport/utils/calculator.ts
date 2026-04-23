/**
 * 人工话务员接续报表 - 计算工具函数
 * @description 提供报表指标计算、时长格式化等功能
 * @version 1.0.0
 */

import type { OperatorReportItem, CalculatedReportItem, SummaryData, CalculateConfig } from '../types/operatorReport'
import { defaultCalculateConfig } from '../types/operatorReport'

/**
 * 格式化时长 - 将秒转换为"X小时X分"或"X分"格式
 * @param seconds 秒数
 * @returns 格式化后的字符串
 */
export const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return '0分'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return minutes > 0 ? `${hours}小时${minutes}分` : `${hours}小时`
  }
  return `${minutes}分`
}

/**
 * 格式化时长（带秒）- 将秒转换为"X分X秒"格式
 * @param seconds 秒数
 * @returns 格式化后的字符串
 */
export const formatDurationWithSeconds = (seconds: number): string => {
  if (seconds <= 0) return '0秒'

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  if (mins > 0) {
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分`
  }
  return `${secs}秒`
}

/**
 * 计算百分比
 * @param numerator 分子
 * @param denominator 分母
 * @param decimals 小数位数，默认1位
 * @returns 百分比数值，分母为0返回null
 */
export const calculatePercentage = (
  numerator: number,
  denominator: number,
  decimals: number = 1
): number | null => {
  if (denominator === 0) return null
  const percentage = (numerator / denominator) * 100
  return parseFloat(percentage.toFixed(decimals))
}

/**
 * 计算平均值
 * @param total 总值
 * @param count 数量
 * @param decimals 小数位数，默认0位
 * @returns 平均值，数量为0返回null
 */
export const calculateAverage = (
  total: number,
  count: number,
  decimals: number = 0
): number | null => {
  if (count === 0) return null
  const average = total / count
  return parseFloat(average.toFixed(decimals))
}

/**
 * 计算单条报表数据（添加计算字段）
 * @param item 原始数据项
 * @returns 计算后的数据项
 */
export const calculateReportItem = (item: OperatorReportItem): CalculatedReportItem => {
  // 空闲率 = (空闲时长 / 签入时长) * 100%
  const idleRate = calculatePercentage(item.idleDuration, item.loginDuration, 1) || 0

  // 平均接通时长 = 接通总时长 / 接通量
  const avgConnectedDuration = calculateAverage(item.connectedDuration, item.connectedCount, 0)

  // 小休率 = (小休时长 / 签入时长) * 100%
  const breakRate = calculatePercentage(item.breakDuration, item.loginDuration, 1) || 0

  // 参评率 = (参评量 / 接通量) * 100%
  const evaluateRate = calculatePercentage(item.evaluatedCount, item.connectedCount, 1)

  // 参评满意率 = (参评满意量 / 参评量) * 100%
  const satisfiedRate = calculatePercentage(item.satisfiedCount, item.evaluatedCount, 1)

  return {
    ...item,
    idleRate,
    avgConnectedDuration,
    breakRate,
    evaluateRate,
    satisfiedRate
  }
}

/**
 * 计算汇总数据
 * @param dataList 数据列表
 * @returns 汇总数据
 */
export const calculateSummary = (dataList: CalculatedReportItem[]): SummaryData => {
  if (dataList.length === 0) {
    return {
      name: '全省汇总',
      employeeId: '-',
      city: '-',
      team: '-',
      loginCount: 0,
      loginDuration: 0,
      idleDuration: 0,
      idleRate: 0,
      connectedCount: 0,
      connectedDuration: 0,
      avgConnectedDuration: null,
      outboundCount: 0,
      outboundDuration: 0,
      breakCount: 0,
      breakDuration: 0,
      breakRate: 0,
      evaluatedCount: 0,
      evaluateRate: null,
      satisfiedCount: 0,
      satisfiedRate: null
    }
  }

  // 累加基础字段
  const summary = dataList.reduce((acc, item) => ({
    loginCount: acc.loginCount + item.loginCount,
    loginDuration: acc.loginDuration + item.loginDuration,
    idleDuration: acc.idleDuration + item.idleDuration,
    connectedCount: acc.connectedCount + item.connectedCount,
    connectedDuration: acc.connectedDuration + item.connectedDuration,
    outboundCount: acc.outboundCount + item.outboundCount,
    outboundDuration: acc.outboundDuration + item.outboundDuration,
    breakCount: acc.breakCount + item.breakCount,
    breakDuration: acc.breakDuration + item.breakDuration,
    evaluatedCount: acc.evaluatedCount + item.evaluatedCount,
    satisfiedCount: acc.satisfiedCount + item.satisfiedCount
  }), {
    loginCount: 0,
    loginDuration: 0,
    idleDuration: 0,
    connectedCount: 0,
    connectedDuration: 0,
    outboundCount: 0,
    outboundDuration: 0,
    breakCount: 0,
    breakDuration: 0,
    evaluatedCount: 0,
    satisfiedCount: 0
  })

  // 计算汇总后的百分比和平均值
  const idleRate = calculatePercentage(summary.idleDuration, summary.loginDuration, 1) || 0
  const avgConnectedDuration = calculateAverage(summary.connectedDuration, summary.connectedCount, 0)
  const breakRate = calculatePercentage(summary.breakDuration, summary.loginDuration, 1) || 0
  const evaluateRate = calculatePercentage(summary.evaluatedCount, summary.connectedCount, 1)
  const satisfiedRate = calculatePercentage(summary.satisfiedCount, summary.evaluatedCount, 1)

  return {
    name: '全省汇总',
    employeeId: '-',
    city: '-',
    team: '-',
    ...summary,
    idleRate,
    avgConnectedDuration,
    breakRate,
    evaluateRate,
    satisfiedRate
  }
}

/**
 * 检查是否需要高亮显示（红色）
 * @param value 数值
 * @param type 类型：'idleRate' | 'breakRate' | 'satisfiedRate'
 * @param config 计算配置
 * @returns 是否需要高亮
 */
export const shouldHighlight = (
  value: number | null,
  type: 'idleRate' | 'breakRate' | 'satisfiedRate',
  config: CalculateConfig = defaultCalculateConfig
): boolean => {
  if (value === null) return false

  switch (type) {
    case 'idleRate':
      return value > config.idleRateThreshold
    case 'breakRate':
      return value > config.breakRateThreshold
    case 'satisfiedRate':
      return value < config.satisfiedRateThreshold
    default:
      return false
  }
}

/**
 * 获取高亮样式类名
 * @param value 数值
 * @param type 类型
 * @param config 计算配置
 * @returns 样式类名
 */
export const getHighlightClass = (
  value: number | null,
  type: 'idleRate' | 'breakRate' | 'satisfiedRate',
  config: CalculateConfig = defaultCalculateConfig
): string => {
  return shouldHighlight(value, type, config) ? 'highlight-red' : ''
}

/**
 * 格式化百分比显示
 * @param value 百分比数值
 * @param showPercent 是否显示%符号
 * @returns 格式化后的字符串
 */
export const formatPercentage = (value: number | null, showPercent: boolean = true): string => {
  if (value === null) return '-'
  return showPercent ? `${value}%` : `${value}`
}

/**
 * 格式化平均值显示
 * @param value 平均值数值
 * @returns 格式化后的字符串
 */
export const formatAverage = (value: number | null): string => {
  if (value === null) return '-'
  return Math.round(value).toString()
}
