/**
 * 关键词查询量及资源统计报表 - 计算工具函数
 * @description 提供报表指标计算、格式化等功能
 * @version 1.0.0
 */

import type { KeywordQueryItem, CalculatedKeywordItem } from '../types/keywordQueryReport'

/**
 * 计算单条数据（自动计算未销售数量）
 * 计算公式：未销售数量 = 最大销售数量 - 已销售数量
 * @param item 原始数据项
 * @returns 计算后的数据项
 */
export const calculateKeywordItem = (item: KeywordQueryItem): CalculatedKeywordItem => {
  // 未销售数量 = 最大销售数量 - 已销售数量
  const unsoldCount = item.maxSalesCount - item.soldCount

  return {
    ...item,
    unsoldCount
  }
}

/**
 * 格式化数字（千分位）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

/**
 * 计算关键词查询数据列表
 * 对每条数据自动计算未销售数量
 * @param data 原始数据列表
 * @returns 计算后的数据列表
 */
export const calculateKeywordData = (data: KeywordQueryItem[]): CalculatedKeywordItem[] => {
  return data.map(item => calculateKeywordItem(item))
}
