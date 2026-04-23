/**
 * 关键词查询量及资源统计报表模块
 * 功能：统计关键词查询量及资源销售情况
 * 核心计算：未销售数量 = 最大销售数量 - 已销售数量（自动计算）
 */

export { default as KeywordQueryReport } from './KeywordQueryReport.vue'
export * from './types/keywordQueryReport'
export * from './utils/calculator'
