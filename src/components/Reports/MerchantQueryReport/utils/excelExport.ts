/**
 * 优推商家查询量报表 - Excel导出工具
 * @description 提供报表数据导出为Excel功能
 * @version 1.0.0
 */

import * as XLSX from 'xlsx'
import type { CalculatedMerchantItem } from '../types/merchantQueryReport'
import { formatPercentage, formatNumber } from './calculator'

/**
 * 导出Excel文件
 * @param dataList 数据列表
 * @param filename 文件名
 */
export const exportToExcel = (
  dataList: CalculatedMerchantItem[],
  filename?: string
): void => {
  // 准备导出数据
  const exportData = dataList.map((item, index) => ({
    '序号': index + 1,
    '地市': item.city,
    '区县': item.district,
    '所有关键词': item.allKeywords.join('、'),
    '销售区域': item.salesRegion,
    '行业': item.industry,
    '单位名称': item.companyName,
    '播报号码': item.broadcastNumber,
    '业务号码': item.businessNumber,
    '被查关键词': item.queriedKeyword,
    '开通日期': item.openDate,
    '被查询次数': formatNumber(item.queryCount),
    '关键词查询次数': formatNumber(item.keywordQueryCount),
    '模糊查询次数': formatNumber(item.fuzzyQueryCount),
    '转接次数': formatNumber(item.transferCount),
    '转接成功次数': formatNumber(item.transferSuccessCount),
    '转接成功率': formatPercentage(item.transferSuccessRate)
  }))

  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 6 },   // 序号
    { wch: 10 },  // 地市
    { wch: 10 },  // 区县
    { wch: 25 },  // 所有关键词
    { wch: 10 },  // 销售区域
    { wch: 12 },  // 行业
    { wch: 25 },  // 单位名称
    { wch: 15 },  // 播报号码
    { wch: 15 },  // 业务号码
    { wch: 15 },  // 被查关键词
    { wch: 12 },  // 开通日期
    { wch: 12 },  // 被查询次数
    { wch: 14 },  // 关键词查询次数
    { wch: 14 },  // 模糊查询次数
    { wch: 10 },  // 转接次数
    { wch: 12 },  // 转接成功次数
    { wch: 12 }   // 转接成功率
  ]
  ws['!cols'] = colWidths

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '优推商家查询量报表')

  // 生成文件名
  const defaultFilename = `优推商家查询量报表_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`

  // 导出文件
  XLSX.writeFile(wb, filename || defaultFilename)
}

/**
 * 生成带时间戳的文件名
 * @returns 文件名
 */
export const generateFilename = (): string => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '')
  return `优推商家查询量报表_${dateStr}_${timeStr}.xlsx`
}
