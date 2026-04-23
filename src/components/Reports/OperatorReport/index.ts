/**
 * 人工话务员接续报表 - 模块导出
 */

export { default as OperatorReport } from './OperatorReport.vue'

// 类型导出
export type {
  FilterForm,
  OperatorReportItem,
  CalculatedReportItem,
  ServiceResponse,
  ReportQueryParams
} from './types/operatorReport'

// 工具函数导出
export {
  formatDuration,
  formatDurationWithSeconds,
  calculatePercentage,
  calculateAverage,
  calculateReportItem,
  shouldHighlight,
  getHighlightClass,
  formatPercentage,
  formatAverage
} from './utils/calculator'

// Excel导出导出
export {
  exportToExcel,
  generateFilename
} from './utils/excelExport'
