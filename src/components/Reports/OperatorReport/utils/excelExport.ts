/**
 * 人工话务员接续报表 - Excel导出工具
 * @description 提供报表数据导出为Excel功能
 * @version 1.0.0
 */

import * as XLSX from 'xlsx'
import type { CalculatedReportItem } from '../types/operatorReport'
import { formatDuration, formatPercentage, formatAverage } from './calculator'

/**
 * 导出Excel文件
 * @param dataList 数据列表
 * @param filename 文件名
 */
export const exportToExcel = (
  dataList: CalculatedReportItem[],
  filename?: string
): void => {
  // 准备导出数据
  const exportData = dataList.map((item, index) => ({
    '序号': index + 1,
    '人员名称': item.name,
    '工号': item.employeeId,
    '地市': item.city,
    '班组': item.team,
    '签入次数': item.loginCount,
    '签入时长': formatDuration(item.loginDuration),
    '空闲率': formatPercentage(item.idleRate),
    '接通量': item.connectedCount,
    '接通时长': formatDuration(item.connectedDuration),
    '平均接通时长(秒)': formatAverage(item.avgConnectedDuration),
    '呼出次数': item.outboundCount,
    '呼出时长(分)': Math.round(item.outboundDuration / 60),
    '小休次数': item.breakCount,
    '小休时长': formatDuration(item.breakDuration),
    '小休率': formatPercentage(item.breakRate),
    '参评量': item.evaluatedCount,
    '参评率': formatPercentage(item.evaluateRate),
    '参评满意量': item.satisfiedCount,
    '参评满意率': formatPercentage(item.satisfiedRate)
  }))

  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 6 },   // 序号
    { wch: 12 },  // 人员名称
    { wch: 10 },  // 工号
    { wch: 10 },  // 地市
    { wch: 10 },  // 班组
    { wch: 10 },  // 签入次数
    { wch: 12 },  // 签入时长
    { wch: 10 },  // 空闲率
    { wch: 10 },  // 接通量
    { wch: 12 },  // 接通时长
    { wch: 14 },  // 平均接通时长
    { wch: 10 },  // 呼出次数
    { wch: 12 },  // 呼出时长
    { wch: 10 },  // 小休次数
    { wch: 12 },  // 小休时长
    { wch: 10 },  // 小休率
    { wch: 10 },  // 参评量
    { wch: 10 },  // 参评率
    { wch: 12 },  // 参评满意量
    { wch: 12 }   // 参评满意率
  ]
  ws['!cols'] = colWidths

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '人工话务员接续报表')

  // 生成文件名
  const defaultFilename = `人工话务员接续报表_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`

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
  return `人工话务员接续报表_${dateStr}_${timeStr}.xlsx`
}
