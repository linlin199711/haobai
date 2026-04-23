/**
 * 优推商家查询量报表 - 计算工具函数
 * @description 提供报表指标计算、格式化等功能
 * @version 1.0.0
 */

import type { MerchantQueryItem, CalculatedMerchantItem } from '../types/merchantQueryReport'

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
 * 计算单条数据（添加转接成功率）
 * @param item 原始数据项
 * @returns 计算后的数据项
 */
export const calculateMerchantItem = (item: MerchantQueryItem): CalculatedMerchantItem => {
  // 转接成功率 = (转接成功次数 / 转接次数) * 100%
  const transferSuccessRate = calculatePercentage(item.transferSuccessCount, item.transferCount, 1)

  return {
    ...item,
    transferSuccessRate
  }
}

/**
 * 格式化百分比显示
 * @param value 百分比数值
 * @returns 格式化后的字符串
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null) return '-'
  return `${value}%`
}

/**
 * 格式化数字（千分位）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}
